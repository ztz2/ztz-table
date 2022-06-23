import { createApp } from 'vue';
import { install } from 'ant-design-vue/es';
import ViewUIPlus from 'view-ui-plus';
import ElementPlus from 'element-plus';
import 'ant-design-vue/dist/antd.css';
import 'element-plus/dist/index.css';
import 'view-ui-plus/dist/styles/viewuiplus.css';

import App from './App.vue';
import ZtzTableInstall from '../element-plus';
import InstallHighlight from './plugins/install-highlight';
import router from './router';
import store from './store';

createApp(App)
  .use(install)
  .use(ElementPlus)
  .use(InstallHighlight)
  .use(ViewUIPlus)
  .use(ZtzTableInstall)
  .use(store)
  .use(router)
  .mount('#app');
