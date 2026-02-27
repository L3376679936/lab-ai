<template>
  <div class="download-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>组件下载 / 按需引入</h2>
        <p>勾选你需要的组件，生成安装配置。</p>
      </div>

      <div class="filter-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索组件..."
          prefix-icon="el-icon-search"
          style="width: 300px; margin-right: 20px;"
        ></el-input>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-box" 
            v-if="selectedComponents.length > 0"
            @click="handleDownload"
            style="margin-right: 15px;"
          >
            生成并下载安装包
          </el-button>
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImport"
            accept=".json"
            style="display: inline-block;"
          >
            <el-button type="info" size="small" icon="el-icon-upload2" plain>导入组件配置</el-button>
          </el-upload>
        </div>
      </div>

      <div class="guide-area" v-if="selectedComponents.length > 0">
        <div class="guide-header">
          <i class="el-icon-magic-stick"></i>
          <span>集成引导 (已勾选 {{ selectedComponents.length }} 个组件)</span>
        </div>
        
        <el-tabs type="border-card" class="guide-tabs">
          <el-tab-pane label="1. 安装依赖">
            <p class="guide-text">在项目根目录运行安装命令：</p>
            <pre class="code-block">npm install {{ selectedDependencies.join(' ') }}</pre>
          </el-tab-pane>
          <el-tab-pane label="2. 放置目录">
            <p class="guide-text">将下载得到的 <code class="inline-code">lab-ui</code> 文件夹整体放入项目的 <code class="inline-code">src</code> 目录下。</p>
          </el-tab-pane>
          <el-tab-pane label="3. 全局注册">
            <p class="guide-text">在 <code class="inline-code">main.js</code> 中引入并安装：</p>
            <pre class="code-block">import LabUI from './lab-ui'
