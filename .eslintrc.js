module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'arrow-body-style': 0,
    'prefer-rest-params': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    'max-classes-per-file': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'vue/multi-word-component-names': 0,
    'import/no-extraneous-dependencies': 0,
    'vuejs-accessibility/anchor-has-content': 0,
    'vuejs-accessibility/mouse-events-have-key-events': 0,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
