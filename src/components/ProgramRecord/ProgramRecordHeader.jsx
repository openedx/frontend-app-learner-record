import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@openedx/paragon';

import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import messages from './messages';

function ProgramRecordHeader({
  learner, program, platform, intl,
}) {
  return (
    <header className="program-record-header">
      <div className="program-headings">
        <div className="program-title">
          <p className="heading-label">
            <FormattedMessage
              id="program.record.type"
              defaultMessage="{program_type} Program Record"
              description="The type of program record"
              values={{
                program_type: program.type_name,
              }}
            />
          </p>
          <h1>
            <FormattedMessage
              id="program.record.name"
              defaultMessage="{program_name} Record"
              description="Name of the program"
              values={{
                program_name: program.name,
              }}
            />
          </h1>
        </div>
        <h4>
          <FormattedMessage
            id="platform.and.school.name"
            defaultMessage="{platform} | {school}"
            description="Name of the platform and school"
            values={{
              platform,
              school: program.school,
            }}
          />
        </h4>
      </div>
      <div className="program-status">
        {
        (program.completed
            && (
            <Badge variant="success">
              {intl.formatMessage(messages.earnedStatusBadge)}
            </Badge>
            ))
            || (program.empty
                && (
                <Badge variant="danger">
                  {intl.formatMessage(messages.notEarnedStatusBadge)}
                </Badge>
                ))
            || (
            <Badge variant="warning">
              {intl.formatMessage(messages.partiallyCompletedStatusBadge)}
            </Badge>
            )
        }
        <span className="updated">
          <FormattedMessage
            id="last.updated.date"
            defaultMessage="Last Updated {date}"
            description="Date recorded from the last updated to this record"
            values={{
              date: new Date(program.last_updated).toLocaleDateString(),
            }}
          />
        </span>
      </div>
      <div className="learner-info my-3">
        {
          learner.full_name && (
          <FormattedMessage
            id="learner.full_name"
            defaultMessage="{full_name} | "
            description="Full name of the learner"
            values={{
              full_name: learner.full_name,
            }}
          />
          )
        }
        <FormattedMessage
          id="learner.email"
          defaultMessage="{email}"
          description="Email of the learner"
          values={{
            email: learner.email,
          }}
        />
      </div>
    </header>
  );
}

ProgramRecordHeader.propTypes = {
  learner: PropTypes.shape({
    email: PropTypes.string,
    full_name: PropTypes.string,
  }).isRequired,
  program: PropTypes.shape({
    name: PropTypes.string,
    school: PropTypes.string,
    completed: PropTypes.bool,
    empty: PropTypes.bool,
    type: PropTypes.string,
    type_name: PropTypes.string,
    last_updated: PropTypes.string,
  }).isRequired,
  platform: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ProgramRecordHeader);
