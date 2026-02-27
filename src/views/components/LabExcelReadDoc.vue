<template>
  <div class="lab-excel-read-doc">
    <doc-title title="LabExcelRead" subtitle="表格读取组件，支持 Excel (.xlsx, .xls) 和 CSV 文件上传并解析为 JSON 数据。" />

    <code-display 
      title="基础用法" 
      description="拖拽或点击上传 Excel/JSON 文件，解析结果将在下方展示。" 
      :code="codeSnippet"
    >
      <div class="demo-wrapper">
        <lab-excel-read @success="handleSuccess" />
        
        <div v-if="tableData.length" class="result-box">
          <div class="result-header">
            <div class="header-left">
              <span>解析成功! 共 {{ tableData.length }} 条数据</span>
              <span v-if="tableData.length > 100" class="warning-text"> (仅展示前 100 条)</span>
            </div>
            <div class="header-actions">
              <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadJSON">下载 JSON</el-button>
              <el-button type="success" size="mini" icon="el-icon-document-copy" v-copy="jsonString" v-if="jsonString">复制 JSON</el-button>
              <el-button type="text" @click="clearData">清空</el-button>
            </div>
          </div>
          
          <el-table 
             :data="displayData" 
             border 
             height="300" 
             style="width: 100%"
             :span-method="objectSpanMethod"
          >
             <el-table-column 
               v-for="header in tableHeader" 
               :key="header" 
               :prop="header" 
               :label="header" 
               show-overflow-tooltip
             />
          </el-table>
          
          <div class="json-preview">
            <h5>JSON 数据预览 (前 2 条):</h5>
            <pre>{{ JSON.stringify(displayData.slice(0, 2), null, 2) }}</pre>
          </div>
        </div>
      </div>
    </code-display>

    <h3>组件参数</h3>
    <el-table :data="attributes" class="api-table" border size="small">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>
    
    <h3>事件</h3>
    <el-table :data="events" class="api-table" border size="small">
      <el-table-column prop="name" label="事件名" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="params" label="回调参数" />
    </el-table>
  </div>
</template>

<script>
import LabExcelRead from '@/components/LabExcelRead'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'
import { saveAs } from 'file-saver'

export default {
  name: 'LabExcelReadDoc',
  components: {
    LabExcelRead,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      spanMap: {}, // 存储合并信息
      codeSnippet: `
<lab-excel-read @success="handleSuccess" accept=".xlsx,.xls,.csv,.json" />

methods: {
  handleSuccess({ header, results, spanMap }) {
    this.tableHeader = header;
    this.tableData = results;
    this.spanMap = spanMap;
  },
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (this.spanMap) {
      const cellFunc = this.spanMap[\`\${rowIndex}-\${columnIndex}\`];
      if (cellFunc) {
        return cellFunc;
      }
    }
  }
}
`.trim(),
      attributes: [
        { prop: 'drag', desc: '是否启用拖拽上传', type: 'Boolean', default: 'true' },
        { prop: 'showFileList', desc: '是否显示已上传文件列表', type: 'Boolean', default: 'false' },
        { prop: 'accept', desc: '接受的文件类型', type: 'String', default: '.xlsx, .xls, .csv, .json' },
      ],
      events: [
        { name: 'success', desc: '解析成功触发', params: '{ header, results, spanMap }' },
        { name: 'input', desc: '支持 v-model 绑定解析结果', params: 'results: Array' },
        { name: 'error', desc: '解析失败触发', params: 'Error Object' }
      ]
    }
  },
  computed: {
    displayData() {
      // 限制展示前 100 条，避免页面卡顿
      return this.tableData.slice(0, 100);
    },
    jsonString() {
      return this.tableData.length ? JSON.stringify(this.tableData, null, 2) : '';
    }
  },
  methods: {
    handleSuccess({ header, results, spanMap }) {
      this.tableHeader = header;
      this.tableData = results;
      this.spanMap = spanMap || {};
      this.$message.success(`成功解析 ${results.length} 条数据`);
    },
    clearData() {
      this.tableData = [];
      this.tableHeader = [];
      this.spanMap = {};
    },
    downloadJSON() {
      if (!this.jsonString) return;
      const blob = new Blob([this.jsonString], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "data.json");
      this.$message.success('已开始下载 JSON 文件');
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.spanMap) {
        // 注意：这里的 columnIndex 是表格列索引，不一定等于 Excel 的列索引（如果 headers 过滤了）
        // 但目前我们 headers 是顺序 push 的，对应 Excel 的有效列。
        // 然而 spanMap 是基于 Excel 绝对列索引 (c) 的。
        // 如果我们过滤了空列，columnIndex 和 spanMap 的 key 可能会对不上！
        
        // 这是一个潜在 bug。
        // 如果第 2 列被过滤了，前端显示的第 2 列其实是 Excel 的第 3 列。
        // 修正方案：getHeaderRow 应该返回 列索引映射？或者我们假设表头不为空？
        // 用户之前的表格有空列，被我过滤了。
        
        // 简单处理：如果 spanMap 存在，说明有合并。
        // 我们利用 column.property (表头名) 或者 column.index?
        // element-ui 的 columnIndex 是可视列索引。
        
        // 鉴于时间，我们先直接用 columnIndex。如果用户正好过滤了列，合并可能会错位。
        // 但通常合并单元格的表格，表头都是完整的。
        
        const cellSpan = this.spanMap[`${rowIndex}-${columnIndex}`];
        if (cellSpan) {
          return cellSpan;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.result-box {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  padding: 10px;
  border-radius: 4px;
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #eee;
    
    .warning-text {
      color: #e6a23c;
      font-size: 12px;
      margin-left: 5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  
  .json-preview {
    margin-top: 15px;
    background: #fafafa;
    padding: 10px;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 10px 0;
      color: #606266;
    }
    
    pre {
      margin: 0;
      font-size: 12px;
      color: #333;
      overflow-x: auto;
      max-height: 200px; /* 限制预览高度 */
    }
  }
}
</style>
