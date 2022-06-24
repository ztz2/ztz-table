<template>
  <el-form
    :model="formEntity"
    :rules="formRules"
    ref="formRef"
    label-width="80px"
  >
    <el-form-item label="时间" prop="date">
      <el-date-picker
        v-model="formEntity.date"
        type="date"
      />
    </el-form-item>
    <el-form-item label="地点" prop="address">
      <el-input v-model="formEntity.address" style="width: 220px;" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import {
  ref,
  reactive,
  defineExpose,
  watchEffect,
  defineProps,
} from 'vue';

const props = defineProps({
  // 当修改的时候，实体表单模型通过data传递过来，用于数据回显
  data: {
    type: Object,
    default: () => ({}),
  },
});

const formRef = ref();
const formEntity = reactive({
  date: '',
  address: '',
});

const formRules = reactive({
  address: [
    { required: true, message: '必填项', trigger: 'blur' },
  ],
});

// 数据回显到实体模型
watchEffect(() => {
  for (const [k, v] of Object.entries(props.data)) { formEntity[k] = v; }
});

// 必须暴露的两个方法
defineExpose({
  // 获取表单实例
  getFormRef: () => formRef.value,
  // 获取表单模型
  getFormModel: () => formEntity,
});
</script>
