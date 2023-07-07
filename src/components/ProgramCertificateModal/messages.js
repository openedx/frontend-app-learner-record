import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  certificateModalTitle: {
    id: 'credentials.modal.title',
    defaultMessage: 'Verifiable credential',
    description: 'Title of a dialog.',
  },
  certificateModalCloseBtn: {
    id: 'credentials.modal.close.button',
    defaultMessage: 'Close modal window',
    description: 'Label on button to close a dialog.',
  },
  certificateModalCloseMobileBtn: {
    id: 'credentials.modal.close.mobile.button',
    defaultMessage: 'Cancel',
    description: 'Label on button to close a dialog.',
  },
  certificateModalMobileTitle: {
    id: 'credentials.modal.mobile.title',
    defaultMessage:
      'To download a verifiable credential to your mobile wallet application, please follow the instructions below.',
    description: 'Text for a mobile dialog of the program certificate.',
  },
  certificateModalAppStoreBtn: {
    id: 'credentials.modal.instruction.appStore.button',
    defaultMessage: 'Download the mobile app from the Apple App Store',
    description:
      'The label for the link to download the apple version of the app.',
  },
  certificateModalGooglePlayBtn: {
    id: 'credentials.modal.instruction.googlePlay.button',
    defaultMessage: 'Download the mobile app from the Google Play',
    description:
      'The label for the link to download the google version of the app.',
  },
  certificateModalInstructionTitle: {
    id: 'credentials.modal.instruction.title',
    defaultMessage: 'Download and install the app on your smartphone.',
    description: 'Title text of the instructions.',
  },
  certificateModalInstructionStep1: {
    id: 'credentials.modal.instruction.step1',
    defaultMessage: 'Sign up for the app to identify yourself.',
    description: 'Text of step of the instructions.',
  },
  certificateModalInstructionStep2: {
    id: 'credentials.modal.instruction.step2',
    defaultMessage:
      'Open the application and select the option "Scan QR code". Scan the provided code.',
    description: 'Text of step of the instructions.',
  },
  certificateModalInstructionStep3: {
    id: 'credentials.modal.instruction.step3',
    defaultMessage:
      'Follow the instructions below to get the verifiable credential:',
    description: 'Text of step of the instructions.',
  },
  certificateModalInstructionStep4: {
    id: 'credentials.modal.instruction.step4',
    defaultMessage: 'Once you have successfully finished, close the modal.',
    description: 'Text of step of the instructions.',
  },
  certificateModalDeeplinkBtn: {
    id: 'credentials.modal.deeplink',
    defaultMessage: 'Download Credential',
    description: 'The label for the link to download credential.',
  },
  certificateModalLoading: {
    id: 'credentials.modal.loading',
    defaultMessage: 'Loading...',
    description: 'Message when data is being loaded',
  },
  certificateModalQrCodeLabel: {
    id: 'credentials.modal.qrCode.label',
    defaultMessage: 'QR code to obtain the verifiable credential',
    description: 'The label for verifiable credential QR code',
  },
  certificateModalCopyLinkLabel: {
    id: 'credentials.modal.copyLink.label',
    defaultMessage: 'Copy link',
    description: 'Label for copy link from QR code',
  },
  credentialsModalError: {
    id: 'credentials.modal.error',
    defaultMessage:
      'An error occurred attempting to retrieve your program certificate. Please try again later.',
    description:
      "An error message indicating there is a problem retrieving the user's program certificate data",
  },
});

export default messages;
