import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { logError } from '@edx/frontend-platform/logging';

async function sendRecords(programUUID, username, orgId) {
  try {
    const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${programUUID}/send`;
    const response = await getAuthenticatedHttpClient().post(url, { username, pathway_id: orgId });
    return response;
  } catch (error) {
    logError(error);
    throw new Error(error);
  }
}

export default sendRecords;
