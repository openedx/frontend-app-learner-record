import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Badge } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';

function ProgramRecordTable({ grades, intl }) {
  const formatGradeData = (data) => (
    data.map(grade => ({
      ...grade,
      course_id: grade.course_id.replace(/^course-v1:/, ''),
      // If certificate not earned hide some fields
      ...(!grade.issue_date && { course_id: null }),
      ...(!grade.issue_date && { letter_grade: null }),
      ...(!grade.issue_date && { attempts: null }),
      percent_grade:
        grade.issue_date
          ? `${parseInt(Math.round(grade.percent_grade * 100), 10).toString()}%`
          : '',
      issue_date:
        grade.issue_date
          ? new Date(grade.issue_date).toLocaleDateString()
          : '',
      status: grade.issue_date
        ? (
          <Badge variant="success">
            {intl.formatMessage(messages.earnedStatusBadge)}
          </Badge>
        )
        : (
          <Badge variant="danger">
            {intl.formatMessage(messages.notEarnedStatusBadge)}
          </Badge>
        ),
    }))
  );
  return (
    <DataTable
      itemCount={grades.length}
      data={formatGradeData(grades)}
      columns={[
        {
          Header: 'Course Name',
          accessor: 'name',
        },
        {
          Header: 'School',
          accessor: 'school',
        },
        {
          Header: 'Course ID',
          accessor: 'course_id',
        },
        {
          Header: 'Highest grade earned',
          accessor: 'percent_grade',
        },
        {
          Header: 'Letter Grade',
          accessor: 'letter_grade',
        },
        {
          Header: 'Verified Attempts',
          accessor: 'attempts',
        },
        {
          Header: 'Date Earned',
          accessor: 'issue_date',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
      ]}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content="No results found" />
    </DataTable>
  );
}

ProgramRecordTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  grades: PropTypes.arrayOf(PropTypes.object).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ProgramRecordTable);
