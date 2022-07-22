import {
  get,
  merge,
  debounce,
  cloneDeep,
} from 'lodash';

import {
  h,
  ref,
  watch,
  computed,
  Fragment,
  watchEffect,
  nextTick,
  defineComponent,
  useAttrs,
  useSlots,
  WatchStopHandle,
  PropType,
  getCurrentInstance,
} from 'vue';
import {
  ElSpace,
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
  sortCurdVNodeBtn, mergeDifference,
} from '../utils/util';

import {
  ICrud,
  ICrudAdd,
  ICrudEdit,
  ICrudDelete,

  FormRef,
  DataFunc,
  AnyObject,
  CustomVNode,
  SlotRenderType,
  CreateCrudBtnConfig,

  TableColumn,
  TableDataRow,
  TablePagination,
  TableDataRowOptions,
} from './interface';

type RefreshTableOptions = {
  resetPageNum?: boolean;
  resetQueryParams?: boolean;
}
type ExposeType = {
  ({
    showAddDialog,
    refreshTable,
  }: {
    showAddDialog(): void;
    refreshTable({
      resetPageNum,
      resetQueryParams,
    }
    ?: RefreshTableOptions): void;
  }): void
}

class CrudAdd implements Partial<ICrudAdd> {
  api = undefined;
  formComponent = undefined;
  successMsg = '添加成功';
  errorMsg = null;
  dialogProps = {
    width: '700px',
    title: '添加',
    'append-to-body': true,
  };
}
class CrudEdit implements Partial<ICrudEdit> {
  api = undefined;
  detailApi = undefined;
  formComponent = undefined;
  successMsg = '修改成功';
  errorMsg = undefined;
  dialogProps = {
    width: '700px',
    title: '修改',
    'append-to-body': true,
  };
  buttonProps = {
    type: 'default',
    size: 'small',
    plain: true,
  };
}
class CrudDelete implements Partial<ICrudDelete> {
  api = undefined;
  crudSort = 30;
  confirmText = '确定要删除吗？';
  successMsg = '删除成功';
  errorMsg = null;
  buttonProps = {
    type: 'danger',
    size: 'small',
    plain: true,
  };
}

