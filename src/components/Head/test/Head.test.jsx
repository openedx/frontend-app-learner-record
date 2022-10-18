import React from 'react';
import { Helmet } from 'react-helmet';
import { getConfig } from '@edx/frontend-platform';
import { render, initializeMockApp } from '../../../setupTest';
import Head from '../Head';

describe('Head', () => {
  beforeAll(async () => {
    await initializeMockApp();
  });

  const props = {};
  it('should match render title tag and favicon with the site configuration values', () => {
    render(<Head {...props} />);
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(`My Learner Records | ${getConfig().SITE_NAME}`);
    expect(helmet.linkTags[0].rel).toEqual('shortcut icon');
    expect(helmet.linkTags[0].href).toEqual(getConfig().FAVICON_URL);
  });
});
