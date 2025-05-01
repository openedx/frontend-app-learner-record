import React from 'react';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { logError } from '@edx/frontend-platform/logging';
import {
  render, screen, fireEvent, waitFor, initializeMockApp,
} from '../../../setupTest';
import { getProgramRecordUrl, getProgramRecordCsv } from '../data/service';
import ProgramRecordActions from '../ProgramRecordActions';

// Mock necessary modules and functions
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    CREDENTIALS_BASE_URL: 'https://credentials.example.com',
  })),
}));
jest.mock('../data/service', () => ({
  getProgramRecordUrl: jest.fn(),
  getProgramRecordCsv: jest.fn(),
}));

// Mock the navigator clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};
global.navigator.clipboard = mockClipboard;

// Import the component to be tested

const defaultProps = {
  showSendRecordButton: false,
  isPublic: false,
  toggleSendRecordModal: jest.fn(),
  renderBackButton: () => (<button type="button">Back</button>),
  username: 'testuser',
  programUUID: 'test-program-uuid',
  sharedRecordUUID: null,
  setShowProgramRecord429Error: jest.fn(),
};

const renderComponent = (props = {}) => {
  render(<ProgramRecordActions {...{ ...defaultProps, ...props }} />);
};

describe('ProgramRecordActions', () => {
  beforeAll(() => {
    initializeMockApp();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined); // Mock successful clipboard write
  });

  describe('when isPublic is false', () => {
    it('renders the back button', () => {
      renderComponent();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders the "Send program record" button when showSendRecordButton is true', () => {
      renderComponent({ showSendRecordButton: true });
      expect(screen.getByText('Send program record')).toBeInTheDocument();
    });

    it('calls toggleSendRecordModal when the "Send program record" button is clicked', () => {
      renderComponent({ showSendRecordButton: true });
      const sendButton = screen.getByText('Send program record');
      fireEvent.click(sendButton);
      expect(defaultProps.toggleSendRecordModal).toHaveBeenCalledTimes(1);
    });

    describe('programRecordUrl is not set', () => {
      it('renders the "Create program record link" button', () => {
        renderComponent();
        expect(screen.getByText('Create program record link')).toBeInTheDocument();
      });

      it('calls getProgramRecordUrl and copies the URL to clipboard when "Create program record link" is clicked', async () => {
        const mockUrl = { data: { url: 'https://example.com/shared/record' } };
        getProgramRecordUrl.mockResolvedValue(mockUrl);
        renderComponent();
        const createButton = screen.getByText('Create program record link');
        fireEvent.click(createButton);

        expect(getProgramRecordUrl).toHaveBeenCalledWith('test-program-uuid', 'testuser');
        await waitFor(() => {
          expect(mockClipboard.writeText).toHaveBeenCalledWith('https://example.com/shared/record');
        });
        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.share_started', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
        });
        await waitFor(() => {
          expect(screen.getByText('Link copied!')).toBeVisible();
        });
      });

      it('shows an error toast and logs an error if getProgramRecordUrl fails', async () => {
        const mockError = new Error('Failed to create link');
        mockError.status = 500;
        getProgramRecordUrl.mockRejectedValue(mockError);
        renderComponent();
        const createButton = screen.getByText('Create program record link');
        fireEvent.click(createButton);

        await waitFor(() => {
          expect(logError).toHaveBeenCalledWith(mockError);
          expect(screen.getByText('Program record link creation failed. Please log out, log back in, and try again.')).toBeVisible();
        });
        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.share_url_copied', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
        });
      });

      it('sets setShowProgramRecord429Error to true if getProgramRecordUrl fails with a 429 status', async () => {
        const mockError = { status: 429 };
        getProgramRecordUrl.mockRejectedValue(mockError);
        renderComponent();
        const createButton = await screen.findByText('Create program record link');
        fireEvent.click(createButton);
        await waitFor(() => {
          expect(defaultProps.setShowProgramRecord429Error).toHaveBeenCalledWith(true);
        });
      });
    });

    describe('programRecordUrl is set (sharedRecordUUID is provided)', () => {
      it('renders the "Copy program record link" button with the shared URL', () => {
        renderComponent({ sharedRecordUUID: 'shared-uuid' });
        expect(screen.getByText('Copy program record link')).toBeInTheDocument();
      });

      it('copies the shared URL to clipboard when "Copy program record link" is clicked', async () => {
        renderComponent({ sharedRecordUUID: 'shared-uuid' });
        const copyButton = screen.getByText('Copy program record link');
        fireEvent.click(copyButton);

        await waitFor(() => {
          expect(mockClipboard.writeText).toHaveBeenCalledWith('https://credentials.example.com/records/programs/shared/shared-uuid');
        });
        expect(sendTrackEvent).toHaveBeenCalledWith('edx.bi.credentials.program_record.share_url_copied', {
          category: 'records',
          'program-uuid': 'test-program-uuid',
        });
        await waitFor(() => {
          expect(screen.getByText('Link copied!')).toBeVisible();
        });
      });
    });

    it('renders the help icon button', () => {
      renderComponent();
      expect(screen.getByTestId('help-icon-button')).toBeInTheDocument();
    });

    it('shows the help popover when the help icon button is clicked', async () => {
      renderComponent();
      const helpButton = screen.getByTestId('help-icon-button');
      fireEvent.click(helpButton);
      await waitFor(() => {
        expect(screen.getByText('Sending your Program Record')).toBeVisible();
        expect(screen.getByText('Sharing your Program Record')).toBeVisible();
      });
    });
  });

  describe('when isPublic is true', () => {
    it('renders the "Download program record" button', () => {
      renderComponent({ isPublic: true });
      expect(screen.getByText('Download program record')).toBeInTheDocument();
    });

    it('calls getProgramRecordCsv and triggers a download when the button is clicked', async () => {
      getProgramRecordCsv.mockResolvedValue({ status: 200 });
      renderComponent({ isPublic: true });
      const downloadButton = screen.getByText('Download program record');
      fireEvent.click(downloadButton);

      expect(getProgramRecordCsv).toHaveBeenCalledWith('test-program-uuid');
      await waitFor(() => {
        expect(screen.getByText('Downloading program record')).toBeVisible();
      });
      await waitFor(() => {
        expect(screen.getByText('Download complete')).toBeVisible();
      });
    });

    it('shows an error state if getProgramRecordCsv fails', async () => {
      const mockError = new Error('Download failed');
      getProgramRecordCsv.mockRejectedValue(mockError);
      renderComponent({ isPublic: true });
      const downloadButton = screen.getByText('Download program record');
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(screen.getByText('Downloading program record')).toBeVisible();
      });
      await waitFor(() => {
        expect(screen.getByText('Download program record failed')).toBeVisible();
        expect(logError).toHaveBeenCalledWith(mockError);
      });
    });
  });
});
