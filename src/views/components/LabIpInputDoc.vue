<template>
  <div class="lab-ip-input-doc">
    <doc-title title="LabIpInput" subtitle="分段式 IP 地址输入框，支持自动跳转与格式校验。" />

    <code-display 
      title="基础用法" 
      description="支持 medium/small/mini 三种尺寸，自动处理数字校验和跳转。" 
      :code="codeSnippet"
    >
      <div class="demo-wrapper">
        <div class="demo-row">
          <span>标准尺寸：</span>
          <lab-ip-input v-model="ip1" clearable />
          <span style="margin-left: 10px;">值: {{ ip1 }}</span>
        </div>
        
        <div class="demo-row">
          <span>禁用状态：</span>
          <lab-ip-input v-model="ip2" disabled />
        </div>

        <div class="demo-row">
          <span>Mini 尺寸：</span>
          <lab-ip-input v-model="ip3" size="mini" />
        </div>
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
import LabIpInput from '@/components/LabIpInput'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabIpInputDoc',
  components: {
    LabIpInput,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      ip1: '192.168.1.1',
      ip2: '127.0.0.1',
      ip3: '',
      codeSnippet: `
<template>
  <lab-ip-input v-model="ip" clearable size="small" />
</template>

<script>
export default {
  data() {
    return {
      ip: '192.168.0.1'
    }
  }
}
<\/script>
`.trim(),
      attributes: [
        { prop: 'value / v-model', desc: 'IP 地址字符串', type: 'String', default: "''" },
        { prop: 'disabled', desc: '是否禁用', type: 'Boolean', default: 'false' },
        { prop: 'clearable', desc: '是否显示清空图标', type: 'Boolean', default: 'false' },
        { prop: 'readonly', desc: '是否只读', type: 'Boolean', default: 'false' },
        { prop: 'size', desc: '尺寸 (medium/small/mini)', type: 'String', default: 'medium' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
