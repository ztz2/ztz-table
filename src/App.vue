<template>
  <div class="app-container">
    <div class="app-header">
      <div class="app-header__l">
        <a href="/">
          <RadiusBottomrightOutlined />
          ZTZ TABLE
        </a>
      </div>
      <div class="app-header__r">
        <a-space :size="20">
          <a href="https://github.com/ztz2/ztz-table" target="_blank"><GithubOutlined style="font-size: 28px; color: #333333" /></a>
        </a-space>
      </div>
    </div>
    <div class="app-body">
      <div
        class="app-nav"
        :style="{overflow: mouseInRef ? 'auto' : 'hidden'}"
        @mouseenter="mouseInRef=true"
        @mouseleave="mouseInRef=false"
      >
        <a-menu v-model:selectedKeys="activeMenu">
          <a-menu-item-group title="指南">
            <a-menu-item @click="$router.push('/about')" key="about" to="/about">介绍</a-menu-item>
            <a-menu-item @click="$router.push('/start')" key="start" to="/start">快速开始</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group title="配置说明">
            <a-menu-item @click="$router.push('/doc-element-plus')" key="doc-element-plus">基于 element-plus 表格配置</a-menu-item>
          </a-menu-item-group>
        </a-menu>
      </div>
      <div class="app-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { GithubOutlined, RadiusBottomrightOutlined } from '@ant-design/icons-vue';

const mouseInRef = ref(false);
const activeMenu = reactive([]);

onMounted(() => {
  activeMenu.push(window.location.hash.replace('#/', ''));
});
</script>
<style>
.app-header{
  position: sticky;
  top: 0;
  left: 0;
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  color: #000000d9;
}
.app-header__l{
  display: flex;
  align-items: center;
}
.app-header__l > a{
  padding-left: 20px;
  color: #000000d9;
  font-size: 18px;
  font-weight: 600;
  font-family: Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji",sans-serif;
}
.app-header__r{
  display: flex;
  align-content: center;
  font-size: 16px;
}
.app-header__r a{
  color: #000000d9;
}
.app-header__r a:hover{
  color: #1890ff;
}
.app-body{
  display: flex;
}
.app-nav{
  width: 240px;
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  z-index: 8;
  background: #fff;
  border-right: 1px solid #dcdee2;
}
.app-nav > .ivu-menu{
  width: auto!important;
  margin-right: 0;
}
.app-nav > .ivu-menu:after{
  display: none;
}
.app-content{
  width: 0;
  flex-grow: 1;
  overflow: auto;
  margin-left: 260px;
  padding: 40px;
}
.gap10{margin-top: 10px;}
.gap24{margin-top: 24px;}
</style>
