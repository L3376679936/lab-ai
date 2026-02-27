<template>
  <div class="lab-fuzzy-select">
    <el-select
      v-model="internalValue"
      filterable
      :filter-method="pinyinMatchMethod"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      class="full-width"
    >
      <el-option
        v-for="item in filteredOptions"
        :key="item[valueKey]"
        :label="item[labelKey]"
        :value="item[valueKey]"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import PinyinMatch from 'pinyin-match'

export default {
  name: "LabFuzzySelect",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
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
  data() {
    return {
      filteredOptions: []
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  watch: {
    options: {
      handler(val) {
        this.filteredOptions = val
      },
      immediate: true
    }
  },
  methods: {
    pinyinMatchMethod(val) {
      if (val) {
        if (PinyinMatch && PinyinMatch.match) {
          const result = []
          this.options.forEach(i => {
            const m = PinyinMatch.match(i[this.labelKey], val)
            if (m) {
              result.push(i)
            }
          })
          this.filteredOptions = result
        } else {
          // Fallback if pinyin-match is missing
           this.filteredOptions = this.options.filter(item => 
            item[this.labelKey].toLowerCase().includes(val.toLowerCase())
          )
        }
      } else {
        this.filteredOptions = this.options
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-fuzzy-select {
  width: 100%;
  .full-width {
    width: 100%;
  }
}
</style>
