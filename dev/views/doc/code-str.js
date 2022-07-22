/* eslint-disable  */
export const importSideCode = `<template>
  <ZtzTable :columns="columns" :data="tableData"></ZtzTable>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ZtzTable, TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableDataRow>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive<Array<TableColumn>>([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// 基本使用
export const baseDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableDataRow>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive<Array<TableColumn>>([
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

<script lang="ts" setup>
import { reactive } from 'vue';
import { TableColumn } from 'ztz-table';

const tableData = reactive<Array<TableColumn>>([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// 自定义头
export const customHeaderDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script lang="ts" setup>
import { h, reactive } from 'vue';
import { ElTag } from 'element-plus';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
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

const tableData = reactive<Array<TableDataRow>>([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// 自定义单元格
export const customRenderDemoCode = `<template>
  <ztz-table :columns="columns" :data="tableData"></ztz-table>
</template>

<script lang="ts" setup>
import { h, reactive } from 'vue';
import { ElTag } from 'element-plus';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
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

const tableData = reactive<Array<TableDataRow>>([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>\n`;

// CRUD-查询
export const crudQueryDemoCode = `<template>
  <ztz-table
    :columns="columns"
    :data="pageListApi"
    :pagination="pagination"
    list-key="content"
    total-key="total"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
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

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
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
    :data="pageListApi"
    :query-params="queryParams"
    ref="ztzTableRef"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
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

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};
</script>\n`;

// CRUD-动态查询
export const crudQueryByDynamicParamsDemoCode = `<template>
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
  </el-form>
  <ztz-table
    :columns="columns"
    :data="pageListApi"
    :query-params="queryParams"
    dynamic
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { TableColumn, TableDataRow } from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

// 搜索条件
const queryParams = reactive({
  date: '',
  address: '',
});

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};
</script>\n`;

// CRUD-删除
export const crudDeleteDemoCode = `<template>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="pageListApi"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import {
  ICrud,
  ICrudDelete,
  TableColumn,
  TableDataRow,
} from 'ztz-table';

const columns = reactive<Array<TableColumn>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 80 },
]);

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });

// 删除接口
const deleteApi = (params: any) => { console.log('删除接口请求参数：', params); return asyncTask(); };
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};
// CRUD配置
const crud = reactive<ICrud>({
  delete: {
    api: deleteApi,
  } as ICrudDelete,
});
</script>\n`;

// CRUD-新增
export const crudAddDemoCode = `<template>
  <el-button @click="ztzTableRef.showAddDialog()">添加</el-button>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="pageListApi"
    ref="ztzTableRef"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import {
  ICrud,
  ICrudAdd,
  TableColumn,
  TableDataRow,
} from 'ztz-table';
import AddFormComponent from './add-form-component.vue';

// 表格实例
const ztzTableRef = ref(null);

const columns = reactive<Array<TableColumn>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });

// 新增接口
const addApi = (params: any) => { console.log('新增接口请求参数：', params); return asyncTask(); };
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};

// CRUD配置
const crud = reactive<ICrud>({
  add: {
    api: addApi,
    formComponent: AddFormComponent,
  } as ICrudAdd,
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

<script lang="ts" setup>
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
    :data="pageListApi"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import {
  ICrud,
  ICrudEdit,
  TableColumn,
  TableDataRow,
} from 'ztz-table';
import EditFormComponent from './edit-form-component.vue';

// 表格配置
const columns = reactive<Array<TableColumn>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 80 },
]);

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });

// 修改接口
const editApi = (params: any): any => { console.log('修改接口请求参数：', params); return asyncTask(); };
// 详情接口
const detailApi = (params: any): any => { console.log('详情接口请求参数：', params); return asyncTask(); };
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};

// CRUD配置
const crud = reactive<ICrud>({
  edit: {
    api: editApi,
    // 【可选】详情接口API，，当没有详情接口，会把当前单元格数据作为实体
    detailApi,
    formComponent: EditFormComponent,
  } as ICrudEdit,
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

<script lang="ts" setup>
import {
  ref,
  reactive,
  defineExpose,
  watchEffect,
  defineProps,
} from 'vue';

const props = defineProps({
  // 当修改的时候，实体表单模型通过data传递过来，用于数据回显
  data: {
    type: Object,
    default: () => ({}),
  },
});

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

// 数据回显到表单实体模型
watchEffect(() => Object.entries(props.data).forEach(([k, v]) => { formEntity[k] = v; }));

// 必须暴露的两个方法
defineExpose({
  // 获取表单实例
  getFormRef: () => formRef.value,
  // 获取表单模型
  getFormModel: () => formEntity,
});
</script>\n`

/************ CRUD-完整功能 ************/
export const crudFullDemoCode = `<template>
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
  <div>
    <el-button @click="ztzTableRef.showAddDialog()">添加</el-button>
  </div>
  <ztz-table
    :crud="crud"
    :columns="columns"
    :data="pageListApi"
    :pagination="pagination"
    :query-params="queryParams"
    ref="ztzTableRef"
    list-key="content"
    total-key="total"
  ></ztz-table>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import {
  ICrud,
  TableColumn,
  TableDataRow,
} from 'ztz-table';
import EditFormComponent from './form-component.vue';

const ztzTableRef = ref(null);

// 表格配置
const columns = reactive<Array<TableColumn>>([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 150 },
]);

// 分页配置
const pagination = reactive({
  // 当前页
  pageNum: 1,
  // 分页数
  pageSize: 2,
});

// 搜索条件
const queryParams = reactive({
  date: '',
  address: '',
});

// 用定时器模拟Ajax异步请求
const asyncTask = (data: any) => new Promise((resolve) => { setTimeout(() => { resolve(data); }, 1500 + Math.random() * 1500); });

// 新增接口
const addApi = (params: any) => { console.log('新增接口请求参数：', params); return asyncTask(); };
// 修改接口
const editApi = (params: any) => { console.log('修改接口请求参数：', params); return asyncTask(); };
// 删除接口
const deleteApi = (params: any) => { console.log('删除接口请求参数：', params); return asyncTask(); };
// 详情接口
const detailApi = (params: any) => { console.log('详情接口请求参数：', params); return asyncTask(); };
// 表格分页列表接口
const pageListApi = (params: any) => {
  console.log('表格分页列表接口请求参数：', params);
  return asyncTask({
    total: 6,
    content: [
      { date: '2021-03-05', address: \`北京（\${Math.random()}）\` },
      { date: '2021-03-06', address: \`上海（\${Math.random()}）\` },
    ] as Array<TableDataRow>,
  });
};

// CRUD配置
const crud = reactive<ICrud>({
  add: {
    api: addApi,
    formComponent: EditFormComponent,
  },
  edit: {
    api: editApi,
    detailApi,
    formComponent: EditFormComponent,
  },
  delete: {
    api: deleteApi,
  },
});
</script>\n`
