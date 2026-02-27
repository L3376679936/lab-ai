<template>
  <div class="lab-upload-doc">
    <doc-title title="LabUpload" subtitle="基于 Element UI Upload 封装，支持拖拽、列表预览 and 主题适配。" />

    <code-display 
      title="文件上传示例" 
      description="包含拖拽上传和按钮点击上传两种模式，支持文件类型限制和列表回显。" 
      :code="codeSnippet"
    >
      <h3>拖拽上传</h3>
      <lab-upload
        drag
        multiple
        v-model="fileList1"
        :auto-upload="false"
        style="margin-bottom: 30px"
      >
        <div slot="tip">只能上传 jpg/png 文件，且不超过 500kb</div>
      </lab-upload>
      
      <h3>点击上传</h3>
      <lab-upload
        v-model="fileList2"
        :auto-upload="false"
      >
        <div slot="tip">点击按钮选择文件</div>
      </lab-upload>
    </code-display>

    <h3>组件参数</h3>
    <el-table :data="attributes" class="api-table" border size="small">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>

    <h3>组件事件</h3>
    <el-table :data="events" class="api-table" border size="small">
      <el-table-column prop="name" label="事件名称" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="param" label="回调参数" />
    </el-table>
  </div>
</template>

<script>
import LabUpload from '@/components/LabUpload'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabUploadDoc',
  components: {
    LabUpload,
    DocTitle,
    CodeDisplay
  },
  data() {
    const codeSnippet = `
<!-- 拖拽上传 -->
<lab-upload drag multiple v-model="fileList1" :auto-upload="false">
  <div slot="tip">...</div>
</lab-upload>

<!-- 点击上传 -->
<lab-upload v-model="fileList2" :auto-upload="false">
  <div slot="tip">...</div>
</lab-upload>

<script>
export default {
  data() {
    return {
      fileList1: [],
      fileList2: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/...' }
      ]
    }
  }
}
<\/script>
`.trim()

    return {
      codeSnippet,
      fileList1: [],
      fileList2: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' }
      ],
      attributes: [
        { prop: 'value / v-model', desc: '文件列表', type: 'Array', default: '[]' },
        { prop: 'action', desc: '上传地址', type: 'String', default: '-' },
        { prop: 'headers', desc: '请求头', type: 'Object', default: '-' },
        { prop: 'drag', desc: '是否启用拖拽', type: 'Boolean', default: 'false' },
        { prop: 'multiple', desc: '是否支持多选', type: 'Boolean', default: 'false' },
      ],
      events: [
        { name: 'success', desc: '上传成功回调', param: 'response, file, fileList' },
        { name: 'error', desc: '上传失败回调', param: 'err, file, fileList' },
        { name: 'change', desc: '文件状态改变时触发', param: 'file, fileList' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
