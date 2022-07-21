const path = require('path');
function resolve(p) {
  return path.resolve(__dirname, p);
}
module.exports = {
  "stories": [
    "../dev/**/*.stories.mdx",
    "../dev/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-docs',
      options: {
        vueDocgenOptions: {
          alias: {
            '@': resolve('../dev'),
            '@ztz-table': resolve('src'),
          },
          propsParser(filePath, source) {
            console.log('require(\'vue-docgen-api\').parse(filePath): ', require('vue-docgen-api').parse(filePath));
            return require('vue-docgen-api').parse(filePath)
          }
        },
      },
    },
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  typescript: {
    check: false,
    checkOptions: {},
    // reactDocgen: 'react-docgen-typescript',
    // reactDocgenTypescriptOptions: {
    //   shouldExtractLiteralValuesFromEnum: true,
    //   propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    // },
  },
}
