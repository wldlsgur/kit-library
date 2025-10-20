const path = require('path');

module.exports = {
  extends: ['@repo/eslint-config/react'],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.app.json'),
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.app.json'),
      },
    },
  },
  rules: {},
};
