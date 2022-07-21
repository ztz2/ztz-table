export const importSideCode = `<template>
  <ZtzTable :columns="columns" :data="tableData"></ZtzTable>
</template>

<script setup>
import { reactive } from 'vue';
import { ZtzTable } from 'ztz-table';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);
</script>
\n`;
