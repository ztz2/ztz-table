<template>
  <div class="ztz-table-wrapper">
    <ElButton @click="visibleAddDialogRef=true">新增</ElButton>
    <div v-loading="loadingTableDataRef" class="ztz-table__body">
      <!-- 表格区域 -->
      <div class="ztz-table__content">
        <ElTable
          v-bind="$attrs"
          :data="tableDataRef"
          style="width: 100%"
        >
          <component :is="columnVNodeRenderRef"></component>
        </ElTable>
      </div>
      <!-- 分页区域 -->
      <div
        class="ztz-table__pagination"
        :class="{
          'ztz-table__pagination--right': paginationPropsRef.position === 'right'
        }"
        v-if="!hidePagination"
      >
        <ElSpace>
          <div v-if="slots.paginationLeftSide">
            <slot name="paginationLeftSide" v-bind="requestContentRef"></slot>
          </div>
          <ElPagination
            v-bind="$attrs"
            v-model:currentPage="paginationPropsRef.pageNum"
            :="paginationPropsRef"
            :layout="paginationPropsRef.layout"
            :total="paginationPropsRef.total"
            :page-size="paginationPropsRef.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <div v-if="slots.paginationRightSide">
            <slot name="paginationRightSide" v-bind="requestContentRef"></slot>
          </div>
        </ElSpace>
      </div>
    </div>
  </div>

  <!-- 新增模态框 -->
  <template v-if="hasAddRef">
    <ElDialog
      v-model="visibleAddDialogRef"
      v-bind="currentCrudRef.add.dialogProps"
    >
      <div>
        <component v-loading="loadingAddRef" :is="currentCrudRef.add.formComponent" ref="addFormRef" ></component>
      </div>
      <template #footer>
        <ElButton @click="visibleAddDialogRef = false">取消</ElButton>
        <ElButton :loading="loadingAddRef" @click="handleSubmit('add')" type="primary">确定</ElButton>
      </template>
    </ElDialog>
  </template>

  <!-- 编辑模态框 -->
  <template v-if="hasEditRef">
    <ElDialog
      v-model="visibleEditDialogRef"
      v-bind="currentCrudRef.edit.dialogProps"
    >
      <div>
        <component
          v-loading="loadingEditRef"
          :data="editFormModelRef"
          :is="currentCrudRef.edit.formComponent"
          ref="editFormRef"
        ></component>
      </div>
      <template #footer>
        <ElButton @click="visibleEditDialogRef = false">取消</ElButton>
        <ElButton :loading="loadingEditRef" @click="handleSubmit('edit')" type="primary">确定</ElButton>
      </template>
    </ElDialog>
  </template>
</template>

<script setup>
import {
  merge,
  cloneDeep,
} from 'lodash';
import {
  h,
  ref,
  computed,
  Fragment,
  useSlots,
  defineProps,
  watchEffect,
  defineExpose,
} from 'vue';
import {
  ElTable,
  ElDialog,
  ElButton,
  ElMessage,
  ElPopconfirm,
  ElPagination,
  ElTableColumn,
} from 'element-plus';

import {
  getProp,
  getLabel,
  checkType,
  getObjectValue,
  sortCurdVNodeBtn,
} from '../../utils/util';

import {
  TableCrud,
  TableRowOptions,
  PaginationDefaultProps,
} from './types';

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: [Array, Function],
    default: () => [],
  },
  queryParams: {
    type: Object,
    default: () => ({}),
  },
  crud: {
    type: Object,
    default: () => null,
  },
  // 是否立即执行搜索
  immediate: {
    type: Boolean,
    default: true,
  },
  // 分页属性
  paginationProps: {
    type: Object,
    default: () => (new PaginationDefaultProps()),
  },
  // 影藏分页
  hidePagination: Boolean,
});
const slots = useSlots();
const tableDataRef = ref([]);
const addFormRef = ref(null);
const editFormRef = ref(null);
const visibleAddDialogRef = ref(false);
const visibleEditDialogRef = ref(false);
const currentCrudRef = ref({});
const columnVNodeRenderRef = ref({ render: undefined });

const loadingAddRef = ref(false);
const loadingEditRef = ref(false);
const loadingTableDataRef = ref(false);
const paginationPropsRef = ref(props.paginationProps);
const editFormModelRef = ref({});
const queryParamsRef = ref({});
const queryParamsBackupRef = ref({});
const requestContentRef = ref({});

const hasAddRef = computed(() => !!currentCrudRef.value?.add?.api && !!currentCrudRef.value?.add?.formComponent);
const hasEditRef = computed(() => !!currentCrudRef.value?.edit?.api && !!currentCrudRef.value?.edit?.formComponent);
const hasDeleteRef = computed(() => !!currentCrudRef.value?.delete?.api);

