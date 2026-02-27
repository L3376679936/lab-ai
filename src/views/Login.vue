<template>
  <div class="login-container" :class="theme === 'tech' ? 'theme-tech' : 'theme-light'">
    <!-- 背景粒子连线（仅暗色/科技模式显示） -->
    <canvas id="particle-canvas" class="particle-canvas" v-show="theme === 'tech'"></canvas>
    
    <!-- 亮色模式背景点缀与动效 -->
    <div class="light-bg-shapes" v-show="theme !== 'tech'">
      <ul class="floating-squares">
        <li>L</li><li>A</li><li>B</li><li>L</li><li>A</li>
        <li>B</li><li>L</li><li>A</li><li>B</li><li>L</li>
      </ul>
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 科技感开门动效图层（position:fixed，不受父容器 overflow:hidden 影响） -->
    <div class="tech-3d-scene" v-if="theme === 'tech'">
      <div class="tech-door door-left" :class="{entering: isDoorIn}"></div>
      <div class="tech-door door-right" :class="{entering: isDoorIn}"></div>
    </div>

    <!-- 登录面板 -->
    <div class="login-box-wrapper">
      <div class="login-box">
        <div class="login-header">
          <div class="logo-wrapper">
             <i class="el-icon-odometer tech-icon" v-if="theme === 'tech'"></i>
             <lab-logo v-else />
          </div>
          <h2 class="title" :data-text="'系统登录'">
            系统登录
          </h2>
        </div>
        
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0" class="lab-login-form">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              prefix-icon="el-icon-user" 
              placeholder="请输入账号 (lab_admin)" 
              @keyup.enter.native="handleLogin"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              type="password" 
              v-model="loginForm.password" 
              prefix-icon="el-icon-lock" 
              placeholder="请输入密码 (lab123456)" 
              @keyup.enter.native="handleLogin"
              show-password
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button 
              type="primary" 
              class="login-btn" 
              @click="handleLogin" 
              :loading="loading"
              :class="{'tech-btn': theme === 'tech'}"
            >
              <span class="btn-text">登 录</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  name: 'Login',
  data() {
    return {
      isUnlocking: false,
      isDoorIn: false,  // 门滑入关闭
      loading: false,
      loginForm: {
        username: 'lab_admin',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // Particle system
      canvas: null,
      ctx: null,
      particles: [],
      animationFrame: null,
      mouse: { x: null, y: null, radius: 150 }
    }
  },
  computed: {
    theme() {
      return this.$store.state.theme || localStorage.getItem('lab-theme') || 'normal'
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.theme === 'tech') {
        this.initParticles()
      }
    })
    window.addEventListener('resize', this.resizeCanvas)
    window.addEventListener('mousemove', this.handleMouseMove)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas)
    window.removeEventListener('mousemove', this.handleMouseMove)
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
  },
  watch: {
    theme(newVal) {
      if (newVal === 'tech') {
        this.$nextTick(() => this.initParticles())
      } else {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.ctx && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 模拟请求
          setTimeout(() => {
            const { username, password } = this.loginForm
            const encryptedPassword = CryptoJS.MD5(password).toString()
            // 预设密码的密文 lab123456 -> 5a500fe2612df1258a08952f9d88ade6
            
            if (username === 'lab_admin' && encryptedPassword === '5a500fe2612df1258a08952f9d88ade6') {
              this.$message.success('登录成功')
              localStorage.setItem('lab_token', 'mock_token_' + new Date().getTime())
              
              if (this.theme === 'tech') {
                // 登录框淡出
                this.isUnlocking = true
                // 0.3s 后门从两侧滑入
                setTimeout(() => { this.isDoorIn = true }, 300)
                // 1.5s 后跳转
                setTimeout(() => { this.$router.push('/') }, 1500)
              } else {
                this.$router.push('/')
              }
            } else {
              this.$message.error('账号或密码错误')
            }
            this.loading = false
          }, 800)
        }
      })
    },
    
    // ======== 粒子特效 ========
    handleMouseMove(event) {
      this.mouse.x = event.x
      this.mouse.y = event.y
    },
    resizeCanvas() {
      if (!this.canvas) return
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.initParticleArray()
    },
    initParticles() {
      this.canvas = document.getElementById('particle-canvas')
      if (!this.canvas) return
      this.ctx = this.canvas.getContext('2d')
      this.resizeCanvas()
      this.animateParticles()
    },
    initParticleArray() {
      this.particles = []
      const numberOfParticles = (this.canvas.width * this.canvas.height) / 9000
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1
        let x = (Math.random() * ((this.canvas.width - size * 2) - (size * 2)) + size * 2)
        let y = (Math.random() * ((this.canvas.height - size * 2) - (size * 2)) + size * 2)
        let directionX = (Math.random() * 1) - 0.5
        let directionY = (Math.random() * 1) - 0.5
        let color = 'rgba(0, 217, 255, 0.8)'
        this.particles.push(new Particle(x, y, directionX, directionY, size, color, this.canvas, this.mouse))
      }
    },
    animateParticles() {
      if (this.theme !== 'tech' || !this.ctx) return
      this.animationFrame = requestAnimationFrame(this.animateParticles)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update()
      }
      this.connectParticles()
    },
    connectParticles() {
      let opacityValue = 1
      for (let a = 0; a < this.particles.length; a++) {
        for (let b = a; b < this.particles.length; b++) {
          let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x))
                       + ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y))
          if (distance < (this.canvas.width / 10) * (this.canvas.height / 10)) {
            opacityValue = 1 - (distance / 20000)
            this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacityValue * 0.3})`
            this.ctx.lineWidth = 1
            this.ctx.beginPath()
            this.ctx.moveTo(this.particles[a].x, this.particles[a].y)
            this.ctx.lineTo(this.particles[b].x, this.particles[b].y)
            this.ctx.stroke()
          }
        }
      }
    }
  }
}

// 粒子类封装
class Particle {
  constructor(x, y, directionX, directionY, size, color, canvas, mouse) {
    this.x = x
    this.y = y
    this.directionX = directionX
    this.directionY = directionY
    this.size = size
    this.color = color
    this.canvas = canvas
    this.mouse = mouse
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }
  update() {
    if (this.x > this.canvas.width || this.x < 0) this.directionX = -this.directionX
    if (this.y > this.canvas.height || this.y < 0) this.directionY = -this.directionY

    // Check collision with mouse
    let dx = this.mouse.x - this.x
    let dy = this.mouse.y - this.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < this.mouse.radius + this.size) {
      if (this.mouse.x < this.x && this.x < this.canvas.width - this.size * 10) {
        this.x += 3
      }
      if (this.mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 3
      }
      if (this.mouse.y < this.y && this.y < this.canvas.height - this.size * 10) {
        this.y += 3
      }
      if (this.mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 3
      }
    }
    
    this.x += this.directionX
    this.y += this.directionY
    
    // Ensure we have a context before drawing
    const ctx = this.canvas.getContext('2d')
    if (ctx) this.draw(ctx)
  }
}
</script>

<style lang="scss" scoped>
/* =========== 基础容器 =========== */
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

/* =========== 亮色模式 (Light Mode) =========== */
.theme-light {
  background-color: #f5f7fa;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(64, 158, 255, 0.08) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(103, 194, 58, 0.06) 0%, transparent 25%);

  .light-bg-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    
    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: -1;
      animation: float-slow 15s infinite alternate ease-in-out;
    }
    
    .shape-1 {
      width: 400px;
      height: 400px;
      background: rgba(64, 158, 255, 0.15);
      top: -100px;
      left: -100px;
      animation-delay: 0s;
    }
    
    .shape-2 {
      width: 500px;
      height: 500px;
      background: rgba(103, 194, 58, 0.1);
      bottom: -150px;
      right: -100px;
      animation-delay: -5s;
    }
    
    .shape-3 {
      width: 300px;
      height: 300px;
      background: rgba(230, 162, 60, 0.1);
      top: 40%;
      left: 60%;
      animation-delay: -10s;
    }
  }

  // 亮色模式悬浮方块动效
  .floating-squares {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    z-index: 0;
    
    li {
      position: absolute;
      display: flex; /* Flexbox 居中字母 */
      align-items: center;
      justify-content: center;
      list-style: none;
      width: 20px;
      height: 20px;
      background: rgba(64, 158, 255, 0.15);
      color: rgba(64, 158, 255, 0.3); /* 字母颜色略深于背景 */
      font-weight: bold;
      font-size: 16px;
      user-select: none;
      animation: float-up 25s linear infinite;
      bottom: -150px;
      border-radius: 4px;
      
      &:nth-child(1) { left: 25%; width: 80px; height: 80px; font-size: 40px; animation-delay: 0s; }
      &:nth-child(2) { left: 10%; width: 30px; height: 30px; font-size: 20px; animation-delay: 2s; animation-duration: 12s; }
      &:nth-child(3) { left: 70%; width: 40px; height: 40px; font-size: 24px; animation-delay: 4s; }
      &:nth-child(4) { left: 40%; width: 60px; height: 60px; font-size: 30px; animation-delay: 0s; animation-duration: 18s; }
      &:nth-child(5) { left: 65%; width: 20px; height: 20px; font-size: 14px; animation-delay: 0s; }
      &:nth-child(6) { left: 75%; width: 110px; height: 110px; font-size: 60px; animation-delay: 3s; }
      &:nth-child(7) { left: 35%; width: 150px; height: 150px; font-size: 80px; animation-delay: 7s; }
      &:nth-child(8) { left: 50%; width: 25px; height: 25px; font-size: 16px; animation-delay: 15s; animation-duration: 45s; }
      &:nth-child(9) { left: 20%; width: 35px; height: 35px; font-size: 20px; animation-delay: 2s; animation-duration: 35s; }
      &:nth-child(10) { left: 85%; width: 130px; height: 130px; font-size: 70px; animation-delay: 0s; animation-duration: 11s; }
    }
  }

  .login-box-wrapper {
    z-index: 10;
    animation: fade-up 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .login-box {
    width: 380px;
    padding: 45px 40px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.05),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.8);
    position: relative;
    overflow: hidden;
    
    // 优雅的顶部高光线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 35px;
    
    .logo-wrapper {
      margin-bottom: 15px;
      transform: scale(1.1);
    }
    
    .title {
      font-size: 24px;
      color: #303133;
      font-weight: 600;
      margin: 0;
      letter-spacing: 1px;
    }
  }

  ::v-deep .el-input__inner {
    border-radius: 8px;
    height: 44px;
    line-height: 44px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dcdfe6;
    transition: all 0.3s;
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
      background: #fff;
    }
  }

  .login-btn {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 4px;
    background: linear-gradient(135deg, #409EFF, #3a7eed);
    border: none;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    margin-top: 10px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
}

/* =========== 科技暗黑模式 (Tech Mode) =========== */
.theme-tech {
  background-color: #030a16;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  /* 不要在此层加 perspective，否则 overflow:hidden 会拍平 3D 上下文 */
  /* 不要在此层加 overflow: visible，会导致滚动条 */

  /* 强制统一组件内部的字体 */
  ::v-deep .el-input__inner,
  ::v-deep .el-button {
    font-family: inherit;
  }
  
  // 登录成功后登录框淡出缩放
  &.is-unlocking {
    .login-box-wrapper {
      animation: fade-out-zoom 0.4s forwards;
      pointer-events: none;
    }
    .particle-canvas {
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  /* ===== 科技阯门 3D 独立图层 (fixed 不受 overflow:hidden 影响) ===== */
  /* 科技开门动效图层 */
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
    &.entering::after { opacity: 1; }
  }

  /* 左门：默认藏在左侧屏外 */
  .door-left {
    left: 0;
    transform: translateX(-100%);
    &::after { right: -1px; }
    &.entering {
      transform: translateX(0);
      transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  /* 右门：默认藏在右侧屏外 */
  .door-right {
    right: 0;
    transform: translateX(100%);
    &::after { left: -1px; }
    &.entering {
      transform: translateX(0);
      transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  /* 登录成功后登录框淡出 */
  &.is-unlocking .login-box-wrapper {
    animation: fade-out-zoom 0.4s forwards;
    pointer-events: none;
  }

  &.is-unlocking .particle-canvas {
    opacity: 0;
    transition: opacity 0.3s;
  }

  .particle-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .login-box-wrapper {
    z-index: 10;
    perspective: 1000px;
  }

  .login-box {
    width: 420px;
    padding: 50px 45px;
    background: rgba(3, 13, 29, 0.7);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(0, 217, 255, 0.2);
    box-shadow: 
      0 0 30px rgba(0, 217, 255, 0.05),
      inset 0 0 20px rgba(0, 217, 255, 0.05);
    position: relative;
    overflow: hidden;
    animation: tech-box-entry 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    
    // 四角高亮折线
    &::before, &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      transition: all 0.3s;
    }
    &::before {
      top: -1px; left: -1px;
      border-top-color: #00d9ff;
      border-left-color: #00d9ff;
    }
    &::after {
      bottom: -1px; right: -1px;
      border-bottom-color: #00d9ff;
      border-right-color: #00d9ff;
    }
    
    &:hover {
      box-shadow: 
        0 0 40px rgba(0, 217, 255, 0.1),
        inset 0 0 30px rgba(0, 217, 255, 0.1);
        
      &::before, &::after {
        width: 30px;
        height: 30px;
        box-shadow: 0 0 10px #00d9ff;
      }
    }
  }
  
  // 扫光背景特效
  .scan-line-x, .scan-line-y {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.8), transparent);
    z-index: -1;
  }
  .scan-line-x {
    top: 50%; left: -100%;
    width: 100%; height: 1px;
    animation: scan-x 4s linear infinite;
  }
  .scan-line-y {
    left: 50%; top: -100%;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent, rgba(0, 217, 255, 0.8), transparent);
    animation: scan-y 6s linear infinite 2s;
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    
    .logo-wrapper {
      margin-bottom: 20px;
    }
    
    .tech-icon {
      font-size: 52px;
      color: #00d9ff;
      text-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
      margin-bottom: 10px;
    }
    
    .title {
      font-family: inherit;
      font-size: 28px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 8px 0;
      letter-spacing: 4px;
      position: relative;
      text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
    }
    
    .subtitle {
      font-size: 12px;
      color: #00d9ff;
      opacity: 0.6;
      letter-spacing: 2px;
      margin: 0;
    }
  }

  // 深度定制深色形态组件
  ::v-deep .el-input__inner {
    background: rgba(0, 20, 40, 0.6);
    border: 1px solid rgba(0, 217, 255, 0.3);
    color: #00d9ff;
    border-radius: 4px;
    height: 46px;
    line-height: 46px;
    transition: all 0.3s;
    font-family: inherit; // 继承父级统一字体
    letter-spacing: 1px;
    
    &::placeholder {
      color: rgba(0, 217, 255, 0.3);
    }
    
    &:focus {
      background: rgba(0, 30, 60, 0.8);
      border-color: #00d9ff;
      box-shadow: 0 0 15px rgba(0, 217, 255, 0.2), inset 0 0 5px rgba(0, 217, 255, 0.1);
    }
  }
  ::v-deep .el-input__prefix {
    color: rgba(0, 217, 255, 0.6);
  }

  .tech-btn {
    width: 100%;
    height: 48px;
    background: transparent;
    border: 1px solid #00d9ff;
    color: #00d9ff;
    font-size: 16px;
    letter-spacing: 4px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    margin-top: 15px;
    font-family: inherit; // 继承父级统一字体
    border-radius: 2px;
    
    // 背景网格线
    background-image: linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px);
    background-size: 4px 4px;
    
    .btn-text {
      position: relative;
      z-index: 10;
      text-shadow: 0 0 5px rgba(0, 217, 255, 0.5);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.4), transparent);
      transition: all 0.5s;
      z-index: 1;
    }
    
    &:hover {
      background-color: rgba(0, 217, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 217, 255, 0.4), inset 0 0 10px rgba(0, 217, 255, 0.2);
      color: #fff;
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
    }
  }
}

/* =========== 全局动画 =========== */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float-slow {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 20px) scale(1.05); }
  100% { transform: translate(-20px, 40px) scale(0.95); }
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

@keyframes tech-box-entry {
  0% { opacity: 0; transform: scale(0.9) rotateX(-10deg); filter: blur(10px); }
  100% { opacity: 1; transform: scale(1) rotateX(0); filter: blur(0); }
}

@keyframes fade-out-zoom {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
}
</style>
