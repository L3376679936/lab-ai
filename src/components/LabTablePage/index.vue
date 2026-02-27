<template>
  <div class="lab-table-page" :class="themeClass">
    <!-- 顶部布局容器：包含搜索栏和工具栏 -->
    <div class="s-o-t-wrap">
      
      <!-- 1. 搜索查询区：通过 slot 自定义表单项 -->
      <div class="search-wrap" v-if="showSearch">
        <slot name="searchBar" />
      </div>

      <!-- 2. 工具栏区：放置按钮、操作等 -->
      <div class="table-toolbar" v-if="showToolbar">
        <div class="toolbar-left">
          <slot name="toolbar-left" />
        </div>
        <div class="toolbar-right">
          <slot name="toolbar-right" />
        </div>
      </div>

      <!-- 3. 表格主体区：包含 el-table 本身 -->
      <div class="table-wrap" ref="tableWrap">
        <el-table
          v-loading="loading || internalLoading"
          ref="elTable"
          :row-key="rowKey"
          :data="displayData"
          :summary-method="summaryMethod"
          :show-summary="showSummary"
          :stripe="stripe"
          border
          v-bind="$attrs"
          header-row-class-name="lab-table-page-header"
          cell-class-name="lab-table-page-cell"
          :row-class-name="rowClassName"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @cell-click="handleCellClick"
          @header-dragend="handleHeaderDragend"
          v-on="$listeners"
        >
          <!-- 3.1 预设列：序号 -->
          <el-table-column
            v-if="showIndex"
            type="index"
            width="50"
            align="center"
            label="#"
          />
          
          <!-- 3.2 预设列：多选框 -->
          <el-table-column
            v-if="showCheckbox"
            type="selection"
            width="55"
            align="center"
          />

          <!-- 3.3 动态数据列：根据 columns 属性生成 -->
          <el-table-column
            v-for="col in activeColumns"
            :key="col.prop || col.value || col.label"
            v-bind="getColumnAttrs(col)"
            :label="col.name || col.label"
            :prop="col.value || col.prop"
            :sortable="col.noSort ? false : 'custom'"
            :sort-by="col.sortBy || col.value || col.prop"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 支持自定义插槽渲染 -->
              <slot v-if="col.slot" :name="col.slot" v-bind="scope" />

              <!-- 提供几种常用的内置类型 -->
              <template v-else>
                <!-- 链接按钮：通常用于点击弹出详情 -->
                <el-button
                  class="cell-link"
                  v-if="col.type === 'link'"
                  type="text"
                  size="small"
                  @click="col.clickFn && col.clickFn(scope.row)"
                >
                  {{ formatCellValue(scope.row, col) }}
                </el-button>
                
                <!-- 行内输入框：用于快速编辑 -->
                <el-input
                  v-else-if="col.type === 'input'"
                  v-model="scope.row[col.value || col.prop]"
                  size="mini"
                />
                
                <!-- 文件下载链接 -->
                <a
                  v-else-if="col.type === 'aLink'"
                  :href="scope.row[col.url]"
                  :download="scope.row[col.value || col.prop]"
                  class="cell-alink"
                >
                  {{ scope.row[col.value || col.prop] }}
                </a>
                
                <!-- 默认文本展示 -->
                <template v-else>
                  {{ formatCellValue(scope.row, col) }}
                </template>
              </template>
            </template>
          </el-table-column>

          <!-- 3.4 操作列：放置编辑、删除等按钮 -->
          <el-table-column
            v-if="showAction"
            :fixed="actionFixed"
            :width="actionWidth"
            :label="actionLabel"
            align="center"
          >
            <template slot-scope="scope">
              <slot name="tableAction" :row="scope.row" />
            </template>
          </el-table-column>

          <!-- 3.5 设置列：控制列显隐的齿轮按钮 -->
          <el-table-column width="40" :fixed="actionFixed" v-if="showColumnSetting">
            <template slot="header">
              <el-popover
                placement="bottom"
                width="150"
                trigger="click"
                popper-class="lab-column-setting-popover"
              >
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-setting"
                  class="setting-icon-btn"
                />
                <div class="setting-title">显示列设置</div>
                <el-scrollbar wrap-class="setting-scroll-wrap" style="max-height: 300px;">
                  <el-checkbox-group v-model="visibleColumnNames" :min="1">
                    <el-checkbox
                      v-for="name in allColumnNames"
                      :label="name"
                      :key="name"
                      class="setting-item"
                    >
                      {{ name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 4. 分页器：集成刷新与导出快捷入口 -->
    <div class="pagination-wrap" v-if="showPagination">
      <el-pagination
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper, slot"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
        <!-- 分页中间/右侧的自定义操作区 -->
        <div class="pagination-actions">
          <el-tooltip content="刷新数据" placement="top">
            <i class="el-icon-refresh action-icon" @click="handleRefresh" />
          </el-tooltip>
          <template v-if="showExport">
            <span class="divider"></span>
            <el-tooltip content="导出当前页Excel" placement="top">
              <i class="el-icon-download action-icon" @click="handleExport" />
            </el-tooltip>
          </template>
        </div>
      </el-pagination>
    </div>
  </div>
</template>

<script>
/**
 * LabTablePage 综合表格页面组件
 * @description 集成了搜索、工具栏、高性能表格和分页的“一站式”页面模板。
 * 
 * @property {Array} data 外部静态数据（若不提供 api 则显示此数据）
 * @property {Array} columns 列配置项：{ label, prop, slot, type, width, ... }
 * @property {Function} api 数据获取接口，需返回 Promise
 * @property {Object} queryParam 搜索表单关联对象
 * @property {Boolean} showSearch 是否显示搜索区域插槽
 */
import elementResizeDetectorMaker from 'element-resize-detector'
import Sortable from 'sortablejs'

export default {
  name: 'LabTablePage',
  // 禁止属性透传到根节点，手动绑定到 el-table
  inheritAttrs: false,
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [], required: true },
    queryParam: { type: Object, default: () => ({}) },
    api: { type: Function },
    exportFn: { type: Function },
    showSearch: { type: Boolean, default: true },
    showToolbar: { type: Boolean, default: true },
    showPagination: { type: Boolean, default: true },
    showIndex: { type: Boolean, default: true },
    showCheckbox: { type: Boolean, default: true },
    showAction: { type: Boolean, default: true },
    actionLabel: { type: String, default: '操作' },
    actionWidth: { default: 150 },
    actionFixed: { type: String, default: 'right' },
    showColumnSetting: { type: Boolean, default: true },
    showExport: { type: Boolean, default: true },
    stripe: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    defaultColumnCount: { type: Number, default: 8 },
    summaryMethod: { type: Function },
    showSummary: { type: Boolean, default: false },
    pageSizes: { type: Array, default: () => [10, 20, 30, 50, 100] },
    autoLoad: { type: Boolean, default: true },
    enableSortable: { type: Boolean, default: false },
    rowKey: { type: String, default: 'id' },
    rowClassName: { type: [Function, String] },
    spanMethod: { type: Function }
  },
  data() {
    return {
      localColumns: [],
      localTableData: [],
      internalLoading: false,
      visibleColumnNames: [],
      allColumnNames: [],
      pagination: { total: 0, current: 1, size: 10 },
      sortableInstance: null,
      resizeDetector: null
    }
  },
  computed: {
    themeClass() {
      return `theme-${this.$store.state.theme}`
    },
    // 数据优先级：接口数据 > 外部 data
    displayData() {
      return this.localTableData.length > 0 ? this.localTableData : this.data
    },
    // 当前勾选可见的列
    activeColumns() {
      return this.localColumns.filter(col => this.visibleColumnNames.includes(col.label || col.name))
    }
  },
  watch: {
    // 监听列配置变化并初始化
    columns: {
      immediate: true,
      handler(val) {
        this.initColumns(val)
      }
    }
  },
  created() {
    if (this.autoLoad && this.api) {
      this.fetchData()
    }
  },
  mounted() {
    // 初始化拖拽排序（如果启用）
    if (this.enableSortable) {
      this.$nextTick(() => this.initSortable())
    }
    // 启动容器大小监听，防止表格宽度展示不全
    this.initResizeDetector()
  },
  beforeDestroy() {
    // 销毁监听器防止内存泄漏
    if (this.resizeDetector && this.$refs.tableWrap) {
      this.resizeDetector.uninstall(this.$refs.tableWrap)
    }
    if (this.sortableInstance) {
      this.sortableInstance.destroy()
    }
  },
  methods: {
    /**
     * 初始化列数据，设置默认可见列
     */
    initColumns(cols) {
      this.localColumns = JSON.parse(JSON.stringify(cols))
      this.allColumnNames = this.localColumns.map(col => col.label || col.name)
      // 根据默认列数进行截断显示
      this.visibleColumnNames = this.allColumnNames.slice(0, this.defaultColumnCount)
    },

    /**
     * 格式化单元格显示文本
     */
    formatCellValue(row, col) {
      if (typeof col.formatter === 'function') {
        return col.formatter(row, col)
      }
      return row[col.prop || col.value]
    },

    /**
     * 核心接口请求方法
     */
    async fetchData() {
      if (!this.api) return
      
      this.internalLoading = true
      this.$emit('update:loading', true)

      try {
        const params = {
          current: this.pagination.current,
          size: this.pagination.size,
          ...this.queryParam
        }
        const res = await this.api(params)
        
        // 兼容不同的后端返回码和结构
        if (res.code === '000000' || res.code === 200 || res.code === '200') {
          const data = res.data || {}
          const records = data.records || data.list || []
          this.localTableData = records
          this.pagination.total = data.total || 0
          this.$emit('data-update', records)
        } else {
          this.$message.error(res.message || res.msg || '数据查询失败')
        }
      } catch (error) {
        console.error('FetchData Exception:', error)
        this.$message.error('接口请求异常，请检查控制台')
      } finally {
        this.internalLoading = false
        this.$emit('update:loading', false)
      }
    },

    /**
     * 暴露给父组件的主动查询方法
     */
    handleSearch() {
      this.pagination.current = 1
      this.fetchData()
    },

    /**
     * 刷新当前页
     */
    handleRefresh() {
      this.fetchData()
    },

    /**
     * 页码变化回调
     */
    handlePageChange(page) {
      this.pagination.current = page
      this.fetchData()
      this.$emit('current-change', page)
    },

    /**
     * 每页条数变化回调
     */
    handleSizeChange(size) {
      this.pagination.size = size
      this.pagination.current = 1
      this.fetchData()
      this.$emit('size-change', size)
    },

    handleSortChange(sort) { this.$emit('sort-change', sort) },
    handleSelectionChange(val) { this.$emit('selection-change', val) },
    handleCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },

    /**
     * 集成导出逻辑
     */
    handleExport() {
      if (this.exportFn) {
        this.exportFn()
      } else {
        this.$emit('export')
      }
    },

    /**
     * 初始化表头拖拽逻辑
     */
    initSortable() {
      const el = this.$refs.elTable?.$el.querySelector('.el-table__header-wrapper tr')
      if (!el) return
      
      this.sortableInstance = Sortable.create(el, {
        animation: 150,
        ghostClass: 'lab-table-page-ghost',
        onEnd: ({ newIndex, oldIndex }) => {
          // 处理序号和勾选框导致的索引偏移
          const offset = (this.showIndex ? 1 : 0) + (this.showCheckbox ? 1 : 0)
          const adjustedOld = oldIndex - offset
          const adjustedNew = newIndex - offset
          
          if (adjustedOld >= 0 && adjustedNew >= 0) {
            const targetCol = this.localColumns.splice(adjustedOld, 1)[0]
            this.localColumns.splice(adjustedNew, 0, targetCol)
          }
        }
      })
    },

    /**
     * 初始化容器尺寸监听，确保 el-table 能够实时调整布局
     */
    initResizeDetector() {
      this.resizeDetector = elementResizeDetectorMaker()
      this.resizeDetector.listenTo(this.$refs.tableWrap, () => {
        this.$refs.elTable && this.$refs.elTable.doLayout()
      })
    },

    /**
     * 手动拖拽表头调整列宽后的修正逻辑
     * 解决 Element UI 在有固定列时，缩小非固定列可能导致的空白列(gutter)展示不全问题
     */
    handleHeaderDragend() {
      this.$nextTick(() => {
        if (this.$refs.elTable) {
          this.$refs.elTable.doLayout()
        }
      })
    },

    /**
     * 安全地过滤并返回列属性，避免 slot 属性引起渲染冲突
     */
    getColumnAttrs(col) {
      const { slot, type, clickFn, clickable, ...attrs } = col
      // 仅保留 Element UI Table 原生支持的列类型
      if (['selection', 'index', 'expand'].includes(type)) {
        attrs.type = type
      }
      return attrs
    },

    /**
     * 暴露内部 el-table 实例
     * 允许父组件通过 this.$refs.xx.getTableInstance() 调用原生方法（如 clearSelection）
     */
    getTableInstance() {
      return this.$refs.elTable
    }
  }
}
</script>

