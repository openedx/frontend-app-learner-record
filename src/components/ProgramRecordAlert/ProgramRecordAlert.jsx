import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button, Hyperlink } from '@openedx/paragon';
import { Info, CheckCircle } from '@openedx/paragon/icons';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { getConfig } from '@edx/frontend-platform';
import sendRecords from '../ProgramRecordSendModal/data/service';

const ProgramRecordAlert = ({
  alertType, onClose, programUUID, username, setSendRecord, creditPathway, platform,
}) => {
  const handleTryAgainSendRecord = () => {
    sendRecords(programUUID, username, creditPathway.id)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          setSendRecord(prev => ({
            ...prev,
            sendRecordSuccessOrgs: [...prev.sendRecordSuccessOrgs, creditPathway],
            sendRecordFailureOrgs: prev.sendRecordFailureOrgs.filter(pathway => pathway.id !== creditPathway.id),
          }));
        }
      })
      .catch(error => {
        const errorMessage = (`Error: Could not send record again: ${error.message}`);
        logError(errorMessage);
      });
  };

  const getAlert = () => {
    switch (alertType) {
      case 'failure':
        return (
          <Alert
            variant="danger"
            icon={Info}
            actions={[
              <Button
                onClick={handleTryAgainSendRecord}
              >
                <FormattedMessage
                  id="send.records.try.again.button"
                  defaultMessage="Try Again"
                  description="Button that attempts to send the records again"
                />
              </Button>,
            ]}
            dismissible
            onClose={() => onClose(creditPathway.id)}
          >
            <Alert.Heading>
              <FormattedMessage
                id="send.failure.alert.heading"
                defaultMessage="We were unable to send your program record"
                description="Heading for the alert that displays when the program record fails to send"
              />
            </Alert.Heading>
            <FormattedMessage
              id="send.failure.alert.message"
              defaultMessage="You can try to send your record to the {pathway_name} pathway again. If this issue persists {link}"
              description="Message for the alert that displays when the program record fails to send"
              values={{
                pathway_name: creditPathway.name,
                link: (
                  <Hyperlink
                    destination={`${getConfig().SUPPORT_URL_LEARNER_RECORDS}`}
                    target="_blank"
                    showLaunchIcon={false}
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
      default:
        return '';
    }
  };
  return getAlert();
};

ProgramRecordAlert.propTypes = {
  alertType: PropTypes.string,
  onClose: PropTypes.func,
  creditPathway: PropTypes.shape().isRequired,
  setSendRecord: PropTypes.func,
  programUUID: PropTypes.string,
  username: PropTypes.string,
  platform: PropTypes.string,
};

ProgramRecordAlert.defaultProps = {
  alertType: '',
  onClose: () => {},
  setSendRecord: () => {},
  programUUID: '',
  username: '',
  platform: '',
};

export default ProgramRecordAlert;
