<template>
  <div id="app" :class="themeClass">
    <div class="theme-transition-mask" :class="{ active: isSwitching }"></div>
    <router-view/>
  </div>
</template>

<script>
// 引入主题配置，以便在初始化时设置默认主题
import { themes } from '@/styles/theme'

export default {
  name: 'App',
  data() {
    return {
      isSwitching: false
    }
  },
  computed: {
    themeClass() {
      // 从 Vuex 获取当前主题，应用到根元素
      return `theme-${this.$store.state.theme}`
    }
  },
  watch: {
    // 监听主题变化，动态设置 CSS 变量
    '$store.state.theme': {
      handler(val) {
        // 触发遮罩动画
        this.isSwitching = true
        setTimeout(() => {
          this.isSwitching = false
        }, 800)

        this.updateThemeVariables(val)
      },
      immediate: true
    }
  },
  methods: {
    updateThemeVariables(themeName) {
      const themeConfig = themes[themeName] || themes.normal
      const root = document.documentElement
      
      // 设置 CSS 变量，使用 rAF 优化性能
      window.requestAnimationFrame(() => {
        for (const [key, value] of Object.entries(themeConfig)) {
          if (key.startsWith('--')) {
            root.style.setProperty(key, value)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: var(--bg-color, #f5f7fa);
  color: var(--text-color, #303133);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  min-height: 100vh;
}

/* 主题切换遮罩动画 */
.theme-transition-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
  background-color: var(--bg-color, #fff); /* 使用新主题的背景色 */
  opacity: 0;
  /* 初始不可见 */
}

.theme-transition-mask.active {
  animation: theme-switch-ripple 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
}

@keyframes theme-switch-ripple {
  0% {
    opacity: 0;
    clip-path: circle(0% at 50% 50%);
  }
  30% {
    opacity: 1;
    clip-path: circle(50% at 50% 50%);
  }
  50% {
    opacity: 1;
    clip-path: circle(100% at 50% 50%);
  }
  100% {
    opacity: 0;
    clip-path: circle(150% at 50% 50%);
  }
}
</style>
