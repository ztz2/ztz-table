import type { App } from 'vue';
import ZtzTable from './packages/table-element-plus';

export default function install(app: App) {
  app.component('ztz-table', ZtzTable);
  return app;
}

export {
  ZtzTable,
};
