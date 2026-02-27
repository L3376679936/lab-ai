<template>
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
        :icon="isMobile ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
        circle
      ></el-button>
      <el-button
        type="primary"
        :disabled="rightSelection.length === 0"
        @click="addToLeft"
        :icon="isMobile ? 'el-icon-arrow-up' : 'el-icon-arrow-left'"
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
    data: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    titles: { type: Array, default: () => ['待选', '已选'] },
    rowKey: { type: String, default: 'id' },
    filterable: { type: Boolean, default: true }
  },
  data() {
    return {
      leftSelection: [],
      rightSelection: [],
      leftQuery: '',
      rightQuery: '',
      isMobile: false
    }
  },
  computed: {
    themeClass() {
      return `theme-${this.$store.state.theme}`
    },
    leftTableData() {
      return this.data.filter(item => !this.value.includes(item[this.rowKey]))
    },
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
  mounted() {
    this.checkIsMobile()
    window.addEventListener('resize', this.checkIsMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIsMobile)
  },
  methods: {
    checkIsMobile() {
      this.isMobile = window.innerWidth < 768
    },
    filterMethod(query, item) {
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
    border-radius: 8px;
    background: var(--card-bg, #fff);
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    min-width: 300px;
    transition: all 0.3s ease;

    .panel-header {
      padding: 12px 15px;
      background: #f8f9fb;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title { font-weight: 600; color: var(--text-color, #303133); }
      .count { font-size: 12px; color: #909399; font-family: monospace; }
    }

    .panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px;
      overflow: hidden;

      .filter-input {
        margin-bottom: 12px;
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
    padding: 0 10px;
    
    .el-button {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 !important;
      font-size: 18px;
      box-shadow: 0 4px 10px rgba(64, 158, 255, 0.2);
      flex-shrink: 0; // 防止挤压
      
      i { font-weight: bold; }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .lab-table-transfer {
    flex-direction: column;
    height: auto;
    gap: 15px;
    
    .transfer-panel {
      width: 100%;
      height: 350px;
      min-width: auto;
    }
    
    .transfer-buttons {
      flex-direction: row;
      padding: 10px 0;
      width: 100%;
      justify-content: center;
      gap: 30px;
    }
  }
}

// 科技主题
.theme-tech {
  .transfer-panel {
    background: rgba(13, 27, 45, 0.4);
    border: 1px solid rgba(0, 243, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
    
    .panel-header {
      background: rgba(0, 243, 255, 0.08);
      border-bottom: 1px solid rgba(0, 243, 255, 0.2);
      .title { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
      .count { color: rgba(0, 243, 255, 0.6); }
    }

    ::v-deep .el-table {
      background-color: transparent !important;
      color: #b0b0b0 !important;
      border: 1px solid rgba(0, 243, 255, 0.1) !important;

      &::before, &::after { display: none; }

      th, td {
        border-bottom: 1px solid rgba(0, 243, 255, 0.1) !important;
        border-right: 1px solid rgba(0, 243, 255, 0.1) !important;
        background-color: transparent !important;
      }
      
      .el-table__header-wrapper th {
        background-color: rgba(0, 243, 255, 0.05) !important;
        color: #00f3ff !important;
      }
      
      .el-table__row--striped td {
        background-color: rgba(0, 243, 255, 0.02) !important;
      }

      tr:hover > td {
        background-color: rgba(0, 243, 255, 0.08) !important;
      }

      // Checkbox 适配
      .el-checkbox__inner {
        background-color: rgba(0, 20, 40, 0.6) !important;
        border-color: rgba(0, 243, 255, 0.4) !important;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #00f3ff !important;
        border-color: #00f3ff !important;
      }
    }
    
    .filter-input ::v-deep .el-input__inner {
      background-color: rgba(0, 243, 255, 0.05) !important;
      border-color: rgba(0, 243, 255, 0.3) !important;
      color: #00f3ff !important;
      &:focus { border-color: #00f3ff !important; box-shadow: 0 0 8px rgba(0, 243, 255, 0.3); }
    }
  }

  .transfer-buttons .el-button {
    background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%) !important;
    border: none !important;
    box-shadow: 0 0 15px rgba(0, 198, 255, 0.4) !important;
    &:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(0, 198, 255, 0.6) !important; }
    &:disabled {
      background: rgba(255, 255, 255, 0.1) !important;
      box-shadow: none !important;
      opacity: 0.5;
    }
  }
}
</style>
