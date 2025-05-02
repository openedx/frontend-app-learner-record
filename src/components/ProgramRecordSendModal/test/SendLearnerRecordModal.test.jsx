import React from 'react';

import { logError } from '@edx/frontend-platform/logging';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import {
  render, screen, fireEvent, waitFor, initializeMockApp,
} from '../../../setupTest';
import { sendRecords } from '../data/service';
import SendLearnerRecordModal from '../SendLearnerRecordModal';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../data/service', () => ({
  sendRecords: jest.fn(),
}));

const mockToggleSendRecordModal = jest.fn();
const mockSetSendRecord = jest.fn();
const mockSetShowProgramRecord429Error = jest.fn();

const mockCreditPathways = [
  { id: 'pathway-1', name: 'University A' },
  { id: 'pathway-2', name: 'College B' },
];

const defaultProps = {
  isOpen: true,
  toggleSendRecordModal: mockToggleSendRecordModal,
  creditPathways: mockCreditPathways,
  programUUID: 'test-program-uuid',
  username: 'test-user',
  setSendRecord: mockSetSendRecord,
  platform: 'Test Platform',
  programType: 'Test Program',
  setShowProgramRecord429Error: mockSetShowProgramRecord429Error,
};

const renderComponent = (props = {}) => {
  render(<SendLearnerRecordModal {...{ ...defaultProps, ...props }} />);
};

