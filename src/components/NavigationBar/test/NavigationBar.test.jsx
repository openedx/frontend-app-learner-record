/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import {
  render, screen, cleanup, initializeMockApp, fireEvent,
} from '../../../setupTest';
import NavigationBar from '..';

const mockHistoryPush = jest.fn();
global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('navigation-bar', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => {
    mergeConfig({ ENABLE_VERIFIABLE_CREDENTIALS: 'true' });
    return jest.resetModules;
  });
  afterEach(cleanup);

  it('does not render the component with Verifiable Credentials functionality when flag is disabled', () => {
    mergeConfig({ ENABLE_VERIFIABLE_CREDENTIALS: false });
    const { container } = render(<NavigationBar />);
    expect(container.innerHTML).toHaveLength(0);
  });

  it('renders the component with enabled the Verifiable Credentials functionality', () => {
    render(<NavigationBar />);
    expect(screen.getByText('My Learner Records')).toBeTruthy();
    expect(screen.getByText('Verifiable Credentials')).toBeTruthy();
  });

  it('redirects the appropriate route on tab click', () => {
    render(<NavigationBar />);
    fireEvent.click(screen.getByText('Verifiable Credentials'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/verifiable-credentials');
  });
});
