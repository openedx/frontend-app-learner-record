import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';

function RecordsHelp({ helpUrl }) {
  return (
    <section className="help">
      <h2>
        <FormattedMessage
          id="help.section.header"
          defaultMessage="Questions about Learner Records?"
          description="A header for the help section"
        />
      </h2>
      <p>
        <FormattedMessage
          id="help.section.content.with.link"
          defaultMessage="To learn more about records you can {link}"
          description="Content for the help section with a link to the records help area"
          values={{
            link: (
              <Hyperlink
                destination={helpUrl}
                target="_blank"
                showLaunchIcon={false}
              >
                read more in our records help area.
              </Hyperlink>
            ),
          }}
        />
      </p>
    </section>
  );
}

RecordsHelp.propTypes = {
  helpUrl: PropTypes.string.isRequired,
};

export default RecordsHelp;
