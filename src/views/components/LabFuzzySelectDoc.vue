<template>
  <div class="lab-fuzzy-select-doc">
    <doc-title title="LabFuzzySelect" subtitle="支持拼音首字母匹配的下拉选择组件，优化搜索体验。" />

    <code-display 
      title="基础用法" 
      description="支持中文、拼音全拼、拼音首字母进行模糊搜索。" 
      :code="codeSnippet"
    >
      <div class="demo-wrapper" style="width: 300px;">
        <lab-fuzzy-select
          v-model="value"
          :options="options"
          placeholder="请输入关键词搜索 (如: hjg)"
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
  </div>
</template>

<script>
import LabFuzzySelect from '@/components/LabFuzzySelect'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabFuzzySelectDoc',
  components: {
    LabFuzzySelect,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      value: '',
      options: [
        { value: '选项1', label: '黄金糕 (Huang Jin Gao)' },
        { value: '选项2', label: '双皮奶 (Shuang Pi Nai)' },
        { value: '选项3', label: '蚵仔煎 (Ke Zai Jian)' },
        { value: '选项4', label: '龙须面 (Long Xu Mian)' },
        { value: '选项5', label: '北京烤鸭 (Bei Jing Kao Ya)' }
      ],
      codeSnippet: `
<template>
  <lab-fuzzy-select
    v-model="value"
    :options="options"
    placeholder="请输入关键词搜索 (如: hjg)"
  />
</template>

<script>
export default {
  data() {
    return {
      value: '',
      options: [
        { value: '选项1', label: '黄金糕' },
        { value: '选项2', label: '双皮奶' }
      ]
    }
  }
}
<\/script>
`.trim(),
      attributes: [
        { prop: 'value / v-model', desc: '绑定值', type: 'String/Number', default: '-' },
        { prop: 'options', desc: '选项数据源', type: 'Array', default: '[]' },
        { prop: 'labelKey', desc: '选项标签字段名', type: 'String', default: 'label' },
        { prop: 'valueKey', desc: '选项值字段名', type: 'String', default: 'value' },
        { prop: 'placeholder', desc: '占位文本', type: 'String', default: '请选择' },
        { prop: 'disabled', desc: '是否禁用', type: 'Boolean', default: 'false' },
        { prop: 'clearable', desc: '是否可清空', type: 'Boolean', default: 'true' }
      ]
    }
  }
}
</script>
