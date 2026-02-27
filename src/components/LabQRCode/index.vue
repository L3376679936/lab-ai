<template>
  <div class="lab-qrcode" :class="themeClass">
    <!-- 调试信息：正式上线需删除 -->
    <!-- <div style="font-size: 10px; color: red;">imgUrl length: {{ imgUrl ? imgUrl.length : 0 }}</div> -->
    
    <div class="qrcode-wrapper" v-loading="loading">
      <!-- 临时添加红色边框用于调试定位 -->
      <img 
        v-if="imgUrl" 
        :src="imgUrl" 
        :alt="text" 
        :style="{ width: width + 'px', height: width + 'px', border: '2px solid red' }" 
      />
      <div v-else class="placeholder" :style="{ width: width + 'px', height: width + 'px' }">
        <i class="el-icon-picture-outline"></i>
      </div>
    </div>
    <div class="qrcode-text" v-if="showText && text">
      {{ text }}
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'LabQRCode',
  props: {
    text: {
      type: String,
      required: true,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 200
    },
    margin: {
      type: Number,
      default: 4
    },
    colorDark: {
      type: String,
      default: '#000000'
    },
    colorLight: {
      type: String,
      default: '#ffffff'
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgUrl: '',
      loading: false
    }
  },
  computed: {
    themeClass() {
      return `theme-${this.$store.state.theme}`
    },
    finalColorDark() {
      // 暗色主题下默认为青色，否则使用传入值
      if (this.$store.state.theme === 'tech' && this.colorDark === '#000000') {
        return '#00d9ff'
      }
      return this.colorDark
    },
    finalColorLight() {
      if (this.$store.state.theme === 'tech' && this.colorLight === '#ffffff') {
        return '#00000000' // 透明背景
      }
      return this.colorLight
    }
  },
  watch: {
    text: {
      handler: 'generate',
      immediate: true
    },
    width: 'generate',
    margin: 'generate',
    colorDark: 'generate',
    colorLight: 'generate',
    '$store.state.theme': 'generate' // Re-generate on theme change
  },

  mounted() {
    console.log('LabQRCode mounted. Library object:', QRCode)
  },
  methods: {
    async generate() {
      console.log('LabQRCode: generate called', { text: this.text, width: this.width, theme: this.$store.state.theme })
      if (!this.text) {
        console.warn('LabQRCode: No text provided')
        this.imgUrl = ''
        return
      }
      
      this.loading = true
      try {
        console.log('LabQRCode: invoking toDataURL')
        const url = await QRCode.toDataURL(this.text, {
          width: Number(this.width),
          margin: this.margin,
          color: {
            dark: this.finalColorDark,
            light: this.finalColorLight
          },
          errorCorrectionLevel: 'H'
        })
        console.log('LabQRCode: generated url length', url ? url.length : 0)
        this.imgUrl = url
      } catch (err) {
        console.error('QR Generate Error:', err)
        this.$message.error('二维码生成失败: ' + err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  .qrcode-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
    
    .placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f7fa;
      color: #909399;
      font-size: 24px;
    }
  }

  .qrcode-text {
    margin-top: 8px;
    font-size: 12px;
    color: #606266;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.theme-tech {
  background: rgba(13, 27, 45, 0.6);
  border: 1px solid rgba(0, 243, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);

  .qrcode-wrapper {
    .placeholder {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-color);
    }
  }

  .qrcode-text {
    color: var(--primary-color);
  }
}
</style>
