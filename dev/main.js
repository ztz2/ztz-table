import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import ZtzTableInstall from '../src';
import router from './router';

createApp(App)
  .use(ElementPlus)
  .use(ZtzTableInstall)
  .use(router)
  .mount('#app');
