module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: 'eslint-config-airbnb',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'array-bracket-spacing': [ 'error', 'always' ],
    'comma-spacing': [ 'error', { before: false, after: true } ],
    'arrow-parens': [ 'error', 'as-needed' ],
  },
};
