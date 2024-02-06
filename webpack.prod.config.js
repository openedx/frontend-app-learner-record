const path = require('path');
const fs = require('fs');
const { createConfig } = require('@edx/frontend-build');

/** This condition confirms whether the configuration for the MFE has switched to a JS-based configuration
 * as previously implemented in frontend-build and frontend-platform. If the environment variable exists, then
 * an env.config.js file will be created at the root directory and its env variables can be accessed with getConfig().
 *
 * https://github.com/openedx/frontend-build/blob/master/docs/0002-js-environment-config.md
 * https://github.com/openedx/frontend-platform/blob/master/docs/decisions/0007-javascript-file-configuration.rst
 */
if (process.env.JS_CONFIG_FILEPATH) {
  fs.copyFile(process.env.JS_CONFIG_FILEPATH, 'env.config.js', (err) => {
    if (err) { throw err; }
  });
}

const config = createConfig('webpack-prod');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

module.exports = config;
