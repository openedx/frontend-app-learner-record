import React, { useState } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import PropTypes from 'prop-types';
import {
  ModalDialog, Form, SelectableBox, ActionRow, Button,
} from '@openedx/paragon';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import sendRecords from './data/service';

function SendLearnerRecordModal({
  isOpen, toggleSendRecordModal, creditPathways, programUUID, username, setSendRecord, platform, programType,
}) {
  const [selectedPathways, setSelectedPathways] = useState([]);

  const handleSendRecords = async () => {
    const pathwaysToSendRecords = creditPathways.filter(pathway => selectedPathways.includes(pathway.name));

    const orgs = {
      sendRecordSuccessOrgs: [],
      sendRecordFailureOrgs: [],
    };

    await Promise.all(pathwaysToSendRecords.map(pathway => sendRecords(programUUID, username, pathway.id)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          orgs.sendRecordSuccessOrgs.push(pathway);
        } else {
          orgs.sendRecordFailureOrgs.push(pathway);
        }
      })
      .catch(error => {
        orgs.sendRecordFailureOrgs.push(pathway);
        const errorMessage = (`Error: Could not send ${pathway.name} record: ${error.message}`);
        logError(errorMessage);
      })));

    setSendRecord(prev => ({
      ...prev,
      ...orgs,
    }));

    sendTrackEvent('edx.bi.credentials.program_record.send_finished', {
      category: 'records',
      'program-uuid': programUUID,
      organizations: pathwaysToSendRecords,
    });

    toggleSendRecordModal();
  };

  const handleCheckboxChange = (e) => {
    e.persist();

    if (e.target.checked) {
      setSelectedPathways(prev => ([
        ...prev,
        e.target.value,
      ]));
    } else {
      setSelectedPathways(prev => ([
        ...prev.filter(pathway => pathway !== e.target.value),
      ]));
    }
  };

  return (
    <ModalDialog
      title="Title"
      isOpen={isOpen}
      hasCloseButton
      onClose={toggleSendRecordModal}
      size="lg"
      className="send-record-modal"
      isFullscreenScroll
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          <FormattedMessage
            id="send.record.modal.header"
            defaultMessage="Send Program Record to {platform} Credit Partner"
            description="Heading for the send record modal dialog box"
            values={{
              platform,
            }}
          />
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p>
          <FormattedMessage
            id="send.record.modal.description"
            defaultMessage="You can directly share your program record with {platform} partners that accept credit for this {programType} Program. Once you send your record you cannot unsend it."
            description="Information about what the send program record modal is used for"
            values={{
              platform,
              programType,
            }}
          />
        </p>
        <Form>
          <p>
            <FormattedMessage
              id="send.record.modal.form.header"
              defaultMessage="Select the organization(s) you wish to send this record to:"
              description="Heading for the checkbox form in the send record modal"
            />
          </p>
          <SelectableBox.Set
            name="pathways"
            type="checkbox"
            className="checkbox-group"
            onChange={handleCheckboxChange}
            value={selectedPathways}
            ariaLabel="pathway selection"
          >
            {creditPathways.map(pathway => (
              <SelectableBox
                value={pathway.name}
                type="checkbox"
                aria-label="checkbox"
                inputHidden={false}
                key={pathway.id}
              >
                {pathway.name}
              </SelectableBox>
            ))}
          </SelectableBox.Set>
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            <FormattedMessage
              id="send.record.modal.cancel.button"
              defaultMessage="Cancel"
              description="Button used to cancel out of the send record modal"
            />
          </ModalDialog.CloseButton>
          <Button
            variant="primary"
            disabled={selectedPathways.length === 0}
            onClick={handleSendRecords}
          >
            <FormattedMessage
              id="send.record.modal.send.button"
              defaultMessage="Send program record"
              description="Button used to send the program record"
            />
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

SendLearnerRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSendRecordModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  creditPathways: PropTypes.arrayOf(PropTypes.object).isRequired,
  programUUID: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  setSendRecord: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  programType: PropTypes.string.isRequired,
};

export default SendLearnerRecordModal;
