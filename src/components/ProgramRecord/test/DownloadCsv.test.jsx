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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ programUUID: 'test-id' }),
}));

let windowSpy;

describe('program-record', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  afterEach(() => {
    windowSpy.mockRestore();
    cleanup();
    Factory.resetAll();
  });
  it('renders the program record with download button on successful request of a public record', async () => {
    const responseMock = programRecordFactory.build();
    await act(async () => {
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/test-id/?is_public=true`)
        .reply(200, responseMock);
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/test-id/csv`)
        .reply(200, {});
      render(<ProgramRecord isPublic />);
    });
    const originalWindow = { ...window };
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      location: {
        origin: 'https://example.com',
      },
    }));
    expect(screen.getByRole('button', { name: 'Download program record' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Download program record' }));
    expect(await screen.findByText(`${responseMock.record.program.name} Record`)).toBeTruthy();
    expect(await screen.findByText(`${responseMock.record.program.type_name} Program Record`)).toBeTruthy();
    expect(await screen.findByText(`${responseMock.record.platform_name} | ${responseMock.record.program.school}`)).toBeTruthy();
    expect(await screen.findByText(`Last Updated ${new Date(responseMock.record.program.last_updated).toLocaleDateString()}`)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'read more in our records help area.' })).toBeTruthy();
  });
});
