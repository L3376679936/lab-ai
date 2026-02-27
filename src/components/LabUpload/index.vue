<template>
  <div class="lab-upload-container" :class="themeClass">
    <el-upload
      ref="upload"
      class="lab-upload"
      :action="action"
      :multiple="multiple"
      :drag="drag"
      :limit="limit"
      :auto-upload="autoUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      v-bind="$attrs"
    >
      <i v-if="drag" class="el-icon-upload"></i>
      <div v-if="drag" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      
      <el-button v-else size="small" type="primary">点击上传</el-button>
      
      <div slot="tip" class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </el-upload>
    
    <!-- 自定义文件列表展示（可选增强，这里复用 el-upload 的，或者可以覆盖） -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LabUpload',
  props: {
    action: {
      type: String,
      default: '#' // 默认不实际上传，仅演示
    },
    multiple: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: false
    },
    limit: Number,
    autoUpload: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array, //双向绑定文件列表
      default: () => []
    }
  },
  data() {
    return {
      fileList: this.value
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return `theme-${this.theme}`
    }
  },
  watch: {
    value(val) {
      this.fileList = val
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList
      this.$emit('input', fileList)
      this.$emit('change', file, fileList)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('input', fileList)
      this.$emit('remove', file, fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-upload-container {
  padding: 20px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;
}

.theme-tech {
  ::v-deep .el-upload-dragger {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 217, 255, 0.3);
    
    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
    }
    
    .el-icon-upload {
      color: var(--primary-color);
    }
    
    .el-upload__text {
      color: var(--text-color);
      em {
        color: var(--primary-color);
      }
    }
  }
  
  ::v-deep .el-upload-list__item-name {
    color: var(--text-color);
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
