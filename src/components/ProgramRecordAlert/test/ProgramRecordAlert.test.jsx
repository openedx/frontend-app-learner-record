import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import {
  render, screen, fireEvent, waitFor, initializeMockApp,
} from '../../../setupTest';
import { sendRecords } from '../../ProgramRecordSendModal/data/service';
import ProgramRecordAlert from '../ProgramRecordAlert';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    SUPPORT_URL_LEARNER_RECORDS: 'https://support.example.com',
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../../ProgramRecordSendModal/data/service', () => ({
  sendRecords: jest.fn(),
}));

const mockCreditPathway = {
  id: 'pathway-1',
  name: 'Test Pathway',
};

const mockProps = {
  onClose: jest.fn(),
  creditPathway: mockCreditPathway,
  setSendRecord: jest.fn(),
  programUUID: 'test-uuid',
  username: 'test-user',
  platform: 'Test Platform',
};

describe('ProgramRecordAlert', () => {
  beforeAll(() => {
    initializeMockApp();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when alertType is "failure"', () => {
    it('renders the failure alert with the correct message and "Try Again" button', () => {
      render(<ProgramRecordAlert {...mockProps} alertType="failure" />);

      expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      expect(screen.getByText('We were unable to send your program record')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Dismiss/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'contact Test Platform support.' })).toHaveAttribute('href', 'https://support.example.com');
      expect(screen.getByRole('link', { name: 'contact Test Platform support.' })).toHaveAttribute('target', '_blank');
    });

    it('calls onClose with the creditPathway id when the close button is clicked', () => {
      render(<ProgramRecordAlert {...mockProps} alertType="failure" />);
      const closeButton = screen.getByRole('button', { name: /Dismiss/i });
      fireEvent.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalledWith(mockCreditPathway.id);
    });

    it('calls sendRecords and updates button state on "Try Again" click with successful response', async () => {
      sendRecords.mockResolvedValue({ status: 200 });
      render(<ProgramRecordAlert {...mockProps} alertType="failure" />);
      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });

      fireEvent.click(tryAgainButton);

      expect(sendRecords).toHaveBeenCalledWith(mockProps.programUUID, mockProps.username, mockCreditPathway.id);
      expect(screen.getByRole('button', { name: 'Re-trying...' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
        expect(mockProps.setSendRecord).toHaveBeenCalledWith(expect.any(Function));
        const setSendRecordCall = mockProps.setSendRecord.mock.calls[0][0];
        const previousState = { sendRecordSuccessOrgs: [], sendRecordFailureOrgs: [mockCreditPathway] };
        const newState = setSendRecordCall(previousState);
        expect(newState.sendRecordSuccessOrgs).toEqual([mockCreditPathway]);
        expect(newState.sendRecordFailureOrgs).toEqual([]);
      });
    });

    it('calls sendRecords and updates button state on "Try Again" click with unsuccessful response', async () => {
      const mockError = new Error('API error');
      sendRecords.mockRejectedValue(mockError);
      render(<ProgramRecordAlert {...mockProps} alertType="failure" />);
      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });

      fireEvent.click(tryAgainButton);

      expect(sendRecords).toHaveBeenCalledWith(mockProps.programUUID, mockProps.username, mockCreditPathway.id);
      expect(screen.getByRole('button', { name: 'Re-trying...' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
        expect(mockProps.setSendRecord).not.toHaveBeenCalled();
        expect(getConfig).toHaveBeenCalled();
        expect(logError).toHaveBeenCalledWith(`Error: Could not send record again: ${mockError.message}`);
      });
    });
  });

  describe('when alertType is "success"', () => {
    it('renders the success alert with the correct message', () => {
      render(<ProgramRecordAlert {...mockProps} alertType="success" />);

      expect(screen.getByRole('alert')).toHaveClass('alert-success');
      expect(screen.getByText('You have successfully sent your program record')).toBeInTheDocument();
      expect(screen.getByText(`${mockCreditPathway.name} has received your record. Check with the school to learn more about their application process.`)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Dismiss/i })).toBeInTheDocument();
    });

    it('calls onClose with the creditPathway id when the close button is clicked', () => {
      render(<ProgramRecordAlert {...mockProps} alertType="success" />);
      const closeButton = screen.getByRole('button', { name: /Dismiss/i });
      fireEvent.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalledWith(mockCreditPathway.id);
    });
  });

  describe('when alertType is not "success" or "failure"', () => {
    it('renders an empty string', () => {
      const { container } = render(<ProgramRecordAlert {...mockProps} alertType="info" />);
      expect(container.firstChild.firstChild).toBeNull();
    });
  });
});
