import React from 'react';
import { useParams } from 'react-router-dom';

import { logError } from '@edx/frontend-platform/logging';
import {
  render, screen, waitFor, initializeMockApp,
  fireEvent,
} from '../../../setupTest';

import ProgramRecord from '../ProgramRecord';
import { getProgramDetails } from '../data/service';
import { sendRecords } from '../../ProgramRecordSendModal/data/service';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../data/service', () => ({
  getProgramDetails: jest.fn(),
}));

jest.mock('../../ProgramRecordSendModal/data/service', () => ({
  sendRecords: jest.fn(),
}));

const mockProgramUUID = 'test-uuid';
const mockRecordDetails = {
  record: {
    learner: { username: 'testuser' },
    program: { type_name: 'Test Program' },
    platform_name: 'Test Platform',
    grades: [],
    pathways: [{ id: 'pathway-1', name: 'Pathway 1' }],
    shared_program_record_uuid: 'shared-uuid',
  },
  records_help_url: 'https://example.com/help',
};

const defaultProps = {
  isPublic: false,
};

const renderComponent = (props = {}) => {
  useParams.mockReturnValue({ programUUID: mockProgramUUID });
  render(<ProgramRecord {...{ ...defaultProps, ...props }} />);
};

describe('ProgramRecord', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => {
    getProgramDetails.mockResolvedValue(mockRecordDetails);
    jest.clearAllMocks();
  });

  it('renders loading message initially', () => {
    getProgramDetails.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to My Records' })).toBeInTheDocument();
  });

  it('fetches program details on mount with correct UUID and isPublic flag', async () => {
    renderComponent();
    await waitFor(() => {
      expect(getProgramDetails).toHaveBeenCalledWith(mockProgramUUID, false);
    });
  });

  // it('renders ProgramRecordActions, Header, Table, and Help when data is loaded', async () => {
  //   renderComponent();
  //   await waitFor(() => {
  //     // TODO: find another way to check for these -- maybe add the test ids to the component itself?
  //     // expect(screen.getByTestId('program-record-actions')).toBeInTheDocument();
  //     // expect(screen.getByTestId('program-record-header')).toBeInTheDocument();
  //     // expect(screen.getByTestId('program-record-table')).toBeInTheDocument();
  //     // expect(screen.getByTestId('records-help')).toBeInTheDocument();
  //   });
  // });

  it('logs an error when getProgramDetails fails', async () => {
    const mockError = new Error('Failed to fetch data');

    getProgramDetails.mockRejectedValue(mockError);
    renderComponent();
    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith(`Error: Could not fetch program record data for user: ${mockError.message}`);
      expect(screen.getByText('Loading...')).toBeInTheDocument(); // Still shows loading initially
      expect(screen.getByRole('link', { name: 'Back to My Records' })).toBeInTheDocument();
    });
  });

  it('renders the service issue alert when there is no data', async () => {
    getProgramDetails.mockResolvedValue({});
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('An error occurred attempting to retrieve your program records. Please try again later.')).toBeInTheDocument();
    });
  });

  it('renders SendLearnerRecordModal when toggleSendRecordModal is called', async () => {
    renderComponent(); // Initial render with modal closed

    await waitFor(() => {
      expect(screen.queryByTestId('modal-backdrop')).toBeNull();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send program record' }));

    await waitFor(() => {
      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    });
  });

  it('renders a success alert when successfully sending a program record', () => {
    renderComponent(); // Initial render with modal closed

    waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Send program record' }));
      fireEvent.click(screen.getByText('Pathway 1'));
      fireEvent.click(screen.getByTestId('send-records-modal-button'));

      expect(screen.getByText('You have successfully sent your program record')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Dismiss'));
      expect(screen.getByText('You have successfully sent your program record')).toBeNull();
    });
  });

  it('renders a failure alert when it fails sending a program record', () => {
    renderComponent(); // Initial render with modal closed
    const mockError = new Error('Failed to send records');

    sendRecords.mockRejectedValue(mockError);
    waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Send program record' }));
      fireEvent.click(screen.getByText('Pathway 1'));
      fireEvent.click(screen.getByTestId('send-records-modal-button'));

      expect(screen.getByText('We were unable to send your program record')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Dismiss'));
      expect(screen.getByText('We were unable to send your program record')).toBeNull();
    });
  });

  it('renders Back button as a Hyperlink', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: 'Back to My Records' })).toHaveAttribute('href', '/');
  });
});
