module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.spec.{tsx,ts}', '!**/node_modules/**'],
};
