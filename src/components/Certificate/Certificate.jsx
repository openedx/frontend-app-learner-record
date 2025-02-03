import React from 'react';
import PropTypes from 'prop-types';

import {
  FormattedDate,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { Hyperlink, DropdownButton, Dropdown } from '@openedx/paragon';
import messages from './messages';

function Certificate({
  intl,
  type,
  credential_title: certificateTitle,
  credential_org: certificateOrg,
  modified_date: modifiedDate,
  uuid,
  handleCreate,
  storages = [],
}) {
  const showSingleAction = storages.length === 1;

  const renderCreationButtons = () => (
    <div>
      {showSingleAction && (
        <Hyperlink
          className="btn btn-outline-primary"
          onClick={() => handleCreate(uuid, storages[0].id)}
        >
          {intl.formatMessage(messages.certificateCardActionLabel)}
        </Hyperlink>
      )}
      {!showSingleAction && (
        <DropdownButton id="dropdown-storages" title={intl.formatMessage(messages.certificateCardMultiActionLabel)}>
          {storages.map(({ id, name }) => (
            <Dropdown.Item key={id} onClick={() => handleCreate(uuid, id)}>
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      )}
    </div>
  );

  return (
    <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
      <div className="card mb-4 certificate flex-grow-1">
        <div className="card-body d-flex flex-column">
          <div className="card-title">
            <p className="small mb-0">
              {type === 'program'
                ? intl.formatMessage(messages.programCertificateCardName)
                : intl.formatMessage(messages.courseCertificateCardName)}
            </p>
            <h4 className="certificate-title">{certificateTitle}</h4>
          </div>
          <p className="small mb-0 mt-auto">
            {intl.formatMessage(messages.certificateCardOrgLabel)}
          </p>
          <p className="h6 mb-4">
            {certificateOrg
              || intl.formatMessage(messages.certificateCardNoOrgText)}
          </p>
          <p className="small mb-2">
            {intl.formatMessage(messages.certificateCardDateLabel, {
              date: <FormattedDate value={new Date(modifiedDate)} />,
            })}
          </p>
          {renderCreationButtons()}
        </div>
      </div>
    </div>
  );
}

Certificate.propTypes = {
  intl: intlShape.isRequired,
  type: PropTypes.oneOf(['program', 'course']),
  credential_title: PropTypes.string.isRequired,
  credential_org: PropTypes.string.isRequired,
  modified_date: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  handleCreate: PropTypes.func.isRequired,
  storages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default injectIntl(Certificate);
