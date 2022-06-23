<template>
  <div class="about">
    <h1 class="text-center">表格快速成型工具</h1>
    <p class="text-center">
      <g-emoji class="g-emoji" alias="package" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4e6.png">📦</g-emoji>
      ZTZ Table，一个为开发者准备的基于 Vue 3.0 和 Element Plus
<!--      和 view-ui-plus 和 ant-design-vue@next-->
      的数据表格二次封装的组件库，旨在通过配置文件快速生成表格。集成CRUD功能，通过简单配置，快速完成一个基本的增删查改功能。
    </p>
    <h2>Feature</h2>
    <ul>
      <ol><CheckSquareOutlined /> 表格快速配置</ol>
      <ol><CheckSquareOutlined /> 支持静态表格，和动态接口数据生成</ol>
      <ol><CheckSquareOutlined /> 支持分页</ol>
      <ol><CheckSquareOutlined /> 支持自定义 prop 列名</ol>
      <ol><CheckSquareOutlined /> 支持单元格内容以及表头自定义渲染</ol>
      <ol><CheckSquareOutlined /> 支持对 element-plus table 兼容其 template 语法，同时也可以使用JS配置对象</ol>
      <ol><CheckSquareOutlined /> CRUD集成，低耦合，基于API，兼容所有项目</ol>
      <ol><CheckSquareOutlined /> 支持CRUD功能中进行权限控制，精确到行，具体到功能按钮</ol>
    </ul>
  </div>
</template>
<script>
import { CheckSquareOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    CheckSquareOutlined,
  },
};
</script>
<style scoped>
.text-center{
  text-align: center;
}
.about p{
  color: #555;
}
</style>
