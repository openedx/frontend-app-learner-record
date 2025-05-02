import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

export async function sendRecords(programUUID, username, pathwayId) {
  const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${programUUID}/send`;
  const response = await getAuthenticatedHttpClient().post(url, { username, pathway_id: pathwayId });
  return response;
}

export default sendRecords;
