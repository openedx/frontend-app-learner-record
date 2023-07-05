import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Tabs, Tab } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { ROUTES } from '../../constants';

import messages from './messages';

function NavigationBar({ intl }) {
  const NavigationTabs = [
    {
      id: 'learnerRecords',
      path: ROUTES.PROGRAM_RECORDS,
    },
  ];

  if (getConfig().ENABLE_VERIFIABLE_CREDENTIALS) {
    NavigationTabs.push({
      id: 'verifiableCredentials',
      path: ROUTES.VERIFIABLE_CREDENTIALS,
    });
  }

  const history = useHistory();
  const location = useLocation();

  return NavigationTabs.length > 1 ? (
    <Tabs
      className="mt-1 mb-5"
      defaultActiveKey={location.pathname}
      onSelect={path => history.push(path)}
    >
      {NavigationTabs.map(tab => (
        <Tab
          key={tab.id}
          eventKey={tab.path}
          title={intl.formatMessage(messages[tab.id])}
        />
      ))}
    </Tabs>
  ) : null;
}

NavigationBar.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NavigationBar);
