<template>
  <div class="lab-table-page-doc">
    <doc-title title="LabTablePage" subtitle="综合表格页面模板，集成了搜索栏、工具栏、高性能表格和分页器，适用于后台管理系统的主数据展示页面。" />

    <!-- 基础用法 -->
    <code-display 
      title="基础用法" 
      description="集成搜索插槽和表格操作。支持自动获取数据、列显隐控制、刷新和简单的导出逻辑。由于使用了 v-bind='$attrs'，本组件完美支持所有 Element UI Table 的原生属性（如 border, stripe, height 等）。" 
      :code="baseCode"
    >
      <div style="margin-bottom: 10px;">
        <el-switch v-model="tableBorder" active-text="显示边框" inactive-text="隐藏边框" size="small" />
      </div>
      <lab-table-page
        ref="tablePage"
        :columns="columns"
        :api="mockApi"
        :query-param="searchForm"
        :loading.sync="loading"
        :border="tableBorder"
        density="small"
        enable-sortable
        @data-update="handleDataUpdate"
      >
        <!-- 搜索栏插槽 -->
        <template #searchBar>
          <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item label="用户姓名">
              <el-input v-model="searchForm.name" placeholder="输入姓名查询" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
                <el-option label="活跃" value="active" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click="doReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 工具栏左侧插槽 -->
        <template #toolbar-left>
          <el-button type="primary" size="small" icon="el-icon-plus">新增用户</el-button>
          <el-button type="success" size="small" icon="el-icon-check">审核通过</el-button>
          <el-button type="warning" size="small" icon="el-icon-warning-outline">批量降级</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">彻底删除</el-button>
          <el-button type="info" size="small" icon="el-icon-info">查看日志</el-button>
        </template>

        <!-- 自定义列渲染 -->
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="mini">
            {{ row.status === 'active' ? '活跃' : '禁用' }}
          </el-tag>
        </template>

        <!-- 操作列插槽 -->
        <template #tableAction>
          <el-button type="text" size="mini">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" size="mini" style="color: #f56c6c">删除</el-button>
        </template>
      </lab-table-page>
    </code-display>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="160" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>
    <div class="table-tip">
      <i class="el-icon-info"></i> 支持所有 <a href="https://element.eleme.cn/#/zh-CN/component/table#table-attributes" target="_blank">el-table 原生属性</a> (通过 v-bind="$attrs" 透传)。
    </div>

    <h3>组件事件 (Events)</h3>
    <el-table :data="events" border size="small" class="api-table">
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="param" label="参数" />
    </el-table>
    <div class="table-tip">
      <i class="el-icon-info"></i> 支持所有 <a href="https://element.eleme.cn/#/zh-CN/component/table#table-events" target="_blank">el-table 原生事件</a> (通过 v-on="$listeners" 转发)。
    </div>

    <h3>组件方法 (Methods)</h3>
    <el-table :data="methods" border size="small" class="api-table">
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="desc" label="说明" />
    </el-table>

    <h3>插槽 (Slots)</h3>
    <el-table :data="slots" border size="small" class="api-table">
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="desc" label="说明" />
    </el-table>
  </div>
</template>

