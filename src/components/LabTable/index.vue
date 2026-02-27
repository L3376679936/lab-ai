<template>
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
      return `theme-${this.$store.state.theme}`
    },
    densityClass() {
      return `density-${this.currentDensity}`
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
</style>
