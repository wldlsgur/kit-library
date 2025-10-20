const base = require('./base');

module.exports = {
  ...base,
  extends: [
    ...base.extends,
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',
  ],
};