<script>
import LabTablePage from '@/components/LabTablePage'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabTablePageDoc',
  components: {
    LabTablePage,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      tableBorder: true,
      loading: false,
      searchForm: {
        name: '',
        status: ''
      },
      columns: [
        { label: '日期', prop: 'date', width: '120' },
        { label: '用户ID', prop: 'userId', width: '100' },
        { label: '姓名', prop: 'name', width: '120' },
        { label: '邮箱', prop: 'email' },
        { label: '状态', prop: 'status', slot: 'status', width: '100' },
        { label: '最后登录', prop: 'lastLogin', width: '180' }
      ],
      baseCode: `
<template>
  <lab-table-page
    ref="tablePage"
    :columns="columns"
    :api="mockApi"
    :query-param="searchForm"
  >
    <!-- 1. 搜索区域 -->
    <template #searchBar>
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" />
        </el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
      </el-form>
    </template>

    <!-- 2. 工具栏项 -->
    <template #toolbar-left>
      <el-button type="primary" size="small">新增</el-button>
    </template>

    <!-- 3. 操作列按钮 -->
    <template #tableAction="{ row }">
      <el-button type="text" size="mini">详情</el-button>
    </template>
  </lab-table-page>
</template>

<script>
export default {
  data() {
    return {
      searchForm: { name: '' },
      columns: [
        { label: '日期', prop: 'date', width: '120' },
        { label: '姓名', prop: 'name' },
        { label: '状态', prop: 'status', slot: 'status' }
      ]
    }
  },
  methods: {
    // 异步 API 函数，params 包含分页和搜索参数
    async mockApi(params) {
      return this.$http.get('/api/users', { params })
    },
    doSearch() {
      this.$refs.tablePage.handleSearch()
    }
  }
}
<\/script>
`.trim(),
      attributes: [
        { prop: 'columns', desc: '列配置数组，支持 label, prop, width, slot 等', type: 'Array', default: '[]' },
        { prop: 'api', desc: '异步数据请求函数，需返回 Promise', type: 'Function', default: '-' },
        { prop: 'queryParam', desc: '关联的搜索参数对象', type: 'Object', default: '{}' },
        { prop: 'showSearch', desc: '是否显示搜索栏插槽区域', type: 'Boolean', default: 'true' },
        { prop: 'showToolbar', desc: '是否显示工具栏区域', type: 'Boolean', default: 'true' },
        { prop: 'actionLabel', desc: '操作列的标题文本', type: 'String', default: '操作' },
        { prop: 'actionWidth', desc: '操作列的宽度', type: 'Number/String', default: '150' },
        { prop: 'defaultColumnCount', desc: '默认显示的列数（其余在设置中可勾选）', type: 'Number', default: '8' },
        { prop: 'autoLoad', desc: '组件挂载后是否自动调用 api 获取数据', type: 'Boolean', default: 'true' },
        { prop: 'enableSortable', desc: '是否启用表头拖拽排序功能', type: 'Boolean', default: 'false' }
      ],
      events: [
        { name: 'data-update', desc: '数据加载完成时触发，返回当前的记录数组', param: 'records' },
        { name: 'current-change', desc: '页码切换时触发', param: 'page' },
        { name: 'size-change', desc: '每页条目数切换时触发', param: 'size' },
        { name: 'export', desc: '点击导出按钮且未提供 exportFn 时触发', param: '-' }
      ],
      methods: [
        { name: 'handleSearch()', desc: '手动触发查询逻辑（重置页码为1）' },
        { name: 'handleRefresh()', desc: '刷新当前页数据' },
        { name: 'getTableInstance()', desc: '获取底层的 el-table 实例，用于调用 clearSelection 等原生方法' }
      ],
      slots: [
        { name: 'searchBar', desc: '搜索表单插槽' },
        { name: 'toolbar-left', desc: '工具栏左侧扩展插槽' },
        { name: 'toolbar-right', desc: '工具栏右侧扩展插槽' },
        { name: 'tableAction', desc: '操作列自定义内容插槽' },
        { name: '[col.slot]', desc: '基于 columns 配置生成的动态列插槽' }
      ]
    }
  },
  methods: {
    // 模拟接口调用
    async mockApi(params) {
      console.log('Mock API Request:', params)
      return new Promise(resolve => {
        setTimeout(() => {
          let allList = Array.from({ length: 100 }).map((_, i) => ({
            id: i + 1,
            userId: 'USR-00' + (i + 1),
            date: '2024-01-22',
            name: i % 3 === 0 ? '张三' + i : (i % 3 === 1 ? '李四' + i : '王五' + i),
            email: `user${i+1}@example.com`,
            status: i % 2 === 0 ? 'active' : 'disabled',
            lastLogin: '2024-01-22 10:24:55'
          }))

          // 模拟搜索过滤
          if (params.name) {
            allList = allList.filter(item => item.name.includes(params.name))
          }
          if (params.status) {
            allList = allList.filter(item => item.status === params.status)
          }

          const total = allList.length
          const start = (params.current - 1) * params.size
          const list = allList.slice(start, start + params.size)

          resolve({
            code: 200,
            data: {
              records: list,
              total: total,
              size: params.size,
              current: params.current
            }
          })
        }, 800)
      })
    },
    doSearch() {
      this.$refs.tablePage.handleSearch()
    },
    doReset() {
      this.searchForm = { name: '', status: '' }
      this.$refs.tablePage.handleSearch()
    },
    handleDataUpdate(records) {
      console.log('Loaded data:', records)
    }
  }
}
</script>


