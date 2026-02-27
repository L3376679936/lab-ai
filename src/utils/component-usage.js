
export const componentUsage = {
  'LabTableTransfer': `
### LabTableTransfer - 高级表格穿梭框
融合了 Table 的列展示能力和 Transfer 的穿梭交互。

#### 引入
\`\`\`javascript
import LabTableTransfer from './components/LabTableTransfer.vue'
\`\`\`

#### 基础用法
\`\`\`html
<template>
  <lab-table-transfer
    v-model="selectedIds"
    :data="sourceData"
    :columns="columns"
    :titles="['待选人员', '已选人员']"
    row-key="id"
    filterable
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      sourceData: [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'User' }
      ],
      columns: [
        { label: '姓名', prop: 'name' },
        { label: '角色', prop: 'role' }
      ]
    }
  }
}
</script>
\`\`\`

#### 核心 Props
- \`data\` (Array): 源数据列表
- \`value / v-model\` (Array): 绑定的已选数据 key 集合
- \`columns\` (Array): 列定义，格式同 el-table-column，支持 prop/label/width
- \`titles\` (Array): 左右面板标题，默认 ['待选', '已选']
- \`rowKey\` (String): 数据唯一主键，默认 'id'
`,

  'LabQRCode': `
### LabQRCode - 二维码生成组件
基于 qrcode 由于库封装，支持自定义颜色和尺寸。

#### 引入
\`\`\`javascript
import LabQRCode from './components/LabQRCode.vue'
\`\`\`

#### 基础用法
\`\`\`html
<!-- 简单使用 -->
<lab-qrcode text="https://example.com" />

<!-- 自定义样式 -->
    text="Custom Style" 
    :width="150" 
    color-dark="#00d9ff" 
    color-light="transparent" 
  />
</template>
\`\`\`

#### 核心 Props
- \`text\` (String): 二维码内容
- \`width\` (Number): 尺寸，单位 px，默认 200
- \`colorDark\` (String): 实点颜色（前景色）
- \`colorLight\` (String): 空白颜色（背景色）
`,

  'LabTablePage': `
### LabTablePage - 综合表格页
集成了搜索栏、工具栏、表格和分页的标准页面组件。

#### 引入
\`\`\`javascript
import LabTablePage from './components/LabTablePage.vue'
\`\`\`

#### 基础用法
\`\`\`html
<lab-table-page
  :columns="columns"
  :api="fetchApi"
  :query-param="searchForm"
>
  <!-- 搜索槽 -->
  <template #searchBar>
    <el-input v-model="searchForm.keyword" placeholder="搜一下" />
    <el-button @click="$refs.table.handleSearch()">查询</el-button>
  </template>

  <!-- 工具栏 -->
  <template #toolbar-left>
    <el-button type="primary">新增</el-button>
  </template>
</lab-table-page>
\`\`\`
`,

  'LabTable': `
### LabTable - 增强版表格
对 el-table 的封装，增加了配置化列显隐、密度控制等功能。

#### 用法
\`\`\`html
<lab-table :data="list" :columns="columns" border>
  <template #action="{ row }">
    <el-button>Edit</el-button>
  </template>
</lab-table>
\`\`\`
`,
  
  'LabForm': `
### LabForm - 配置化表单
通过 JSON 配置自动生成 ElementUI 表单。

#### 用法
\`\`\`html
<lab-form 
  :schema="formSchema" 
  v-model="formData" 
  @submit="handleSubmit" 
/>
\`\`\`
`,

  'LabChart': `
### LabChart - ECharts 封装
自动处理 resize 和主题适配的图表组件。

#### 用法
\`\`\`html
<lab-chart :options="chartOption" height="400px" />
\`\`\`
`,

  'LabUpload': `
### LabUpload - 文件上传
增强的上传组件，支持自定义列表样式和拖拽。

#### 用法
\`\`\`html
<lab-upload v-model="fileList" action="/api/upload" />
\`\`\`
`,

  'LabSliceFrame': `
### LabSliceFrame - 九宫格缩放框
用于大屏开发，实现边框图片不失真的九宫格拉伸。

#### 用法
\`\`\`html
<lab-slice-frame 
  src="border.png" 
  :slice="[20, 20, 20, 20]"
>
  <div class="content">内容区域</div>
</lab-slice-frame>
\`\`\`
`,

  // Directives
  'v-copy': `
### v-copy - 一键复制
点击元素复制指定文本到剪贴板。

\`\`\`html
<el-button v-copy="shareUrl">复制链接</el-button>
\`\`\`
`,

  'v-debounce': `
### v-debounce - 防抖指令
延迟执行点击事件，防止重复提交。

\`\`\`html
<el-button v-debounce="{ fn: handleSave, event: 'click', time: 1000, args: ['user_id_123'] }">提交（防抖）</el-button>
\`\`\`
`,

  'v-throttle': `
### v-throttle - 节流指令
限制事件触发频率。

\`\`\`html
<div v-throttle="[handleScroll, 1000, 'click', 'extra']">滚动触发</div>
\`\`\`
`,

  'v-waterMarker': `
### v-waterMarker - 水印指令
给容器添加背景水印。

\`\`\`html
<div v-waterMarker="{ text: 'Lab AI Project', textColor: 'rgba(180, 180, 180, 0.15)' }">
  ... content ...
</div>
\`\`\`
`,

  'v-clickOutside': `
### v-clickoutside - 点击外部
点击元素以外区域时触发回调，常用于关闭下拉菜单。

\`\`\`html
<ul v-if="isDropdownOpen" v-clickOutside="() => isDropdownOpen = false">
  <li>菜单项 1</li>
  <li>菜单项 2</li>
</ul>
\`\`\`
`,

  'v-waves': `
### v-waves - 水波纹效果
点击添加 Material Design 风格水波纹反馈。

\`\`\`html
<el-button type="primary" v-waves>默认波纹</el-button>
<el-button type="info" v-waves="'rgba(255, 255, 255, 0.4)'">半透明白</el-button>
<div v-waves class="custom-wave-box">Div 容器</div>
\`\`\`
`,

  'v-ellipsis': `
### v-ellipsis - 文本省略
超过宽度自动省略并显示 Tooltip。

\`\`\`html
<div v-ellipsis :style="{ width: '100px' }">
  这是一段很长的文本内容...
</div>
\`\`\`
`,

  'v-lazyload': `
### v-lazyload - 图片懒加载
图片进入可视区域后再加载。

\`\`\`html
<img v-lazyload="imageUrl" />
\`\`\`
`
}
