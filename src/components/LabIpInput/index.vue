<template>
  <div class="lab-ip-input" :class="[sizeClass, themeClass, { 'is-disabled': disabled }]">
    <div 
      class="ip-input-wrapper" 
      :class="{ 'is-focus': isFocus }"
      @mouseenter="showClear = true"
      @mouseleave="showClear = false"
    >
      <template v-for="(segment, index) in ipSegments">
        <input
          :key="'segment-' + index"
          ref="ipInput"
          v-model="segment.value"
          type="text"
          class="ip-segment-input"
          :disabled="disabled"
          :readonly="readonly"
          maxlength="3"
          @focus="handleFocus(index)"
          @blur="handleBlur"
          @input="handleInput(segment, index)"
          @keydown="handleKeydown(segment, index, $event)"
        />
        <span :key="'dot-' + index" v-if="index < 3" class="ip-dot">.</span>
      </template>
      
      <i 
        v-if="clearable && !disabled && !readonly && hasValue && (showClear || isFocus)"
        class="el-icon-circle-close ip-clear-btn"
        @click.stop="handleClear"
      ></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "LabIpInput",
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    size: {
      type: String,
      default: "medium" // medium, small, mini
    }
  },
  data() {
    return {
      ipSegments: [
        { value: '' }, { value: '' }, { value: '' }, { value: '' }
      ],
      isFocus: false,
      showClear: false
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return `theme-${this.theme}`
    },
    sizeClass() {
      return `lab-ip-input--${this.size}`
    },
    hasValue() {
      return this.ipSegments.some(seg => seg.value !== '')
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val) {
          this.ipSegments.forEach(seg => seg.value = '')
          return
        }
        const parts = val.split('.')
        if (parts.length === 4) {
          // Avoid overwriting while typing if values match (prevent cursor jump on simple update)
           parts.forEach((p, i) => {
             if (this.ipSegments[i].value !== p) {
                this.ipSegments[i].value = p
             }
           })
        }
      },
      immediate: true
    }
  },
  methods: {
    updateValue() {
      const val = this.ipSegments.map(s => s.value).join('.')
      // If all empty, emit empty string? Or "..."? Standard is empty string if all empty.
      const isEmpty = this.ipSegments.every(s => s.value === '')
      this.$emit('input', isEmpty ? '' : val)
      this.$emit('change', isEmpty ? '' : val)
    },
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleInput(segment, index) {
      let val = segment.value.replace(/\D/g, '') // Remove non-digits
      if (val !== '') {
        let num = parseInt(val, 10)
        if (num > 255) num = 255
        // Remove leading zeros usually? Or keep them? 
        // Standard IP doesn't have leading zeros like 01. But let's keep simple.
        segment.value = num.toString()
      } else {
        segment.value = ''
      }
      
      this.updateValue()

      // Auto jump to next if length is 3
      if (segment.value.length === 3 && index < 3) {
        this.$nextTick(() => {
          this.$refs.ipInput[index + 1].focus()
        })
      }
    },
    handleKeydown(segment, index, e) {
       // Backspace
       if (e.keyCode === 8) {
         if (segment.value === '' && index > 0) {
            e.preventDefault() // Prevent deleting char in previous input accidentally before focus
            this.$refs.ipInput[index - 1].focus()
         }
       }
       // Left Arrow
       else if (e.keyCode === 37) {
         if (e.target.selectionStart === 0 && index > 0) {
            e.preventDefault()
            this.$refs.ipInput[index - 1].focus()
         }
       }
       // Right Arrow
       else if (e.keyCode === 39) {
         if (e.target.selectionStart === segment.value.length && index < 3) {
            e.preventDefault()
            this.$refs.ipInput[index + 1].focus()
         }
       }
       // Dot (.) or Enter or Space -> Next
       else if ([190, 110, 13, 32].includes(e.keyCode)) {
          e.preventDefault()
          if (index < 3) {
            this.$refs.ipInput[index + 1].focus()
          }
       }
    },
    handleClear() {
      this.ipSegments.forEach(s => s.value = '')
      this.updateValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-ip-input {
  display: inline-block;
  width: 100%;
  max-width: 300px;
  vertical-align: middle;

  &.is-disabled {
    .ip-input-wrapper {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
      
      .ip-segment-input {
        background-color: transparent;
        cursor: not-allowed;
      }
    }
  }

  .ip-input-wrapper {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: flex;
    align-items: center;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    padding: 0 5px;
    position: relative; // For clear icon

    &.is-focus {
      border-color: #409EFF;
    }
    
    // Clear button
    .ip-clear-btn {
      position: absolute;
      right: 5px;
      color: #c0c4cc;
      cursor: pointer;
      font-size: 14px;
      &:hover { color: #909399; }
    }
  }

  .ip-segment-input {
    flex: 1;
    border: none;
    outline: none;
    text-align: center;
    padding: 0;
    color: inherit;
    background: transparent;
    min-width: 20px;
    
    // Hide default clear button
    &::-ms-clear { display: none; }
  }

  .ip-dot {
    width: 10px;
    text-align: center;
    font-weight: bold;
    color: #909399;
    user-select: none;
  }

  // Sizes
  &--medium .ip-input-wrapper { height: 36px; line-height: 36px; font-size: 14px; }
  &--small .ip-input-wrapper { height: 32px; line-height: 32px; font-size: 13px; }
  &--mini .ip-input-wrapper { height: 28px; line-height: 28px; font-size: 12px; }

  // Dark Theme support
  &.theme-tech {
    .ip-input-wrapper {
      background-color: var(--lab-card-bg, rgba(20, 20, 30, 0.8));
      border-color: var(--lab-border-color, rgba(0, 217, 255, 0.3));
      color: var(--lab-text-color, #e0e0e0);

      &.is-focus {
        border-color: #00d9ff;
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
      }
      
      .ip-clear-btn {
        color: rgba(255,255,255,0.4);
        &:hover { color: #00d9ff; }
      }
    }
    
    .ip-dot {
      color: rgba(255,255,255,0.6);
    }

    &.is-disabled {
      .ip-input-wrapper {
        background-color: rgba(0,0,0,0.2);
        border-color: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.3);
      }
    }
  }
}
</style>
