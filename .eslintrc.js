// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
  rules: {
    'react/function-component-definition': 'off',
  },
});
