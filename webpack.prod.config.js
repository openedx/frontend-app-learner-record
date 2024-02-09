const fs = require('fs');
const { createConfig } = require('@edx/frontend-build');

/** This condition confirms whether the configuration for the MFE has switched to a JS-based configuration
 * as previously implemented in frontend-build and frontend-platform. If the environment variable exists, then
 * an env.config.js file will be created at the root directory and its env variables can be accessed with getConfig().
 *
 * https://github.com/openedx/frontend-build/blob/master/docs/0002-js-environment-config.md
 * https://github.com/openedx/frontend-platform/blob/master/docs/decisions/0007-javascript-file-configuration.rst
 */

const envConfigPath = process.env.JS_CONFIG_FILEPATH;

if (envConfigPath) {
  const envConfigFilename = envConfigPath.slice(envConfigPath.indexOf('env.config'));
  fs.copyFile(envConfigPath, envConfigFilename, (err) => {
    if (err) { throw err; }
  });
}

const config = createConfig('webpack-prod');

module.exports = config;
