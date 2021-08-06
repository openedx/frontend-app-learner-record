import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

async function getProgramRecords() {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/`;
  let data = {};
  try {
    ({ data } = await getAuthenticatedHttpClient().get(url, { withCredentials: true }));
  } catch (error) {
    // We are catching and suppressing errors here on purpose. If an error occurs during the
    // getProgramRecords call we will pass back an empty `data` object. Downstream we make
    // the assumption that if the ProgramRecords object is empty that there was an issue or
    // error communicating with the service/API.
  }
  return data;
}

export default getProgramRecords;