// 表格数据赋值，一定要使用这个方法
const setTableData = (data = []) => {
  tableDataRef.value = data.map((item) => {
    item = { ...item };
    item._options = Object.assign(new TableRowOptions(), (checkType(item._options, 'Object') ? item._options : {}));
    return item;
  });
};
// 创建CRUD功能按钮
const createCrudBtn = function (config, ...args) {
  const { row } = args[0];
  const result = [];
  // eslint-disable-next-line no-underscore-dangle
  const options = row?._options;
  const editPermission = options?.permission?.delete;
  const deletePermission = options?.permission?.delete;
  const getInjectStatus = (type) => {
    let isInject = getObjectValue(config, type);
    if (typeof isInject !== 'boolean') {
      isInject = config.label === '操作';
    }
    if (typeof getObjectValue(options, 'injectEdit') === 'boolean') {
      isInject = getObjectValue(options, 'injectEdit');
    }
    return isInject;
  };

  const injectEdit = getInjectStatus('injectEdit');
  const injectDelete = getInjectStatus('injectDelete');

  // 编辑功能按钮
  if (
    hasEditRef.value
    && injectEdit
    && editPermission !== false
  ) {
    result.push(h(ElButton, {
      ...currentCrudRef.value.edit.buttonProps,
      curdSort: currentCrudRef.value.edit.curdSort,
      disabled: options.disabledEdit || options.loadingDelete,
      onClick: (e) => {
        // eslint-disable-next-line no-use-before-define
        handleCrudEdit.apply(this, [...args, e]);
      },
    }, ['编辑']));
  }
  // 删除功能按钮
  if (hasDeleteRef.value
    && injectDelete
    && deletePermission !== false
  ) {
    result.push(h(ElPopconfirm, {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      title: currentCrudRef.value.delete.confirmText,
      onConfirm: () => {
        // eslint-disable-next-line no-use-before-define
        handleDelete.apply(this, [...args]);
      },
    }, {
      reference: () => h(ElButton, {
        ...currentCrudRef.value.delete.buttonProps,
        curdSort: currentCrudRef.value.delete.curdSort,
        loading: options?.loadingDelete,
        disabled: options.disabledDelete,
      }, ['删除']),
    }));
  }
  return result;
};
// 向表格中注入CRUD的功能
const injectCurd2ColumnVNode = (columnVNodeList = []) => {
  columnVNodeList.forEach((columnVNode) => {
    const renderHeader = columnVNode?.children?.renderHeader ?? columnVNode?.children?.header;
    const renderDefault = columnVNode?.children?.render ?? columnVNode?.children?.default;
    const label = getLabel(columnVNode.props);
    const prop = getProp(columnVNode.props);
    const config = {
      label,
      injectEdit: getObjectValue(columnVNode.props, 'injectEdit'),
      injectDelete: getObjectValue(columnVNode.props, 'injectDelete'),
    };
    // 自定义渲染-头
    if (typeof renderHeader === 'function') {
      columnVNode.children.header = renderHeader;
    }
    // 自定义渲染-body
    if (typeof renderDefault === 'function') {
      columnVNode.children.default = function (...argsList) {
        const renderVNode = renderDefault.apply(this, argsList);
        [].push.apply(renderVNode, createCrudBtn.apply(this, [config, ...argsList]));
        return sortCurdVNodeBtn(renderVNode);
      };
    } else {
      // 重新创建虚拟节点，更新 ShapeFlags
      h(columnVNode, {}, {
        ...(checkType(columnVNode.children, 'Object') ? columnVNode.children : {}),
        ...{
          default(...argsList) {
            const { row } = argsList[0];
            const renderVNode = createCrudBtn.apply(this, [config, ...argsList]);
            if (prop != null) {
              renderVNode.push(h('span', {}, [getObjectValue(row, prop)]));
            }
            return renderVNode;
          },
        },
      });
    }
  });
  return columnVNodeList;
};

// 搜索数据处理
watchEffect(() => {
  if (Object.keys(props.queryParams).length > 0) {
    queryParamsBackupRef.value = cloneDeep(props.queryParams);
  }
  queryParamsRef.value = props.queryParams;
});

// 表格数据
watchEffect(() => {
  if (Array.isArray(props.data)) {
    setTableData(props.data);
  }
});

// 分页配置
watchEffect(() => {
  paginationPropsRef.value = merge(new PaginationDefaultProps(), props.paginationProps);
});

// 分页字段获取
watchEffect(() => {
  if (typeof props.paginationProps?.pageSize === 'number') {
    paginationPropsRef.value.pageSize = props.paginationProps?.pageSize;
  }
  if (typeof props.paginationProps?.pageNum === 'number') {
    paginationPropsRef.value.pageNum = props.paginationProps?.pageNum;
  }
  if (typeof props.paginationProps?.currentPage === 'number') {
    paginationPropsRef.value.pageNum = props.paginationProps?.currentPage;
  }
  if (typeof props.paginationProps?.layout === 'string') {
    paginationPropsRef.value.layout = props.paginationProps?.layout;
  }
});

