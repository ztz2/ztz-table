<template>
  <div class="doc-element-plus">
    <a-space :size="30" direction="vertical" style="width: 100%;">
      <a-card title="基本使用">
        <div>
          <p>通过配置columns对象，快速创建一个表格</p>
          <ztz-table :columns="columns" :data="tableData"></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="baseDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="使用template语法">
        <div>
          <p>使用template模板语法，需要使用一个 <strong>columns</strong> 插槽，其他属性参数和饿了么UI保持一致，包括自定义渲染表头和单元格</p>
          <ztz-table :columns="columns" :data="tableData"></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="templateDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="自定义渲染表头">
        <div>
          <p>通过使用 <strong>renderHeader</strong> 函数进行自定义列头显示内容。</p>
          <ztz-table :columns="columns2" :data="tableData"></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="customHeaderDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="自定义渲染单元格">
        <div>
          <p>通过使用 <strong>render</strong> 函数进行自定义单元格显示内容。</p>
          <ztz-table :columns="columns3" :data="tableData"></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="customRenderDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <h2>高级功能-CRUD之列表查询</h2>
      <a-card title="CRUD-列表查询">
        <div>
          <p>表格 <strong>data</strong> 属性接收一个后端接口函数，表格加载完成将会调用该接口请求数据进行渲染。
            当 <strong>data</strong> 是一个函数的时候，则认为这是一个动态的表格，将会自动启用分页功能，当然可以使用 <strong>hidePagination</strong> 属性进行关闭</p>
          <p>服务器端返回的数据对象中，必须包含两个字段：list - 列表数据集合，total - 总条数，当后端定义的字段名称和这里约定的不同的时候，可以使用 <strong>listKey</strong> 和 <strong>totalKey</strong> 属性进行修改</p>
          <ztz-table
            :columns="columns"
            :data="fetchTableDataApi"
            :pagination="pagination"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="crudQueryDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="CRUD-列表查询-含有搜索条件">
        <div>
          <p>通过 <strong>queryParams</strong> 属性接收搜索条件，使用 ref 获取 ZtzTable 实例，调用 <strong>refreshTable</strong> 函数进行刷新表格，重新获取数据，该函数接收两个参数：resetPageNum - 是否重置当前页数，resetQueryParams - 是否重置当前参数，可根据这两个参数进行重置搜索功能，默认都是false</p>
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
            :pagination="pagination"
            ref="ztzTableRef"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="crudQueryByParamsDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="CRUD-列表查询-根据搜索条件动态变化刷新表格">
        <div>
          <p>增加 <strong>dynamic</strong> 属性即可，监听参数变化的输入是比较频繁的，内部默认有350ms的防抖策略，还是推荐自行配置使用ajax取消重复请求功能。</p>
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
            :data="fetchTableDataApi"
            :query-params="queryParams"
            :pagination="pagination"
            dynamic
            ref="ztzTableRef"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="crudQueryByDynamicParamsDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <h2>CRUD中剩余的增删改配置</h2>
      <p>增删改功能需要在 <strong>curd</strong> 属性中进行配置扩展该功能</p>
      <a-card title="CRUD-删除功能">
        <div>
          <ol>
            <li>1. 在 <strong>crud</strong> 属性中 delete->api 增加删除接口API配置</li>
            <li>2. 在 <strong>columns</strong> 中增加配置，删除功能按钮注入到哪个单元格，当 label === "操作"的时候，默认会注入到这里，当然可以使用 injectDelete=false取消，当为true时候，直接注入到该单元格</li>
          </ol>
          <ztz-table
            :columns="columns4"
            :data="fetchTableDataApi"
            :pagination="pagination"
            :crud="{delete: deleteCRUD}"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="查看代码">
              <code-box :code="crudDeleteDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="CRUD-添加功能">
        <div>
          <ol>
            <li>1.该功能实现基于Vue动态组件（类似React render props）功能实现，所以 <strong>crud</strong> 配置中需要传递一个添加表单组件 <strong>add-form-component.vue</strong> 进来</li>
            <li>2.该表单组件必须暴露两个方法：getFormRef 方法，返回 ElForm 组件Ref实例，getFormModel 方法，用于获取表单实体模型实例方法</li>
            <li>3.使用ztzTableRef.showAddDialog()调用即可</li>
          </ol>
          <div>
            <el-button @click="ztzTableAddRef.showAddDialog()">添加</el-button>
          </div>
          <ztz-table
            :columns="columns"
            :data="fetchTableDataApi"
            :pagination="pagination"
            :crud="{add: addCRUD}"
            ref="ztzTableAddRef"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="table - 查看代码">
              <code-box :code="crudAddDemoCode"></code-box>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="add-form-component.vue - 查看代码">
              <code-box :code="crudAddFormComponentDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
      <a-card title="CRUD-修加功能">
        <div>
          修改功能实现方式基本和新增类似。
          <ol>
            <li>1.该功能实现基于Vue动态组件（类似React render props）功能实现，所以 <strong>crud</strong> 配置中需要传递一个添加表单组件 <strong>edit-form-component.vue</strong> 进来</li>
            <li>2.该表单组件必须暴露两个方法：getFormRef 方法，返回 ElForm 组件Ref实例，getFormModel 方法，用于获取表单实体模型实例方法</li>
            <li>2. 在 <strong>columns</strong> 中增加配置，删除功能按钮注入到哪个单元格，当 label === "操作"的时候，默认会注入到这里，当然可以使用 injectEdit=false取消，当为true时候，直接注入到该单元格</li>
          </ol>
          <ztz-table
            :columns="columns4"
            :data="fetchTableDataApi"
            :pagination="pagination"
            :crud="{edit: editCRUD}"
            list-key="content"
            total-key="total"
          ></ztz-table>
        </div>
        <div class="gap24">
          <a-collapse>
            <a-collapse-panel key="1" header="table - 查看代码">
              <code-box :code="crudEditDemoCode"></code-box>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="edit-form-component.vue - 查看代码">
              <code-box :code="crudEditFormComponentDemoCode"></code-box>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-card>
    </a-space>
  </div>
