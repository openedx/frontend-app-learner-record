import React from 'react';

import { ChevronLeft, Info } from '@edx/paragon/icons';
import { Alert, Hyperlink } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { logError } from '@edx/frontend-platform/logging';
import _ from 'lodash';

import getProgramRecords from './data/service';

const ProgramRecordsList = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasNoData, setHasNoData] = React.useState(false);
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
    getProgramRecords().then((data) => {
      setIsLoaded(true);
      if (_.isEmpty(data)) {
        setHasNoData(true);
      } else {
        setRecords(data.enrolled_programs);
      }
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
        className="mt-2 mb-4 d-inline-block muted-link pl-3 pr-3"
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
    <p className="pl-3 pr-3">
      <FormattedMessage
        id="records.list.empty"
        defaultMessage="No records yet. Program records are created once you have earned at least one course
        certificate in a program."
        description="A message indicating the user has no program records to display on the Learner Records page"
      />
    </p>
  );

  const renderRows = () => (
    <section id="program-records-list" className="pl-3 pr-3">
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
    </section>
  );

  const renderList = () => {
    if (isLoaded) {
      if (hasNoData) {
        return renderCredentialsServiceIssueAlert();
      }
      if (!records.length) {
        return renderEmpty();
      }
      return renderRows();
    }
    return null;
  };

  return (
    <main id="main-content" className="pt-5 pb-5 pl-4 pr-4 " tabIndex="-1">
      {renderProfile()}
      <h1 className="h3 pl-3 pr-3 mb-4">
        <FormattedMessage
          id="records.header"
          defaultMessage="My Learner Records"
          description="Header for the Learner Records page"
        />
      </h1>
      {renderList()}
    </main>
  );
};

export default ProgramRecordsList;
