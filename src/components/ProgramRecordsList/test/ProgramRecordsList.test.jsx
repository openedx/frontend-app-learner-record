/**
 * @jest-environment jsdom
 */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import {
  render, screen, cleanup, initializeMockApp,
} from '../../../setupTest';
import ProgramRecordsList from '..';
import programListRecordsFactory from './__factories__/programListRecords.factory';

jest.mock('../../NavigationBar', () => 'NavigationBar');

describe('program-records-list', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => jest.resetModules);
  afterEach(cleanup);

  it('renders the component', () => {
    render(<ProgramRecordsList />);
    expect(screen.getByText('My Learner Records')).toBeTruthy();
  });

  it('it should display a link to the user\'s Profile', () => {
    render(<ProgramRecordsList />);
    expect(screen.getByText('Back to My Profile')).toBeTruthy();
  });

  it('it should have a help section', () => {
    render(<ProgramRecordsList />);
    expect(screen.getByText('Questions about Learner Records?')).toBeTruthy();
  });
});

describe('program-list-data', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });

  it('should display records when data is present', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/`)
      .reply(200, programListRecordsFactory.build());
    render(<ProgramRecordsList />);
    expect(await screen.findByText('edX | Completed')).toBeTruthy();
    expect(await screen.findByText('edX | Partially Completed')).toBeTruthy();
    expect(await screen.findAllByText('View Program Record')).toBeTruthy();
  });

  it('should display no records when no enrolled_programs are present', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/`)
      .reply(200, { enrolled_programs: [] });
    render(<ProgramRecordsList />);
    expect(await screen.findByText('No records yet. Program records are created once you have earned at least one course certificate in a program.')).toBeTruthy();
  });

  it('should throw an error if there is no data', async () => {
    const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records/`)
      .reply(200, {});
    render(<ProgramRecordsList />);
    expect(await screen.findByText('An error occurred attempting to retrieve your program records. Please try again later.')).toBeTruthy();
  });
});
