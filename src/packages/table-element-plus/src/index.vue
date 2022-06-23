<template>
  <div class="ztz-table-wrapper">
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
          'ztz-table__pagination--right': paginationRef.position === 'right'
        }"
        v-if="!hidePaginationComputed"
      >
        <ElSpace>
          <div v-if="slots.paginationLeftSide">
            <slot name="paginationLeftSide" v-bind="requestContentRef"></slot>
          </div>
          <ElPagination
            v-bind="$attrs"
            v-model:currentPage="paginationRef.pageNum"
            :="paginationRef"
            :layout="paginationRef.layout"
            :total="paginationRef.total"
            :page-size="paginationRef.pageSize"
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
  <template v-if="hasAddComputed">
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
  <template v-if="hasEditComputed">
    <ElDialog
      v-model="visibleEditDialogRef"
      v-bind="currentCrudRef.edit.dialogProps"
    >
      <div v-loading="loadingEditEntityRef">
        <component
          v-loading="loadingEditRef"
          :data="editFormModelRef"
          :is="currentCrudRef.edit.formComponent"
          ref="editFormRef"
        ></component>
      </div>
      <template #footer>
        <ElButton @click="visibleEditDialogRef = false">取消</ElButton>
        <ElButton
          :loading="loadingEditRef"
          :disabled="loadingEditEntityRef"
          @click="handleSubmit('edit')"
          type="primary">确定</ElButton>
      </template>
    </ElDialog>
  </template>
</template>

<script setup>
import {
  get,
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
  defineExpose, nextTick,
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
  TablePagination,
} from './config';

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
    type: TableCrud,
    default: () => null,
  },
  // 是否立即执行搜索
  immediate: {
    type: Boolean,
    default: true,
  },
  // 分页属性
  pagination: {
    type: TablePagination,
    default: () => (new TablePagination()),
  },
  // 影藏分页
  hidePagination: {
    type: [Boolean, null],
    default: null,
  },
  // 表格数据Key
  listKey: {
    type: String,
    default: 'content',
  },
  // 总条数Key
  totalKey: {
    type: String,
    default: 'total',
  },
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
const loadingEditEntityRef = ref(false);
const loadingTableDataRef = ref(false);
const paginationRef = ref(props.pagination);
const paginationBackupRef = ref(props.pagination);
const editFormModelRef = ref({});
const queryParamsRef = ref({});
const queryParamsBackupRef = ref(null);
const requestContentRef = ref({});

