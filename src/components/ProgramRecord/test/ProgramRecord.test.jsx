/**
 * @jest-environment jsdom
 */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import {
  render, screen, cleanup, fireEvent, act, initializeMockApp,
} from '../../../setupTest';
import ProgramRecord from '../ProgramRecord';
import programRecordFactory from './__factories__/programRecord.factory';
import programRecordUrlFactory from './__factories__/programRecordActions.factory';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ programUUID: 'test-id' }),
}));

describe('program-record', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });

  it('renders the program record on successful request of a private record with credit pathways', async () => {
    const responseMock = programRecordFactory.build();
    await act(async () => {
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
        .reply(200, responseMock);
      axiosMock
        .onPost()
        .reply(200, programRecordUrlFactory.build());
      render(<ProgramRecord isPublic={false} />);
    });

    expect(screen.getByRole('link', { name: 'Back to My Records' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send program record' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /help/i }));
    expect(await screen.findByText('Sending your Program Record')).toBeTruthy();

    expect(await screen.findByText(`${responseMock.record.program.name} Record`)).toBeTruthy();
    expect(await screen.findByText(`${responseMock.record.program.type_name} Program Record`)).toBeTruthy();
    expect(await screen.findByText(`${responseMock.record.platform_name} | ${responseMock.record.program.school}`)).toBeTruthy();
    expect(await screen.findByText(`Last Updated ${new Date(responseMock.record.program.last_updated).toLocaleDateString()}`)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'read more in our records help area.' })).toBeTruthy();
  });

  it('doesn\'t render a "Send program record" button when there are no credit pathways', async () => {
    const responseMock = programRecordFactory.build();
    await act(async () => {
      responseMock.record.pathways = [];
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
        .reply(200, responseMock);
      axiosMock
        .onPost()
        .reply(200, programRecordUrlFactory.build());
      render(<ProgramRecord isPublic={false} />);
    });
    expect(screen.queryByRole('button', { name: 'Send program record' })).toBeNull();
  });

  it('renders alert on successful request with no data', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`)
      .reply(200, {});
    render(<ProgramRecord isPublic={false} />);
    expect(await screen.findByText('An error occurred attempting to retrieve your program records. Please try again later.')).toBeTruthy();
  });

  it('renders loading message on delay', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=false`);
    render(<ProgramRecord isPublic={false} />);
    expect(await screen.findByText('Loading...')).toBeTruthy();
  });
});
