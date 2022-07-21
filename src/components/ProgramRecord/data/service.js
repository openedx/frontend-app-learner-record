import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

async function getProgramDetails(programId, isPublic) {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/${programId}/?is_public=${isPublic}`;
  let data = {};

  try {
    ({ data } = await getAuthenticatedHttpClient().get(url, { withCredentials: true }));
  } catch (error) {
    // We are catching and suppressing errors here on purpose. If an error occurs during the
    // getProgramDetails call we will pass back an empty `data` object. Downstream we make
    // the assumption that if the ProgramDetails object is empty that there was an issue or
    // error communicating with the service/API.
  }
  return data;
}

export async function getProgramRecordUrl(programId, username) {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${programId}/share`;
  try {
    const response = await getAuthenticatedHttpClient().post(url, { username });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getProgramRecordCsv(programId) {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/${programId}/csv`;
  try {
    const response = await getAuthenticatedHttpClient().get(url, { withCredentials: true });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export default getProgramDetails;
