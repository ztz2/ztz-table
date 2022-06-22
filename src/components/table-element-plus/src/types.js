import { uuid } from '@/components/utils/util';

export class TableCrud {
  add = {
    // 【必须】 { (): Promise<any> } 后端接口API
    api: null,
    // 【必须】 { VueComponent } 实体类组件
    formComponent: null,
    // 【可选】 { string|null= } 操作成功提示消息，为null，则不提示
    successMsg: '添加成功',
    // 【可选】 { string|null= } 操作失败提示消息，为null，则不提示
    errorMsg: null,
    // 【可选】 { Object= } 模态框属性
    dialogProps: {
      width: '700px',
      title: '添加',
      'append-to-body': true,
    },
  };

  edit = {
    // 【必须】 { (): Promise<any> } 后端接口API
    api: null,
    // 【可选】 { (): Promise<any> = } 后端详情接口API
    detailApi: null,
    // 【必须】 { VueComponent } 实体类组件
    formComponent: null,
    // 【可选】 { string|null= } 操作成功提示消息，为null，则不提示
    successMsg: '修改成功',
    // 【可选】 { string|null= } 操作失败提示消息，为null，则不提示
    errorMsg: null,
    // 【可选】 { Object= } 模态框属性
    dialogProps: {
      width: '700px',
      title: '修改',
      'append-to-body': true,
    },
    // 【可选】 { Object= } 操作按钮的一些属性
    buttonProps: {
      type: 'default',
      size: 'small',
      plain: true,
    },
  }

  delete = {
    // 【必须】 { (): Promise<any> } 后端接口API
    api: null,
    // 【可选】 { number= } 按钮排序
    crudSort: 30,
    // 【可选】 { string= } 删除二次确认提示文本
    confirmText: '确定要删除吗？',
    // 【可选】 { Object= } 操作按钮的一些属性
    buttonProps: {
      type: 'danger',
      size: 'small',
      plain: true,
    },
  }
}

export class TableRowOptions {
  loadingDelete = false;

  disabledEdit = false;

  disabledDelete = false;

  uid = uuid();

  permission = {
    edit: true,
    delete: true,
  }
}

// 更多属性参考 饿了么UI文档
export class PaginationDefaultProps {
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
