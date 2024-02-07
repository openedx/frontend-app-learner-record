const { createConfig } = require('@edx/frontend-build');
/** Uncomment the lines below if you wish to use an env.config.js in development */
// const envConfig = require('./env.config');

const config = createConfig('webpack-dev');

// config.devServer.port = envConfig.PORT || process.env.PORT || 8080;

module.exports = config;
