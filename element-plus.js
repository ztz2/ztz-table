import ZtzTable from './src/components/table-element-plus/src/index.vue';

export { ZtzTable };
export default {
  install: (app) => {
    app.component('ztz-table', ZtzTable);
  },
};
