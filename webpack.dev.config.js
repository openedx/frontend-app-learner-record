const path = require('path');
const { createConfig } = require('@edx/frontend-build');
/** Uncomment the lines below if you wish to use an env.config.js in development */
// const envConfig = require('./env.config');

const config = createConfig('webpack-dev');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

// config.devServer.port = envConfig.PORT || process.env.PORT || 8080;

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

module.exports = config;
