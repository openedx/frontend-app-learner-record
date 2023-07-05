/**
 * @jest-environment jsdom
 */
import React from 'react';
import ProgramCertificateModal from '..';
import {
  render, screen, cleanup, initializeMockApp,
} from '../../../setupTest';

const props = {
  isOpen: true,
  close: jest.fn(),
  data: {
    deeplink: 'https://example1.com',
    qrcode: 'data:image/png;base64,...',
    app_link_android: 'https://example2.com',
    app_link_ios: 'https://example3.com',
  },
};

describe('program-certificate-modal', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });
  beforeEach(() => jest.resetModules);
  afterEach(cleanup);

  it('renders the component', () => {
    render(<ProgramCertificateModal {...props} />);
    expect(screen.getByText('Verifiable credential')).toBeTruthy();
    expect(screen.getByText('Close modal window')).toBeTruthy();
  });
});
