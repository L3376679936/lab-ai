<template>
  <div class="error-404-page">
    <div class="particles-container" ref="particles"></div>
    
    <div class="content-box">
      <div class="error-code">404</div>
      <div class="error-title">SYSTEM ERROR: PATH_NOT_FOUND</div>
      <div class="error-desc">
        您请求的资源地址在量子存储中无法定位，或由于时空裂缝已不复存在。
      </div>
      
      <div class="action-bar">
        <el-button type="primary" size="large" icon="el-icon-back" @click="goHome">
          返回安全终端
        </el-button>
        <el-button type="info" size="large" plain icon="el-icon-refresh" @click="handleRefresh">
          重置链路
        </el-button>
      </div>
    </div>

    <!-- 科技装饰元素 -->
    <div class="decor-line top"></div>
    <div class="decor-line bottom"></div>
    <div class="corner-box top-left"></div>
    <div class="corner-box top-right"></div>
    <div class="corner-box bottom-left"></div>
    <div class="corner-box bottom-right"></div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  mounted() {
    this.initParticles()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    handleRefresh() {
      window.location.reload()
    },
    initParticles() {
      // 这里的粒子背景可以结合之前的 Particles 逻辑或简单的 CSS 动画
      // 为简化，我们通过动态生成一些随机漂浮的霓虹点来模拟
      const container = this.$refs.particles
      if (!container) return
      
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div')
        dot.className = 'floating-dot'
        const size = Math.random() * 4 + 2 + 'px'
        dot.style.width = size
        dot.style.height = size
        dot.style.left = Math.random() * 100 + '%'
        dot.style.top = Math.random() * 100 + '%'
        dot.style.animationDelay = Math.random() * 5 + 's'
        dot.style.opacity = Math.random() * 0.5 + 0.2
        container.appendChild(dot)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.error-404-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0a192f 0%, #020c1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f3ff;
  font-family: 'Inter', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
  z-index: 9999;

  .particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    ::v-deep .floating-dot {
      position: absolute;
      background: #00f3ff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00f3ff;
      animation: float 10s infinite ease-in-out;
    }
  }

  .content-box {
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 40px;
    background: rgba(0, 243, 255, 0.03);
    border: 1px solid rgba(0, 243, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    max-width: 600px;
    animation: fadeIn 1s ease-out;

    .error-code {
      font-size: 120px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 20px;
      background: linear-gradient(180deg, #00f3ff 30%, rgba(0, 243, 255, 0.1) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 15px rgba(0, 243, 255, 0.5));
      letter-spacing: -5px;
    }

    .error-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 15px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .error-desc {
      font-size: 16px;
      line-height: 1.8;
      color: rgba(0, 243, 255, 0.7);
      margin-bottom: 40px;
    }

    .action-bar {
      display: flex;
      gap: 20px;
      justify-content: center;

      .el-button {
        &.el-button--primary {
          background: linear-gradient(90deg, #00f3ff, #0072ff) !important;
          border: none !important;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
          &:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(0, 243, 255, 0.5); }
        }
        &.is-plain {
          background: rgba(0, 243, 255, 0.05) !important;
          border: 1px solid rgba(0, 243, 255, 0.3) !important;
          color: #00f3ff !important;
          &:hover { background: rgba(0, 243, 255, 0.1) !important; }
        }
      }
    }
  }

  // 装饰线
  .decor-line {
    position: absolute;
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00f3ff, transparent);
    opacity: 0.3;
    &.top { top: 100px; left: -150px; transform: rotate(45deg); }
    &.bottom { bottom: 100px; right: -150px; transform: rotate(45deg); }
  }

  // 边角元素
  .corner-box {
    position: absolute;
    width: 20px;
    height: 20px;
    border-color: #00f3ff;
    border-style: solid;
    opacity: 0.5;
    &.top-left { top: 30px; left: 30px; border-width: 2px 0 0 2px; }
    &.top-right { top: 30px; right: 30px; border-width: 2px 2px 0 0; }
    &.bottom-left { bottom: 30px; left: 30px; border-width: 0 0 2px 2px; }
    &.bottom-right { bottom: 30px; right: 30px; border-width: 0 2px 2px 0; }
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, 20px); }
  50% { transform: translate(-15px, 10px); }
  75% { transform: translate(10px, -20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
