<template>
  <div class="lab-input-new-doc">
    <doc-title title="LabInputNew" subtitle="下拉框底部嵌入新增按钮，支持快捷添加选项。" />

    <code-display 
      title="基础用法" 
      description="点击顶部或底部的 '添加选项' 按钮触发自定义事件。" 
      :code="codeSnippet"
    >
      <div class="demo-wrapper" style="width: 300px;">
        <lab-input-new
          v-model="value"
          :options="options"
          item-name="城市"
          @add-item="handleAddItem"
        />
        <div style="margin-top: 10px; color: #666;">当前选中: {{ value }}</div>
      </div>
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
import LabInputNew from '@/components/LabInputNew'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabInputNewDoc',
  components: {
    LabInputNew,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      value: '',
      options: [
        { value: 'Beijing', label: '北京' },
        { value: 'Shanghai', label: '上海' },
        { value: 'Guangzhou', label: '广州' }
      ],
      codeSnippet: `
<template>
  <lab-input-new
    v-model="value"
    :options="options"
    item-name="城市"
    @add-item="handleAddItem"
  />
</template>

<script>
export default {
  methods: {
    handleAddItem(val) {
      if (val) {
        // 模拟调用 API 添加
        this.options.push({ value: val, label: val })
        this.$message.success('已添加: ' + val)
        this.value = val // 自动选中
      }
    }
  }
}
<\/script>
`.trim(),
      attributes: [
        { prop: 'value / v-model', desc: '绑定值', type: 'String/Number', default: '-' },
        { prop: 'options', desc: '选项列表', type: 'Array', default: '[]' },
        { prop: 'itemName', desc: '添加按钮上的名词 (如 "城市")', type: 'String', default: '选项' },
        { prop: 'addButtonPosition', desc: '按钮位置 (top/bottom)', type: 'String', default: 'top' },
      ],
      events: [
        { name: 'add-item', desc: '点击确认添加时触发', param: '输入的文本值' }
      ]
    }
  },
  methods: {
    handleAddItem(val) {
      if (val) {
        this.options.push({ value: val, label: val })
        this.$message.success('已添加到列表: ' + val)
        this.value = val
      }
    }
  }
}
</script>