const hasAddComputed = computed(() => !!currentCrudRef.value?.add?.api && !!currentCrudRef.value?.add?.formComponent);
const hasEditComputed = computed(() => !!currentCrudRef.value?.edit?.api && !!currentCrudRef.value?.edit?.formComponent);
const hasDeleteComputed = computed(() => !!currentCrudRef.value?.delete?.api);
const hidePaginationComputed = computed(() => {
  if (typeof props.hidePagination === 'boolean') {
    return props.hidePagination;
  }
  return typeof props.data !== 'function';
});

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
    hasEditComputed.value
    && injectEdit
    && editPermission !== false
  ) {
    result.push(h(ElButton, {
      ...currentCrudRef.value.edit.buttonProps,
      curdSort: currentCrudRef.value.edit.curdSort,
      disabled: options.disabledEdit || options.loadingDelete,
      onClick: (e) => {
        // eslint-disable-next-line no-use-before-define
        handleEdit.apply(this, [...args, e]);
      },
    }, ['编辑']));
  }
  // 删除功能按钮
  if (hasDeleteComputed.value
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
  columnVNodeList = columnVNodeList.map((columnVNode) => {
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
        let renderVNodeList = [];
        const renderVNode = renderDefault.apply(this, argsList);
        if (renderVNode) {
          if (Array.isArray(renderVNode)) {
            renderVNodeList = renderVNode;
          } else {
            renderVNodeList = [renderVNode];
          }
        }
        [].push.apply(renderVNodeList, createCrudBtn.apply(this, [config, ...argsList]));
        return sortCurdVNodeBtn(renderVNodeList);
      };
    } else {
      // 重新创建虚拟节点，更新 ShapeFlags
      columnVNode = h(columnVNode, { key: String(Date.now()) }, {
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
    return columnVNode;
  });
  return columnVNodeList;
};

// 搜索数据处理
watchEffect(() => {
  if (Object.keys(props.queryParams).length > 0 && queryParamsBackupRef.value == null) {
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
  if (Object.keys(props.pagination).length > 0 && paginationBackupRef.value == null) {
    paginationBackupRef.value = cloneDeep(props.pagination);
  }
  paginationRef.value = merge(new TablePagination(), paginationBackupRef.value);
});

// 分页字段获取
watchEffect(() => {
  if (typeof props.pagination?.pageSize === 'number') {
    paginationRef.value.pageSize = props.pagination?.pageSize;
  }
  if (typeof props.pagination?.pageNum === 'number') {
    paginationRef.value.pageNum = props.pagination?.pageNum;
  }
  if (typeof props.pagination?.currentPage === 'number') {
    paginationRef.value.pageNum = props.pagination?.currentPage;
  }
  if (typeof props.pagination?.layout === 'string') {
    paginationRef.value.layout = props.pagination?.layout;
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

// 新增，添加
const showAddDialog = () => {
  if (hasAddComputed.value) {
    visibleAddDialogRef.value = true;
  }
};

// 编辑，修改
const handleEdit = ({ row }) => {
  visibleEditDialogRef.value = true;
  if (row._options.uid === editFormModelRef.value?._options?.uid) {
    return;
  }
  nextTick(() => {
    // 重置表单
    editFormRef.value?.resetFields?.();
    editFormRef.value?.clearValidate?.();
    row = cloneDeep(row);
    loadingEditRef.value = false;
    editFormModelRef.value = row;
    // 判断是否有详情接口，有详情接口使用详情接口获取实体
    if (typeof currentCrudRef.value.edit.detailApi === 'function') {
      const params = { ...row };
      delete params._options;
      loadingEditEntityRef.value = true;
      currentCrudRef.value.edit.detailApi(params).then((res = {}) => {
        res = checkType(res, 'Object') ? res : {};
        console.log(123);
        if (editFormModelRef.value?._options?.uid === row?._options?.uid) {
          res._options = row._options;
          editFormModelRef.value = res;
          loadingEditEntityRef.value = false;
        }
      });
    } else {
      loadingEditEntityRef.value = false;
    }
  });
};

// 删除
const handleDelete = ({ row }) => {
  const params = cloneDeep(row);
  delete params._options;
  row._options.loadingDelete = true;
  currentCrudRef.value.delete.api(params).then(() => {
    const msg = currentCrudRef.value.delete.successMsg;
    refreshTable();
    if (msg) {
      ElMessage({
        showClose: true,
        message: msg,
        type: 'success',
      });
    }
  }).catch(() => {
    row._options.loadingDelete = false;
  });
};

// 请求表格数据
const fetchTableData = () => {
  if (typeof props.data === 'function') {
    const params = cloneDeep(queryParamsRef.value, {
      pageNum: paginationRef.value.pageNum,
      pageSize: paginationRef.value.pageSize,
    });
    loadingTableDataRef.value = true;
    props.data(params).then((res) => {
      setTableData(get(res, props.listKey));
      paginationRef.value.total = get(res, props.totalKey);
      requestContentRef.value = res;
    }).finally(() => {
      loadingTableDataRef.value = false;
    });
  } else {
    loadingTableDataRef.value = false;
  }
};

/**
 * @description 刷新表格数据
 * @param options { Object= } 可选配置
 * @param options.resetPageNum { boolean= } 重置分页到初始值
 * @param options.resetQueryParams { boolean= } 重置搜索条件到初始值
 */
const refreshTable = (options = { resetPageNum: false, resetQueryParams: false }) => {
  if (options?.resetPageNum) {
    paginationRef.value.pageNum = paginationBackupRef.value.pageNum ?? 1;
  }
  if (options?.resetQueryParams && queryParamsBackupRef.value) {
    for (const [k, v] of Object.entries(queryParamsBackupRef.value)) {
      queryParamsRef.value[k] = v;
    }
  }
  fetchTableData();
};

const handleSizeChange = (val) => {
  paginationRef.value.pageSize = val;
  refreshTable();
};

const handleCurrentChange = (val) => {
  paginationRef.value.pageNum = val;
  refreshTable();
};

// 修改和新增的时候，提交表单
const handleSubmit = (type) => {
  const isAdd = type === 'add';
  const formRef = isAdd ? addFormRef.value.getFormRef() : editFormRef.value.getFormRef();
  const entity = cloneDeep(isAdd ? addFormRef.value.getFormModel() : editFormRef.value.getFormModel());
  const c = isAdd ? currentCrudRef.value.add : currentCrudRef.value.edit;
  const options = entity._options;
  delete entity._options;
  formRef.validate((valid) => {
    if (valid) {
      if (isAdd) {
        loadingAddRef.value = true;
      } else {
        loadingEditRef.value = true;
      }
      c.api(entity).then((d) => {
        if (!isAdd && options.uid !== editFormModelRef.value?._options?.uid) {
          return d;
        }
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
      }).catch((e) => {
        if (!isAdd && options.uid !== editFormModelRef.value?._options?.uid) {
          return e;
        }
        const msg = c.errorMsg;
        if (msg) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'error',
          });
        }
      }).finally(() => {
        if (!isAdd && options.uid !== editFormModelRef.value?._options?.uid) {
          return;
        }
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
  refreshTable();
}

// 对外暴露的方法
defineExpose({
  showAddDialog,
  refreshTable,
});
</script>

<style>
.ztz-table__pagination{
  margin-top: 12px;
  display: flex;
}
.ztz-table__pagination--right{
  justify-content: flex-end;
}
</style>
