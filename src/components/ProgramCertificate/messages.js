import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  certificateCardName: {
    id: 'certificate.card.name',
    defaultMessage: 'Program Certificate',
    description: 'A title text of the available program certificate item.',
  },
  certificateCardOrgLabel: {
    id: 'certificate.card.organization.label',
    defaultMessage: 'From',
    description: '',
  },
  certificateCardNoOrgText: {
    id: 'certificate.card.noOrg.text',
    defaultMessage: 'No organization',
    description: '',
  },
  certificateCardDateLabel: {
    id: 'certificate.card.date.label',
    defaultMessage: 'Awarded on {date}',
    description: '',
  },
  certificateCardActionLabel: {
    id: 'certificate.card.action.label',
    defaultMessage: 'Create',
    description: 'A text on single action button',
  },
  certificateCardMultiActionLabel: {
    id: 'certificate.card.multiAction.label',
    defaultMessage: 'Create with',
    description: 'A text on a dropdown with multiple action options',
  },
});

export default messages;
