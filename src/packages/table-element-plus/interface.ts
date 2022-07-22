import type { Component, VNode, ComponentPublicInstance } from 'vue';
import type { ElDialog, ElButton } from 'element-plus';
// eslint-disable-next-line
import { uuid } from '../utils/util';

type ElDialogProps = Partial<typeof ElDialog>;
type ElButtonProps = Partial<typeof ElButton>;
type NullType = null | undefined;

export type TableColumn = {
  prop?: string
  label?: string
  render?({ row, $index }: { row: any, $index: number }): Component | Array<Component>;
  renderHeader?({ column, $index }: { column: any, $index: number }): Component | Array<Component>;
  [propName: string]: any;
}

export type TableDataRow = {
  [propName: string]: any;
  _options?: ITableDataRowOptions
}

// 自定义VNode
export type CustomVNode = VNode & {
  children?: SlotRenderType
}

export type SlotRenderType = {
  render?() : VNode | Array<VNode>;
  header?() : VNode | Array<VNode>;
  default?() : VNode | Array<VNode>;
  renderHeader?() : VNode | Array<VNode>;
}

export type CreateCrudBtnConfig = {
  label?: string;
  injectEdit?: boolean;
  injectDelete?: boolean;
}

export type AnyObject = {
  [propName: string]: any
  _options?: TableDataRow['_options']
}

export type FormRef = {
  getFormModel(): AnyObject;
  getFormRef(): {
    resetFields(): void;
    clearValidate(): void;
    validate(callback: (valid: boolean) => void): Promise<(valid: boolean) => void>
  };
} & Element & ComponentPublicInstance;

export type DataFunc = {
  (queryParams: AnyObject): Promise<{
    total: number
    content: Array<TableDataRow>
  }> | any
}

export interface ICrudAdd{
  // 【必须】 { (): Promise<any> } 后端接口API
  api(): Promise<any>
  // 【必须】 { Component } 实体类组件
  formComponent: Component
  // 【可选】 { string|null= } 操作成功提示消息，为null，则不提示
  successMsg?: string | NullType
  // 【可选】 { string|null= } 操作失败提示消息，为null，则不提示
  errorMsg?: string | NullType
  // 【可选】 { ElDialogProps= } 模态框属性
  dialogProps?: ElDialogProps
}

export interface ICrudEdit{
  // 【必须】 { (): Promise<any> } 后端接口API
  api(): Promise<any>
  // 【可选】 { (): Promise<any> = } 后端详情接口API
  detailApi?: Promise<any> | NullType
  // 【必须】 { Component } 实体类组件
  formComponent: Component
  // 【可选】 { string|null= } 操作成功提示消息，为null，则不提示
  successMsg?: string | NullType
  // 【可选】 { string|null= } 操作失败提示消息，为null，则不提示
  errorMsg?: string | NullType
  // 【可选】 { ElDialogProps= } 模态框属性
  dialogProps?: ElDialogProps
  // 【可选】 { ElButtonProps= } 操作按钮的一些属性
  buttonProps?: ElButtonProps
}

export interface ICrudDelete{
  // 【必须】 { (): Promise<any> } 后端接口API
  api(): Promise<any>
  // 【可选】 { number= } 按钮排序
  crudSort?: number | NullType
  // 【可选】 { string= } 删除二次确认提示文本
  confirmText?: string | NullType
  // 【可选】 { string|null= } 操作成功提示消息，为null，则不提示
  successMsg?: string | NullType
  // 【可选】 { string|null= } 操作失败提示消息，为null，则不提示
  errorMsg?: string | NullType
  // 【可选】 { ElButtonProps= } 操作按钮的一些属性
  buttonProps?: ElButtonProps
}

export interface ICrud{
  add?: ICrudAdd
  edit?: ICrudEdit
  delete?: ICrudDelete
}

export interface ITableDataRowOptions {
  // 唯一UID
  uid?: string;
  // 删除fetching状态
  loadingDelete?: boolean;
  // 禁用编辑
  disabledEdit?: boolean;
  // 禁用删除
  disabledDelete?: boolean;
  // 权限
  permission?: {
    edit?: boolean
    delete?: boolean
  }
}

export class TableDataRowOptions implements ITableDataRowOptions {
  uid = uuid();
  loadingDelete = false;
  disabledEdit = false;
  disabledDelete = false;
  permission = {
    edit: true,
    delete: true,
  } as ITableDataRowOptions['permission'];
}

// 更多属性参考 饿了么UI文档
export class TablePagination {
  // 当前页
  pageNum = 1;
  // 每页显示条目个数
  pageSize = 10;
  // 总条目数
  total = undefined;
  layout = 'prev, pager, next';
  background = true;
  // 分页对齐位置，left||right
  position = 'right';
}
