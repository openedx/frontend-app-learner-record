import React, { useState, useEffect } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import PropTypes from 'prop-types';
import {
  Help, AccountBalance, ContentCopy, Download, SpinnerSimple, Check,
} from '@openedx/paragon/icons';
import {
  Button, StatefulButton, Icon, IconButton, OverlayTrigger, Popover, Tooltip, Toast,
} from '@openedx/paragon';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { getConfig } from '@edx/frontend-platform';
import { getProgramRecordUrl, getProgramRecordCsv } from './data/service';

function ProgramRecordActions({
  showSendRecordButton, isPublic, toggleSendRecordModal, renderBackButton, username, programUUID, sharedRecordUUID,
}) {
  const [programRecordUrl, setProgramRecordUrl] = useState(sharedRecordUUID && `${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/${sharedRecordUUID}`);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadRecord, setDownloadRecord] = useState('default');

  const downloadButtonProps = {
    labels: {
      default: (
        <FormattedMessage
          id="download.button.default"
          defaultMessage="Download program record"
          description="Default state for the download program record button"
        />
      ),
      pending: (
        <FormattedMessage
          id="download.button.pending"
          defaultMessage="Downloading program record"
          description="Pending state for the download program record button"
        />
      ),
      complete: (
        <FormattedMessage
          id="download.button.complete"
          defaultMessage="Download complete"
          description="Completed state for the download program record button"
        />
      ),
    },
    icons: {
      default: <Icon src={Download} />,
      pending: <Icon src={SpinnerSimple} className="icon-spin" />,
      complete: <Icon src={Check} />,
    },
    disabledStates: ['pending', 'complete'],
    variant: 'primary',
  };

  useEffect(() => {
    if (showCopyTooltip) {
      setTimeout(() => {
        setShowCopyTooltip(false);
      }, 3000);
    }
  }, [showCopyTooltip]);

  useEffect(() => {
    if (downloadRecord === 'complete') {
      setTimeout(() => {
        setDownloadRecord('default');
      }, 4000);
    }
  }, [downloadRecord]);

  const handleCopyEvent = () => {
    sendTrackEvent('edx.bi.credentials.program_record.share_url_copied', {
      category: 'records',
      'program-uuid': programUUID,
    });
    setShowCopyTooltip(true);
  };

  const handleProgramUrlCopy = () => {
    navigator.clipboard.writeText(programRecordUrl);
    handleCopyEvent();
  };

  const handleProgramUrlCreate = () => {
    getProgramRecordUrl(programUUID, username)
      .then(({ data }) => {
        setProgramRecordUrl(data.url);
        navigator.clipboard.writeText(data.url);
        sendTrackEvent('edx.bi.credentials.program_record.share_started', {
          category: 'records',
          'program-uuid': programUUID,
        });
      })
      .catch((error) => {
        logError(error);
        throw new Error(error);
      });
    handleCopyEvent();
  };

  const handleDownloadRecord = () => {
    setDownloadRecord('pending');
    getProgramRecordCsv(programUUID)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          setDownloadRecord('complete');
          window.location = `${getConfig().CREDENTIALS_BASE_URL}/records/programs/shared/${programUUID}/csv`;
        }
      })
      .catch((error) => {
        logError(error);
        throw new Error(error);
      });
  };

  return (
    <div className={`program-record-nav ${isPublic && ('flex-row-reverse')}`}>
      {!isPublic ? (
        <>
          {renderBackButton()}
          <div className="program-record-actions">
            {showSendRecordButton && (
            <Button
              variant="primary"
              onClick={toggleSendRecordModal}
              iconBefore={AccountBalance}
              className="send-record-button"
            >
              <FormattedMessage
                id="send.program.record"
                defaultMessage="Send program record"
                description="Button text for sending a program record"
              />
            </Button>
            )}
            <OverlayTrigger
              placement="top"
              show={showCopyTooltip}
              overlay={(
                <Tooltip
                  id="copy-tooltip"
                >
                  <FormattedMessage
                    id="copy.link.tooltip.message"
                    defaultMessage="Link copied!"
                    description="Notification message displayed when a user copies the link"
                  />
                </Tooltip>
                )}
            >
              {programRecordUrl ? (
                <Button
                  variant="outline-primary"
                  iconBefore={ContentCopy}
                  className="copy-record-button"
                  onClick={handleProgramUrlCopy}
                >
                  <FormattedMessage
                    id="copy.program.record.link"
                    defaultMessage="Copy program record link"
                    description="Button text for copying a link to the program record"
                  />
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  iconBefore={ContentCopy}
                  className="copy-record-button"
                  onClick={handleProgramUrlCreate}
                >
                  <FormattedMessage
                    id="create.program.record.link"
                    defaultMessage="Create program record link"
                    description="Button text for creating a link to the program record"
                  />
                </Button>
              )}
            </OverlayTrigger>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={(
                <Popover
                  id="help-popover"
                >
                  <Popover.Title as="h3">
                    <FormattedMessage
                      id="send.program.record.popover.heading"
                      defaultMessage="Sending your Program Record"
                      description="Header for information on sending a program record"
                    />
                  </Popover.Title>
                  <Popover.Content>
                    <FormattedMessage
                      id="send.program.record.popover.content"
                      defaultMessage="Pursue deeper learning. Send your record to universities that accept this program for credit. You can send your record to multiple universities at once. Once sent, the records cannot be unsent."
                      description="Content describing the process of sending program records to organizations"
                    />
                  </Popover.Content>
                  <Popover.Title as="h3">
                    <FormattedMessage
                      id="share.program.record.popover.heading"
                      defaultMessage="Sharing your Program Record"
                      description="Header for information on sharing a program record"
                    />
                  </Popover.Title>
                  <Popover.Content>
                    <FormattedMessage
                      id="share.program.record.popover.content"
                      defaultMessage="Showcase your progress! Share this record publicly with universities and employers. Create a 'public program record link' to give people access to your record."
                      description="Content describing the process of sharing program records to organizations and employers"
                    />
                  </Popover.Content>
                </Popover>
              )}
            >
              <IconButton
                data-testid="help-icon-button"
                className="help-icon"
                src={Help}
                iconAs={Icon}
                alt="Help"
                variant="primary"
              />
            </OverlayTrigger>
          </div>
        </>
      ) : (
        <>
          <div className="download-record">
            <StatefulButton
              variant="primary"
              {...downloadButtonProps}
              state={downloadRecord}
              onClick={handleDownloadRecord}
            >
              <FormattedMessage
                id="download.program.record"
                defaultMessage="Download program record"
                description="Click this button to download the program record"
              />
            </StatefulButton>
          </div>
          <Toast
            onClose={() => setShowDownloadToast(false)}
            show={showDownloadToast}
          >
            <FormattedMessage
              id="successful.record.download.toast.message"
              defaultMessage="Program record sucessfullly downloaded"
              description="A message to briefly display when the user successfully downloads a program record"
            />
          </Toast>
        </>
      )}
    </div>
  );
}

ProgramRecordActions.propTypes = {
  showSendRecordButton: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
  toggleSendRecordModal: PropTypes.func.isRequired,
  renderBackButton: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  programUUID: PropTypes.string.isRequired,
  sharedRecordUUID: PropTypes.string.isRequired,
};

export default ProgramRecordActions;
