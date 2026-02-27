<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="text-upper">Next Gen UI</span>
          <span class="highlight">Lab-AI</span>
        </h1>
        <p class="hero-subtitle">
          专为现代化大屏与后台系统打造的 Vue 2 组件库。
          <br>融合科技美学与实用主义。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="medium" round icon="el-icon-video-play" @click="$router.push('/components/labTable')">开始使用</el-button>
          <el-button size="medium" round icon="el-icon-download" @click="$router.push('/download')">下载源码</el-button>
        </div>
      </div>
      <div class="hero-image">
        <div class="code-preview glass-card">
          <div class="preview-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="preview-body">
            <div class="holo-interface">
               <div class="circle-outer"></div>
               <div class="circle-inner"></div>
               <!-- Floating Stats Center -->
               <div class="floating-stat">
                 <span class="label">SYSTEM STATUS</span>
                 <span class="value">
                   <span class="online-text">ONLINE</span>
                   <span class="cursor"></span>
                 </span>
                 <span class="status-ring"></span>
               </div>
               
               <!-- Orbiting Dots -->
               <div class="orbit-path">
                 <div class="orbit-dot"></div>
               </div>
               <div class="orbit-path path-2">
                 <div class="orbit-dot dot-2"></div>
               </div>

               <!-- Active Users Bubble -->
               <div class="active-users-bubble">
                  <span class="dot"></span>
                  1.2k Users
               </div>

               <div class="scan-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card glass-card">
        <div class="icon-box blue">
          <i class="el-icon-magic-stick"></i>
        </div>
        <h3>开箱即用</h3>
        <p>基于 Element UI 深度封装，无需繁琐配置，专注于业务逻辑开发。</p>
      </div>
      <div class="feature-card glass-card">
        <div class="icon-box cyan">
          <i class="el-icon-cpu"></i>
        </div>
        <h3>双模主题</h3>
        <p>内置 <b>Tech</b> 与 <b>Normal</b> 模式，一键切换黑科技大屏与清爽后台风格。</p>
      </div>
      <div class="feature-card glass-card">
        <div class="icon-box purple">
          <i class="el-icon-box"></i>
        </div>
        <h3>按需构建</h3>
        <p>提供源码级按需下载，零冗余引入，让你的项目保持轻量。</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1600px; // Increased from 1200px
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;
  gap: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.hero-content {
  flex: 1;
  
  .hero-title {
    font-size: 64px;
    font-weight: 800;
    margin-bottom: 24px;
    line-height: 1.1;
    color: var(--text-color);
    position: relative;
    letter-spacing: -2px;
    
    .text-upper {
      display: block;
      font-size: 40px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .highlight {
      background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .hero-subtitle {
    font-size: 20px;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 40px;
    max-width: 600px;
    
    @media (max-width: 768px) {
      margin: 0 auto 40px;
    }
  }
  
  .hero-actions {
    display: flex;
    gap: 16px;
    
    @media (max-width: 768px) {
      justify-content: center;
    }

    ::v-deep .el-button--primary {
      background: var(--primary-gradient);
      border: none;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
    
    ::v-deep .el-button--default {
      background: var(--glass-bg);
      border: var(--glass-border);
      color: var(--text-color);
      
      &:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
    }
  }
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: var(--primary-color);
    filter: blur(80px);
    opacity: 0.2;
    border-radius: 50%;
    z-index: 0;
  }
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  z-index: 10; // Bring main card to front
}

.backdrop-card {
  position: absolute;
  width: 200px;
  height: 140px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1; // Behind main card
  padding: 16px;
  display: flex;
  flex-direction: column;
  
  &.neural-card {
    top: -40px;
    left: 20px;
    transform: rotate(-15deg);
    animation: float-slow 6s ease-in-out infinite;

    .neural-header {
      display: flex;
      justify-content: space-between;
      color: var(--primary-color);
      font-size: 12px;
      margin-bottom: 10px;
    }
    .neural-body {
      flex: 1;
      position: relative;
      .node {
        width: 8px;
        height: 8px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        box-shadow: 0 0 5px #fff;
        &.n1 { top: 10px; left: 10px; animation: blink 2s infinite; }
        &.n2 { top: 40px; left: 50px; animation: blink 2s infinite 0.3s; }
        &.n3 { top: 10px; left: 90px; animation: blink 2s infinite 0.6s; }
      }
      .link {
        position: absolute;
        height: 1px;
        background: rgba(255,255,255,0.3);
        transform-origin: 0 0;
        &.l1 { top: 14px; left: 14px; width: 50px; transform: rotate(35deg); }
        &.l2 { top: 44px; left: 54px; width: 50px; transform: rotate(-35deg); }
      }
    }
  }

  &.analysis-card {
    bottom: -30px;
    right: 20px;
    transform: rotate(10deg);
    animation: float-slow 7s ease-in-out infinite reverse;
    
    .analysis-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #06b6d4;
      margin-bottom: 10px;
      .status-dot {
        width: 6px;
        height: 6px;
        background: #27c93f;
        border-radius: 50%;
        animation: pulse 1s infinite;
      }
    }
    .analysis-body {
      flex: 1;
      position: relative;
      overflow: hidden;
      .wave-line {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #06b6d4, transparent);
        animation: scan 2s linear infinite;
        &.delay { animation-delay: 1s; }
      }
    }
  }
}

.code-preview {
  width: 100%;
  max-width: 400px;
  height: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.3s ease;
  z-index: 10; // Ensure on top
  
  &:hover {
    transform: perspective(1000px) rotateY(0) rotateX(0);
  }
  
  .preview-header {
    height: 36px;
    background: rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    border-bottom: var(--glass-border);
    
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      &.red { background: #ff5f56; }
      &.yellow { background: #ffbd2e; }
      &.green { background: #27c93f; }
    }
  }
  
  .preview-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible; // Allow floating elements to extend
    
    .holo-interface {
      width: 240px; // Larger
      height: 240px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .circle-outer {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        border-bottom-color: var(--primary-color);
        animation: spin 10s linear infinite;
      }
      
      .circle-inner {
        position: absolute;
        width: 70%;
        height: 70%;
        border: 2px dashed rgba(0, 243, 255, 0.5);
        border-radius: 50%;
        animation: spin-reverse 15s linear infinite;
      }

      // Orbit Styles
      .orbit-path {
        position: absolute;
        width: 140%;
        height: 140%;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.05);
        animation: spin 20s linear infinite;

        .orbit-dot {
          position: absolute;
          top: 0;
          left: 50%;
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--primary-color);
          transform: translate(-50%, -50%);
        }
        
        &.path-2 {
          width: 180%;
          height: 180%;
          animation: spin-reverse 25s linear infinite;
          opacity: 0.6;
           .dot-2 { background: #8b5cf6; box-shadow: 0 0 10px #8b5cf6; }
        }
      }

      .active-users-bubble {
        position: absolute;
        bottom: -60px;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.4);
        padding: 6px 16px;
        border-radius: 20px;
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(4px);
        animation: float-card 3s ease-in-out infinite 1.5s;

        .dot {
          width: 6px;
          height: 6px;
          background: #27c93f;
          border-radius: 50%;
          box-shadow: 0 0 5px #27c93f;
          animation: pulse 1s infinite;
        }
      }
      
      .floating-stat {
        text-align: center;
        z-index: 2;
        position: relative;
        
        .label {
          display: block;
          font-size: 10px;
          color: var(--text-secondary);
          letter-spacing: 3px;
          margin-bottom: 8px;
          animation: label-fade 3s ease-in-out infinite;
        }
        .value {
          font-size: 28px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
          
          .online-text {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            letter-spacing: 4px;
            animation: text-glow-sweep 2.5s ease-in-out infinite;
            
            /* 扫光覆盖层 */
            &::after {
              content: 'ONLINE';
              position: absolute;
              top: 0;
              left: -100%;
              width: 40%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
              -webkit-background-clip: text;
              background-clip: text;
              animation: sweep-shine 2.5s ease-in-out infinite;
            }
          }
          
          /* 错误：-webkit-text-fill-color 不能用 content overlay。改用一个透明 div 做扫光 */
          .sweep-overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
            animation: sweep-move 2.5s ease-in-out infinite;
          }
          
          /* 光标颗烁 */
          .cursor {
            display: inline-block;
            width: 2px;
            height: 28px;
            background: var(--primary-color);
            box-shadow: 0 0 6px var(--primary-color);
            animation: cursor-blink 1.2s step-start infinite;
            border-radius: 1px;
          }
        }
        
        /* 呼吸光晒 */
        .status-ring {
          display: block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid rgba(59, 130, 246, 0.3);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: ring-breathe 2s ease-in-out infinite;
          pointer-events: none;
          
          &::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(59, 130, 246, 0.15);
            animation: ring-breathe 2s ease-in-out infinite 0.5s;
            transform: scale(1.4);
          }
        }
      }
      
      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.5;
        animation: scan 4s ease-in-out infinite;
      }
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px;
  transition: transform 0.3s ease, border-color 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
  }
  
  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 20px;
    
    &.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    &.cyan { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
    &.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
  }
  
  h3 {
    margin: 0 0 12px;
    font-size: 20px;
    color: var(--text-color);
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 0.8; }
}

@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@keyframes float-card {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ONLINE 区域动画 */
@keyframes label-fade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes text-glow-sweep {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6)); }
  50% { filter: drop-shadow(0 0 14px rgba(59, 130, 246, 1)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)); }
}

@keyframes sweep-move {
  0% { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 1; }
  60% { opacity: 1; }
  100% { transform: translateX(200%); opacity: 0; }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes ring-breathe {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.8;
    box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.2);
  }
}</style>
