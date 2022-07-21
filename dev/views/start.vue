<template>
  <div class="start">
    <h1>安裝</h1>
    <h2>环境支持</h2>
    <p>ZTZ Table 是一个依赖 Vue 3 开发的表格组件库。如果是 Vue2 请自行升级后使用。</p>
    <h2>包管理器安装</h2>
    <p>使用前请安装 <a href="https://element-plus.gitee.io">element-plus</a></p>
    <div><code-box :code="installCode" :show-copy="false"></code-box></div>
    <p></p>
    <h2>引入到项目中</h2>
    <p>全局注册组件</p>
    <div><code-box :code="importAllCode"></code-box></div>
    <h2>局部注册组件引入方式</h2>
    <div><code-box :code="importSideCode"></code-box></div>
  </div>
</template>

<script>
import CodeBox from '@/components/code-box/src/index.vue';
import { importSideCode } from '@/constants/code';

export default {
  name: 'start',
  components: {
    CodeBox,
  },
  data() {
    return {
      installCode: `# Yarn
$ yarn add ztz-table

# NPM
$ npm install ztz-table --save

# cnpm
$ cnpm install ztz-table --save`,
      importAllCode: `import { createApp } from 'vue';
import ZtzTableInstall from 'ztz-table';
import App from './App.vue'

const app = createApp(App)
app.use(ZtzTableInstall).mount('#app');`,
      importSideCode,
    };
  },
};
</script>
