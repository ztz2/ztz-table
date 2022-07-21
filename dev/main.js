import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import ZtzTableInstall from '../src';
import InstallHighlight from './plugins/install-highlight';
import router from './router';

createApp(App)
  .use(ElementPlus)
  .use(InstallHighlight)
  .use(ZtzTableInstall)
  .use(router)
  .mount('#app');
