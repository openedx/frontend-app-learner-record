import React, { useEffect } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import _ from 'lodash';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Plugin } from '@edx/frontend-plugin-framework/src/plugins';
import { RecordsList as ProgramRecordsList } from '../ProgramRecordsList/ProgramRecordsList';
import getProgramRecords from '../ProgramRecordsList/data/service';

// NOTES:
// This is capitalized to signify that it is a React Component
// There were issues when passing fallback components to the ErrorBoundary from frontend-platform
// If a function is passed to ErrorBoundary, for some reason, it doesn't get rendered to the page
// However, if you format it like a React Component (ie. <ErrorFallback />) then it WILL get rendered to the page
// Take a closer look at the Plugin.jsx file in frontend-plugin-framework to see how this is done
// Important to note that this capitilization DOES NOT do anything other than provide a reminder to the developer
// If it is passed with a lowercase or as a function it will still work
// Below in the Plugin component you can see it is not called in the component format (<ErrorFallbackComponent />)
// It is provided as a prop like any other function would be (ErrorFallbackComponent={ErrorFallbackComponent})
const ErrorFallbackComponent = () => (
  <div>
    <p>
      <FormattedMessage
        id="unexpected.error.message.text"
        defaultMessage="Oh geez, this is not good at all."
        description="error message when an unexpected error occurs"
      />
    </p>
    <br />
  </div>
);

// const ExplodingComponent = () => {
//   throw new Error('Exploding component');
// };

// eslint-disable-next-line react/prop-types
const PluginProgramRecord = () => {
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
      // TODO: add logic to setError and render alert?
      const errorMessage = (`Error: Could not fetch learner record data for user: ${error.message}`);
      logError(errorMessage);
    });
  }, []);

  // NOTES:
  // If the code that errors is not wrapped in a Plugin component,
  // then the error will bubble up to the ErrorBoundary in AppProvider (every MFE is wrapped in <AppProvider />)
  // Simply throwing an error in this component could trigger the AppProvider ErrorBoundary
  // if that code is not wrapped in the <Plugin /> component
  // This function controls the rendering of various component and is wrapped by <Plugin />
  const renderPlugin = () => {
    if (isLoaded) {
      if (hasNoData) {
        return (<h3>Error: no data in response</h3>);
      }
      if (!records.length) {
        // Simply throwing an error here would trigger the AppProvider ErrorBoundary, example:
        // throw new Error('oops');
        // However, returning the <ExplodingComponent /> here would trigger the Plugin's ErrorBoundary, example:
        // return (
        //   <ExplodingComponent />
        // )

        // Not sure why this is

        return (
          <p className="pl-3 pr-3 text-gray-500">
            <FormattedMessage
              id="records.list.empty"
              defaultMessage="No records yet. Program records are created once you have earned at least one course
                  certificate in a program."
              description="A message indicating the user has no program records to display on the Learner Records page"
            />
          </p>
        );
      }
      return <ProgramRecordsList records={records} />;
    }
    return null;
  };

  return (
    <Plugin ErrorFallbackComponent={ErrorFallbackComponent}>
      {renderPlugin()}
    </Plugin>
  );
};

export default PluginProgramRecord;
