<template>
  <div class="lab-rich-text-doc" :class="`theme-${theme}`">
    <doc-title title="LabRichText" subtitle="基于 Tinymce 的富文本编辑器，深度集成暗色主题，支持丰富的插件扩展与自定义工具栏。" />

    <code-display 
      title="基础用法" 
      description="支持 v-model 双向绑定，自动适配当前系统主题（亮色/暗色主题）。" 
      :code="baseCode"
    >
      <div style="margin-bottom: 20px;">
        <span style="font-size: 14px; margin-right: 10px; color: var(--text-secondary);">只读模式：</span>
        <el-switch v-model="disabled"></el-switch>
      </div>
      <lab-rich-text v-model="content" :disabled="disabled" :height="400" />
      <div style="margin-top: 20px;">
        <h4>当前内容 (HTML):</h4>
        <pre class="content-preview">{{ content }}</pre>
      </div>
    </code-display>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>

    <h3>组件事件 (Events)</h3>
    <el-table :data="events" border size="small" class="api-table">
      <el-table-column prop="name" label="事件名" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="params" label="回调参数" />
    </el-table>

    <div class="table-tip">
      <i class="el-icon-warning-outline"></i> 注意：组件已内置图片 Base64 上传处理。如需对接后端上传接口，请修改 `init` 配置中的 `images_upload_handler`。
    </div>
  </div>
</template>

<script>
import LabRichText from '@/components/LabRichText/index.vue'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'
import { mapState } from 'vuex'

export default {
  name: 'LabRichTextDoc',
  components: {
    LabRichText,
    DocTitle,
    CodeDisplay
  },
  computed: {
    ...mapState(['theme'])
  },
  data() {
    return {
      content: '<p>欢迎使用 <strong>LabRichText</strong> 富文本组件！</p><p>尝试切换右上角的<span style="color: #00d9ff;">【主题切换】</span>按钮，查看编辑器如何自动适配暗色主题。</p>',
      disabled: false,
      baseCode: `
<template>
  <lab-rich-text 
    v-model="content" 
    :disabled="disabled"
    :height="400" 
  />
</template>

<script>
export default {
  data() {
    return {
      content: '<p>Initial content...</p>',
      disabled: false
    }
  }
}
<\/script>
`.trim(),
      attributes: [
        { prop: 'value / v-model', desc: '绑定值', type: 'String', default: '-' },
        { prop: 'disabled', desc: '是否禁用 (只读模式)', type: 'Boolean', default: 'false' },
        { prop: 'height', desc: '编辑器高度 (px)', type: 'Number', default: '500' },
        { prop: 'plugins', desc: 'Tinymce 插件字符串', type: 'String', default: 'print preview ...' },
        { prop: 'toolbar', desc: 'Tinymce 工具栏配置', type: 'String', default: 'styleselect ...' }
      ],
      events: [
        { name: 'input', desc: '在内容发生改变时触发', params: 'content (String)' },
        { name: 'change', desc: '在内容发生改变时触发', params: 'content (String)' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.content-preview {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  color: #606266;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
}

.lab-rich-text-doc {
  &.theme-tech {
    .content-preview {
      background: rgba(0, 0, 0, 0.3);
      color: #00d9ff;
      border: 1px solid rgba(0, 243, 255, 0.2);
    }
    
    ::v-deep .el-switch {
      .el-switch__label {
        color: #b0b0b0;
        &.is-active {
          color: #00d9ff;
        }
      }
      
      .el-switch__core {
        border-color: #409eff;
        background-color: #2c2c2c;
      }
      
      &.is-checked .el-switch__core {
        border-color: #00d9ff;
        background-color: rgba(0, 217, 255, 0.3);
      }
    }
  }
}
</style>
