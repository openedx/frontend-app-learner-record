import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { BrowserView, MobileView, isBrowser } from 'react-device-detect';
import {
  ActionRow, Button, Row, StandardModal,
} from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

import messages from './messages';
import appStoreImg from '../../assets/images/appStore.png';
import googlePlayImg from '../../assets/images/googleplay.png';

function ProgramCertificateModal({
  intl, isOpen, close, data,
}) {
  const {
    deeplink,
    qrcode,
    app_link_android: appLinkAndroid,
    app_link_ios: appLinkIos,
    error,
  } = data;

  if (error) {
    return (
      <StandardModal title="Failure" isOpen={isOpen} onClose={close} size="lg">
        <Info className="text-danger-500 mr-2 mb-1" />
        {error}
      </StandardModal>
    );
  }

  return (
    <StandardModal
      title={intl.formatMessage(messages.certificateModalTitle)}
      isOpen={isOpen}
      onClose={close}
      size="lg"
      footerNode={
        isBrowser ? (
          <BrowserView>
            <ActionRow>
              <ActionRow.Spacer />
              <Button onClick={close}>
                {intl.formatMessage(messages.certificateModalCloseBtn)}
              </Button>
            </ActionRow>
          </BrowserView>
        ) : null
      }
    >
      <>
        <BrowserView>
          <Row>
            <div className="col-12 col-md-4 mb-3 mb-md-0 text-center">
              <div className="border border-gray-300 rounded p-1">
                <img
                  data-testid="qr-code-img"
                  className="mw-100 mh-100"
                  src={`data:image/png;base64,${qrcode}`}
                  alt={intl.formatMessage(messages.certificateModalQrCodeLabel)}
                />
              </div>
            </div>
            <div className="col-12 col-md-8">
              <h4>
                {intl.formatMessage(messages.certificateModalInstructionTitle)}
              </h4>
              <ol>
                <li>
                  {intl.formatMessage(
                    messages.certificateModalInstructionStep1,
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    messages.certificateModalInstructionStep2,
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    messages.certificateModalInstructionStep3,
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    messages.certificateModalInstructionStep4,
                  )}
                </li>
              </ol>
            </div>
          </Row>
        </BrowserView>
        <MobileView>
          <p>{intl.formatMessage(messages.certificateModalMobileTitle)}</p>
          <Button
            href={appLinkIos}
            target="_blank"
            size="lg"
            className="mb-2 bg-gray-900 p-2"
            block
            aria-label={intl.formatMessage(
              messages.certificateModalAppStoreBtn,
            )}
          >
            <img
              src={appStoreImg}
              style={{ maxHeight: '2rem' }}
              alt="App Store"
            />
          </Button>
          <Button
            href={appLinkAndroid}
            target="_blank"
            size="lg"
            className="mb-3 bg-gray-900 p-2"
            block
            aria-label={intl.formatMessage(
              messages.certificateModalGooglePlayBtn,
            )}
          >
            <img
              src={googlePlayImg}
              style={{ maxHeight: '2rem' }}
              alt="Google Play"
            />
          </Button>
          <p />
          <ol>
            <li>
              {intl.formatMessage(messages.certificateModalInstructionStep1)}
            </li>
            <li>
              {intl.formatMessage(messages.certificateModalInstructionStep2)}
            </li>
            <li>
              {intl.formatMessage(messages.certificateModalInstructionStep3)}
            </li>
            <li>
              {intl.formatMessage(messages.certificateModalInstructionStep4)}
            </li>
          </ol>
          <Button
            href={deeplink}
            target="_blank"
            size="lg"
            className="mb-2"
            block
          >
            {intl.formatMessage(messages.certificateModalDeeplinkBtn)}
          </Button>
          <Button variant="outline-primary" size="lg" block onClick={close}>
            {intl.formatMessage(messages.certificateModalCloseMobileBtn)}
          </Button>
        </MobileView>
      </>
    </StandardModal>
  );
}

ProgramCertificateModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.shape.isRequired,
};

export default injectIntl(ProgramCertificateModal);
