import React, { useEffect, useState } from 'react';

import { ChevronLeft, Info } from '@openedx/paragon/icons';
import {
  Alert, Hyperlink, Row, useToggle,
} from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { logError } from '@edx/frontend-platform/logging';

import NavigationBar from '../NavigationBar';
import {
  getCertificates,
  getAvailableStorages,
  initVerifiableCredentialIssuance,
} from './data/service';
import messages from './messages';
import CertificateModal from '../CertificateModal';
import Certificate from '../Certificate';

function CertificatesList({ intl }) {
  const [certificatesAreLoaded, setCertificatesAreLoaded] = useState(false);
  const [dataLoadingIssue, setDataLoadingIssue] = useState('');
  const [certificates, setCertificates] = useState({
    program_credentials: [],
    course_credentials: [],
  });

  const [storagesIsLoaded, setStoragesIsLoaded] = useState(false);
  const [storages, setStorages] = useState([]);

  const [modalIsOpen, openModal, closeModal] = useToggle(false);

  const isCertificatesEmpty = !certificates.program_credentials.length && !certificates.course_credentials.length;

  const [
    verifiableCredentialIssuanceData,
    setVerifiableCredentialIssuanceData,
  ] = useState({});

  useEffect(() => {
    getCertificates()
      .then((data) => {
        setCertificates(data);
        setCertificatesAreLoaded(true);
      })
      .catch((error) => {
        const errorMessage = intl.formatMessage(messages.errorCertificatesLoading);
        setDataLoadingIssue(errorMessage);
        logError(errorMessage + error.message);
      });
  }, [intl]);

  useEffect(() => {
    getAvailableStorages()
      .then((data) => {
        setStorages(data);
        setStoragesIsLoaded(true);
      })
      .catch((error) => {
        const errorMessage = intl.formatMessage(
          messages.errorAvailableStoragesLoading,
        );
        setDataLoadingIssue(errorMessage);
        logError(errorMessage + error.message);
      });
  }, [intl]);

  const handleCreate = (uuid, storageId) => {
    initVerifiableCredentialIssuance({ uuid, storageId })
      .then((data) => {
        setVerifiableCredentialIssuanceData(data);
        if (data.redirect) {
          window.location = data.deeplink;
        } else {
          openModal();
        }
      })
      .catch((error) => {
        const errorMessage = intl.formatMessage(messages.errorIssuanceInit);
        setVerifiableCredentialIssuanceData({ error: errorMessage });
        openModal();
        logError(errorMessage + error.message);
      });
  };

  const renderProfile = () => {
    const { username } = getAuthenticatedUser();
    return (
      <Hyperlink
        destination={`${getConfig().LMS_BASE_URL}/u/${username}`}
        className="mb-4 d-inline-block muted-link pl-3 pr-3"
      >
        <ChevronLeft className="mb-1" />
        {intl.formatMessage(messages.credentialsProfileLink)}
      </Hyperlink>
    );
  };

  const renderCredentialsServiceIssueAlert = ({
    message = intl.formatMessage(messages.credentialsListError),
  }) => (
    <div tabIndex="-1">
      <Alert variant="danger">
        <Info className="text-danger-500 mr-2 mb-1" />
        {message}
      </Alert>
    </div>
  );

  const renderEmpty = () => (
    <p className="pl-3 pr-3 text-gray-500">
      {intl.formatMessage(messages.credentialsListEmpty)}
    </p>
  );

  const renderCertificates = (type) => {
    if (!certificates[`${type}_credentials`].length) {
      return null;
    }

    return (
      <section id={`${type}-certificates-list`} className="pl-3 pr-3 pb-3">
        <p>
          {type === 'program'
            ? intl.formatMessage(messages.programCredentialsDescription)
            : intl.formatMessage(messages.courseCredentialsDescription)}
        </p>
        <Row className="mt-4">
          {certificates[`${type}_credentials`].map((certificate) => (
            <Certificate
              type={type}
              key={certificate.uuid}
              storages={storages}
              handleCreate={handleCreate}
              {...certificate}
            />
          ))}
        </Row>
      </section>
    );
  };

  const renderData = (type) => {
    if (!certificatesAreLoaded || !storagesIsLoaded) {
      return null;
    }
    return renderCertificates(type);
  };

  const renderHelp = () => (
    <div className="pl-3 pr-3 pt-4 pb-1">
      <h3 className="h5">
        {intl.formatMessage(messages.credentialsHelpHeader)}
      </h3>
      {intl.formatMessage(messages.credentialsHelpDescription)}
      <Hyperlink
        destination={`${getConfig().SUPPORT_URL_VERIFIABLE_CREDENTIALS}`}
        target="_blank"
        showLaunchIcon={false}
      >
        {intl.formatMessage(messages.credentialsHelpLink)}
      </Hyperlink>
    </div>
  );

  const renderContent = () => {
    if (dataLoadingIssue) {
      return renderCredentialsServiceIssueAlert({
        message: dataLoadingIssue,
      });
    }
    if (isCertificatesEmpty) {
      return renderEmpty();
    }

    return (
      <>
        {renderData('program')}
        {renderData('course')}
      </>
    );
  };

  return (
    <main id="main-content" className="pt-5 pb-5 pl-4 pr-4" tabIndex="-1">
      <div className="container-fluid">
        {renderProfile()}
        <NavigationBar />
        <h1 className="h3 pl-3 pr-3 mb-4">
          {intl.formatMessage(messages.credentialsHeader)}
        </h1>
        {renderContent()}
        {renderHelp()}
        <CertificateModal
          isOpen={modalIsOpen}
          close={closeModal}
          data={verifiableCredentialIssuanceData}
        />
      </div>
    </main>
  );
}

CertificatesList.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CertificatesList);
