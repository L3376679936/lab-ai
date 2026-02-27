<template>
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
      return `theme-${this.$store.state.theme}`
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
</style>
