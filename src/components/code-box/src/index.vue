<template>
  <div class="code-box">
    <div class="code-box__content">
      <div><pre v-highlight><code class="javascript">{{ code }}</code></pre></div>
    </div>
    <div v-if="showCopy && code && code.trim().length > 0" class="code-box__handle">
      <CopyOutlined title="复制代码" ref="copyBtnRef" />
    </div>
  </div>
</template>
<script>
import ClipboardJS from 'clipboard';
import { message } from 'ant-design-vue';
import { CopyOutlined } from '@ant-design/icons-vue';

export default {
  name: 'code-box',
  components: {
    CopyOutlined,
  },
  props: {
    code: String,
    showCopy: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      clipboard: null,
    };
  },
  watch: {
    code: {
      immediate: true,
      handler(code) {
        if (code) {
          this.$nextTick(() => {
            const { copyBtnRef } = this.$refs;
            if (copyBtnRef) {
              const el = copyBtnRef;
              this.clipboard?.destroy?.();
              this.clipboard = new ClipboardJS(el, { text: () => code });
              this.clipboard.on('success', () => {
                console.log(123321);
                message.success('复制成功');
              });
            }
          });
        }
      },
    },
  },
  beforeUnmount() {
    this.clipboard?.destroy?.();
  },
};
</script>
<style scoped>
.code-box{
  min-height: 140px;
  position: relative;
}
.code-box__handle{
  position: absolute;
  right: 20px;
  bottom: 20px;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
</style>
