<template>
  <div class="hello">
    <el-button type="primary">Primary Button</el-button>
    <el-button>默认按钮</el-button>
    <button @click="ztzTableRef.showAddDialog()">新增</button>
    <button @click="visible=!visible">{{ visible ? '关闭' : '开启'}}</button>
    <button @click="handleAdd">添加表头</button>
    <button @click="handleDelete">移除表头</button>
    <button @click="visibleAddressRef=!visibleAddressRef">{{ visibleAddressRef ? '关闭address' : '开启address'}}</button>
    <ztz-table
      :crud="crud"
      :data="pageApi"
      :columns="columns"
      ref="ztzTableRef"
    >
      <template #columns>
        <el-table-column prop="date" label="时间" width="180"  />
        <el-table-column prop="name" label="Name" width="180" :inject-delete="true" />
        <el-table-column v-if="visibleAddressRef" prop="address" label="Address" />
        <el-table-column label="操作">
          <template #render>
            <el-button crud-sort="20">按钮1</el-button>
            <el-button crud-sort="11">按钮2</el-button>
            <el-button crud-sort="12">按钮3</el-button>
          </template>
          <template #renderHeader>
            headerHeader
          </template>
        </el-table-column>
      </template>
      <template #paginationLeftSide="{total}">
        <span v-if="total != null">共计：{{total}}条数据</span>
      </template>
    </ztz-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
  addApi,
  editApi,
  pageApi,
  deleteApi,
} from '@/api';
import ZtzTable from '@/packages/table-element-plus/src/index.vue';

import AddForm from './AddForm.vue';

const ztzTableRef = ref(null);
const visibleAddressRef = ref(false);
const crud = reactive({
  add: {
    api: addApi,
    formComponent: AddForm,
  },
  edit: {
    api: editApi,
    formComponent: AddForm,
  },
  delete: {
    api: deleteApi,
  },
});
// const pagination = reactive({
//   pageSize: 100,
//   pageNum: 2,
// });
const columns = reactive([
  { prop: 'date', label: 'Date' },
  { prop: 'name', label: 'name' },
  { label: '操作' },
]);
const handleAdd = () => {
  columns.push({ prop: 'address', label: 'address' });
};

const handleDelete = () => {
  columns.shift();
};

// const fetchTableData = pageListApi;
const visible = ref(true);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
