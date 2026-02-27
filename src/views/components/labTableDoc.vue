<template>
  <div class="lab-table-doc">
    <doc-title title="LabTable" subtitle="基于 Element UI Table 的二次封装，支持配置化列、分页、自定义插槽。" />
    
    <code-display 
      title="基础用法" 
      description="通过 columns 配置列，data 配置数据，支持自定义插槽。" 
      :code="codeSnippet"
    >
      <lab-table
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        density="medium"
        @current-change="handlePageChange"
      >
        <template #toolbar-left>
          <el-button type="primary" size="small" icon="el-icon-plus">新增</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
        </template>
        
        <template #status="{ row }">
          <el-tag :type="row.status === 'Active' ? 'success' : 'danger'" size="mini">
            {{ row.status }}
          </el-tag>
        </template>
        
        <template #action="{ row }">
          <el-button type="text" size="mini" @click="$message.info('点击编辑: ' + row.name)">编辑</el-button>
          <el-button type="text" size="mini" style="color: #F56C6C">删除</el-button>
        </template>
      </lab-table>
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
import LabTable from '@/components/LabTable'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabTableDoc',
  components: {
    LabTable,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      codeSnippet: `
<lab-table
  :data="tableData"
  :columns="columns"
  :pagination="pagination"
  density="medium"
  @current-change="handlePageChange"
>
  <template #toolbar-left>
     <el-button type="primary" size="small" icon="el-icon-plus">新增</el-button>
  </template>
  
  <template #status="{ row }">
    <el-tag :type="row.status === 'Active' ? 'success' : 'danger'">
      {{ row.status }}
    </el-tag>
  </template>
  
  <template #action="{ row }">
    <el-button type="text">编辑</el-button>
  </template>
</lab-table>

<script>
export default {
  data() {
    return {
      tableData: [
        { date: '2024-01-01', name: 'Alita', address: 'Hunter Warrior', status: 'Active' },
        // ...
      ],
      columns: [
        { prop: 'date', label: '日期', width: '180', sortable: true },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址' },
        { prop: 'status', label: '状态', width: '100', slot: 'status' },
        { label: '操作', width: '150', slot: 'action', align: 'center' }
      ]
    }
  }
}
<\/script>
`.trim(),
      tableData: [
        { date: '2024-01-01', name: 'Alita', address: 'Hunter Warrior', status: 'Active' },
        { date: '2024-01-02', name: 'Major', address: 'Section 9', status: 'Active' },
        { date: '2024-01-03', name: 'K', address: 'Blade Runner', status: 'Inactive' },
        { date: '2024-01-04', name: 'T-800', address: 'Cyberdyne Systems', status: 'Inactive' },
        { date: '2024-01-05', name: 'Neo', address: 'The Matrix', status: 'Active' },
      ],
      columns: [
        { prop: 'date', label: '日期', width: '180', sortable: true },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址' },
        { prop: 'status', label: '状态', width: '100', slot: 'status' },
        { label: '操作', width: '150', slot: 'action', align: 'center' }
      ],
      pagination: {
        total: 100,
        pageSize: 10,
        currentPage: 1,
        layout: 'total, prev, pager, next'
      },
      attributes: [
        { prop: 'data', desc: '显示的数据', type: 'Array', default: '[]' },
        { prop: 'columns', desc: '列配置数组 (prop, label, width, slot...)', type: 'Array', default: '[]' },
        { prop: 'pagination', desc: '分页配置 (total, pageSize, currentPage)', type: 'Object', default: '-' },
        { prop: 'density', desc: '表格密度 (small / medium / large)', type: 'String', default: 'medium' },
        { prop: 'loading', desc: '是否显示加载中', type: 'Boolean', default: 'false' },
      ],
      events: [
        { name: 'current-change', desc: '页码改变时触发', param: 'currentPage' },
        { name: 'size-change', desc: '每页条数改变时触发', param: 'pageSize' }
      ]
    }
  },
  methods: {
    handlePageChange(page) {
      this.$message.success(`切换到第 ${page} 页`)
    }
  }
}
</script>