// JSON配置渲染表格
watchEffect(() => {
  if (typeof slots.columns !== 'function') {
    const columnVNodeList = props.columns.map((column, index) => {
      // 差异
      const label = getLabel(column);
      column.slots = {};
      column.prop = getProp(column);
      column.label = label;
      column.key = column.key ?? index;
      const children = {};
      // 自定义渲染
      const renderHeader = column.renderHeader ?? column.header;
      const renderDefault = column.render ?? column.default;
      if (typeof renderHeader === 'function') {
        children.header = renderHeader;
      }
      if (typeof renderDefault === 'function') {
        children.default = renderDefault;
      }
      return h(ElTableColumn, {
        ...column,
      }, Object.keys(children).length > 0 ? children : undefined);
    });
    columnVNodeRenderRef.value = h(Fragment, null, injectCurd2ColumnVNode(columnVNodeList));
  }
});

// CRUD配置合并
watchEffect(() => {
  if (checkType(props.crud, 'Object')) {
    currentCrudRef.value = merge(new TableCrud(), props.crud);
  }
});

// template 语法渲染表格结构
if (typeof slots.columns === 'function') {
  columnVNodeRenderRef.value = {
    render: () => injectCurd2ColumnVNode(slots.columns()),
  };
}

// 编辑
const handleCrudEdit = function ({ row }) {
  if (row._options.uid === editFormModelRef.value?._options?.uid) {
    return;
  }
  editFormModelRef.value = cloneDeep(row);
  visibleEditDialogRef.value = true;
  loadingEditRef.value = false;
};

// 删除
const handleDelete = function ({ row }) {
  const params = cloneDeep(row);
  delete params._options;
  row._options.loadingDelete = true;
  currentCrudRef.value.delete.api(params).then(() => {
    refreshTable();
  }).catch(() => {
    row._options.loadingDelete = false;
  });
};

// 请求表格数据
const fetchTableData = () => {
  if (typeof props.data === 'function') {
    const params = cloneDeep(queryParamsRef.value, {
      pageNum: paginationPropsRef.value.pageNum,
      pageSize: paginationPropsRef.value.pageSize,
    });
    loadingTableDataRef.value = true;
    props.data(params).then((res) => {
      setTableData(res.content);
      paginationPropsRef.value.total = res.total;
      requestContentRef.value = res;
    }).finally(() => {
      loadingTableDataRef.value = false;
    });
  } else {
    loadingTableDataRef.value = false;
  }
};

// 刷新表格数据，不会有任何重置
const refreshTable = () => {
  fetchTableData();
};

// 重新加载表格数据，重置搜索条件，重置分页
const reloadTable = () => {
  queryParamsRef.value = cloneDeep(queryParamsBackupRef.value);
  paginationPropsRef.value.pageNum = props.paginationProps.pageNum;
  paginationPropsRef.value.pageSize = props.paginationProps.pageSize;
  fetchTableData();
};

const handleSizeChange = (val) => {
  paginationPropsRef.value.pageSize = val;
  refreshTable();
};

const handleCurrentChange = (val) => {
  paginationPropsRef.value.pageNum = val;
  refreshTable();
};

const handleSubmit = (type) => {
  const isAdd = type === 'add';
  const formRef = isAdd ? addFormRef.value.getFormRef() : editFormRef.value.getFormRef();
  const entity = cloneDeep(isAdd ? addFormRef.value.getFormModel() : editFormRef.value.getFormModel());
  const c = isAdd ? currentCrudRef.value.add : currentCrudRef.value.edit;
  delete entity._options;
  formRef.validate((valid) => {
    if (valid) {
      if (isAdd) {
        loadingAddRef.value = true;
      } else {
        loadingEditRef.value = true;
      }
      c.api(entity).then(() => {
        const msg = c.successMsg;
        formRef.resetFields();
        formRef.clearValidate();
        if (isAdd) {
          visibleAddDialogRef.value = false;
        } else {
          visibleEditDialogRef.value = false;
          editFormModelRef.value = {};
        }
        refreshTable();
        if (msg) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'success',
          });
        }
      }).catch(() => {
        const msg = c.errorMsg;
        if (msg) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'error',
          });
        }
      }).finally(() => {
        if (isAdd) {
          loadingAddRef.value = false;
        } else {
          loadingEditRef.value = false;
        }
      });
    }
  });
};

// 立即执行搜索
if (props.immediate) {
  reloadTable();
}

// 对外暴露的方法
defineExpose({
  refreshTable,
  reloadTable,
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.ztz-table__pagination{
  margin-top: 12px;
  display: flex;
}
.ztz-table__pagination--right{
  justify-content: flex-end;
}
</style>
