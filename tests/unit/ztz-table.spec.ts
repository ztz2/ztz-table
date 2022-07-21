import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { ZtzTable } from '../../src';
import FormComponent from './form-component';

function waitTimer(t = 450) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(t), t);
  });
}

describe('test ztz-table(element-plus) component', () => {
  it('should render table by json config', async () => {
    const columns = [
      { prop: 'date', label: '时间', width: '180' },
      { prop: 'address', label: '地点' },
    ];
    const tableData = [
      { date: '2021-03-01', address: '山西' },
      { date: '2021-03-02', address: '西藏' },
    ];
    const wrapper = mount(ZtzTable, {
      props: { columns, data: tableData },
      global: {
        plugins: [ElementPlus],
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const tdList = wrapper.findAll('.el-table__body > tbody >.el-table__row .el-table__cell');
    const text = tdList.map((el) => el.text()).join(',');
    expect(text).toBe('2021-03-01,山西,2021-03-02,西藏');
  });

  it('should render table by template', async () => {
    const tableData = [
      { date: '2021-03-03', address: '北京' },
      { date: '2021-03-04', address: '上海' },
    ];
    const wrapper = mount(ZtzTable, {
      props: { data: tableData },
      global: {
        plugins: [ElementPlus],
      },
      slots: {
        columns: `
          <el-table-column prop="date" label="时间" width="180" />
          <el-table-column prop="address" label="地点" />
        `,
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const tdList = wrapper.findAll('.el-table__body > tbody >.el-table__row .el-table__cell');
    const text = tdList.map((el) => el.text()).join(',');
    console.log(text);
    expect(text).toBe('2021-03-03,北京,2021-03-04,上海');
  });

  it('render crud(query) table', async () => {
    const pageListApi = jest.fn(() => Promise.resolve({
      total: 6,
      content: [
        { date: '2021-03-09', address: '广西' },
        { date: '2021-03-10', address: '海南' },
      ],
    }));
    const columns = [
      { prop: 'date', label: '时间', width: '180' },
      { prop: 'address', label: '地点' },
    ];
    const wrapper = mount(ZtzTable, {
      props: {
        columns,
        data: pageListApi,
        'list-key': 'content',
        'total-key': 'total',
        ref: 'ztzTable',
      },
      global: {
        plugins: [ElementPlus],
      },
    });
    await waitTimer();
    expect(pageListApi).toBeCalledTimes(1);

    // @ts-ignore
    wrapper.vm.refreshTable?.();
    await waitTimer();
    expect(pageListApi).toBeCalledTimes(2);
  });

  it('render crud(add) table', async () => {
    const pageListApi = jest.fn(() => Promise.resolve({
      total: 6,
      content: [
        { date: '2021-03-09', address: '广西' },
        { date: '2021-03-10', address: '海南' },
      ],
    }));
    const addApi = jest.fn(() => Promise.resolve({}));

    const columns = [
      { prop: 'date', label: '时间', width: '180' },
      { prop: 'address', label: '地点' },
    ];

    const crud = {
      add: {
        api: addApi,
        formComponent: FormComponent,
        dialogProps: {
          'append-to-body': false,
        },
      },
    };

    // @ts-ignore
    const wrapper = mount(ZtzTable, {
      props: {
        crud,
        columns,
        data: pageListApi,
        'list-key': 'content',
        'total-key': 'total',
        ref: 'ztzTable',
      },
      global: {
        plugins: [ElementPlus],
      },
    });
    await waitTimer();
    expect(pageListApi).toBeCalledTimes(1);

    // @ts-ignore
    wrapper.vm.showAddDialog?.();
    await wrapper.vm.$nextTick();
    const submitBtn = wrapper.find('.el-dialog__footer .el-button--primary');
    await submitBtn.trigger('click');
    await waitTimer();
    expect(addApi).toBeCalledTimes(1);
  });

  it('render crud(edit) table', async () => {
    const pageListApi = jest.fn(() => Promise.resolve({
      total: 6,
      content: [
        { date: '2021-03-09', address: '广西' },
        { date: '2021-03-10', address: '海南' },
      ],
    }));
    const editApi = jest.fn(() => Promise.resolve({}));
    const detailApi = jest.fn(() => Promise.resolve({}));

    const columns = [
      { prop: 'date', label: '时间', width: '180' },
      { prop: 'address', label: '地点' },
      { label: '操作', width: 80 },
    ];

    const crud = {
      edit: {
        api: editApi,
        detailApi,
        formComponent: FormComponent,
        dialogProps: {
          'append-to-body': false,
        },
      },
    };

    // @ts-ignore
    const wrapper = mount(ZtzTable, {
      props: {
        crud,
        columns,
        data: pageListApi,
        'list-key': 'content',
        'total-key': 'total',
        ref: 'ztzTable',
      },
      global: {
        plugins: [ElementPlus],
      },
    });
    await waitTimer();
    expect(pageListApi).toBeCalledTimes(1);

    const editBtn = wrapper.find('.el-table__body > tbody >.el-table__row .el-button');
    // @ts-ignore
    await editBtn.trigger('click');
    await wrapper.vm.$nextTick();
    const submitBtn = wrapper.find('.el-dialog__footer .el-button--primary');
    await submitBtn.trigger('click');
    await waitTimer();

    expect(editApi).toBeCalledTimes(1);
    expect(detailApi).toBeCalledTimes(1);
  });

  it('render crud(delete) table', async () => {
    const pageListApi = jest.fn(() => Promise.resolve({
      total: 6,
      content: [
        { date: '2021-03-09', address: '广西' },
      ],
    }));
    const deleteApi = jest.fn(() => Promise.resolve({}));

    const columns = [
      { prop: 'date', label: '时间', width: '180' },
      { prop: 'address', label: '地点' },
      { label: '操作', width: 80 },
    ];

    const crud = {
      delete: {
        api: deleteApi,
      },
    };

    // @ts-ignore
    const wrapper = mount(ZtzTable, {
      props: {
        crud,
        columns,
        data: pageListApi,
        'list-key': 'content',
        'total-key': 'total',
        ref: 'ztzTable',
      },
      global: {
        plugins: [ElementPlus],
      },
    });
    await waitTimer();
    expect(pageListApi).toBeCalledTimes(1);

    const editBtn = wrapper.find('.el-table__body > tbody >.el-table__row .el-button');
    // @ts-ignore
    await editBtn.trigger('click');
    await wrapper.vm.$nextTick();
    const confirmBtn = document.body.querySelector('.el-popconfirm__action .el-button--primary');
    console.log(confirmBtn);
    // @ts-ignore
    confirmBtn?.click();
    await waitTimer();

    expect(deleteApi).toBeCalledTimes(1);
  });
});
