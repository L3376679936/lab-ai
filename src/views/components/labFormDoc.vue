<template>
  <div class="lab-form-doc">
    <doc-title title="LabForm" subtitle="配置化表单组件，支持多种控件类型、动态栅格布局与内置验证。" />

    <code-display 
      title="动态表单基础" 
      description="通过 JSON 配置对象生成完整表单，支持栅格布局和双向绑定。" 
      :code="codeSnippet"
    >
      <el-alert
        title="实时数据预览"
        type="info"
        :description="JSON.stringify(formData, null, 2)"
        show-icon
        :closable="false"
        style="margin-bottom: 20px;"
      >
      </el-alert>
      
      <lab-form
        v-model="formData"
        :config="formConfig"
        @submit="handleSubmit"
        @reset="handleReset"
      >
        <template #actions>
          <el-button type="primary" icon="el-icon-check" @click="customSubmit">提交数据</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
        </template>
      </lab-form>
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
import LabForm from '@/components/LabForm'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabFormDoc',
  components: {
    LabForm,
    DocTitle,
    CodeDisplay
  },
  data() {
    const codeSnippet = `
<template>
  <lab-form
    v-model="formData"
    :config="formConfig"
    @submit="handleSubmit"
  >
    <template #actions>
       <el-button type="primary">提交</el-button>
    </template>
  </lab-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        age: 18,
        role: 'user'
      },
      formConfig: {
        formItems: [
          { type: 'input', label: '用户名', prop: 'username', span: 12, rules: [{ required: true }] },
          { type: 'number', label: '年龄', prop: 'age', span: 12 },
          { 
            type: 'select', 
            label: '角色', 
            prop: 'role', 
            span: 24,
            options: [
               { label: '管理员', value: 'admin' },
               { label: '用户', value: 'user' }
            ]
          }
        ]
      }
    }
  }
}
<\/script>
`.trim()

    return {
      codeSnippet,
      formData: {
        username: '',
        role: 'user',
        remember: true,
        age: 18,
        birthday: '',
        tags: []
      },
      formConfig: {
        labelWidth: '100px',
        formItems: [
          {
            type: 'input',
            label: '用户名',
            prop: 'username',
            span: 12,
            rules: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            attrs: {
              placeholder: '请输入用户名',
              clearable: true,
              'prefix-icon': 'el-icon-user'
            }
          },
          {
            type: 'number',
            label: '年龄',
            prop: 'age',
            span: 12,
            attrs: { min: 0, max: 150 }
          },
          {
            type: 'select',
            label: '角色',
            prop: 'role',
            span: 12,
            options: [
              { label: '管理员', value: 'admin' },
              { label: '普通用户', value: 'user' },
              { label: '访客', value: 'guest' }
            ]
          },
          {
            type: 'date',
            label: '生日',
            prop: 'birthday',
            span: 12
          },
          {
            type: 'checkbox',
            label: '兴趣标签',
            prop: 'tags',
            span: 24,
            options: [
              { label: '编程', value: 'code' },
              { label: '阅读', value: 'read' },
              { label: '游戏', value: 'game' }
            ]
          },
          {
            type: 'switch',
            label: '记住我',
            prop: 'remember',
            span: 24
          }
        ]
      },
      attributes: [
        { prop: 'value / v-model', desc: '表单数据对象', type: 'Object', default: '{}' },
        { prop: 'config', desc: '表单配置对象 (含 formItems, labelWidth 等)', type: 'Object', default: '-' },
        { prop: 'loading', desc: '是否显示加载状态', type: 'Boolean', default: 'false' },
      ],
      events: [
        { name: 'submit', desc: '表单提交事件，返回当前数据', param: 'formData' },
        { name: 'reset', desc: '表单重置事件', param: '-' },
        { name: 'change', desc: '任意表单项值变化时触发', param: 'key, value' }
      ]
    }
  },
  methods: {
    handleSubmit(data) {
      this.$message.success('提交成功: ' + JSON.stringify(data))
    },
    customSubmit() {
      this.$message.info('触发了自定义提交按钮')
    },
    handleReset() {
      this.formData = {
        username: '',
        role: 'user',
        remember: true,
        age: 18,
        birthday: '',
        tags: []
      }
      this.$message.info('表单已重置')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
