import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import AppProvider from '@edx/frontend-platform/react/AppProvider';
import { HelmetProvider } from 'react-helmet-async';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { configure as configureLogging, MockLoggingService } from '@edx/frontend-platform/logging';
import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureAuth, MockAuthService } from '@edx/frontend-platform/auth';
import appMessages from './i18n';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export function initializeMockApp() {
  mergeConfig({
    authenticatedUser: {
      userId: 'abc123',
      username: 'Mock User',
      roles: [],
      administrator: false,
    },
  });

  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });

  const i18nService = configureI18n({
    config: getConfig(),
    loggingService,
    messages: [appMessages],
  });

  const authService = configureAuth(MockAuthService, { config: getConfig(), loggingService });
  return { loggingService, i18nService, authService };
}

function render(ui, options) {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <IntlProvider locale="en">
        <AppProvider><HelmetProvider>{children}</HelmetProvider></AppProvider>
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything.
export * from '@testing-library/react';

// Override `render` method.
export { render };
