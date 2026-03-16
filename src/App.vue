<template>
  <div id="app" :class="themeClass">
    <div class="theme-transition-mask" :class="{ active: isSwitching }"></div>
    <router-view/>
    
    <transition name="fade-door">
      <div class="tech-3d-scene" v-show="$store.state.isDoorVisible">
        <div class="tech-door door-left" :class="{'is-open': $store.state.isDoorOpen}">
          <div class="tech-scan-line"></div>
          <div class="tech-circuit-container">
            <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="none">
              <!-- 基础暗纹 -->
              <g class="circuit-base">
                <path d="M0 100 H150 L200 150 V300 L250 350 H400" />
                <path d="M400 150 H300 L250 200 V500 L150 600 H0" />
                <path d="M100 0 V200 L150 250 H350 L400 300" />
                <path d="M300 800 V650 L200 550 H0" />
              </g>
              <!-- 流动电流 -->
              <g class="circuit-glow">
                <path d="M0 100 H150 L200 150 V300 L250 350 H400" class="glow-path p1" />
                <path d="M400 150 H300 L250 200 V500 L150 600 H0" class="glow-path p2" />
                <path d="M100 0 V200 L150 250 H350 L400 300" class="glow-path p3" />
                <path d="M300 800 V650 L200 550 H0" class="glow-path p4" />
              </g>
            </svg>
          </div>
        </div>
        <div class="tech-door door-right" :class="{'is-open': $store.state.isDoorOpen}">
          <div class="tech-scan-line"></div>
          <div class="tech-circuit-container">
            <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="none" style="transform: scaleX(-1);">
              <g class="circuit-base">
                <path d="M0 100 H150 L200 150 V300 L250 350 H400" />
                <path d="M400 150 H300 L250 200 V500 L150 600 H0" />
                <path d="M100 0 V200 L150 250 H350 L400 300" />
                <path d="M300 800 V650 L200 550 H0" />
              </g>
              <g class="circuit-glow">
                <path d="M0 100 H150 L200 150 V300 L250 350 H400" class="glow-path p1" />
                <path d="M400 150 H300 L250 200 V500 L150 600 H0" class="glow-path p2" />
                <path d="M100 0 V200 L150 250 H350 L400 300" class="glow-path p3" />
                <path d="M300 800 V650 L200 550 H0" class="glow-path p4" />
              </g>
            </svg>
          </div>
        </div>
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
  perspective: 2000px; /* 增加 3D 透视感 */
}

.tech-door {
  position: absolute;
  top: 0;
  width: 50vw;
  height: 100vh;
  background: linear-gradient(to right, #010c1e 80%, #031a35);
  pointer-events: none;
  will-change: transform;
  overflow: hidden;

  /* 机械纹路背景 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 2px 2px, rgba(0, 217, 255, 0.05) 1px, transparent 0),
      linear-gradient(rgba(0, 217, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 217, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px, 20px 20px, 20px 20px;
    opacity: 0.6;
  }

  /* 动态扫描光条 */
  .tech-scan-line {
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
      transparent,
      rgba(0, 217, 255, 0.05) 40%,
      rgba(0, 217, 255, 0.2) 50%,
      rgba(0, 217, 255, 0.05) 60%,
      transparent
    );
    animation: tech-scan 4s linear infinite;
  }

  /* 电子线路纹理容器 */
  .tech-circuit-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6; /* 提高可见度 */
    pointer-events: none;

    .circuit-base {
      fill: none;
      stroke: rgba(0, 217, 255, 0.2);
      stroke-width: 1px;
    }

    .glow-path {
      fill: none;
      stroke: #00d9ff;
      stroke-width: 2px;
      stroke-dasharray: 20, 180;
      stroke-dashoffset: 200;
      filter: drop-shadow(0 0 5px #00d9ff);
      animation: circuit-glow-move 3s infinite linear;
    }

    .p2 { animation-delay: -0.8s; }
    .p3 { animation-delay: -1.5s; }
    .p4 { animation-delay: -2.2s; }
  }

  /* 门缝发光边缘 - 增强霓虹感 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 4px;
    height: 100vh;
    background: #00d9ff;
    box-shadow:
      0 0 10px #00d9ff,
      0 0 30px #00d9ff,
      0 0 60px rgba(0, 217, 255, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: neon-pulse 2s infinite ease-in-out;
  }
  &:not(.is-open)::after { opacity: 1; }
}

@keyframes tech-scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(200%); }
}

@keyframes circuit-glow-move {
  0% { stroke-dashoffset: 200; opacity: 0.3; }
  50% { opacity: 1; stroke-width: 3px; }
  100% { stroke-dashoffset: 0; opacity: 0.3; }
}

@keyframes neon-pulse {
  0%, 100% { opacity: 0.8; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.5); }
}

/* 亮色主题下门的适配样式 */
#app.theme-normal .tech-door, #app.theme-light .tech-door {
  background: linear-gradient(to right, #f5f7fa 80%, #e4e7ed);
  &::before {
    background-image: radial-gradient(circle at 2px 2px, rgba(64, 158, 255, 0.1) 1px, transparent 0);
  }
  &::after {
    background: #409eff;
    box-shadow: 0 0 15px #409eff, 0 0 30px rgba(64, 158, 255, 0.4);
  }
}

/* 左门：增加开门时的旋转和偏移，模拟机械臂结构 */
.door-left {
  left: 0;
  transform-origin: left center;
  transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
  &::after { right: -2px; }
  &.is-open {
    transform: translateX(-95%) rotateY(-20deg) scale(0.95);
    opacity: 0.3;
  }
}

/* 右门 */
.door-right {
  right: 0;
  transform-origin: right center;
  transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
  &::after { left: -2px; }
  &.is-open {
    transform: translateX(95%) rotateY(20deg) scale(0.95);
    opacity: 0.3;
  }
}

</style>
