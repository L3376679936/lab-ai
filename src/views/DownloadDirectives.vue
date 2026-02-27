<template>
  <div class="download-directives-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>自定义指令下载 / 配置管理</h2>
        <p>勾选需要的指令，一键生成包含注册逻辑的 directives 文件夹。</p>
      </div>

      <div class="filter-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索指令 (如: copy, debounce)..."
          prefix-icon="el-icon-search"
          style="width: 320px; margin-right: 20px;"
        ></el-input>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选本页</el-checkbox>
        
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-box" 
            v-if="selectedKeys.length > 0"
            @click="handleDownloadPackage"
            style="margin-right: 15px;"
          >
            生成并下载安装包
          </el-button>
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImportConfig"
            accept=".json"
            style="display: inline-block; margin-right: 10px;"
          >
            <el-button type="info" size="small" icon="el-icon-upload2" plain>导入本地配置</el-button>
          </el-upload>
          <el-button type="info" size="small" icon="el-icon-share" plain @click="handleExportConfig">导出当前配置</el-button>
        </div>
      </div>

      <!-- 引导区域 -->
      <div class="guide-area" v-if="selectedKeys.length > 0">
        <div class="guide-header">
          <i class="el-icon-magic-stick"></i>
          <span>集成引导 (已勾选 {{ selectedKeys.length }} 项)</span>
        </div>
        <el-tabs type="border-card" class="guide-tabs">
          <el-tab-pane label="1. 放置目录">
            <p class="guide-text">将下载得到的 <code class="inline-code">directives</code> 文件夹整体放入项目的 <code class="inline-code">src</code> 目录下。</p>
          </el-tab-pane>
          <el-tab-pane label="2. 全局注册">
            <p class="guide-text">在 <code class="inline-code">main.js</code> 中引入并安装：</p>
            <p class="guide-text"><pre class="code-block">import LabDirectives from './directives'
Vue.use(LabDirectives)</pre></p>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 指令列表 -->
      <el-row :gutter="20" class="directive-list">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in filteredDirectives" :key="item.key">
          <el-card 
            shadow="hover" 
            class="directive-card" 
            :class="{ 'is-active': selectedKeys.includes(item.key) }"
            @click.native="toggleSelection(item.key)"
          >
            <div class="card-top">
              <el-checkbox :value="selectedKeys.includes(item.key)" @change="toggleSelection(item.key)"></el-checkbox>
              <span class="directive-name">v-{{ item.key }}</span>
            </div>
            <div class="card-body">
              <p class="desc">{{ item.description }}</p>
              <div class="meta">
                <el-tag size="mini" type="info" effect="plain">{{ item.size }}</el-tag>
                <el-button type="text" size="mini" @click.stop="viewDocs(item.key)">查看说明</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { directiveSource } from '@/utils/directive-source'
import { componentUsage } from '@/utils/component-usage'


