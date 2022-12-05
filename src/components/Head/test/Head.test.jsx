import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { waitFor } from '@testing-library/react';
import { render, initializeMockApp } from '../../../setupTest';
import Head from '../Head';

describe('Head', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });

  const props = {};
  it('should match render title tag and favicon with the site configuration values', async () => {
    render(<Head {...props} />);

    await waitFor(() => {
      expect(document.title).toEqual(`My Learner Records | ${getConfig().SITE_NAME}`);
      expect(document.querySelector('link').rel).toEqual('shortcut icon');
      expect(document.querySelector('link').href).toEqual(getConfig().FAVICON_URL);
    });
  });
});
