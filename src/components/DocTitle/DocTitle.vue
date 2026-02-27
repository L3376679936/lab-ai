<template>
  <div class="doc-title-wrapper" :class="themeClass">
    <div class="title-container">
      <h2 class="doc-title">
        {{ title }}
        <span class="tech-bar"></span>
      </h2>
    </div>
    <p class="doc-subtitle" v-if="subtitle">
      <i class="el-icon-caret-right subtitle-icon"></i>
      {{ subtitle }}
    </p>
    <div class="tech-line"></div>
    <div class="extra-actions">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocTitle',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  },
  computed: {
    themeClass() {
      return `theme-${this.$store.state.theme}`
    },
    isTech() {
      return this.$store.state.theme === 'tech'
    }
  }
}
</script>

<style lang="scss" scoped>
.doc-title-wrapper {
  margin-bottom: 48px;
  position: relative;
  overflow: hidden;
  padding-bottom: 10px;

  .extra-actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 12px;
  }
}

.title-container {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.doc-title {
  font-size: 46px;
  font-weight: 800;
  margin: 0;
  position: relative;
  z-index: 2;
  
  // Logo Gradient: Blue to Cyan
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  letter-spacing: -1.5px;
  line-height: 1.2;
}

/* 装饰条 */
// Static decoration bar with its own subtle animation
.tech-bar {
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4, transparent);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    filter: blur(4px);
    animation: bar-scan 2s linear infinite;
  }
}

.doc-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 700px;
  opacity: 0.9;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 5px;

  .subtitle-icon {
    color: var(--primary-color);
    margin-top: 4px;
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4));
  }
}

.tech-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  opacity: 0.6; // Increased from 0.5
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    box-shadow: 0 0 10px var(--primary-color);
    animation: scan-move 4s linear infinite;
  }
}

/* 科技模式增强 */
.theme-tech {
  .doc-title {
    text-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  }
}

@keyframes scan-move {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(1000px); } // Use a larger range or 100vw equivalent if possible
}

@keyframes bar-scan {
  0% { transform: translateX(-25px); }
  100% { transform: translateX(85px); }
}
</style>
