/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import {
  render, screen, cleanup, initializeMockApp, fireEvent, waitFor,
} from '../../../setupTest';
import NavigationBar from '..';

const mockedNavigator = jest.fn();
global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
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
    waitFor(() => { expect(container.innerHTML).toHaveLength(0); });
  });

  it('renders the component with enabled the Verifiable Credentials functionality', async () => {
    render(<NavigationBar />);
    await screen.findByText('My Learner Records');
    await screen.findByText('Verifiable Credentials');
  });

  it('redirects the appropriate route on tab click', async () => {
    render(<NavigationBar />);
    await screen.findByText('Verifiable Credentials');
    fireEvent.click(screen.getByText('Verifiable Credentials'));
    expect(mockedNavigator).toHaveBeenCalledWith('/verifiable-credentials');
  });
});
