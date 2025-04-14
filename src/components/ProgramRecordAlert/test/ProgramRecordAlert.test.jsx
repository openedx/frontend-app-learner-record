/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Factory } from 'rosie';
import {
  render, screen, cleanup, initializeMockApp, fireEvent,
} from '../../../setupTest';
import ProgramRecordAlert from '../ProgramRecordAlert';
import programAlertDataFactory from './__factories__/programRecordAlert.factory';
import { sendRecords } from '../../ProgramRecordSendModal/data/service';

jest.mock('../../ProgramRecordSendModal/data/service', () => ({
  sendRecords: jest.fn(() => ({
    then: jest.fn(() => ({
      catch: jest.fn(),
    })),
  })),
}));

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

  it('tries to send the record again when the Try Again button is clicked', async () => {
    const alertProps = programAlertDataFactory.build({ alertType: 'failure' });

    render(<ProgramRecordAlert {...alertProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(sendRecords).toHaveBeenCalled();
    expect(sendRecords).toHaveBeenCalledWith('12345', 'edX', 1);
    expect(await screen.findByText('Re-trying...')).toBeTruthy();
  });
});
