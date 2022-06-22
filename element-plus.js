import ZtzTable from './src/packages/table-element-plus/src/index.vue';

export { ZtzTable };
export default {
  install: (app) => {
    app.component('ztz-table', ZtzTable);
  },
};
