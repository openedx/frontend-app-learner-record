import React from 'react';
import { Router, useParams } from 'react-router-dom';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { logError } from '@edx/frontend-platform/logging';
import { createMemoryHistory } from 'history';
import isEmpty from 'lodash/isEmpty';
import {
  render, screen, waitFor, initializeMockApp,
  fireEvent,
} from '../../../setupTest';

import ProgramRecord from '../ProgramRecord';
import ProgramRecordActions from '../ProgramRecordActions';
import ProgramRecordHeader from '../ProgramRecordHeader';
import ProgramRecordTable from '../ProgramRecordTable';
import RecordsHelp from '../RecordsHelp';
import ProgramRecordAlert from '../../ProgramRecordAlert';
import SendLearnerRecordModal from '../../ProgramRecordSendModal';
import { getProgramDetails } from '../data/service';

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

jest.mock('../ProgramRecordActions', () => jest.fn(() => <div data-testid="program-record-actions" />));
jest.mock('../ProgramRecordHeader', () => jest.fn(() => <div data-testid="program-record-header" />));
jest.mock('../ProgramRecordTable', () => jest.fn(() => <div data-testid="program-record-table" />));
jest.mock('../RecordsHelp', () => jest.fn(() => <div data-testid="records-help" />));
jest.mock('../../ProgramRecordAlert', () => jest.fn(() => <div data-testid="program-record-alert" />));
jest.mock('../../ProgramRecordSendModal', () => jest.fn(() => <div data-testid="send-learner-record-modal" />));
jest.mock('../data/service', () => ({
  getProgramDetails: jest.fn(),
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

const renderWithRouter = (ui, { route = '/', history = createMemoryHistory([route]) } = {}) => {
  return render(<Router history={history}>{ui}</Router>);
};

const defaultProps = {
  isPublic: false,
};

const renderComponent = (props = {}) => {
  useParams.mockReturnValue({ programUUID: mockProgramUUID });
  // getProgramDetails.mockResolvedValue(mockRecordDetails);
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

  it('renders ProgramRecordActions, Header, Table, and Help when data is loaded', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('program-record-actions')).toBeInTheDocument();
      expect(screen.getByTestId('program-record-header')).toBeInTheDocument();
      expect(screen.getByTestId('program-record-table')).toBeInTheDocument();
      expect(screen.getByTestId('records-help')).toBeInTheDocument();
    });
  });

  // it('renders SendLearnerRecordModal when sendRecord.sendRecordModalOpen is true', async () => {
  //   renderComponent();
  //   await waitFor(() => {
  //     expect(screen.queryByTestId('send-learner-record-modal')).toBeNull();
  //   });
  //   getProgramDetails.mockResolvedValue(mockRecordDetails);
  //   renderComponent();
  //   const { rerender } = renderWithRouter(<ProgramRecord {...defaultProps} />, {
  //     history: createMemoryHistory([{
  //       state: {
  //         sendRecord: { sendRecordModalOpen: true },
  //       },
  //     }]),
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('send-learner-record-modal')).toBeInTheDocument();
  //   });
  // });

  // it('renders success alerts for sendRecord.sendRecordSuccessOrgs', async () => {
  //   const successOrgs = [{ id: 'org-1', name: 'Org 1' }];
  //   const mockSendRecordState = {
  //     sendRecordModalOpen: false,
  //     sendRecordSuccessOrgs: successOrgs,
  //     sendRecordFailureOrgs: [],
  //   };
  //   getProgramDetails.mockResolvedValue(mockRecordDetails);
  //   renderWithRouter(<ProgramRecord {...defaultProps} />, {
  //     history: createMemoryHistory([{
  //       state: {
  //         sendRecord: mockSendRecordState,
  //       },
  //     }]),
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('program-record-alert')).toBeInTheDocument();
  //     expect(ProgramRecordAlert).toHaveBeenCalledWith(expect.objectContaining({ alertType: 'success', creditPathway: successOrgs[0] }), {});
  //   });
  // });

  // it('renders failure alerts for sendRecord.sendRecordFailureOrgs', async () => {
  //   const failureOrgs = [{ id: 'org-2', name: 'Org 2' }];
  //   const mockSendRecordState = {
  //     sendRecordModalOpen: false,
  //     sendRecordSuccessOrgs: [],
  //     sendRecordFailureOrgs: failureOrgs,
  //   };
  //   getProgramDetails.mockResolvedValue(mockRecordDetails);
  //   renderWithRouter(<ProgramRecord {...defaultProps} />, {
  //     history: createMemoryHistory([{
  //       state: {
  //         sendRecord: mockSendRecordState,
  //       },
  //     }]),
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('program-record-alert')).toBeInTheDocument();
  //     expect(ProgramRecordAlert).toHaveBeenCalledWith(expect.objectContaining({ alertType: 'failure', creditPathway: failureOrgs[0] }), {});
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

  it('passes correct props to ProgramRecordActions', async () => {
    renderComponent();
    await waitFor(() => {
      expect(ProgramRecordActions).toHaveBeenCalledWith(expect.objectContaining({
        showSendRecordButton: true,
        isPublic: false,
        toggleSendRecordModal: expect.any(Function),
        renderBackButton: expect.any(Function),
        username: 'testuser',
        programUUID: 'test-uuid',
        sharedRecordUUID: 'shared-uuid',
      }), {});
    });
  });

  it('passes correct props to ProgramRecordHeader', async () => {
    renderComponent();
    await waitFor(() => {
      expect(ProgramRecordHeader).toHaveBeenCalledWith(expect.objectContaining({
        learner: { username: 'testuser' },
        program: { type_name: 'Test Program' },
        platform: 'Test Platform',
      }), {});
    });
  });

  it('passes correct props to ProgramRecordTable', async () => {
    renderComponent();
    await waitFor(() => {
      expect(ProgramRecordTable).toHaveBeenCalledWith(expect.objectContaining({
        grades: [],
      }), {});
    });
  });

  it('passes correct helpUrl prop to RecordsHelp', async () => {
    renderComponent();
    await waitFor(() => {
      expect(RecordsHelp).toHaveBeenCalledWith(expect.objectContaining({
        helpUrl: 'https://example.com/help',
      }), {});
    });
  });

  // it('passes correct props to SendLearnerRecordModal', async () => {
  //   renderComponent();
  //   const mockToggle = jest.fn();
  //   getProgramDetails.mockResolvedValue(mockRecordDetails);
  //   const { rerender } = renderWithRouter(<ProgramRecord {...defaultProps} />, {
  //     history: createMemoryHistory([{
  //       state: {
  //         sendRecord: { sendRecordModalOpen: true },
  //       },
  //     }]),
  //   });
  //   await waitFor(() => {
  //     expect(SendLearnerRecordModal).toHaveBeenCalledWith(expect.objectContaining({
  //       isOpen: true,
  //       toggleSendRecordModal: expect.any(Function),
  //       creditPathways: [{ id: 'pathway-1', name: 'Pathway 1' }],
  //       programUUID: 'test-uuid',
  //       username: 'testuser',
  //       setSendRecord: expect.any(Function),
  //       platform: 'Test Platform',
  //       programType: 'Test Program',
  //     }), {});
  //   });
  // });

  it('renders Back button as a Hyperlink', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: 'Back to My Records' })).toHaveAttribute('href', '/');
  });
});
