import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';
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

describe('copy-to-clipboard', () => {
  const originalClipboard = { ...global.navigator.clipboard };

  beforeAll(async () => {
    await initializeMockApp();
  });

  beforeEach(() => {
    analytics.sendTrackEvent.mockReset();
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
    cleanup();
    Factory.resetAll();
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
    const createButton = screen.getByRole('button', { name: /create program record link/i });
    expect(createButton).toBeTruthy();
    fireEvent.click(createButton);
    expect(await screen.findByText('Link copied!')).toBeTruthy();
    expect(navigator.clipboard.writeText).toBeCalledTimes(1);
    expect(analytics.sendTrackEvent.mock.calls.length).toBe(2);
    expect(analytics.sendTrackEvent.mock.calls[0][0]).toEqual('edx.bi.credentials.program_record.share_url_copied');
    expect(analytics.sendTrackEvent.mock.calls[0][1]).toEqual({
      category: 'records',
      'program-uuid': 'test-id',
    });
    expect(analytics.sendTrackEvent.mock.calls[1][0]).toEqual('edx.bi.credentials.program_record.share_started');
    expect(analytics.sendTrackEvent.mock.calls[1][1]).toEqual({
      category: 'records',
      'program-uuid': 'test-id',
    });
  });

  it('renders a "Copy program record link" button when a public link exists', async () => {
    const responseMock = programRecordFactory.build();
    await act(async () => {
      responseMock.record.shared_program_record_uuid = 'test-public-id';
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
        .reply(200, responseMock);
      axiosMock
        .onPost()
        .reply(200, programRecordUrlFactory.build());
      render(<ProgramRecord isPublic={false} />);
    });
    const copyButton = screen.getByRole('button', { name: /copy program record link/i });
    expect(copyButton).toBeTruthy();
    fireEvent.click(copyButton);
    expect(analytics.sendTrackEvent.mock.calls.length).toBe(1);
    expect(analytics.sendTrackEvent.mock.calls[0][0]).toEqual('edx.bi.credentials.program_record.share_url_copied');
    expect(analytics.sendTrackEvent.mock.calls[0][1]).toEqual({
      category: 'records',
      'program-uuid': 'test-id',
    });
  });
});
