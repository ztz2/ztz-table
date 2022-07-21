import { ref, reactive, defineComponent } from 'vue';
import { ElForm } from 'element-plus';

export default defineComponent({
  setup(props, { expose }) {
    const formRef = ref();
    const formEntity = reactive({
      date: '',
      address: '',
    });
    const formRules = reactive({});
    // 必须暴露的两个方法
    expose({
      // 获取表单实例
      getFormRef: () => formRef.value,
      // 获取表单模型
      getFormModel: () => formEntity,
    });
    return () => (<>
      <ElForm ref={(r) => formRef.value = r} model={formEntity} rules={formRules} />
    </>);
  },
});