Vue.use(LabUI)</pre>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 分组折叠展示 -->
      <el-collapse v-model="activeCategories" class="category-collapse">
        <el-collapse-item v-for="(category, name) in groupedComponents" :key="name" :name="name">
          <template slot="title">
            <div class="category-header">
              <span class="category-title">{{ name }}</span>
              <el-tag size="mini" effect="plain" class="count-tag">{{ category.selectedCount }} / {{ category.list.length }}</el-tag>
            </div>
          </template>
          
          <el-row :gutter="15">
            <el-col :xs="24" :sm="12" :md="8" v-for="comp in category.list" :key="comp.name" style="margin-bottom: 15px;">
              <el-card 
                shadow="hover" 
                class="component-card" 
                :class="{ 'is-selected': selectedComponents.includes(comp.name) }"
                @click.native="toggleSelection(comp.name)"
              >
                <div slot="header" class="card-header">
                  <el-checkbox 
                    :value="selectedComponents.includes(comp.name)" 
                    style="pointer-events: none;"
                  >{{ comp.name }}</el-checkbox>
                  <el-button 
                    type="text" 
                    icon="el-icon-document" 
                    class="view-docs-btn" 
                    @click.native.stop="jumpToDocs(comp.name)"
                  >文档</el-button>
                </div>
                <div class="card-desc">
                  {{ comp.description }}
                  <div class="meta">
                     <span class="deps-list"><i class="el-icon-paperclip"></i> {{ comp.dependencies.join(', ') }}</span>
                     <span class="size-tag">{{ comp.size }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { componentSource } from '@/utils/component-source'
import { directiveSource } from '@/utils/directive-source'
import { componentUsage } from '@/utils/component-usage'

export default {
  name: 'Download',
  data() {
    return {
      components: [],
      searchQuery: '',
      selectedComponents: [],
      checkAll: false,
      activeCategories: []
    }
  },
  computed: {
    filteredComponents() {
      if (!this.searchQuery) return this.components
      return this.components.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.description.includes(this.searchQuery)
      )
    },
    groupedComponents() {
      const groups = {}
      this.filteredComponents.forEach(c => {
        const cat = c.category || 'Other'
        if (!groups[cat]) {
          groups[cat] = { list: [], selectedCount: 0 }
        }
        groups[cat].list.push(c)
        if (this.selectedComponents.includes(c.name)) {
          groups[cat].selectedCount++
        }
      })
      return groups
    },
    selectedDependencies() {
      const deps = new Set(['element-ui'])
      this.components.forEach(c => {
        if (this.selectedComponents.includes(c.name)) {
          c.dependencies.forEach(d => deps.add(d))
        }
      })
      return Array.from(deps)
    }
  },
  created() {
    this.fetchComponents()
    const saved = localStorage.getItem('lab-ui-selected')
    if (saved) {
      try {
        this.selectedComponents = JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to parse saved selections')
      }
    }
  },
  watch: {
    selectedComponents(val) {
      localStorage.setItem('lab-ui-selected', JSON.stringify(val))
    }
  },
  methods: {
    async fetchComponents() {
      try {
        const res = await axios.get('/components.json')
        // 过滤掉指令，只保留组件
        this.components = res.data.components.filter(c => c.type !== 'directive' && !c.name.startsWith('v-'))
      } catch (e) {
        console.error('Failed to load component manifest:', e)
        // Fallback
        this.components = [
          { name: 'LabTable', description: '增强型表格组件，支持密度控制、拖拽排序和科技主题', dependencies: ['element-ui', 'sortablejs'], category: 'Data', size: '15KB' },
          { name: 'LabForm', description: '动态表单生成器，基于 JSON 配置自动渲染表单', dependencies: ['element-ui'], category: 'Form', size: '12KB' },
          { name: 'LabChart', description: 'ECharts 图表封装，自动适配当前主题', dependencies: ['echarts'], category: 'Data', size: '8KB' },
          { name: 'LabUpload', description: '增强文件上传组件，支持文件列表自定义和拖拽', dependencies: ['element-ui'], category: 'Form', size: '5KB' },
          { name: 'LabTablePage', description: '综合页面组件，集成搜索、工具栏、表格和分页', dependencies: ['element-ui', 'sortablejs'], category: 'Complex', size: '25KB' },
          { name: 'LabTableTransfer', description: '高级表格穿梭框，融合了穿梭框的交互能力', dependencies: ['element-ui'], category: 'Form', size: '18KB' },
          { name: 'LabQRCode', description: '二维码生成组件，封装 qrcode 库', dependencies: ['qrcode'], category: 'Data', size: '3KB' },
          { name: 'LabSliceFrame', description: '九宫格缩放外框，解决背景图拉伸变形问题', dependencies: ['element-ui'], category: 'Other', size: '5KB' }
        ]
      }
    },
    handleCheckAllChange(val) {
      this.selectedComponents = val ? this.filteredComponents.map(c => c.name) : []
    },
    handleCheckedComponentsChange(value) {
      this.checkAll = value.length === this.components.length
    },
    toggleSelection(name) {
      const index = this.selectedComponents.indexOf(name)
      if (index > -1) {
        this.selectedComponents.splice(index, 1)
      } else {
        this.selectedComponents.push(name)
      }
    },
    jumpToDocs(name) {
      const viewMode = this.$store.state.viewMode
      const comp = this.components.find(c => c.name === name)
      const isDirective = (comp && comp.type === 'directive') || name.startsWith('v-')
      
      // 提取核心 Key 并统一驼峰命名，确保与 LabDirectiveDoc 中的 ID 一致
      let key = name
      if (isDirective) {
        if (comp && comp.key) {
          key = comp.key
        } else {
          // 兜底处理：v-clickoutside -> clickOutside
          const rawKey = name.replace(/^v-/, '')
          const map = {
            'clickoutside': 'clickOutside',
            'watermarker': 'waterMarker',
            'progressive-img': 'progressiveImg'
          }
          key = map[rawKey.toLowerCase()] || rawKey
        }
      }

      if (viewMode === 'router') {
        const routeMap = {
          'LabTable': 'labtable',
          'LabForm': 'labform',
          'LabChart': 'labchart',
          'LabUpload': 'labupload',
          'LabTablePage': 'labtable-page',
          'LabTableTransfer': 'labtable-transfer',
          'LabQRCode': 'labqrcode',
          'LabSliceFrame': 'labslice-frame',
          'LabRichText': 'labrichtext',
          'LabVideo': 'labvideo'
        }
        
        let targetPath = ''
        if (isDirective) {
          targetPath = `/components/directives#${key}`
        } else {
          const routePath = routeMap[name] || name.toLowerCase()
          targetPath = `/components/${routePath}`
        }
        this.$router.push(targetPath).catch(() => {})
      } else {
        const scrollMap = {
          'LabTable': 'ltable-section',
          'LabForm': 'lform-section',
          'LabChart': 'lchart-section',
          'LabUpload': 'lupload-section',
          'LabTablePage': 'ltable-page-section',
          'LabTableTransfer': 'ltable-transfer-section',
          'LabQRCode': 'lqrcode-section',
          'LabSliceFrame': 'lslice-frame-section',
          'LabRichText': 'lrichtext-section',
          'LabVideo': 'lvideo-section'
        }
        
        const sectionId = isDirective ? key : scrollMap[name]
        if (sectionId) {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else if (isDirective) {
            const dirSection = document.getElementById('ldirective-section')
            if (dirSection) dirSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    },
    handleImport(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result)
          if (config && Array.isArray(config.selected)) {
            this.selectedComponents = config.selected
            this.$message.success('配置导入成功')
          }
        } catch (err) {
          this.$message.error('解析配置文件失败')
        }
      }
      reader.readAsText(file.raw)
    },
    async handleDownload() {
      if (this.selectedComponents.length === 0) {
        this.$message.warning('请至少选择一个组件/指令')
        return
      }

      this.$message.info('正在构建自动化安装包...')
      const zip = new JSZip()
      const root = zip.folder("lab-ui")
      const componentsFolder = root.folder("components")
      const directivesFolder = root.folder("directives")
      
      let importLines = []
      let componentNames = []
      let directiveNames = []
      let usageContent = []
      
      this.selectedComponents.forEach(name => {
        // Collect usage info
        if (componentUsage[name]) {
          usageContent.push(componentUsage[name])
        }

        // Find logic
        const compDef = this.components.find(c => c.name === name)
        if (!compDef) return

        if (compDef.type === 'directive') {
           const code = directiveSource[compDef.key]
           if (code) {
             // Treat all directives as .js files for simplicity
             directivesFolder.file(`${compDef.key}.js`, code)
             // For index.js registration
             const directiveName = compDef.name.replace('v-', '') // v-copy -> copy
             importLines.push(`import ${directiveName} from './directives/${compDef.key}.js'`)
             directiveNames.push({ name: directiveName, var: directiveName })
           }
        } else {
           const code = componentSource[name]
           if (code) {
             componentsFolder.file(`${name}.vue`, code)
             importLines.push(`import ${name} from './components/${name}.vue'`)
             componentNames.push(name)
           }
        }
      })
      
      const indexContent = `/**
 * Lab-UI 自动生成的组件/指令注册入口
 */
${importLines.join('\n')}

const components = [
  ${componentNames.join(',\n  ')}
]

const directives = {
  ${directiveNames.map(d => `${d.name}: ${d.var}`).join(',\n  ')}
}

const install = function(Vue) {
  // Register Components
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  
  // Register Directives
  Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key])
  })
}

export default { install }
export { ${componentNames.join(', ')} }
`
      root.file("index.js", indexContent)
      root.file("lab-ui-config.json", JSON.stringify({ selected: this.selectedComponents, timestamp: new Date().toISOString() }, null, 2))
      
      const usageBody = usageContent.join('\n\n---\n')
      
      root.file("README.md", `# Lab-UI 自动化安装包
已下载内容：${this.selectedComponents.join(', ')}

## 快捷使用说明
1. 将 \`lab-ui\` 文件夹复制到项目 \`src\` 目录。
2. 安装依赖：\`npm install ${this.selectedDependencies.join(' ')}\`
3. 在 \`main.js\` 中注册：
   \`\`\`javascript
   import LabUI from './lab-ui'
   Vue.use(LabUI)
   \`\`\`

## 详细组件使用文档
${usageBody || '暂无详细文档'}
`)

      try {
        const content = await zip.generateAsync({ type: "blob" })
        saveAs(content, "lab-ui-package.zip")
        this.$message.success('下载成功！')
      } catch (e) {
        this.$message.error('打包失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.download-page {
  padding-bottom: 50px;
  
  .filter-bar { 
    margin-bottom: 24px; 
    display: flex;
    align-items: center;
    background: var(--bg-color-soft, rgba(0, 0, 0, 0.02));
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .action-buttons { margin-left: auto; display: flex; align-items: center; }
  }
  
  .category-collapse {
    border: none;
    background: transparent;
    
    ::v-deep .el-collapse-item__header {
      background: rgba(0, 243, 255, 0.05);
      border-bottom: 1px solid rgba(0, 243, 255, 0.1);
      padding: 0 20px;
      font-weight: 700;
      color: var(--primary-color);
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    ::v-deep .el-collapse-item__wrap {
      background: transparent;
      border: none;
      padding: 10px 0;
    }
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 12px;
    .count-tag { border-radius: 10px; padding: 0 10px; height: 20px; line-height: 18px; }
  }

  .component-card {
    background-color: var(--card-bg, #fff);
    border-color: var(--border-color);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    
    ::v-deep .el-card__header {
      padding: 8px 12px;
    }
    ::v-deep .el-card__body {
      padding: 10px 12px;
    }
    
    &.is-selected {
      border-color: var(--primary-color);
      background-color: rgba(0, 243, 255, 0.03);
      box-shadow: 0 4px 12px rgba(0, 243, 255, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-checkbox { font-size: 13px; }
      .view-docs-btn { padding: 4px 8px; font-size: 11px; opacity: 0.7; &:hover { opacity: 1; } }
    }
    
    .card-desc {
      font-size: 12px;
      color: var(--text-color);
      opacity: 0.8;
      min-height: 32px;
      line-height: 1.4;
      
      .meta {
        margin-top: 8px;
        color: #909399;
        font-size: 11px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .deps-list {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
        }
        .size-tag { opacity: 0.6; }
      }
    }
  }

  .code-block {
    background: #1e1e1e;
    color: #9cdcfe;
    padding: 12px;
    border-radius: 4px;
    font-size: 13px;
    font-family: Consolas, monospace;
    margin: 0;
  }

  .inline-code {
    background: rgba(0,0,0,0.1);
    padding: 2px 5px;
    border-radius: 3px;
    color: var(--primary-color);
  }

  .guide-area {
    background: var(--bg-color-soft, rgba(0, 217, 255, 0.03));
    border: 1px dashed var(--primary-color);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 30px;
    position: relative;
    backdrop-filter: blur(4px);

    .guide-header {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .guide-tabs {
      border: 1px solid var(--border-color) !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05) !important;

      .guide-text { color: var(--text-color); font-size: 13px; line-height: 1.8; margin-bottom: 10px; }
    }
  }
}

// 科技模式下进一步强化折叠面板样式
.theme-tech {
  .filter-bar { background: rgba(0, 243, 255, 0.04); border-color: rgba(0, 243, 255, 0.2); }

  .category-collapse {
    ::v-deep .el-collapse-item__header {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 243, 255, 0.2);
    }
    .count-tag {
      background: rgba(0, 243, 255, 0.1) !important;
      border: 1px solid rgba(0, 243, 255, 0.4);
      color: var(--primary-color);
      box-shadow: 0 0 8px rgba(0, 243, 255, 0.2);
    }
  }

  .component-card {
    background: rgba(255, 255, 255, 0.02);
    &.is-selected {
      background: rgba(0, 243, 255, 0.08);
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
    }
    .view-docs-btn { color: var(--primary-color); }
  }

  .guide-area {
    background: rgba(0, 243, 255, 0.03);
    border: 1px dashed rgba(0, 243, 255, 0.4);
    box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.05);
  }

  .guide-tabs {
    background: rgba(0, 0, 0, 0.3) !important;
    border-color: rgba(0, 243, 255, 0.2) !important;

    ::v-deep .el-tabs__header {
      background: rgba(0, 0, 0, 0.2);
      border-bottom-color: rgba(0, 243, 255, 0.2);
    }

    ::v-deep .el-tabs__item {
      color: rgba(255, 255, 255, 0.5);
      border-right-color: rgba(0, 243, 255, 0.1) !important;
      &.is-active {
        color: var(--primary-color);
        background: rgba(0, 243, 255, 0.05) !important;
        text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
      }
    }
    ::v-deep .el-tabs__content {
      background: transparent !important;
    }
  }

  .inline-code {
    background: rgba(0, 243, 255, 0.1);
    color: var(--primary-color);
    border: 1px solid rgba(0, 243, 255, 0.2);
  }
}
</style>