<style lang="scss" scoped>
/* 组件样式定义 */
.lab-table-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: var(--card-bg, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  .search-wrap {
    background-color: var(--bg-color-soft, #f8f9fa);
    padding: 16px 20px 4px;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px solid var(--border-color-light, #ebeef5);
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .toolbar-left, .toolbar-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .table-wrap {
    flex: 1;
    overflow: hidden;
    overflow-x: auto; // Enable horizontal scroll on mobile
    position: relative;
    border: 1px solid var(--border-color-light, #ebeef5);
    border-radius: 4px;
  }

  .pagination-wrap {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    position: relative;
    
    .pagination-actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);

      .action-icon {
        cursor: pointer;
        font-size: 18px;
        transition: color 0.3s;
        
        &:hover { color: var(--primary-color); }
      }

      .divider {
        width: 1px;
        height: 14px;
        background-color: var(--border-color-light, #ebeef5);
      }
    }
  }

  /* 单元格特殊样式 */
  .cell-link { color: var(--primary-color); padding: 0; }
  .cell-alink {
    color: var(--primary-color);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  .setting-icon-btn {
    padding: 0;
    font-size: 18px;
    color: var(--text-secondary);
  }
}

/* 科技模式样式增强 */
.theme-tech {
  background: var(--card-bg-tech, rgba(13, 27, 45, 0.7));
  border: 1px solid rgba(0, 217, 255, 0.3);
  backdrop-filter: blur(10px);
  color: #fff;

  .search-wrap {
    background: rgba(0, 217, 255, 0.1);
    border-color: rgba(0, 217, 255, 0.2);
  }

  .table-wrap {
    border-color: rgba(0, 217, 255, 0.2);
  }

  ::v-deep .el-table {
    background: transparent;
    color: #e0e0e0;

    th.lab-table-page-header {
      background: rgba(0, 217, 255, 0.15) !important;
      color: #00d9ff;
      border-bottom: 1px solid rgba(0, 217, 255, 0.3);
    }
    
    tr, td { background: transparent !important; border-bottom: 1px solid rgba(0, 217, 255, 0.1); }
    &::before { background-color: rgba(0, 217, 255, 0.2); }

    .el-table__body tr:hover > td {
      background-color: rgba(0, 217, 255, 0.1) !important;
    }
  }

  ::v-deep .el-pagination {
    color: #e0e0e0 !important;
    button, .el-pager li {
      background: transparent !important;
      color: #e0e0e0 !important;
      &.active { color: #00d9ff !important; }
    }
  }
}

/* 列显隐弹窗内部样式 */
::v-deep .lab-column-setting-popover {
  padding: 12px;
  .setting-title {
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color-light);
  }
  .setting-item { display: block; margin-bottom: 8px; margin-right: 0; }
  .setting-scroll-wrap { padding-right: 10px; }
}

/* 拖拽中的节点占位符 */
.lab-table-page-ghost { opacity: 0.5; background: var(--primary-color-light) !important; }
</style>
