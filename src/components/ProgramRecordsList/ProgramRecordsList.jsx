import React, { useEffect } from 'react';

import { ChevronLeft, Info } from '@edx/paragon/icons';
import {
  Alert, Button, Hyperlink,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { logError } from '@edx/frontend-platform/logging';
import _ from 'lodash';

import NavigationBar from '../NavigationBar/NavigationBar';

import getProgramRecords from './data/service';

function ProgramRecordsList() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasNoData, setHasNoData] = React.useState(false);
  const [records, setRecords] = React.useState([]);

  useEffect(() => {
    getProgramRecords().then((data) => {
      if (_.isEmpty(data)) {
        setHasNoData(true);
      } else {
        (data.enrolled_programs).map((program) => { /* eslint-disable no-param-reassign */
          if (program.completed) {
            program.status = 'Completed';
          } else {
            program.status = 'Partially Completed';
          }
          return null;
        });
        setRecords(data.enrolled_programs);
      }
      setIsLoaded(true);
    }).catch((error) => {
      const errorMessage = (`Error: Could not fetch learner record data for user: ${error.message}`);
      logError(errorMessage);
    });
  }, []);

  const renderProfile = () => {
    const { username } = getAuthenticatedUser();
    return (
      <Hyperlink
        destination={`${getConfig().LMS_BASE_URL}/u/${username}`}
        className="mb-4 d-inline-block muted-link pl-3 pr-3"
      >
        <ChevronLeft className="mb-1" />
        <FormattedMessage
          id="records.profile.link"
          defaultMessage="Back to My Profile"
          description="Link text that redirects logged-in user to their profile page"
        />
      </Hyperlink>
    );
  };

  const renderCredentialsServiceIssueAlert = () => (
    <div tabIndex="-1">
      <Alert variant="danger">
        <Info className="text-danger-500 mr-2 mb-1" />
        <FormattedMessage
          id="records.list.error"
          defaultMessage="An error occurred attempting to retrieve your program records. Please try again later."
          description="An error message indicating there is a problem retrieving the user's program records"
        />
      </Alert>
    </div>
  );

  const renderEmpty = () => (
    <p className="pl-3 pr-3 text-gray-500">
      <FormattedMessage
        id="records.list.empty"
        defaultMessage="No records yet. Program records are created once you have earned at least one course
        certificate in a program."
        description="A message indicating the user has no program records to display on the Learner Records page"
      />
    </p>
  );

  const renderProgramRecords = () => (
    <section id="program-records-list" className="pl-3 pr-3 pb-3">
      <header>
        <h2 className="h4">
          <FormattedMessage
            id="records.subheader"
            defaultMessage="Program Records"
            description="Subheader for the Learner Records page"
          />
        </h2>
        <p>
          <FormattedMessage
            id="records.description"
            defaultMessage="A program record is created once you have earned at least one course certificate
            in a program."
            description="Description of program records for the Learner Records page"
          />
        </p>
      </header>
      {records.map((record, index) => {
        const useBackground = (index % 2) === 0;
        return (
          <div
            key={record.uuid}
            className={`d-flex justify-content-between flex-wrap p-4 ${useBackground ? 'bg-gray-200' : ''}`}
          >
            <div className="flex-column">
              <h3>{record.name}</h3>
              <div>{record.partner} | {record.status}</div>
            </div>
            <div className="d-flex align-items-center pt-3 pt-lg-0">
              <Hyperlink
                variant="muted"
                destination={getConfig().USE_LR_MFE ? `/${record.uuid}` : `${getConfig().CREDENTIALS_BASE_URL}/records/programs/${record.uuid}/`}
              >
                <Button variant="outline-primary">
                  <FormattedMessage
                    id="records.record.view.link"
                    defaultMessage="View Program Record"
                    description="Link text for button that redirects user to view a program record"
                  />
                </Button>
              </Hyperlink>
            </div>
          </div>
        );
      })}
    </section>
  );

  const renderData = () => {
    if (isLoaded) {
      if (hasNoData) {
        return renderCredentialsServiceIssueAlert();
      }
      if (!records.length) {
        return renderEmpty();
      }
      return renderProgramRecords();
    }
    return null;
  };

  const renderHelp = () => (
    <div className="pl-3 pr-3 pt-4 pb-1">
      <h3 className="h5">
        <FormattedMessage
          id="records.help.header"
          defaultMessage="Questions about Learner Records?"
          description="Header for the help section of Learner Records page"
        />
      </h3>
      <FormattedMessage
        id="records.help.description"
        defaultMessage="To learn more about records you can "
        description="Text description for the help section of Learner Records page"
      />
      <Hyperlink
        destination={`${getConfig().SUPPORT_URL_LEARNER_RECORDS}`}
        target="_blank"
        showLaunchIcon={false}
      >
        <FormattedMessage
          id="records.help.link"
          defaultMessage="read more in our records help area."
          description="Text containing link that redirects user to support page"
        />
      </Hyperlink>
    </div>
  );

  return (
    <main id="main-content" className="pt-5 pb-5 pl-4 pr-4" tabIndex="-1">
      {renderProfile()}
      <NavigationBar />
      <h1 className="h3 pl-3 pr-3 mb-4">
        <FormattedMessage
          id="records.header"
          defaultMessage="My Learner Records"
          description="Header for the Learner Records page"
        />
      </h1>
      {renderData()}
      {renderHelp()}
    </main>
  );
}

export default ProgramRecordsList;
