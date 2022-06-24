import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import ZtzTableInstall from '../element-plus';
import InstallHighlight from './plugins/install-highlight';
import router from './router';
import store from './store';

createApp(App)
  .use(ElementPlus)
  .use(InstallHighlight)
  .use(ZtzTableInstall)
  .use(store)
  .use(router)
  .mount('#app');
