import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import getProgramRecords from './service';

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axiosMock.onAny().reply(200);
axios.get = jest.fn();

describe('test getProgramRecords', () => {
  it('gets program records', () => {
    const url = 'http://localhost:18150/records/api/v1/program_records/';
    getProgramRecords();
    expect(axios.get).toBeCalledWith(url, { withCredentials: true });
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
