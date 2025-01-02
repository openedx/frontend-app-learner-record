import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { BrowserView, MobileView, isBrowser } from 'react-device-detect';
import {
  ActionRow, Button, Row, StandardModal,
} from '@openedx/paragon';
import { Info, ContentCopy } from '@openedx/paragon/icons';

import messages from './messages';
import appStoreImg from '../../assets/images/appStore.png';
import googlePlayImg from '../../assets/images/googleplay.png';

function CertificateModal({
  intl, isOpen, close, data,
}) {
  const {
    deeplink,
    qrcode,
    app_link_android: googlePlayAppLink,
    app_link_ios: appleStoreAppLink,
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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(deeplink);
  };

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
              <button
                className="justify-content-center align-items-center mt-2 copy-link"
                onClick={handleCopyClick}
                type="button"
              >
                <ContentCopy />
                {intl.formatMessage(messages.certificateModalCopyLinkLabel)}
              </button>
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
                <div className="d-flex justify-content-between buttons-wrapper">
                  <a href={googlePlayAppLink}>
                    <img src={googlePlayImg} alt="Google Play" />
                  </a>
                  <a href={appleStoreAppLink}>
                    <img src={appStoreImg} alt="Apple App Store" />
                  </a>
                </div>
              </ol>
            </div>
          </Row>
        </BrowserView>
        <MobileView>
          <p>{intl.formatMessage(messages.certificateModalMobileTitle)}</p>
          <Button
            href={appleStoreAppLink}
            target="_blank"
            size="lg"
            className="mb-3 mobile-button"
            block
            aria-label={intl.formatMessage(
              messages.certificateModalAppStoreBtn,
            )}
          >
            <img src={appStoreImg} alt="Apple App Store" />
          </Button>
          <Button
            href={googlePlayAppLink}
            target="_blank"
            size="lg"
            className="mb-3 mobile-button"
            block
            aria-label={intl.formatMessage(
              messages.certificateModalGooglePlayBtn,
            )}
          >
            <img src={googlePlayImg} alt="Google Play" />
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

CertificateModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.shape.isRequired,
};

export default injectIntl(CertificateModal);
