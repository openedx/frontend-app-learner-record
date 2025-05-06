import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Alert, Hyperlink, StatefulButton,
} from '@openedx/paragon';
import { Info, CheckCircle } from '@openedx/paragon/icons';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { getConfig } from '@edx/frontend-platform';
import { sendRecords } from '../ProgramRecordSendModal/data/service';

const ProgramRecordAlert = ({
  alertType,
  onClose,
  programUUID,
  username,
  setSendRecord,
  creditPathway,
  platform,
  setShowProgramRecord429Error,
}) => {
  const [tryAgainButtonState, setTryAgainButtonState] = useState('default');

  const tryAgainButtonProps = {
    labels: {
      default: (
        <FormattedMessage
          id="send.records.try.again.button"
          defaultMessage="Try Again"
          description="Button that attempts to send the records again"
        />
      ),
      pending: (
        <FormattedMessage
          id="send.records.pending.button"
          defaultMessage="Re-trying..."
          description="Button to indicate loading state for Try Again functionality"
        />
      ),
    },
    disabledStates: ['pending'],
  };

  const handleTryAgainSendRecord = () => {
    setTryAgainButtonState('pending');
    sendRecords(programUUID, username, creditPathway.id)
      .then(() => {
        setSendRecord(prev => ({
          ...prev,
          sendRecordSuccessPathways: [...prev.sendRecordSuccessPathways, creditPathway],
          sendRecordFailurePathways: prev.sendRecordFailurePathways.filter(pathway => pathway.id !== creditPathway.id),
        }));
        setTryAgainButtonState('default');
      })
      .catch(error => {
        if (error.status === 429) {
          setShowProgramRecord429Error(true);
          setSendRecord(prev => ({
            ...prev,
            sendRecordFailurePathways: prev.sendRecordFailurePathways.filter(
              pathway => pathway.id !== creditPathway.id,
            ),
          }));
        }
        const errorMessage = (`Error: Could not send record again: ${error.message}`);
        logError(errorMessage);
        setTryAgainButtonState('default');
      });
  };

  const renderAlert = () => {
    switch (alertType) {
      case 'failure':
        return (
          <Alert
            variant="danger"
            icon={Info}
            actions={[
              <StatefulButton
                variant="primary"
                {...tryAgainButtonProps}
                state={tryAgainButtonState}
                onClick={handleTryAgainSendRecord}
              />,
            ]}
            dismissible
            onClose={() => onClose(creditPathway.id)}
          >
            <Alert.Heading>
              <FormattedMessage
                id="send.failure.alert.heading.default"
                defaultMessage="We were unable to send your program record"
                description="Heading for the alert that displays when the program record fails to send"
              />
            </Alert.Heading>
            <FormattedMessage
              id="send.failure.alert.message.default"
              defaultMessage="You can try to send your record to the {pathway_name} pathway again. If this issue persists {link}"
              description="Message for the alert that displays when the program record fails to send"
              values={{
                pathway_name: creditPathway.name,
                link: (
                  <Hyperlink
                    destination={`${getConfig().SUPPORT_URL_LEARNER_RECORDS}`}
                    target="_blank"
                    showLaunchIcon={false}
                    isInline
                  >
                    {`contact ${platform} support.`}
                  </Hyperlink>
                ),
              }}
            />
          </Alert>
        );
      case 'success':
        return (
          <Alert
            variant="success"
            icon={CheckCircle}
            dismissible
            onClose={() => onClose(creditPathway.id)}
          >
            <Alert.Heading>
              <FormattedMessage
                id="send.success.alert.heading"
                defaultMessage="You have successfully sent your program record"
                description="Heading for the alert that displays when a program record is successfully sent"
              />
            </Alert.Heading>
            <FormattedMessage
              id="send.success.alert.message"
              defaultMessage="{pathway_name} has received your record. Check with the school to learn more about their application process."
              description="Message content to inform the user that their record has been received"
              values={{
                pathway_name: creditPathway.name,
              }}
            />
          </Alert>
        );
      case '429':
        return (
          <Alert
            variant="danger"
            onClose={() => setShowProgramRecord429Error(false)}
            icon={Info}
            dismissible
          >
            <Alert.Heading>
              <FormattedMessage
                id="send.failure.alert.heading.429"
                defaultMessage="Too many requests."
                description="Alert heading for 429 error status"
              />
            </Alert.Heading>
            <FormattedMessage
              id="send.failure.alert.message.429"
              defaultMessage="Please try again in a few minutes."
              description="Alert message for 429 error status"
            />
          </Alert>
        );
      default:
        return '';
    }
  };
  return renderAlert();
};

ProgramRecordAlert.propTypes = {
  alertType: PropTypes.string,
  onClose: PropTypes.func,
  creditPathway: PropTypes.shape(),
  setSendRecord: PropTypes.func,
  programUUID: PropTypes.string,
  username: PropTypes.string,
  platform: PropTypes.string,
};

ProgramRecordAlert.defaultProps = {
  alertType: '',
  onClose: () => {},
  creditPathway: {},
  setSendRecord: () => {},
  programUUID: '',
  username: '',
  platform: '',
};

export default ProgramRecordAlert;
