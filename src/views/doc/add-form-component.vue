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
} from 'vue';

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

// 必须暴露的两个方法
defineExpose({
  // 获取表单实例
  getFormRef: () => formRef.value,
  // 获取表单模型
  getFormModel: () => formEntity,
});
</script>
