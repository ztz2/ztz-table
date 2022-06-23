/* eslint-disable  */
// 基本使用
export const baseDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script setup>
import { reactive } from 'vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

//  template 语法
export const templateDemoCode = `<template>
  <ztz-table :data="tableData">
    <template #columns>
      <el-table-column prop="date" label="时间" width="180" />
      <el-table-column prop="address" label="地点" />
    </template>
  </ztz-table>
</template>

<script setup>
import { reactive } from 'vue';

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// 自定义头
export const customHeaderDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script setup>
import { ElTag } from 'element-plus';
import { h, reactive } from 'vue';

const columns = reactive([
  {
    prop: 'date',
    label: '时间',
    width: '180',
    renderHeader({ $index, column }) {
      return h(ElTag, null, [\`自定义头(\${column.label}\${$index})\`]);
    },
  },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// 自定义单元格
export const customRenderDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script setup>
import { ElTag } from 'element-plus';
import { h, reactive } from 'vue';

const columns = reactive([
  {
    prop: 'date',
    label: '时间',
    width: '180',
    render({ $index, row }) {
      return h(ElTag, null, [\`自定义单元格(\${row.date}\${$index})\`]);
    },
  },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// CRUD-查询
export const crudQueryDemoCode = `<template>
  <ztz-table
    :columns="columns"
    :data="fetchTableDataApi"
    :pagination="pagination"
    list-key="content"
    total-key="total"
  />
</template>

<script setup>
import { reactive } from 'vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

// 可选的分页配置
const pagination = reactive({
  // 当前页
  pageNum: 1,
  // 分页数
  pageSize: 2,
});

// 请求表格数据列表
const fetchTableDataApi = () => {
  console.log('获取表格数据列表参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve({
        total: 6,
        content: [
          { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
          { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
        ],
      });
    }, 1200);
  });
};
</script>\n`;

// CRUD-查询带参数
export const crudQueryByParamsDemoCode = `<template>
  <el-form :model="queryParams" label-width="54px" inline>
    <el-form-item label="时间">
      <el-date-picker
        v-model="queryParams.date"
        type="date"
      />
    </el-form-item>
    <el-form-item label="地点">
      <el-input v-model="queryParams.address" />
    </el-form-item>
    <el-form-item>
      <el-button @click="ztzTableRef.refreshTable({ resetPageNum: true, resetQueryParams: true })">重置</el-button>
      <el-button @click="ztzTableRef.refreshTable({ resetPageNum: true })" type="primary">搜索</el-button>
    </el-form-item>
  </el-form>
  <ztz-table
    :columns="columns"
    :data="fetchTableDataApi"
    :query-params="queryParams"
    ref="ztzTableRef"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

// 表格实例
const ztzTableRef = ref(null);

// 搜索条件
const queryParams = reactive({
  date: '',
  address: '',
});

// 请求表格数据列表
const fetchTableDataApi = (params) => {
  console.log('获取表格数据列表参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve({
        total: 6,
        content: [
          { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
          { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
        ],
      });
    }, 1200);
  });
};
</script>\n`;

// CRUD-删除
export const crudDeleteDemoCode = `<template>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="fetchTableDataApi"
  />
</template>

<script setup>
import { reactive } from 'vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 80 },
]);

// 请求表格数据列表
const fetchTableDataApi = (params) => {
  console.log('获取表格数据列表参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve({
        total: 6,
        content: [
          { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
          { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
        ],
      });
    }, 1200);
  });
};

// 删除接口API
const deleteApi = (params) => {
  console.log('删除请求参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve(null);
    }, 1200);
  });
};

// CRUD配置
const crud = reactive({
  delete: {
    api: deleteApi,
  },
});
</script>\n`;

// CRUD-新增
export const crudAddDemoCode = `<template>
  <el-button @click="ztzTableRef.showAddDialog()">添加</el-button>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="fetchTableDataApi"
    ref="ztzTableRef"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';
import AddFormComponent from './add-form-component.vue';

// 表格实例
const ztzTableRef = ref(null);

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

// 请求表格数据列表
const fetchTableDataApi = (params) => {
  console.log('获取表格数据列表参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve({
        total: 6,
        content: [
          { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
          { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
        ],
      });
    }, 1200);
  });
};

// 添加接口API
const addApi = (params) => {
  console.log('添加请求参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve(null);
    }, 1200);
  });
};

// CRUD配置
const crud = reactive({
  add: {
    api: addApi,
    formComponent: AddFormComponent,
  },
});
</script>\n`;

export const crudAddFormComponentDemoCode = `<template>
  <el-form
    :model="formEntity"
    :rules="formRules"
    ref="formRef"
    label-width="80px"
  >
    <el-form-item label="时间" prop="date">
      <el-date-picker
        v-model="formEntity.date"
        type="date"
      />
    </el-form-item>
    <el-form-item label="地点" prop="address">
      <el-input v-model="formEntity.address" style="width: 220px;" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import {
  ref,
  reactive,
  defineExpose,
} from 'vue';

const formRef = ref();
const formEntity = reactive({
  date: '',
  address: '',
});

const formRules = reactive({
  address: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
});

// 必须暴露的两个方法
defineExpose({
  // 获取表单实例
  getFormRef: () => formRef.value,
  // 获取表单模型
  getFormModel: () => formEntity,
});
</script>\n`

/************ CRUD-编辑 ************/
export const crudEditDemoCode = `<template>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="fetchTableDataApi"
  />
</template>

<script setup>
import { reactive } from 'vue';
import EditFormComponent from './edit-form-component.vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 80 },
]);

// 请求表格数据列表
const fetchTableDataApi = (params) => {
  console.log('获取表格数据列表参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve({
        total: 6,
        content: [
          { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
          { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
        ],
      });
    }, 1200);
  });
};

// 修改接口API
const editApi = (params) => {
  console.log('修改请求参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve(null);
    }, 1200);
  });
};

// 详情接口API
const detailApi = (params) => {
  console.log('详情请求参数：', params);
  // 使用定时器模拟Ajax请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端接口返回数据
      resolve(null);
    }, 1200);
  });
};

// CRUD配置
const crud = reactive({
  edit: {
    api: editApi,
    // 【可选】详情接口API，，当没有详情接口，会把当前单元格数据作为实体
    detailApi,
    formComponent: EditFormComponent,
  },
});
</script>\n`;

/************ CRUD-编辑 ************/
export const crudEditFormComponentDemoCode = `<template>
  <el-form
    :model="formEntity"
    :rules="formRules"
    ref="formRef"
    label-width="80px"
  >
    <el-form-item label="时间" prop="date">
      <el-date-picker
        v-model="formEntity.date"
        type="date"
      />
    </el-form-item>
    <el-form-item label="地点" prop="address">
      <el-input v-model="formEntity.address" style="width: 220px;" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import {
  ref,
  reactive,
  defineExpose,
} from 'vue';

const formRef = ref();
const formEntity = reactive({
  date: '',
  address: '',
});

const formRules = reactive({
  address: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
});

// 必须暴露的两个方法
defineExpose({
  // 获取表单实例
  getFormRef: () => formRef.value,
  // 获取表单模型
  getFormModel: () => formEntity,
});
</script>\n`