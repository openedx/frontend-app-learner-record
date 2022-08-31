import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import * as analytics from '@edx/frontend-platform/analytics';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import {
  render, screen, fireEvent, act, cleanup, initializeMockApp,
} from '../../../setupTest';
import ProgramRecord from '../ProgramRecord';
import programRecordFactory from './__factories__/programRecord.factory';
import programRecordUrlFactory from './__factories__/programRecordActions.factory';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ programUUID: 'test-id' }),
}));

jest.mock('@edx/frontend-platform/analytics', () => ({
  configure: () => {},
  sendTrackEvent: jest.fn(),
}));

beforeEach(() => {
  analytics.sendTrackEvent.mockReset();
});

const originalClipboard = { ...global.navigator.clipboard };

beforeAll(async () => {
  await initializeMockApp();
});

beforeEach(() => {
  const mockClipboard = {
    writeText: jest.fn(
      () => {},
    ),
    readText: jest.fn(
      () => {},
    ),
  };
  global.navigator.clipboard = mockClipboard;
});

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
  global.navigator.clipboard = originalClipboard;
});

it('copies a string to the clipboard', async () => {
  await act(async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
      .reply(200, programRecordFactory.build());
    axiosMock
      .onPost()
      .reply(200, programRecordUrlFactory.build());
    render(<ProgramRecord isPublic={false} />);
  });

  const copyLink = screen.getByRole('button', { name: /copy program record link/i });
  expect(copyLink).toBeTruthy();
  fireEvent.click(copyLink);
  expect(await screen.findByText('Link copied!')).toBeTruthy();
  expect(navigator.clipboard.writeText).toBeCalledTimes(1);
  expect(analytics.sendTrackEvent.mock.calls.length).toBe(1);
  expect(analytics.sendTrackEvent.mock.calls[0][0]).toEqual('edx.bi.credentials.program_record.share_url_copied');
  expect(analytics.sendTrackEvent.mock.calls[0][1]).toEqual({
    category: 'records',
    'program-uuid': 'test-id',
  });
});
