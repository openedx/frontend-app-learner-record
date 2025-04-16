import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { logError } from '@edx/frontend-platform/logging';
import axios from 'axios';

export async function sendRecords(programUUID, username, orgId) {
  try {
    // Function to simulate a 429 response
    const simulate429 = (config) => Promise.resolve({
      config,
      data: { message: 'Too Many Requests' }, // Optional: Include a response body
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }, // Include relevant headers
      request: {}, // Mock request object
      status: 429,
      statusText: 'Too Many Requests',
    });

    axios.interceptors.response.use(simulate429, (error) => Promise.reject(error));
    const url = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${programUUID}/send`;
    const response = await getAuthenticatedHttpClient().post(url, { username, pathway_id: orgId });
    return response;
  } catch (error) {
    logError(error);
    throw new Error(error);
  }
}

export default sendRecords;
