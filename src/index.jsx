import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { Routes, Route } from 'react-router-dom';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import messages from './i18n';
import './index.scss';
import ProgramRecordsList from './components/ProgramRecordsList';
import ProgramCertificatesList from './components/ProgramCertificatesList';
import ProgramRecord from './components/ProgramRecord';
import Head from './components/Head';
import { ROUTES } from './constants';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <HelmetProvider>
        <Head />
        <Header />
        {getConfig().USE_LR_MFE ? (
          <Routes>
            <Route
              path={ROUTES.PROGRAM_RECORDS}
              element={<ProgramRecordsList />}
            />
            {getConfig().ENABLE_VERIFIABLE_CREDENTIALS && (
              <Route
                path={ROUTES.VERIFIABLE_CREDENTIALS}
                element={<ProgramCertificatesList />}
              />
            )}
            <Route
              path={ROUTES.PROGRAM_RECORD_SHARED}
              element={<ProgramRecord isPublic />}
            />
            <Route
              path={ROUTES.PROGRAM_RECORD_ITEM}
              element={<ProgramRecord isPublic={false} />}
            />
          </Routes>
        ) : (
          <ProgramRecordsList />
        )}
        <Footer />
      </HelmetProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL_LEARNER_RECORDS: process.env.SUPPORT_URL_LEARNER_RECORDS || '',
        USE_LR_MFE: process.env.USE_LR_MFE || false,
        ENABLE_VERIFIABLE_CREDENTIALS: process.env.ENABLE_VERIFIABLE_CREDENTIALS || false,
        SUPPORT_URL_VERIFIABLE_CREDENTIALS: process.env.SUPPORT_URL_VERIFIABLE_CREDENTIALS || '',
      }, 'LearnerRecordConfig');
    },
  },
  messages,
});
