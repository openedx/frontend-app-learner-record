/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Factory } from 'rosie';
import {
  render, screen, cleanup, initializeMockApp,
} from '../../../setupTest';
import ProgramRecordAlert from '../ProgramRecordAlert';
import programAlertDataFactory from './__factories__/programRecordAlert.factory';

describe('program-record-alert', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    cleanup();
    Factory.resetAll();
  });

  it('renders a failure alert when a record fails to send', async () => {
    const alertProps = programAlertDataFactory.build({ alertType: 'failure' });
    render(
      <ProgramRecordAlert
        {...alertProps}
      />,
    );
    expect(await screen.findByText('We were unable to send your program record')).toBeTruthy();
  });

  it('renders a success alert when a record is successfully sent', async () => {
    const alertProps = programAlertDataFactory.build({ alertType: 'success' });
    render(
      <ProgramRecordAlert
        {...alertProps}
      />,
    );
    expect(await screen.findByText('You have successfully sent your program record')).toBeTruthy();
  });
});