describe('SendLearnerRecordModal', () => {
  beforeAll(() => {
    initializeMockApp();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with the correct title and description', () => {
    renderComponent();
    expect(screen.getByText('Send Program Record to Test Platform Credit Partner')).toBeInTheDocument();
    expect(screen.getByText('You can directly share your program record with Test Platform partners that accept credit for this Test Program Program. Once you send your record you cannot unsend it.')).toBeInTheDocument();
  });

  it('renders the list of credit pathways as selectable boxes', () => {
    renderComponent();
    mockCreditPathways.forEach(pathway => {
      expect(screen.getByRole('checkbox', { name: pathway.name })).toBeInTheDocument();
      expect(screen.getByText(pathway.name)).toBeInTheDocument();
    });
  });

  it('calls toggleSendRecordModal when the close button is clicked', () => {
    renderComponent();
    const closeButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(closeButton);
    expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
  });

  it('disables the "Send program record" button initially', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Send program record' })).toBeDisabled();
  });

  it('enables the "Send program record" button when at least one pathway is selected', async () => {
    renderComponent();
    const checkboxA = screen.getByText('University A');

    fireEvent.click(checkboxA);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send program record' })).toBeEnabled();
    });
  });

  it('disables the "Send program record" button when all selected pathways are unselected', async () => {
    renderComponent();
    const checkboxA = screen.getByText('University A');
    fireEvent.click(checkboxA);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send program record' })).toBeEnabled();
    });
    fireEvent.click(checkboxA);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send program record' })).toBeDisabled();
    });
  });

  describe('when "Send program record" button is clicked', () => {
    it('calls sendRecords for each selected pathway and updates sendRecord on success', async () => {
      sendRecords.mockResolvedValue({});
      renderComponent();
      const checkboxA = screen.getByText('University A');
      fireEvent.click(checkboxA);
      const sendButton = screen.getByRole('button', { name: 'Send program record' });
      fireEvent.click(sendButton);

      expect(sendRecords).toHaveBeenCalledTimes(1);
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-1');

      await waitFor(() => {
        // Access state setter function
        const updateFunction = mockSetSendRecord.mock.calls[0][0];
        // Simulate previous state
        const previousState = { sendRecordSuccessPathways: [], sendRecordFailurePathways: [] };
        const expectedNewState = {
          sendRecordSuccessPathways: [mockCreditPathways[0]],
          sendRecordFailurePathways: [],
        };
        expect(updateFunction(previousState)).toEqual(expectedNewState);

        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.send_finished', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
          organizations: [mockCreditPathways[0]],
        });
        expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
      });
    });

    it('calls sendRecords for each selected pathway and updates sendRecord on failure (non-429)', async () => {
      const mockError = new Error('API error');
      sendRecords.mockRejectedValue(mockError);
      renderComponent();
      const checkboxA = screen.getByText('University A');
      fireEvent.click(checkboxA);
      const sendButton = screen.getByRole('button', { name: 'Send program record' });
      fireEvent.click(sendButton);

      expect(sendRecords).toHaveBeenCalledTimes(1);
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-1');

      await waitFor(() => {
        expect(logError).toHaveBeenCalledWith('Error: Could not send University A record: API error');
        // Access state setter function
        const updateFunction = mockSetSendRecord.mock.calls[0][0];
        // Simulate previous state
        const previousState = { sendRecordSuccessPathways: [], sendRecordFailurePathways: [] };
        const expectedNewState = {
          sendRecordSuccessPathways: [],
          sendRecordFailurePathways: [mockCreditPathways[0]],
        };
        expect(updateFunction(previousState)).toEqual(expectedNewState);

        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.send_finished', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
          organizations: [mockCreditPathways[0]],
        });
        expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
      });
    });

    it('calls sendRecords for each selected pathway and sets 429 error state on 429 failure', async () => {
      const mockError = { status: 429, message: 'Too Many Requests' };
      sendRecords.mockRejectedValue(mockError);
      renderComponent();
      const checkboxA = screen.getByText('University A');
      fireEvent.click(checkboxA);
      const sendButton = screen.getByRole('button', { name: 'Send program record' });
      fireEvent.click(sendButton);

      expect(sendRecords).toHaveBeenCalledTimes(1);
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-1');

      await waitFor(() => {
        expect(logError).toHaveBeenCalledWith('Error: Could not send University A record: Too Many Requests');
        expect(mockSetShowProgramRecord429Error).toHaveBeenCalledWith(true);
        expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
      });
    });

    it('handles sending records to multiple selected pathways when one returns an error', async () => {
      const mockSuccess = {};
      const mockFailure = new Error('API error');
      sendRecords
        .mockResolvedValueOnce(mockSuccess)
        .mockRejectedValueOnce(mockFailure);

      renderComponent();
      const checkboxA = screen.getByText('University A');
      const checkboxB = screen.getByText('College B');
      fireEvent.click(checkboxA);
      fireEvent.click(checkboxB);
      const sendButton = screen.getByRole('button', { name: 'Send program record' });
      fireEvent.click(sendButton);

      expect(sendRecords).toHaveBeenCalledTimes(2);
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-1');
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-2');

      await waitFor(() => {
        expect(logError).toHaveBeenCalledWith('Error: Could not send College B record: API error');
        // Access state setter function
        const updateFunction = mockSetSendRecord.mock.calls[0][0];
        // Simulate previous state
        const previousState = { sendRecordSuccessPathways: [], sendRecordFailurePathways: [] };
        const expectedNewState = {
          sendRecordSuccessPathways: [mockCreditPathways[0]],
          sendRecordFailurePathways: [mockCreditPathways[1]],
        };
        expect(updateFunction(previousState)).toEqual(expectedNewState);

        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.send_finished', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
          organizations: [mockCreditPathways[0], mockCreditPathways[1]],
        });
        expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
      });
    });

    it('handles 429 error when sending to multiple pathways', async () => {
      const mockSuccess = {};
      const mock429Error = { status: 429, message: 'Too Many Requests' };
      sendRecords
        .mockResolvedValueOnce(mockSuccess)
        .mockRejectedValueOnce(mock429Error);

      renderComponent();
      const checkboxA = screen.getByText('University A');
      const checkboxB = screen.getByText('College B');
      fireEvent.click(checkboxA);
      fireEvent.click(checkboxB);
      const sendButton = screen.getByRole('button', { name: 'Send program record' });
      fireEvent.click(sendButton);

      expect(sendRecords).toHaveBeenCalledTimes(2);
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-1');
      expect(sendRecords).toHaveBeenCalledWith('test-program-uuid', 'test-user', 'pathway-2');

      await waitFor(() => {
        expect(logError).toHaveBeenCalledWith('Error: Could not send College B record: Too Many Requests');
        expect(mockSetShowProgramRecord429Error).toHaveBeenCalledWith(true);
        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.send_finished', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
          organizations: [mockCreditPathways[0], mockCreditPathways[1]],
        });
        expect(mockToggleSendRecordModal).toHaveBeenCalledTimes(1);
      });
    });
  });
});
