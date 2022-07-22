const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

function resolve(p) {
  return path.resolve(__dirname, p);
}
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'dist-dev',
  configureWebpack: {
    entry: './dev/main.js',
    resolve: {
      alias: {
        '@': resolve('dev'),
      }
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ]
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'ZTZ Table';
        return args;
      });
  },
});
