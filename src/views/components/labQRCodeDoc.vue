<template>
  <div class="lab-qrcode-doc" :class="'theme-' + theme">
    <doc-title title="LabQRCode" subtitle="基于 qrcode.js 封装的二维码生成组件，支持动态内容、尺寸调整与主题适配。" />

    <code-display
      title="基础用法"
      description="输入任意文本即可实时生成二维码。支持自定义前景色、背景色和尺寸。"
      :code="baseCode"
    >
      <div style="display: flex; gap: 40px; flex-wrap: wrap;">
        <!-- 默认 -->
        <div class="demo-block">
          <h4>默认样式</h4>
          <LabQRCode text="https://github.com/Antigravity-AI" />
        </div>

        <!-- 自定义颜色 -->
        <div class="demo-block">
          <h4>自定义颜色</h4>
          <LabQRCode 
            text="Custom Color QR" 
            color-dark="#ff005c" 
            color-light="#ffeef5"
          />
        </div>

        <!-- 动态生成 -->
        <div class="demo-block">
          <h4>动态生成</h4>
          <el-input v-model="inputText" placeholder="输入内容..." size="small" style="margin-bottom: 10px; width: 200px;" />
          <br>
          <LabQRCode :text="inputText || '请输入内容'" :width="150" />
        </div>
      </div>
    </code-display>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="150" />
    </el-table>
  </div>
</template>

<script>
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'
import { mapState } from 'vuex'

export default {
  name: 'LabQRCodeDoc',
  components: {
    DocTitle,
    CodeDisplay
  },
  computed: {
    ...mapState(['theme'])
  },
  data() {
    return {
      inputText: 'Dynamic Content',
      attributes: [
        { prop: 'text', desc: '二维码内容文本', type: 'String', default: "''" },
        { prop: 'width', desc: '二维码尺寸 (px)', type: 'Number', default: '200' },
        { prop: 'margin', desc: '二维码白边宽度', type: 'Number', default: '4' },
        { prop: 'colorDark', desc: '实点颜色', type: 'String', default: "'#000000'" },
        { prop: 'colorLight', desc: '背景颜色', type: 'String', default: "'#ffffff'" },
        { prop: 'showText', desc: '是否在下方显示文本', type: 'Boolean', default: 'false' }
      ],
      baseCode: `
<template>
  <div>
    <lab-qrcode text="Hello World" />
    
    <lab-qrcode 
      text="Custom Style" 
      :width="150" 
      color-dark="#00d9ff" 
      color-light="transparent" 
    />
  </div>
</template>
`.trim()
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa; /* 亮色模式下给一个浅灰背景，突出二维码 */
}
h4 { margin-top: 0; margin-bottom: 10px; color: var(--text-color); }

/* 暗色主题适配 */
.theme-tech {
  .demo-block {
    background-color: rgba(255, 255, 255, 0.05); /* 暗色模式给一个半透明背景 */
  }
  
  h4 { color: #b0b0b0; }
}
</style>