export default {
  name: 'DownloadDirectives',
  data() {
    return {
      searchQuery: '',
      checkAll: false,
      selectedKeys: [],
      directiveList: [
        { key: 'copy', name: 'v-copy', description: '一键复制文本到剪贴板，支持回调与回显。', size: '1.2KB' },
        { key: 'debounce', name: 'v-debounce', description: '防抖指令，控制高频事件触发频率。', size: '0.8KB' },
        { key: 'throttle', name: 'v-throttle', description: '节流指令，在规定时间内只执行一次。', size: '0.8KB' },
        { key: 'ellipsis', name: 'v-ellipsis', description: '自动文本省略，悬浮显示 Tooltip 详情。', size: '2.1KB' },
        { key: 'waterMarker', name: 'v-waterMarker', description: '为元素添加自定义文本水印背景。', size: '1.5KB' },
        { key: 'waves', name: 'v-waves', description: 'Material 风格的水波纹点击视觉效果。', size: '2.4KB' },
        { key: 'clickOutside', name: 'v-clickOutside', description: '响应元素外部点击事件，常用于关闭浮层。', size: '1.1KB' },
        { key: 'lazyload', name: 'v-lazyload', description: '图片懒加载，支持自定义加载占位图。', size: '1.3KB' },
        { key: 'hotkey', name: 'v-hotkey', description: '键盘热键绑定指令，支持组合键触发。', size: '1.5KB' },
        { key: 'progressiveImg', name: 'v-progressive-img', description: '渐进式图片加载，提供起模糊到清晰的平滑过渡效果。', size: '1.4KB' }
      ]
    }
  },
  computed: {
    filteredDirectives() {
      if (!this.searchQuery) return this.directiveList
      const q = this.searchQuery.toLowerCase()
      return this.directiveList.filter(item => 
        item.key.toLowerCase().includes(q) || 
        item.description.includes(q)
      )
    }
  },
  methods: {
    toggleSelection(key) {
      const idx = this.selectedKeys.indexOf(key)
      if (idx > -1) {
        this.selectedKeys.splice(idx, 1)
      } else {
        this.selectedKeys.push(key)
      }
    },
    handleCheckAllChange(val) {
      if (val) {
        const pageKeys = this.filteredDirectives.map(d => d.key)
        this.selectedKeys = Array.from(new Set([...this.selectedKeys, ...pageKeys]))
      } else {
        const pageKeys = this.filteredDirectives.map(d => d.key)
        this.selectedKeys = this.selectedKeys.filter(k => !pageKeys.includes(k))
      }
    },
    handleDownloadPackage() {
      if (this.selectedKeys.length === 0) {
        return this.$message.warning('请先选择需要下载的指令')
      }
      this.generateZip()
    },
    async generateZip() {
      const loading = this.$loading({ text: '正在打包指令源码...' })
      try {
        const zip = new JSZip()
        const folder = zip.folder("directives")
        
        const importLines = []
        const registerLines = []

        this.selectedKeys.forEach(key => {
          const code = directiveSource[key]
          if (code) {
            folder.file(`${key}.js`, code)
            importLines.push(`import ${key} from './${key}'`)
            registerLines.push(`  Vue.directive('${key}', ${key})`)
          }
        })

        // 生成 index.js
        const indexJs = `/**
 * 指令库快速注册文件
 * 由 Lab-AI 自动化生成
 */
${importLines.join('\n')}

export default {
  install(Vue) {
${registerLines.join('\n')}
  }
}
`
        folder.file('index.js', indexJs)

        // 生成 README.md
        const readme = `# Lab-AI 自定义指令包
已下载指令：${this.selectedKeys.join(', ')}

## 使用说明
1. 将本文件夹（directives）放入项目的 \`src\` 文件夹下。
2. 在 \`main.js\` 中全局引用：
   \`\`\`javascript
   import Directives from './directives'
   Vue.use(Directives)
   \`\`\`

## 详细指令使用文档
${this.getUsageContent()}
`
        folder.file('README.md', readme)

        // 生成配置备份
        const configJson = JSON.stringify({
          type: 'lab-directives-config',
          version: '1.0',
          selected: this.selectedKeys,
          date: new Date().toLocaleString()
        }, null, 2)
        folder.file('config.json', configJson)

        const blob = await zip.generateAsync({ type: 'blob' })
        saveAs(blob, `lab-directives-${Date.now()}.zip`)
        this.$message.success('指令安装包已生成并开始下载')
      } catch (e) {
        console.error(e)
        this.$message.error('打包过程中出错')
      } finally {
        loading.close()
      }
    },
    handleExportConfig() {
      if (this.selectedKeys.length === 0) {
        return this.$message.warning('当前没有任何筛选，无需导出配置')
      }
      const data = JSON.stringify({ selected: this.selectedKeys }, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      saveAs(blob, 'directives-config.json')
    },
    handleImportConfig(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result)
          if (config.selected && Array.isArray(config.selected)) {
            this.selectedKeys = config.selected
            this.$message.success('配置已恢复')
          }
        } catch (err) {
          this.$message.error('无效的配置文件')
        }
      }
      reader.readAsText(file.raw)
    },
    viewDocs(key) {
      const viewMode = this.$store.state.viewMode
      if (viewMode === 'router') {
        this.$router.push(`/components/directives#${key}`).catch(() => {})
      } else {
        const element = document.getElementById(key)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          // Fallback to directive documentation section
          const dirSection = document.getElementById('ldirective-section')
          if (dirSection) dirSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    },
    getUsageContent() {
      const parts = []
      this.selectedKeys.forEach(key => {
        // Construct the expected key in componentUsage (e.g. 'copy' -> 'v-copy')
        // Try both raw key and v-prefixed key just in case
        const vKey = 'v-' + key
        // Direct mapping logic based on our known keys
        let usage = componentUsage[vKey] || componentUsage[key]
        
        if (usage) {
          parts.push(usage)
        }
      })
      
      if (parts.length === 0) return '暂无详细文档'
      return parts.join('\n\n---\n')
    },

  }
}
</script>

