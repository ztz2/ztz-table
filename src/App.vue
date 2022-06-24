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
        <el-space :size="20" style="margin-right: -20px">
          <a href="https://sh.andou.live:9527" target="_blank">Swagger Helper 工具</a>
          <a href="https://github.com/ztz2/ztz-table" target="_blank"><GithubOutlined style="font-size: 28px; color: #333333" /></a>
        </el-space>
      </div>
    </div>
    <div class="app-body">
      <div
        class="app-nav"
        :style="{overflow: mouseInRef ? 'auto' : 'hidden', paddingTop: '18px'}"
        @mouseenter="mouseInRef=true"
        @mouseleave="mouseInRef=false"
      >
        <el-menu :default-active="activeMenuRef">
          <el-menu-item-group title="指南">
            <el-menu-item @click="$router.push('/about')" index="about" to="/about">介绍</el-menu-item>
            <el-menu-item @click="$router.push('/start')" index="start" to="/start">快速开始</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="配置说明">
            <el-menu-item @click="$router.push('/doc-element-plus')" index="doc-element-plus">基于 element-plus 表格配置</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </div>
      <div class="app-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { GithubOutlined, RadiusBottomrightOutlined } from '@ant-design/icons-vue';

const mouseInRef = ref(false);
const activeMenuRef = ref('');

activeMenuRef.value = window.location.hash.replace('#/', '');
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
}
ol, ul {
  padding-left: 0;
}
a{
  color: #000000d9;
  text-decoration: none;
}
a:hover, a:active{
  color: #1890ff;
}

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
  padding-left: 6px;
  color: #000000d9;
  font-size: 18px;
  font-weight: 600;
  font-family: Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji",sans-serif;
}
.app-header__l > a:hover, .app-header__l > a:active{
  color: #1890ff;
}
.app-header__r{
  display: flex;
  align-content: center;
  font-size: 16px;
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
