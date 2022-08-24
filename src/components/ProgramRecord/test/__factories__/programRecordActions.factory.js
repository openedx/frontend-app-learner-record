import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies
import { getConfig } from '@edx/frontend-platform';

export default Factory.define('programActionData')
  .attr('data', {
    url: `${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/test-id/`,
  });
