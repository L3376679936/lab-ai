<template>
  <div class="lab-input-new">
    <el-select
      v-model="internalValue"
      :placeholder="placeholder || `请选择${itemName}`"
      :disabled="disabled"
      clearable
      filterable
      class="full-width"
      @visible-change="handleVisibleChange"
    >
      <!-- Optional: Add button at the top -->
      <el-option
        v-if="addButtonPosition === 'top'"
        value="__ADD_NEW_ITEM__"
        class="add-option-btn text-center"
        :disabled="true" 
      >
        <div class="add-btn-content" @click.stop="handleAddClick">
           <i class="el-icon-plus"></i> 添加{{ itemName }}
        </div>
      </el-option>

      <el-option
        v-for="(item, index) in options"
        :key="item[valueKey] || index"
        :label="item[labelKey]"
        :value="item[valueKey]"
      >
        <span style="float: left">{{ item[labelKey] }}</span>
      </el-option>

      <!-- Optional: Add button at the bottom -->
      <el-option
        v-if="addButtonPosition === 'bottom'"
        value="__ADD_NEW_ITEM__"
        class="add-option-btn text-center"
        :disabled="true"
      >
        <div class="add-btn-content" @click.stop="handleAddClick">
           <i class="el-icon-plus"></i> 添加{{ itemName }}
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "LabInputNew",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    itemName: {
      type: String,
      default: "选项"
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    addButtonPosition: {
      type: String,
      default: "top", // 'top' or 'bottom'
      validator: val => ['top', 'bottom'].includes(val)
    },
    labelKey: {
      type: String,
      default: "label"
    },
    valueKey: {
      type: String,
      default: "value"
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        if (val === '__ADD_NEW_ITEM__') return
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  methods: {
    handleVisibleChange(val) {
      if (val) {
        // Reset or prepare something if needed
      }
    },
    handleAddClick() {
      // Close the dropdown? Usually keeping it open is better or let prompt handle it
      this.$prompt(`请输入新的${this.itemName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: `${this.itemName}不能为空`
      }).then(({ value }) => {
        this.$emit('add-item', value)
        // Optionally update internal value if parent handles the update
      }).catch(() => {
        // Canceled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-input-new {
  width: 100%;
  .full-width {
    width: 100%;
  }

  .add-option-btn {
    cursor: default; // Reset cursor since option is disabled
    padding: 0;
    height: 34px;
    line-height: 34px;
    
    .add-btn-content {
      cursor: pointer;
      color: var(--primary-color, #409EFF);
      font-weight: 500;
      text-align: center;
      width: 100%;
      height: 100%;
      
      &:hover {
        background-color: var(--bg-color-hover, #f5f7fa);
      }
      
      i {
        margin-right: 4px;
      }
    }
  }
}
</style>
