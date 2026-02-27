export const componentSource = {
  LabTable: `<template>
  <div class="lab-table-container" :class="[themeClass, densityClass]">
    <!-- 工具栏 -->
    <div class="table-toolbar" v-if="showToolbar">
      <div class="left-tools">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="right-tools">
        <el-tooltip content="密度" placement="top">
          <el-dropdown trigger="click" @command="handleDensityChange">
            <el-button :size="size" circle icon="el-icon-s-operation"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="default">默认</el-dropdown-item>
              <el-dropdown-item command="medium">中等</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
              <el-dropdown-item command="mini">超紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        <slot name="toolbar-right"></slot>
      </div>
    </div>

    <!-- 表格本体 -->
    <el-table
      ref="elTable"
      :data="data"
      :size="tableSize"
      v-bind="$attrs"
      v-on="$listeners"
      :class="tableClass"
      header-row-class-name="lab-table-header"
      row-class-name="lab-table-row"
    >
      <slot></slot>
      <template v-for="col in columns">
        <el-table-column
          v-if="!col.hidden"
          :key="col.prop"
          v-bind="col"
        >
          <template v-if="col.slot" v-slot="scope">
            <slot :name="col.slot" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="table-pagination" v-if="pagination">
      <el-pagination
        v-bind="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: null
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    density: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      currentDensity: this.density
    }
  },
  computed: {
    themeClass() {
      return \`theme-\${this.$store.state.theme}\`
    },
    densityClass() {
      return \`density-\${this.currentDensity}\`
    },
    tableSize() {
      // 映射密度到 Element UI 的 size
      const map = {
        default: 'medium',
        medium: 'small',
        small: 'mini',
        mini: 'mini'
      }
      return map[this.currentDensity] || 'small'
    },
    tableClass() {
      return {
        'lab-table': true,
        'lab-table--tech': this.$store.state.theme === 'tech'
      }
    },
    size() {
      return this.currentDensity === 'default' ? 'medium' : 'small'
    }
  },
  methods: {
    handleDensityChange(command) {
      this.currentDensity = command
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-table-container {
  padding: 16px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .table-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

// 科技主题适配
.theme-tech {
  ::v-deep .el-table {
    background-color: transparent;
    color: var(--text-color, #e0e0e0);
    
    th, tr {
      background-color: transparent !important;
    }
    
    // 表头
    th.lab-table-header {
      background: rgba(0, 217, 255, 0.1) !important;
      border-bottom: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
    
    // 单元格边框
    td, th.is-leaf {
      border-bottom: 1px solid rgba(0, 217, 255, 0.1);
    }
    
    // Hover 效果
    .el-table__body tr:hover > td {
      background-color: rgba(0, 217, 255, 0.15) !important;
    }
    
    // 斑马纹等其他覆盖...
    &::before {
      background-color: rgba(0, 217, 255, 0.1);
    }
  }
  
  ::v-deep .el-pagination {
    button, .el-pager li {
      background-color: transparent;
      color: var(--text-color);
      
      &.active {
        color: var(--primary-color);
      }
      
      &:disabled {
        color: #606266;
      }
    }
  }
}
</style>`,
  LabForm: `<template>
  <div class="lab-form-container" :class="themeClass">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :size="size"
    >
      <el-row :gutter="20">
        <template v-for="(item, index) in config.formItems">
          <el-col :span="item.span || 24" :key="index" v-if="!item.hidden">
            <el-form-item :label="item.label" :prop="item.prop">
              
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
                :placeholder="item.attrs && item.attrs.placeholder || '请输入' + item.label"
              ></el-input>

              <!-- 数字输入 -->
              <el-input-number
                v-else-if="item.type === 'number'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              ></el-input-number>

              <!-- 选择器 -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                ></el-option>
              </el-select>

              <!-- 日期选择 -->
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              ></el-date-picker>

              <!-- 开关 -->
              <el-switch
                v-else-if="item.type === 'switch'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              ></el-switch>

              <!-- 单选框 -->
              <el-radio-group
                v-else-if="item.type === 'radio'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              >
                <el-radio
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.value"
                >{{ opt.label }}</el-radio>
              </el-radio-group>

              <!-- 复选框 -->
              <el-checkbox-group
                v-else-if="item.type === 'checkbox'"
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              >
                <el-checkbox
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.value"
                >{{ opt.label }}</el-checkbox>
              </el-checkbox-group>

              <!-- 自定义插槽 -->
              <slot
                v-else-if="item.type === 'slot'"
                :name="item.prop"
                :row="item"
                :form="formData"
              ></slot>

            </el-form-item>
          </el-col>
        </template>
        
        <!-- 按钮操作区 -->
        <el-col :span="24" class="form-actions">
          <el-form-item>
            <slot name="actions" :form="this"></slot>
            <template v-if="!$scopedSlots.actions">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LabForm',
  props: {
    // 表单配置
    config: {
      type: Object,
      required: true,
      default: () => ({ formItems: [] })
    },
    // 表单数据对象
    value: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      formData: { ...this.value }
    }
  },
  computed: {
    themeClass() {
      return \`theme-\${this.$store.state.theme}\`
    },
    rules() {
      const rules = {}
      if (this.config.formItems) {
        this.config.formItems.forEach(item => {
          if (item.rules) {
            rules[item.prop] = item.rules
          }
        })
      }
      return rules
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.formData = { ...val }
      }
    },
    formData: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.elForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.elForm.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-form-container {
  padding: 20px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;

  .form-actions {
    text-align: right;
  }
}

// 科技主题适配
.theme-tech {
  ::v-deep .el-form-item__label {
    color: var(--primary-color);
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    color: var(--text-color);
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
    }
  }
  
  ::v-deep .el-button--default {
    background: transparent;
    border: 1px solid rgba(0, 217, 255, 0.3);
    color: var(--text-color);
    &:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(0, 217, 255, 0.1);
    }
  }
}
</style>`,
  LabChart: `<template>
  <div class="lab-chart-container" :class="themeClass">
    <div ref="chart" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'LabChart',
  props: {
    options: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return \`theme-\${this.theme}\`
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    theme() {
      // 切换主题时重新渲染
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) return
      
      // ECharts 主题设置
      // 简单模拟 tech 主题的一些颜色配置，实际开发通常引入专门的 theme json
      const themeName = this.theme === 'tech' ? 'dark' : undefined
      
      this.chartInstance = echarts.init(this.$refs.chart, themeName)
      this.renderChart()
    },
    renderChart() {
      if (!this.chartInstance) return

      let finalOptions = { ...this.options }
      
      // 针对科技主题的特定样式注入
      if (this.theme === 'tech') {
        finalOptions = this.injectTechStyles(finalOptions)
      }

      this.chartInstance.setOption(finalOptions)
    },
    injectTechStyles(opts) {
      // 简单注入 some 科技风配置
      // 实际应更深度合并
      const techColor = ['#00d9ff', '#00ff9d', '#ffb300', '#ff005c', '#8a2be2']
      
      return {
        backgroundColor: 'transparent', // 保持透明，使用容器背景
        color: techColor,
        ...opts,
        textStyle: {
          color: '#e0e0e0',
          ...opts.textStyle
        }
      }
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-chart-container {
  padding: 16px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;
}

// Tech theme specific overrides if needed
.theme-tech {
  // e.g. add a glow border
  border: 1px solid rgba(0, 217, 255, 0.1);
}
</style>`,
  LabUpload: `<template>
  <div class="lab-upload-container" :class="themeClass">
    <el-upload
      ref="upload"
      class="lab-upload"
      :action="action"
      :multiple="multiple"
      :drag="drag"
      :limit="limit"
      :auto-upload="autoUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      v-bind="$attrs"
    >
      <i v-if="drag" class="el-icon-upload"></i>
      <div v-if="drag" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      
      <el-button v-else size="small" type="primary">点击上传</el-button>
      
      <div slot="tip" class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </el-upload>
    
    <!-- 自定义文件列表展示（可选增强，这里复用 el-upload 的，或者可以覆盖） -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LabUpload',
  props: {
    action: {
      type: String,
      default: '#' // 默认不实际上传，仅演示
    },
    multiple: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: false
    },
    limit: Number,
    autoUpload: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array, //双向绑定文件列表
      default: () => []
    }
  },
  data() {
    return {
      fileList: this.value
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return \`theme-\${this.theme}\`
    }
  },
  watch: {
    value(val) {
      this.fileList = val
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList
      this.$emit('input', fileList)
      this.$emit('change', file, fileList)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('input', fileList)
      this.$emit('remove', file, fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-upload-container {
  padding: 20px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;
}

.theme-tech {
  ::v-deep .el-upload-dragger {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 217, 255, 0.3);
    
    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
    }
    
    .el-icon-upload {
      color: var(--primary-color);
    }
    
    .el-upload__text {
      color: var(--text-color);
      em {
        color: var(--primary-color);
      }
    }
  }
  
  ::v-deep .el-upload-list__item-name {
    color: var(--text-color);
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>`,
  LabTableTransfer: `<template>
  <div class="lab-table-transfer" :class="themeClass">
    <!-- Left Panel -->
    <div class="transfer-panel">
      <div class="panel-header">
        <span class="title">{{ titles[0] || '源列表' }}</span>
        <span class="count">{{ leftSelection.length }}/{{ leftTableData.length }}</span>
      </div>
      <div class="panel-body">
        <div class="filter-input" v-if="filterable">
          <el-input
            v-model="leftQuery"
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            clearable
            size="small"
          />
        </div>
        <el-table
          ref="leftTable"
          :data="filteredLeftData"
          height="100%"
          border
          stripe
          :row-key="rowKey"
          @selection-change="handleLeftSelectionChange"
          class="transfer-table"
        >
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <slot name="left-columns">
            <el-table-column
              v-for="col in columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              v-bind="col"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <slot :name="col.slot || col.prop" :row="row">
                  {{ row[col.prop] }}
                </slot>
              </template>
            </el-table-column>
          </slot>
        </el-table>
      </div>
    </div>

    <!-- Buttons -->
    <div class="transfer-buttons">
      <el-button
        type="primary"
        :disabled="leftSelection.length === 0"
        @click="addToRight"
        icon="el-icon-arrow-right"
        circle
      ></el-button>
      <el-button
        type="primary"
        :disabled="rightSelection.length === 0"
        @click="addToLeft"
        icon="el-icon-arrow-left"
        circle
      ></el-button>
    </div>

    <!-- Right Panel -->
    <div class="transfer-panel">
      <div class="panel-header">
        <span class="title">{{ titles[1] || '已选列表' }}</span>
        <span class="count">{{ rightSelection.length }}/{{ rightTableData.length }}</span>
      </div>
      <div class="panel-body">
        <div class="filter-input" v-if="filterable">
          <el-input
            v-model="rightQuery"
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            clearable
            size="small"
          />
        </div>
        <el-table
          ref="rightTable"
          :data="filteredRightData"
          height="100%"
          border
          stripe
          :row-key="rowKey"
          @selection-change="handleRightSelectionChange"
          class="transfer-table"
        >
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <slot name="right-columns">
            <el-table-column
              v-for="col in columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              v-bind="col"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <slot :name="col.slot || col.prop" :row="row">
                  {{ row[col.prop] }}
                </slot>
              </template>
            </el-table-column>
          </slot>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabTableTransfer',
  props: {
    // 所有源数据
    data: {
      type: Array,
      default: () => []
    },
    // 已选数据的 key 数组 (v-model)
    value: {
      type: Array,
      default: () => []
    },
    // 列定义 [{ label, prop, width... }]
    columns: {
      type: Array,
      default: () => []
    },
    // 标题 ['Source', 'Target']
    titles: {
      type: Array,
      default: () => ['待选', '已选']
    },
    // 唯一键名
    rowKey: {
      type: String,
      default: 'id'
    },
    filterable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      leftSelection: [],
      rightSelection: [],
      leftQuery: '',
      rightQuery: ''
    }
  },
  computed: {
    themeClass() {
      return \`theme-\${this.$store.state.theme}\`
    },
    // 左侧数据：不在 value 中的 items
    leftTableData() {
      return this.data.filter(item => !this.value.includes(item[this.rowKey]))
    },
    // 右侧数据：在 value 中的 items
    rightTableData() {
      return this.data.filter(item => this.value.includes(item[this.rowKey]))
    },
    filteredLeftData() {
      if (!this.leftQuery) return this.leftTableData
      return this.leftTableData.filter(item => this.filterMethod(this.leftQuery, item))
    },
    filteredRightData() {
      if (!this.rightQuery) return this.rightTableData
      return this.rightTableData.filter(item => this.filterMethod(this.rightQuery, item))
    }
  },
  methods: {
    filterMethod(query, item) {
      // 默认搜索逻辑：搜索所有列的值
      return this.columns.some(col => {
        const val = item[col.prop]
        return val && String(val).toLowerCase().includes(query.toLowerCase())
      })
    },
    handleLeftSelectionChange(val) {
      this.leftSelection = val
    },
    handleRightSelectionChange(val) {
      this.rightSelection = val
    },
    addToRight() {
      const newKeys = this.leftSelection.map(item => item[this.rowKey])
      const newValue = [...this.value, ...newKeys]
      this.$emit('input', newValue)
      this.$emit('change', newValue, 'right', newKeys)
      this.leftSelection = []
    },
    addToLeft() {
      const keysToRemove = this.rightSelection.map(item => item[this.rowKey])
      const newValue = this.value.filter(key => !keysToRemove.includes(key))
      this.$emit('input', newValue)
      this.$emit('change', newValue, 'left', keysToRemove)
      this.rightSelection = []
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-table-transfer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  gap: 20px;
  
  .transfer-panel {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: var(--card-bg, #fff);
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    min-width: 300px;

    .panel-header {
      padding: 10px 15px;
      background: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title { font-weight: bold; color: var(--text-color, #303133); }
      .count { font-size: 12px; color: #909399; }
    }

    .panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 10px;
      overflow: hidden;

      .filter-input {
        margin-bottom: 10px;
      }

      .transfer-table {
        flex: 1;
        width: 100%;
        margin: 0;
      }
    }
  }

  .transfer-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .lab-table-transfer {
    flex-direction: column;
    height: auto;
    
    .transfer-panel {
      width: 100%;
      height: 400px;
    }
    
    .transfer-buttons {
      flex-direction: row;
      gap: 20px;
    }
  }
}

.theme-tech {
  .transfer-panel {
    background: rgba(13, 27, 45, 0.6);
    border: 1px solid rgba(0, 243, 255, 0.2);
    
    .panel-header {
      background: rgba(0, 243, 255, 0.1);
      border-bottom: 1px solid rgba(0, 243, 255, 0.2);
      .title { color: var(--primary-color); }
    }
  }
}
</style>`,
  LabQRCode: `<template>
  <div class="lab-qrcode" :class="themeClass">
    <div class="qrcode-wrapper" v-loading="loading">
      <img v-if="imgUrl" :src="imgUrl" :alt="text" :style="{ width: width + 'px', height: width + 'px' }" />
      <div v-else class="placeholder" :style="{ width: width + 'px', height: width + 'px' }">
        <i class="el-icon-picture-outline"></i>
      </div>
    </div>
    <div class="qrcode-text" v-if="showText && text">
      {{ text }}
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'LabQRCode',
  props: {
    text: {
      type: String,
      required: true,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 200
    },
    margin: {
      type: Number,
      default: 4
    },
    colorDark: {
      type: String,
      default: '#000000'
    },
    colorLight: {
      type: String,
      default: '#ffffff'
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgUrl: '',
      loading: false
    }
  },
  computed: {
    themeClass() {
      return \`theme-\${this.$store.state.theme}\`
    },
    finalColorDark() {
      if (this.$store.state.theme === 'tech' && this.colorDark === '#000000') {
        return '#00d9ff'
      }
      return this.colorDark
    },
    finalColorLight() {
      if (this.$store.state.theme === 'tech' && this.colorLight === '#ffffff') {
        return '#00000000'
      }
      return this.colorLight
    }
  },
  watch: {
    text: {
      handler: 'generate',
      immediate: true
    },
    width: 'generate',
    margin: 'generate',
    colorDark: 'generate',
    colorLight: 'generate',
    '$store.state.theme': 'generate'
  },
  methods: {
    async generate() {
      if (!this.text) {
        this.imgUrl = ''
        return
      }
      
      this.loading = true
      try {
        const url = await QRCode.toDataURL(this.text, {
          width: Number(this.width),
          margin: this.margin,
          color: {
            dark: this.finalColorDark,
            light: this.finalColorLight
          },
          errorCorrectionLevel: 'H'
        })
        this.imgUrl = url
      } catch (err) {
        console.error('QR Generate Error:', err)
        this.$message.error('二维码生成失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  .qrcode-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
    
    .placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f7fa;
      color: #909399;
      font-size: 24px;
    }
  }

  .qrcode-text {
    margin-top: 8px;
    font-size: 12px;
    color: #606266;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.theme-tech {
  background: rgba(13, 27, 45, 0.6);
  border: 1px solid rgba(0, 243, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);

  .qrcode-wrapper {
    .placeholder {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-color);
    }
  }

  .qrcode-text {
    color: var(--primary-color);
  }
}
</style>`,
  LabTablePage: `<template>
  <div class="lab-table-page" :class="themeClass">
    <div class="s-o-t-wrap">
      <div class="search-wrap" v-if="showSearch">
        <slot name="searchBar" />
      </div>
      <div class="table-toolbar" v-if="showToolbar">
        <div class="toolbar-left">
          <slot name="toolbar-left" />
        </div>
        <div class="toolbar-right">
          <slot name="toolbar-right" />
        </div>
      </div>
      <div class="table-wrap" ref="tableWrap">
        <el-table
          v-loading="loading || internalLoading"
          ref="elTable"
          :row-key="rowKey"
          :data="displayData"
          border
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-table-column v-if="showIndex" type="index" width="50" align="center" label="#" />
          <el-table-column v-if="showCheckbox" type="selection" width="55" align="center" />
          <el-table-column
            v-for="col in activeColumns"
            :key="col.prop || col.label"
            v-bind="getColumnAttrs(col)"
            :label="col.label"
            :prop="col.prop"
          >
            <template slot-scope="scope">
              <slot v-if="col.slot" :name="col.slot" v-bind="scope" />
              <template v-else>
                {{ scope.row[col.prop] }}
              </template>
            </template>
          </el-table-column>
          <el-table-column v-if="showAction" :fixed="actionFixed" :width="actionWidth" :label="actionLabel" align="center">
            <template slot-scope="scope">
              <slot name="tableAction" :row="scope.row" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-wrap" v-if="showPagination">
      <el-pagination
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
import Sortable from 'sortablejs'

export default {
  name: 'LabTablePage',
  inheritAttrs: false,
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [], required: true },
    queryParam: { type: Object, default: () => ({}) },
    api: { type: Function },
    showSearch: { type: Boolean, default: true },
    showToolbar: { type: Boolean, default: true },
    showPagination: { type: Boolean, default: true },
    showIndex: { type: Boolean, default: true },
    showCheckbox: { type: Boolean, default: true },
    showAction: { type: Boolean, default: true },
    actionLabel: { type: String, default: '操作' },
    actionWidth: { default: 150 },
    actionFixed: { type: String, default: 'right' },
    loading: { type: Boolean, default: false },
    autoLoad: { type: Boolean, default: true },
    enableSortable: { type: Boolean, default: false },
    rowKey: { type: String, default: 'id' }
  },
  data() {
    return {
      localTableData: [],
      internalLoading: false,
      pagination: { total: 0, current: 1, size: 10 },
      sortableInstance: null,
      resizeDetector: null
    }
  },
  computed: {
    themeClass() { return \`theme-\${this.$store.state.theme}\` },
    displayData() { return this.localTableData.length > 0 ? this.localTableData : this.data },
    activeColumns() { return this.columns }
  },
  created() { if (this.autoLoad && this.api) this.fetchData() },
  mounted() {
    if (this.enableSortable) {
      this.$nextTick(() => this.initSortable())
    }
    this.initResizeDetector()
  },
  beforeDestroy() {
    if (this.resizeDetector && this.$refs.tableWrap) {
      this.resizeDetector.uninstall(this.$refs.tableWrap)
    }
    if (this.sortableInstance) {
      this.sortableInstance.destroy()
    }
  },
  methods: {
    async fetchData() {
      if (!this.api) return
      this.internalLoading = true
      try {
        const params = { current: this.pagination.current, size: this.pagination.size, ...this.queryParam }
        const res = await this.api(params)
        if (res.code === 200 || res.code === '200' || res.code === '000000') {
          const data = res.data || {}
          this.localTableData = data.records || data.list || []
          this.pagination.total = data.total || 0
        }
      } finally {
        this.internalLoading = false
      }
    },
    handlePageChange(page) { this.pagination.current = page; this.fetchData() },
    handleSizeChange(size) { this.pagination.size = size; this.pagination.current = 1; this.fetchData() },
    initSortable() {
       const el = this.$refs.elTable?.$el.querySelector('.el-table__header-wrapper tr')
       if (!el) return
       this.sortableInstance = Sortable.create(el, {
         animation: 150,
         onEnd: ({ newIndex, oldIndex }) => {
           this.$emit('column-drop', { newIndex, oldIndex })
         }
       })
    },
    initResizeDetector() {
      this.resizeDetector = elementResizeDetectorMaker()
      this.resizeDetector.listenTo(this.$refs.tableWrap, () => {
        this.$refs.elTable && this.$refs.elTable.doLayout()
      })
    },
    getColumnAttrs(col) {
      const { slot, ...attrs } = col
      return attrs
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-table-page {
  padding: 16px;
  background-color: var(--card-bg, #fff);
  border-radius: 4px;
}
.theme-tech {
  background: rgba(13, 27, 45, 0.7);
  color: #fff;
}
</style>`,
  LabSliceFrame: `<template>
  <div class="lab-slice-frame" :style="frameStyle">
    <div class="lab-slice-frame__content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabSliceFrame',
  props: {
    image: { type: String, required: true },
    slice: { type: [Number, String], default: 20 },
    borderWidth: { type: [Number, String], default: 20 },
    padding: { type: String, default: '16px' },
    repeat: { type: String, default: 'stretch' }
  },
  computed: {
    frameStyle() {
      let bw = typeof this.borderWidth === 'number' ? \`\${this.borderWidth}px\` : this.borderWidth;
      return {
        'border-width': bw,
        'border-style': 'solid',
        'border-image-source': \`url(\${this.image})\`,
        'border-image-slice': \`\${this.slice} fill\`,
        'border-image-repeat': this.repeat
      };
    },
    contentStyle() { return { padding: this.padding }; }
  }
}
</script>

<style lang="scss" scoped>
.lab-slice-frame {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  min-width: 40px;
  min-height: 40px;

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>`,
  LabLogo: `<template>
  <div class="lab-logo">
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <path d="M10 5 V35 H30" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-1" />
      <path d="M40 35 L55 5 L70 35 M45 25 H65" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-2" />
      <path d="M80 35 V5 H95 C105 5 105 15 95 20 C105 20 105 35 95 35 H80" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-3" />
      <circle cx="55" cy="5" r="3" fill="#fff" class="tech-dot" />
      <circle cx="30" cy="35" r="3" fill="#fff" class="tech-dot delay-1" />
      <circle cx="95" cy="20" r="3" fill="#fff" class="tech-dot delay-2" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'LabLogo'
}
</script>

<style lang="scss" scoped>
.lab-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  svg { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
  .letter-path {
    stroke-dasharray: 200;
    stroke-dashoffset: 0;
    animation: draw 3s ease-in-out infinite alternate;
    &.delay-1 { animation-delay: 0s; }
    &.delay-2 { animation-delay: 0.5s; }
    &.delay-3 { animation-delay: 1s; }
  }
  .tech-dot {
    opacity: 0;
    animation: blink 2s ease-in-out infinite;
    &.delay-1 { animation-delay: 0.5s; }
    &.delay-2 { animation-delay: 1s; }
  }
}
@keyframes draw {
  0% { stroke-dashoffset: 200; fill: transparent; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}
@keyframes blink {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>`,
  DocTitle: `<template>
  <div class="doc-title-wrapper" :class="themeClass">
    <div class="title-container">
      <h2 class="doc-title">{{ title }}<span class="tech-bar"></span></h2>
    </div>
    <p class="doc-subtitle" v-if="subtitle">
      <i class="el-icon-caret-right subtitle-icon"></i>{{ subtitle }}
    </p>
    <div class="tech-line"></div>
  </div>
</template>

<script>
export default {
  name: 'DocTitle',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  },
  computed: {
    themeClass() { return \`theme-\${this.$store.state.theme}\` }
  }
}
</script>

<style lang="scss" scoped>
.doc-title-wrapper { margin-bottom: 48px; position: relative; overflow: hidden; padding-bottom: 10px; }
.title-container { position: relative; display: inline-block; margin-bottom: 12px; }
.doc-title {
  font-size: 46px; font-weight: 800; margin: 0; position: relative; z-index: 2;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: -1.5px; line-height: 1.2;
}
.tech-bar {
  position: absolute; bottom: -4px; left: 0; width: 80px; height: 4px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4, transparent);
  border-radius: 2px; overflow: hidden;
  &::after {
    content: ''; position: absolute; top: 0; left: 0; width: 20px; height: 100%;
    background: rgba(255, 255, 255, 0.8); filter: blur(4px); animation: bar-scan 2s linear infinite;
  }
}
.doc-subtitle {
  font-size: 16px; color: var(--text-secondary); line-height: 1.6; max-width: 700px;
  opacity: 0.9; display: flex; align-items: flex-start; gap: 8px; margin-top: 5px;
  .subtitle-icon { color: var(--primary-color); margin-top: 4px; filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4)); }
}
.tech-line {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--primary-color), transparent); opacity: 0.6;
  &::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100px; height: 100%;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    box-shadow: 0 0 10px var(--primary-color); animation: scan-move 4s linear infinite;
  }
}
@keyframes scan-move { 0% { transform: translateX(-100px); } 100% { transform: translateX(1000px); } }
@keyframes bar-scan { 0% { transform: translateX(-25px); } 100% { transform: translateX(85px); } }
</style>`,
  ThemeSwitcher: `<template>
  <div class="theme-switcher">
    <el-switch v-model="isTech" active-text="科技模式" inactive-text="普通模式"
      active-color="#00d9ff" inactive-color="#409EFF" @change="handleThemeChange">
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitcher',
  computed: {
    isTech: {
      get() { return this.$store.state.theme === 'tech' },
      set(val) {}
    }
  },
  methods: {
    handleThemeChange(val) {
      const theme = val ? 'tech' : 'normal'
      this.$store.commit('SET_THEME', theme)
    }
  }
}
</script>`,
  ViewSwitcher: `<template>
  <div class="view-switcher" @click="toggleMode" :title="tooltipText">
    <div class="switch-track" :class="{ 'is-scroll': isScroll }">
      <div class="switch-handle"><i :class="iconClass"></i></div>
    </div>
    <span class="label">{{ labelText }}</span>
  </div>
</template>

<script>
export default {
  name: 'ViewSwitcher',
  computed: {
    isScroll() { return this.$store.state.viewMode === 'scroll' },
    iconClass() { return this.isScroll ? 'el-icon-document' : 'el-icon-monitor' },
    labelText() { return this.isScroll ? '文档视图' : '分页视图' },
    tooltipText() { return this.isScroll ? '点击切换为分页路由模式' : '点击切换为单页滚动模式' }
  },
  methods: {
    toggleMode() { this.$store.dispatch('toggleViewMode') }
  }
}
</script>

<style lang="scss" scoped>
.view-switcher {
  display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;
  font-size: 14px; color: var(--text-secondary); transition: color 0.3s;
  &:hover { color: var(--primary-color); }
  .switch-track {
    width: 40px; height: 20px; background-color: rgba(0,0,0,0.1); border-radius: 10px;
    position: relative; transition: background-color 0.3s; border: 1px solid var(--border-color);
    &.is-scroll {
      background-color: var(--primary-color); border-color: var(--primary-color);
      .switch-handle { transform: translateX(20px); background-color: #fff; color: var(--primary-color); }
    }
    .switch-handle {
      width: 16px; height: 16px; border-radius: 50%; background-color: var(--text-secondary);
      color: #fff; position: absolute; top: 1px; left: 1px; display: flex; align-items: center;
      justify-content: center; transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      i { font-size: 10px; }
    }
  }
}
</style>`,
  CodeDisplay: `<template>
  <div class="code-display" :class="{ 'is-expanded': isExpanded }">
    <div class="demo-block"><slot></slot></div>
    <div class="meta-block" v-if="title || description">
      <div class="demo-title" v-if="title">{{ title }}</div>
      <div class="demo-description" v-if="description">{{ description }}</div>
    </div>
    <div class="demo-actions" :class="{ 'is-fixed': isExpanded }">
       <el-tooltip content="复制全部代码" placement="top"><i class="el-icon-document-copy" @click="copyCode"></i></el-tooltip>
      <el-tooltip :content="isExpanded ? '隐藏代码' : '显示代码'" placement="top">
        <i :class="isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" @click="toggleExpand"></i>
      </el-tooltip>
    </div>
    <el-collapse-transition>
      <div class="source-block" v-show="isExpanded">
        <pre><code class="language-html" ref="codeBlock">{{ code }}</code></pre>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
export default {
  name: 'CodeDisplay',
  props: { title: String, description: String, code: String },
  data() { return { isExpanded: false } },
  watch: { code() { this.$nextTick(() => { this.highlight() }) } },
  mounted() { this.highlight() },
  methods: {
    toggleExpand() { this.isExpanded = !this.isExpanded },
    highlight() { if (this.$refs.codeBlock) { Prism.highlightElement(this.$refs.codeBlock) } },
    copyCode() {
      this.$copyText(this.code).then(() => { this.$message.success('代码已复制') }, () => { this.$message.error('复制失败') })
    }
  }
}
</script>

<style lang="scss" scoped>
.code-display {
  border: 1px solid var(--border-color, #ebeef5); border-radius: 4px;
  background-color: var(--card-bg, #fff); margin-bottom: 24px; transition: all 0.3s;
  &:hover { box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6); }
}
.demo-block { padding: 24px; border-bottom: 1px solid var(--border-color, #ebeef5); }
.meta-block {
  padding: 18px 24px; border-bottom: 1px dashed var(--border-color, #ebeef5);
  .demo-title { font-weight: 500; font-size: 16px; margin-bottom: 6px; }
  .demo-description { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
}
.demo-actions {
  padding: 10px; display: flex; align-items: center; justify-content: flex-end; gap: 16px;
  border-top: 1px solid var(--border-color, #ebeef5); background-color: var(--card-bg);
  i { cursor: pointer; font-size: 16px; color: var(--text-secondary); }
}
.source-block { background-color: #fafafa; border-top: 1px solid var(--border-color, #ebeef5); pre { margin: 0; padding: 18px 24px; font-size: 12px; } }
</style>`,
  LabRichText: `<template>
  <div class="lab-rich-text" :class="themeClass">
    <editor v-model="content" :init="init" :disabled="disabled"></editor>
  </div>
</template>

<script>
// 请确保已安装 npm install tinymce @tinymce/tinymce-vue
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver';

// Core Plugins (Ensure these are imported or available)
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';
import 'tinymce/plugins/link';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/template';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/print';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/help';
import 'tinymce/plugins/emoticons/js/emojis';

// Note: Replace mapState with your store logic if needed
// import { mapState } from 'vuex';

export default {
  name: 'LabRichText',
  components: { Editor },
  props: {
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    height: { type: Number, default: 500 },
    // Theme prop or inject store
    theme: { type: String, default: 'light' }, 
    plugins: {
      type: String,
      default: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize'
    },
    toolbar: {
      type: String,
      default: 'styleselect fontselect fontsizeselect | code undo redo restoredraft | copy cut paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | help'
    }
  },
  data() {
    return {
      content: this.value
    };
  },
  computed: {
    themeClass() {
      return \`theme-\${this.theme}\`;
    },
    init() {
      const isDark = this.theme === 'tech';
      return {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: isDark ? '/tinymce/skins/ui/oxide-dark' : '/tinymce/skins/ui/oxide',
        content_css: isDark ? '/tinymce/skins/content/dark/content.css' : '/tinymce/skins/content/default/content.css',
        height: this.height,
        min_height: this.height,
        max_height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        content_style: isDark ? 'body { color: #e0e0e0; background: #1a1a1a; }' : '',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        branding: false,
        menubar: false,
        resize: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64();
          success(img);
        }
      };
    }
  },
  watch: {
    value(newValue) { if (newValue !== this.content) this.content = newValue; },
    content(newValue) { this.$emit('input', newValue); this.$emit('change', newValue); }
  }
};
</script>

<style lang="scss" scoped>
.lab-rich-text {
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  
  &.theme-tech {
    border: 1px solid rgba(0, 243, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
    // Deep selectors might need adaptation based on project style strategy
    ::v-deep .tox-tinymce { border: none !important; }
    ::v-deep .tox-toolbar__group { background: transparent; }
  }
}
</style>`,
  LabVideo: `<template>
  <div class="lab-video" :class="[themeClass, { 'is-tech-frame': isTechFrame }]">
    <div v-if="displayTechFrame" class="tech-frame-overlay pointer-events-none">
      <div class="tf-corner tf-corner-tl"></div>
      <div class="tf-corner tf-corner-tr"></div>
      <div class="tf-corner tf-corner-bl"></div>
      <div class="tf-corner tf-corner-br"></div>
      <div class="tf-scan-line"></div>
    </div>
    <video-player
      class="lab-video__player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @play="$emit('play', $event)"
      @pause="$emit('pause', $event)"
      @ended="$emit('ended', $event)"
    />
  </div>
</template>

<script>
// npm install video.js vue-video-player
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'LabVideo',
  components: { videoPlayer },
  props: {
    type: { type: String, default: 'video/mp4' },
    src: { type: String, required: true },
    poster: { type: String, default: '' },
    theme: { type: String, default: 'light' },
    isTechFrame: { type: Boolean, default: false },
    aspectRatio: { type: String, default: '16:9' },
    options: { type: Object, default: () => ({}) }
  },
  computed: {
    themeClass() { return \`theme-\${this.theme}\`; },
    displayTechFrame() { return this.theme === 'tech' || this.isTechFrame; },
    playerOptions() {
      return {
        language: 'zh-CN',
        aspectRatio: this.aspectRatio,
        fluid: true,
        sources: [{ type: this.type, src: this.src }],
        poster: this.poster,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        },
        ...this.options
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.lab-video {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #000;
  
  .tech-frame-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none;
    .tf-corner {
      position: absolute; width: 20px; height: 20px;
      border: 2px solid rgba(0, 243, 255, 0.8);
      transition: all 0.3s;
    }
    .tf-corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .tf-corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
    .tf-corner-bl { bottom: 35px; left: 10px; border-right: none; border-top: none; }
    .tf-corner-br { bottom: 35px; right: 10px; border-left: none; border-top: none; }
    .tf-scan-line {
      position: absolute; top: 0; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.5), transparent);
      animation: video-scan 4s linear infinite; opacity: 0.3;
    }
  }
}
@keyframes video-scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
}
.pointer-events-none { pointer-events: none; }
</style>`
}