export default defineComponent({
  name: 'ztz-table',
  props: {
    columns: {
      type: Array as PropType<Array<TableColumn>>,
      default: () => [],
    },
    data: {
      type: [Array, Function] as PropType<Array<any> | DataFunc>,
      default: () => [],
    },
    queryParams: {
      type: Object,
      default: () => ({}),
    },
    crud: {
      type: Object as PropType<ICrud>,
      default: () => ({}),
    },
    // 是否立即执行搜索
    immediate: {
      type: Boolean,
      default: true,
    },
    // 是否根据queryParams搜索条件动态变化，执行刷新列表
    dynamic: {
      type: Boolean,
      default: false,
    },
    // 分页属性
    pagination: {
      type: Object as PropType<TablePagination>,
      default: () => (new TablePagination()),
    },
    // 影藏分页
    hidePagination: Boolean,
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
    emptyText: {
      type: String,
      default: '暂无数据',
    },
  },
  setup(props, { expose }: { expose: ExposeType }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const ins = getCurrentInstance();
    const tableDataRef = ref<Array<TableDataRow>>([]);
    const addFormRef = ref<FormRef|null>(null);
    const editFormRef = ref<FormRef|null>(null);
    const visibleAddDialogRef = ref(false);
    const visibleEditDialogRef = ref(false);
    const currentCrudRef = ref<ICrud|AnyObject>({});
    const columnVNodeRenderRef = ref<CustomVNode|null>(null);

    const loadingAddRef = ref(false);
    const loadingEditRef = ref<boolean>(false);
    const loadingEditEntityRef = ref(false);
    const loadingTableDataRef = ref(false);
    const paginationRef = ref(props.pagination);
    const paginationBackupRef = ref(props.pagination);
    const editFormModelRef = ref<TableDataRow|AnyObject>({});
    const queryParamsRef = ref<AnyObject>({});
    const queryParamsBackupRef = ref<null|object>(null);
    const requestContentRef = ref<AnyObject>({});

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
    const setTableData = (data: Array<TableDataRow> = []) => {
      data.forEach((p: TableDataRow) => {
        const tableDataRowOptions = new TableDataRowOptions();
        if (p._options && checkType(p._options, 'Object')) {
          p._options?.uid == null && merge(p._options, tableDataRowOptions);
        } else {
          p._options = tableDataRowOptions;
        }
      });
      tableDataRef.value = data;
    };

    // 创建CRUD功能按钮
    const createCrudBtn = function (config: CreateCrudBtnConfig, ...args: Array<any>): Array<CustomVNode> {
      const { row } = args[0];
      const result: Array<CustomVNode> = [];
      const options = row?._options;
      const editPermission = options?.permission?.delete;
      const deletePermission = options?.permission?.delete;
      const getInjectStatus = (type: string) => {
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
          onClick: (e: Event) => {
            handleEdit.apply(null, [...args, e] as any);
          },
        }, ['编辑']) as CustomVNode);
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
            handleDelete.apply(null, [...args] as any);
          },
        }, {
          reference: () => h(ElButton, {
            ...currentCrudRef.value.delete.buttonProps,
            curdSort: currentCrudRef.value.delete.curdSort,
            loading: options?.loadingDelete,
            disabled: options.disabledDelete,
          }, ['删除']),
        }) as CustomVNode);
      }
      return result;
    };

    // 向表格中注入CRUD的功能
    const injectCurd2ColumnVNode = (columnVNodeList: Array<CustomVNode> = []) => {
      columnVNodeList = columnVNodeList.map((columnVNode) => {
        const renderHeader = columnVNode?.children?.renderHeader ?? columnVNode?.children?.header;
        const renderDefault = columnVNode?.children?.render ?? columnVNode?.children?.default;
        const label = getLabel(columnVNode.props as TableColumn);
        const prop = getProp(columnVNode.props as TableColumn);
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
            let renderVNodeList: Array<CustomVNode> = [];
            const renderVNode = renderDefault.apply(this, argsList);
            if (renderVNode) {
              if (Array.isArray(renderVNode)) {
                renderVNodeList = renderVNode as Array<CustomVNode>;
              } else {
                renderVNodeList = [renderVNode] as Array<CustomVNode>;
              }
            }
            createCrudBtn.apply(null, [config, ...argsList] as any).forEach((n) => {
              renderVNodeList.push(n);
            });
            return sortCurdVNodeBtn(renderVNodeList);
          };
        } else {
          // 重新创建虚拟节点，更新 ShapeFlags
          columnVNode = h(columnVNode, { key: String(Date.now()) }, {
            // @ts-ignore
            ...(checkType(columnVNode.children, 'Object') ? columnVNode.children : {}),
            ...{
              default(...argsList: any) {
                const { row } = argsList[0];
                const renderVNode = createCrudBtn.apply(this, [config, ...argsList]);
                if (prop != null) {
                  renderVNode.push(h('span', {}, [getObjectValue(row, prop)]) as CustomVNode);
                }
                return renderVNode;
              },
            },
          }) as CustomVNode;
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

    let queryParamsWatcher: WatchStopHandle | null = null;
    // 根据queryParams深度监听动态变化，进行搜索
    watch(() => props.dynamic, (v) => {
      if (v) {
        if (queryParamsWatcher == null) {
          queryParamsWatcher = watch(() => props.queryParams, () => {
            refreshTable({
              resetPageNum: true,
            });
          }, { deep: true });
        }
      } else {
        queryParamsWatcher?.();
      }
    }, { immediate: true });

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
      // @ts-ignore 原字段
      if (typeof props.pagination?.currentPage === 'number') {
        // @ts-ignore 原字段
        paginationRef.value.pageNum = props.pagination?.currentPage;
      }
      if (typeof props.pagination?.layout === 'string') {
        paginationRef.value.layout = props.pagination?.layout;
      }
    });

    // JSON配置渲染表格
    watchEffect(() => {
      if (typeof slots.columns !== 'function') {
        const columnVNodeList: Array<CustomVNode> = (props.columns as Array<AnyObject>).map((column, index) => {
          column = cloneDeep(column);
          // 差异
          const label = getLabel(column);
          column.slots = {};
          column.prop = getProp(column);
          column.label = label;
          column.key = column.key ?? index;
          const children: SlotRenderType = {};
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
          }, Object.keys(children).length > 0 ? children : undefined) as CustomVNode;
        });
        columnVNodeRenderRef.value = h(Fragment, null, injectCurd2ColumnVNode(columnVNodeList)) as CustomVNode;
      }
    });

    // CRUD配置合并
    watchEffect(() => {
      if (checkType(props.crud, 'Object')) {
        props.crud?.add && mergeDifference(props.crud.add, new CrudAdd());
        props.crud?.edit && mergeDifference(props.crud.edit, new CrudEdit());
        props.crud?.delete && mergeDifference(props.crud.delete, new CrudDelete());
        currentCrudRef.value = props.crud;
      } else {
        currentCrudRef.value = {};
      }
    });

    // template 语法渲染表格结构
    if (typeof slots.columns === 'function') {
      columnVNodeRenderRef.value = h(Fragment, null, injectCurd2ColumnVNode(slots?.columns.call(ins) as Array<CustomVNode>)) as CustomVNode;
    }

    // 新增，添加
    const showAddDialog = () => {
      if (hasAddComputed.value) {
        visibleAddDialogRef.value = true;
      }
    };

    // 编辑，修改
    const handleEdit = (data: { row: TableDataRow }) => {
      let { row } = data;
      visibleEditDialogRef.value = true;
      if (row?._options?.uid === editFormModelRef.value?._options?.uid) {
        return;
      }
      nextTick(() => {
        const formRef = editFormRef.value?.getFormRef?.();
        // 重置表单
        formRef?.resetFields?.();
        formRef?.clearValidate?.();
        row = cloneDeep(row);
        loadingEditRef.value = false;
        editFormModelRef.value = row;
        // 判断是否有详情接口，有详情接口使用详情接口获取实体
        if (typeof currentCrudRef.value.edit.detailApi === 'function') {
          const params = { ...row };
          delete params._options;
          loadingEditEntityRef.value = true;
          currentCrudRef.value.edit.detailApi(params).then((res: TableDataRow = {}) => {
            res = checkType(res, 'Object') ? res : {};
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
    const handleDelete = (data: { row: TableDataRow }) => {
      const params = cloneDeep(data.row);
      delete params._options;
      if (data.row._options) {
        data.row._options.loadingDelete = true;
      }
      currentCrudRef.value?.delete?.api(params).then(() => {
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
        if (data.row._options) {
          data.row._options.loadingDelete = false;
        }
      });
    };

    // 请求表格数据
    const execFetchTableData = () => {
      if (typeof props.data === 'function') {
        const params = cloneDeep(Object.assign({}, queryParamsRef.value, {
          pageNum: paginationRef.value.pageNum,
          pageSize: paginationRef.value.pageSize,
        }));
        loadingTableDataRef.value = true;
        const e = props.data(params);
        if (!(e instanceof Promise)) {
          throw new Error('列表接口必须返回Promise实例');
        }
        e.then((res: any) => {
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
    const fetchTableData = debounce(execFetchTableData, 250, { maxWait: 700, leading: false, trailing: true });

    /**
     * @description 刷新表格数据
     * @param options { Object= } 可选配置
     * @param options.resetPageNum { boolean= } 重置分页到初始值
     * @param options.resetQueryParams { boolean= } 重置搜索条件到初始值
     */
    const refreshTable = (options: RefreshTableOptions = { resetPageNum: false, resetQueryParams: false }) => {
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

    const handleSizeChange = (val: number) => {
      paginationRef.value.pageSize = val;
      refreshTable();
    };

    const handleCurrentChange = (val: number) => {
      paginationRef.value.pageNum = val;
      refreshTable();
    };

    // 修改和新增的时候，提交表单
    const handleSubmit = (type: string) => {
      const isAdd = type === 'add';
      const formRef = isAdd ? addFormRef.value?.getFormRef?.() : editFormRef.value?.getFormRef?.();
      const entity = cloneDeep(isAdd ? addFormRef.value?.getFormModel?.() : editFormRef.value?.getFormModel?.()) as AnyObject;
      const c = isAdd ? currentCrudRef.value.add : currentCrudRef.value.edit;
      const options = entity._options;
      delete entity._options;
      formRef?.validate((valid) => {
        if (valid) {
          if (isAdd) {
            loadingAddRef.value = true;
          } else {
            loadingEditRef.value = true;
          }
          c.api(entity).then((d: TableDataRow) => {
            if (!isAdd && options?.uid !== editFormModelRef.value?._options?.uid) {
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
          }).catch((e: Error) => {
            if (!isAdd && options?.uid !== editFormModelRef.value?._options?.uid) {
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
            if (!isAdd && options?.uid !== editFormModelRef.value?._options?.uid) {
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
    expose({
      showAddDialog,
      refreshTable,
    });

    // @ts-ignore
    return () => (<>
      <div class="ztz-table-wrapper">
        {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
        <div v-loading={loadingTableDataRef.value} class="ztz-table__body">
          {/* 表格区域 */}
          <div class="ztz-table__content">
            {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
            <ElTable
              {...attrs}
              emptyText={props.emptyText}
              data={tableDataRef.value}
              style={{ width: '100%' }}
            >
              { // @ts-ignore
                h(columnVNodeRenderRef.value)
              }
            </ElTable>
          </div>
          {/* 分页区域 */}
          {
            !hidePaginationComputed.value &&
            <div class={{
              'ztz-table__pagination': true,
              'ztz-table__pagination--right': paginationRef.value.position === 'right',
            }}
            >
              {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
              <ElSpace>
                {
                  slots.paginationLeftSide &&
                  <div>
                    {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                    <slot {...requestContentRef.value} name="paginationLeftSide" />
                  </div>
                }
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                <ElPagination
                  {...attrs}
                  v-model:currentPage={paginationRef.value.pageNum}
                  layout={paginationRef.value.layout}
                  total={paginationRef.value.total}
                  page-size={paginationRef.value.pageSize}
                  // @ts-ignore
                  onSizeChange={handleSizeChange}
                  onCurrentChange={handleCurrentChange}
                  ref="paginationRef"
                />
                {
                  slots.paginationRightSide &&
                  <div>
                    {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                    <slot {...requestContentRef.value} name="paginationRightSide" />
                  </div>
                }
              </ElSpace>
            </div>
          }
        </div>
      </div>
      { /* 新增模态框 */
        hasAddComputed.value &&
        /* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */
        <ElDialog
          {...currentCrudRef.value?.add?.dialogProps}
          v-model={visibleAddDialogRef.value}
        >
          {{
            default: () => (
              <div v-loading={loadingAddRef.value}>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                {
                  h(currentCrudRef.value.add.formComponent, {
                    ref: (r) => {
                      addFormRef.value = r as FormRef;
                    },
                  })
                }
              </div>
            ),
            footer: () => (
              <>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                <ElButton onClick={() => visibleAddDialogRef.value = false}>取消</ElButton>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                <ElButton loading={loadingAddRef.value} onClick={() => handleSubmit('add')} type="primary">确定</ElButton>
              </>
            ),
          }}
        </ElDialog>
      }
      { /* 编辑模态框 */
        hasEditComputed.value &&
        /* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */
        <ElDialog
          {...currentCrudRef.value.edit.dialogProps}
          v-model={visibleEditDialogRef.value}
        >
          {{
            default: () => (
              <div v-loading={loadingEditEntityRef.value || loadingEditRef.value}>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                {
                  h(currentCrudRef.value.edit.formComponent, {
                    data: editFormModelRef.value,
                    ref: (r) => {
                      editFormRef.value = r as FormRef;
                    },
                  })
                }
              </div>
            ),
            footer: () => (
              <>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                <ElButton onClick={() => visibleEditDialogRef.value = false}>取消</ElButton>
                {/* @ts-ignore 忽略 Type 'Element' is not assignable to type 'ReactNode'. 错误 */}
                <ElButton
                  loading={loadingEditRef.value}
                  disabled={loadingEditEntityRef.value}
                  onClick={() => handleSubmit('edit')}
                  type="primary"
                >
                  确定
                </ElButton>
              </>
            ),
          }}
        </ElDialog>
      }
    </>);
  },
});
