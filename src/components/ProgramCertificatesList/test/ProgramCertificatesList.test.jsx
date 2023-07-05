/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Factory } from 'rosie';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import {
  render, screen, cleanup, initializeMockApp, act,
} from '../../../setupTest';
import ProgramCertificatesList from '..';
import { getProgramCredentialsFactory, getAvailableStoragesFactory } from './__factories__/programCertificatesList.factory';

describe('program-certificates-list', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => jest.resetModules);
  afterEach(cleanup);

  it('renders the Program Certificates List', () => {
    render(<ProgramCertificatesList />);

    expect(screen.getByText('Verifiable Credentials')).toBeTruthy();
    expect(screen.getByText('Back to My Profile')).toBeTruthy();
    expect(screen.getByText('Questions about Verifiable Credentials?')).toBeTruthy();
  });
});

describe('program-certificates-data', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });

  it('should display certificates when data is present', async () => {
    await act(async () => {
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/verifiable_credentials/api/v1/program_credentials/`)
        .reply(200, getProgramCredentialsFactory.build());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/verifiable_credentials/api/v1/storages/`)
        .reply(200, getAvailableStoragesFactory.buildList(1));
      render(<ProgramCertificatesList />);
    });

    expect(await screen.findByText('Verifiable Credentials')).toBeTruthy();
    expect(await screen.findByText('A certificate for a program will appear in the list once you '
      + 'have earned all course certificates in a program.')).toBeTruthy();
    expect(await screen.findByText('Program title 1')).toBeTruthy();
    expect(await screen.findByText('Program org 1')).toBeTruthy();
  });

  it('should display no certificates when no enrolled_programs are present', async () => {
    await act(async () => {
      const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/verifiable_credentials/api/v1/program_credentials/`)
        .reply(200, { program_credentials: [] });
      axiosMock
        .onGet(`${getConfig().CREDENTIALS_BASE_URL}/verifiable_credentials/api/v1/storages/`)
        .reply(200, []);
      render(<ProgramCertificatesList />);
    });
    expect(
      await screen.findByText(
        'No certificate available. Finish your first program to get a certificate.',
      ),
    ).toBeTruthy();
  });
});
