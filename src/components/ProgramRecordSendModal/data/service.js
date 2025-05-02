import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

export async function sendRecords(programUUID, username, orgId) {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${programUUID}/send`;
  const response = await getAuthenticatedHttpClient().post(url, { username, pathway_id: orgId });
  return response;
}

export default sendRecords;
