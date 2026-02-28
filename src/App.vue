<template>
  <div id="app" :class="themeClass">
    <div class="theme-transition-mask" :class="{ active: isSwitching }"></div>
    <router-view/>
    
    <!-- 跨路由全局科技门动效图层 -->
    <transition name="fade-door">
      <div class="tech-3d-scene" v-show="$store.state.isDoorVisible">
        <div class="tech-door door-left" :class="{'is-open': $store.state.isDoorOpen}"></div>
        <div class="tech-door door-right" :class="{'is-open': $store.state.isDoorOpen}"></div>
      </div>
    </transition>
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

/* 门整体图层的渐隐渐显 */
.fade-door-enter-active {
  transition: opacity 0.2s ease-out;
}
.fade-door-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-door-enter, .fade-door-leave-to {
  opacity: 0;
}

/* ================= 全局开门/关门动效 ================= */
.tech-3d-scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9000;
}

.tech-door {
  position: absolute;
  top: 0;
  width: 50vw;
  height: 100vh;
  background: linear-gradient(to right, #010c1e 80%, #031a35);
  pointer-events: none;
  will-change: transform;

  /* 门缝发光边缘 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 3px;
    height: 100vh;
    background: linear-gradient(to bottom, transparent, #00d9ff 20%, #00d9ff 80%, transparent);
    box-shadow: 0 0 20px #00d9ff, 0 0 40px rgba(0, 217, 255, 0.4);
    opacity: 0;
    transition: opacity 0.2s ease-in;
  }
  &:not(.is-open)::after { opacity: 1; }
}

/* 亮色主题下门的适配样式 */
#app.theme-normal .tech-door, #app.theme-light .tech-door {
  background: linear-gradient(to right, #f5f7fa 80%, #e4e7ed);
  
  &::after {
    background: linear-gradient(to bottom, transparent, #409eff 20%, #409eff 80%, transparent);
    box-shadow: 0 0 20px #409eff, 0 0 40px rgba(64, 158, 255, 0.4);
  }
}

/* 左门：停在屏幕中间（关着） */
.door-left {
  left: 0;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  &::after { right: -1px; }
  &.is-open {
    transform: translateX(-100%);
  }
}

/* 右门：停在屏幕中间（关着） */
.door-right {
  right: 0;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  &::after { left: -1px; }
  &.is-open {
    transform: translateX(100%);
  }
}

</style>
