const path = require('path');
const fs = require('fs');
const { createConfig } = require('@edx/frontend-build');

/** in case there isn't an env.config.js in development or pushed into the master branch
    we want to rely on a fallback env.config path in ./jest
    This implementation was first suggested in frontend-build:
    https://github.com/openedx/frontend-build/blob/master/config/jest/fallback.env.config.js
*/
let envConfigPath = path.resolve(__dirname, './jest/fallback.env.config.js');
const appEnvConfigPath = path.resolve(process.cwd(), './env.config.js');

if (fs.existsSync(appEnvConfigPath)) {
  envConfigPath = appEnvConfigPath;
}

module.exports = createConfig('jest', {
  // setupFilesAfterEnv is used after the jest environment has been loaded.  In general this is what you want.  
  // If you want to add config BEFORE jest loads, use setupFiles instead.  
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
  ],
  moduleNameMapper: {
    'env.config': envConfigPath,
  },
});