</template>
<script setup>
import { ElTag } from 'element-plus';
import { h, ref, reactive } from 'vue';
import CodeBox from '@/components/code-box/src/index.vue';
import {
  baseDemoCode,
  templateDemoCode,
  customHeaderDemoCode,
  customRenderDemoCode,
  crudQueryDemoCode,
  crudQueryByParamsDemoCode,
  crudQueryByDynamicParamsDemoCode,
  crudDeleteDemoCode,
  crudAddDemoCode,
  crudAddFormComponentDemoCode,
  crudEditDemoCode,
  crudEditFormComponentDemoCode,
} from '@/views/doc/code-str';
import AddFormComponent from './add-form-component.vue';
import EditFormComponent from './edit-form-component.vue';

const columns = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
]);

const columns2 = reactive([
  {
    prop: 'date',
    label: '时间',
    width: '180',
    renderHeader({ $index, column }) {
      return h(ElTag, null, [`自定义头(${column.label}${$index})`]);
    },
  },
  { prop: 'address', label: '地点' },
]);

const columns3 = reactive([
  {
    prop: 'date',
    label: '时间',
    width: '180',
    render({ $index, row }) {
      return h(ElTag, null, [`自定义单元格(${row.date}${$index})`]);
    },
  },
  { prop: 'address', label: '地点' },
]);

const columns4 = reactive([
  { prop: 'date', label: '时间', width: '180' },
  { prop: 'address', label: '地点' },
  { label: '操作', width: 80 },
]);

const tableData = reactive([
  { date: '2021-03-05', address: '北京' },
  { date: '2021-03-06', address: '上海' },
]);

const ztzTableRef = ref(null);
const ztzTableAddRef = ref(null);

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
          { date: '2021-03-05', address: `北京（${Math.random()}）` },
          { date: '2021-03-06', address: `上海（${Math.random()}）` },
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

const pagination = reactive({
  // 当前页
  pageNum: 1,
  // 分页数
  pageSize: 2,
});

const queryParams = reactive({
  date: '',
  address: '',
});

const deleteCRUD = reactive({
  api: deleteApi,
});

const addCRUD = reactive({
  api: addApi,
  formComponent: AddFormComponent,
});

const editCRUD = reactive({
  api: editApi,
  detailApi: editApi,
  formComponent: EditFormComponent,
});

</script>
<style scoped>
ul, ol {
  list-style: none;
}
</style>
