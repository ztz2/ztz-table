<template>
  <div class="code-box">
    <div class="code-box__content">
      <div>
        <pre class="language-css"><code v-html="highlighterCode"></code></pre>
      </div>
    </div>
    <div v-if="showCopy && code && code.trim().length > 0" class="code-box__handle">
      <el-icon ref="copyBtnRef" title="复制代码"><CopyDocument /></el-icon>
    </div>
  </div>
</template>
<script>
import Prism from 'prismjs';
import ClipboardJS from 'clipboard';
import { ElMessage } from 'element-plus';
import { CopyDocument } from '@element-plus/icons-vue';
import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: 'code-box',
  components: {
    CopyDocument,
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
      highlighterCode: '',
    };
  },
  watch: {
    code: {
      immediate: true,
      handler(code) {
        this.$nextTick(() => {
          this.highlighterCode = Prism.highlight(code, Prism.languages.javascript, 'jsx');
        });
        if (code) {
          this.$nextTick(() => {
            const { copyBtnRef } = this.$refs;
            if (copyBtnRef?.$el) {
              const el = copyBtnRef.$el;
              this.clipboard?.destroy?.();
              this.clipboard = new ClipboardJS(el, { text: () => code });
              this.clipboard.on('success', () => {
                ElMessage({
                  message: '复制成功',
                  type: 'success',
                });
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
  line-height: 20px;
}
.code-box__handle{
  position: absolute;
  right: 20px;
  top: 20px;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
</style>
