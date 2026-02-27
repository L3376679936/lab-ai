<template>
  <div class="lab-table-transfer-doc">
    <doc-title title="LabTableTransfer" subtitle="基于表格的高级穿梭框，适用于大批量数据选择与两栏对比场景。" />

    <code-display
      title="基础用法"
      description="支持自定义列、搜索过滤和双向移动。左侧为源数据，右侧为已选数据。"
      :code="baseCode"
    >
      <lab-table-transfer
        v-model="selectedIds"
        :data="sourceData"
        :columns="columns"
        :titles="['待选人员', '已选人员']"
        row-key="id"
        filterable
      >
        <!-- 自定义列插槽 -->
        <template #role="{ row }">
          <el-tag size="mini" :type="row.role === 'Admin' ? 'danger' : 'info'">{{ row.role }}</el-tag>
        </template>
      </lab-table-transfer>
      
      <div style="margin-top: 20px;">
        <span class="demonstration">当前选中 ID: </span>
        <el-tag v-for="id in selectedIds" :key="id" size="small" style="margin-right: 5px;">{{ id }}</el-tag>
      </div>
    </code-display>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="150" />
    </el-table>

    <h3>组件事件 (Events)</h3>
    <el-table :data="events" border size="small" class="api-table">
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="param" label="参数" />
    </el-table>
  </div>
</template>

<script>
import LabTableTransfer from '@/components/LabTableTransfer'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabTableTransferDoc',
  components: {
    LabTableTransfer,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      selectedIds: [2],
      columns: [
        { label: '姓名', prop: 'name', width: '120' },
        { label: '角色', prop: 'role', slot: 'role', width: '100' },
        { label: '部门', prop: 'dept' }
      ],
      sourceData: Array.from({ length: 15 }).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        role: i % 5 === 0 ? 'Admin' : 'User',
        dept: `研发部-${i % 3 + 1}`
      })),
      attributes: [
        { prop: 'data', desc: '源数据数组', type: 'Array', default: '[]' },
        { prop: 'value / v-model', desc: '绑定值（已选数据的 Key 数组）', type: 'Array', default: '[]' },
        { prop: 'columns', desc: '列定义 [{ label, prop, slot... }]', type: 'Array', default: '[]' },
        { prop: 'titles', desc: '两侧面板标题', type: 'Array', default: "['待选', '已选']" },
        { prop: 'rowKey', desc: '数据唯一标识键名', type: 'String', default: "'id'" },
        { prop: 'filterable', desc: '是否显示搜索框', type: 'Boolean', default: 'true' }
      ],
      events: [
        { name: 'change', desc: '选中项发生变化时触发', param: '(value, direction, movedKeys)' }
      ],
      baseCode: `
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
<\/script>
`.trim()
    }
  }
}
</script>