<style lang="scss" scoped>
.download-directives-page {
  padding-bottom: 50px;

  h2 { margin: 0 0 10px; color: var(--text-color); }
  p { margin: 0; color: var(--text-secondary); font-size: 14px; }

  .filter-bar {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    background: var(--bg-color-soft, rgba(0, 0, 0, 0.02));
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .action-buttons { margin-left: auto; }
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

      .guide-text { color: var(--text-color); font-size: 13px; line-height: 1.8; }
    }

    .download-trigger {
      position: absolute;
      right: 20px;
      top: 15px;
    }
  }

  .directive-list {
    .directive-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid var(--border-color);

      &.is-active {
        border-color: var(--primary-color);
        background: rgba(0, 217, 255, 0.02);
        box-shadow: 0 4px 12px rgba(0, 217, 255, 0.1);
      }

      .card-top {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        .directive-name { font-weight: bold; color: var(--primary-color); }
      }

      .card-body {
        .desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; height: 38px; overflow: hidden; }
        .meta {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-button--text { padding: 4px 10px; font-size: 11px; }
        }
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
  }

  .inline-code {
    background: rgba(0,0,0,0.1);
    padding: 2px 5px;
    border-radius: 3px;
    color: var(--primary-color);
  }
}

.theme-tech {
  .download-directives-page {
    .filter-bar { background: rgba(0, 243, 255, 0.04); border-color: rgba(0, 243, 255, 0.2); }
    
    .guide-area {
      background: rgba(0, 243, 255, 0.03);
      border: 1px dashed rgba(0, 243, 255, 0.4);
    }

    .guide-tabs {
      background: rgba(0, 0, 0, 0.3) !important;
      border-color: rgba(0, 243, 255, 0.2) !important;
      ::v-deep .el-tabs__header { background: rgba(0, 0, 0, 0.2); border-bottom-color: rgba(0, 243, 255, 0.2); }
      ::v-deep .el-tabs__item {
        color: rgba(255, 255, 255, 0.5);
        &.is-active { color: var(--primary-color); background: rgba(0, 243, 255, 0.05) !important; }
      }
    }

    .directive-card {
      background: rgba(255, 255, 255, 0.02);
      &.is-active {
        background: rgba(0, 217, 255, 0.08);
        box-shadow: 0 0 15px rgba(0, 217, 255, 0.2);
      }
      .el-tag {
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.3);
        color: var(--primary-color);
      }
      .el-button--text { color: var(--primary-color); }
    }

    .inline-code {
      background: rgba(0, 243, 255, 0.1);
      color: var(--primary-color);
      border: 1px solid rgba(0, 243, 255, 0.2);
    }
  }
}
</style>
