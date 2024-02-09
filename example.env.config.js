/*
Learner Record is now able to handle JS-based configuration!

For the time being, the `.env.*` files are still made available when cloning down this repo or pulling from
the master branch. To switch to using `env.config.js(x)`:

Note: having both .env and env.config.js(x) files will follow a predictable order, in which non-empty values in the
JS-based config will overwrite the .env environment variables.

frontend-platform's getConfig loads configuration in the following sequence:
- .env file config
- optional handlers (commonly used to merge MFE-specific config in via additional process.env variables)
- env.config.js file config
- runtime config
*/

module.exports = {
  NODE_ENV: 'development',
  PORT: 1990,
  ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
  BASE_URL: 'http://localhost:1990',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  LANGUAGE_PREFERENCE_COOKIE_NAME: 'openedx-language-preference',
  LMS_BASE_URL: 'http://localhost:18000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGOUT_URL: 'http://localhost:18000/logout',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  REFRESH_ACCESS_TOKEN_ENDPOINT: 'http://localhost:18000/login_refresh',
  SEGMENT_KEY: '',
  SITE_NAME: 'localhost',
  USER_INFO_COOKIE_NAME: 'edx-user-info',
  SUPPORT_URL_LEARNER_RECORDS: 'https://support.edx.org/hc/en-us/sections/360001216693-Learner-records',
  APP_ID: '',
  MFE_CONFIG_API_URL: '',
  ENABLE_VERIFIABLE_CREDENTIALS: true,
  SUPPORT_URL_VERIFIABLE_CREDENTIALS: '',
};
