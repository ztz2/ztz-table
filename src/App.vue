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
        :style="{overflow: mouseIn ? 'auto' : 'hidden'}"
        @mouseenter="mouseIn=true"
        @mouseleave="mouseIn=false"
      >
        <Menu active-name="1">
          <MenuGroup title="指南">
            <MenuItem name="1" to="/about">
              介绍
            </MenuItem>
            <MenuItem name="2" to="/start">
              快速开始
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="配置说明">
            <MenuItem name="3" to="/doc-element-plus">
              基于 element-plus 表格配置
            </MenuItem>
          </MenuGroup>
        </Menu>
      </div>
      <div class="app-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
import { GithubOutlined, RadiusBottomrightOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    GithubOutlined,
    RadiusBottomrightOutlined,
  },
  data() {
    return {
      mouseIn: false,
    };
  },
};
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
