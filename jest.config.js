const path = require('path');
const fs = require('fs');
const { createConfig } = require('@edx/frontend-build');

let envConfigPath = path.resolve(__dirname, './jest/fallback.env.config.js');
const appEnvConfigPath = path.resolve(process.cwd(), './env.config.js');

if (fs.existsSync(appEnvConfigPath)) {
  console.log('TRUTH');
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
