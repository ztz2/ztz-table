import type { App } from 'vue';
import ZtzTable from './src/packages/table-element-plus/src/index.vue';

export { ZtzTable };
export default {
  install: (app: App) => {
    app.component('ztz-table', ZtzTable);
  },
};
