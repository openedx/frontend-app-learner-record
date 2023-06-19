/**
 * @jest-environment jsdom
 */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import * as analytics from '@edx/frontend-platform/analytics';
import {
  render, screen, cleanup, fireEvent, act, initializeMockApp,
} from '../../../setupTest';
import ProgramRecord from '../../ProgramRecord/ProgramRecord';
import programRecordFactory from '../../ProgramRecord/test/__factories__/programRecord.factory';

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

describe('program-record-alert', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });

  it('renders a modal for sending program records when the "Send program record" button is clicked', async () => {
    const responseMock = programRecordFactory.build();
    await act(async () => {
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
        .reply(200, responseMock);
      axiosMock
        .onPost()
        .reply(200, { data: { url: `${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/test-id/` } });
      render(<ProgramRecord isPublic={false} />);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send program record' }));
    expect(await screen.findByText(`Send Program Record to ${responseMock.record.platform_name} Credit Partner`)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send program record' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Send program record' }));
    setTimeout(() => {
      expect(screen.getByRole('button', { name: 'Send program record' })).toBeEnabled();
    }, 0);
    // TODO: test for when the user clicks the send button inside the modal
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByText('Send Program Record to edX Credit Partner')).toBeNull();
    expect(analytics.sendTrackEvent.mock.calls.length).toBe(1);
    expect(analytics.sendTrackEvent.mock.calls[0][0]).toEqual('edx.bi.credentials.program_record.send_started');
    expect(analytics.sendTrackEvent.mock.calls[0][1]).toEqual({
      category: 'records',
      'program-uuid': 'test-id',
    });
  });
});
