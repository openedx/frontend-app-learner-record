import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

export default Factory.define('programAlertData')
  .attrs({
    alertType: '',
    onClose: () => {},
    programUUID: '12345',
    username: 'edX',
    setSendRecord: () => {},
    creditPathway: {
      id: 1,
      is_active: true,
      name: 'Funambulist',
      pathway_type: 'credit',
      status: 'sent',
    },
  });
