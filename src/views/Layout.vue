<template>
  <el-container class="app-layout">
    <div class="drawer-bg" v-if="isMobile && isMenuVisible" @click="closeMenu"></div>
    <el-aside width="260px" class="aside" :class="{'is-hidden': !isMenuVisible, 'mobile': isMobile}">
      <div class="logo">
        <lab-logo />
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :background-color="menuBgColor"
        :text-color="menuTextColor"
        :active-text-color="activeTextColor"
        @select="handleMenuSelect"
        unique-opened
      >
        <el-menu-item-group title="开发指南">
          <el-menu-item index="/components/introduction">介绍</el-menu-item>
          <el-menu-item index="/components/directives">自定义指令文档</el-menu-item>
          <el-menu-item index="/download">下载组件</el-menu-item>
          <el-menu-item index="/download/directives">下载自定义指令</el-menu-item>
        </el-menu-item-group>
        
        <el-menu-item-group title="数据展示">
          <el-menu-item index="/components/labtable">Table 表格</el-menu-item>
          <el-menu-item index="/components/labchart">Chart 图表</el-menu-item>
          <el-menu-item index="/components/labqrcode">QRCode 二维码</el-menu-item>
          <el-menu-item index="/components/labvideo">Video 视频</el-menu-item>
          <el-menu-item index="/components/labslice-frame">SliceFrame 九宫格容器</el-menu-item>
          <el-menu-item index="/components/labtext-roll">TextRoll 文字滚动</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="表单组件">
          <el-menu-item index="/components/labform">Form 表单</el-menu-item>
          <el-menu-item index="/components/labupload">Upload 上传</el-menu-item>
          <el-menu-item index="/components/labrichtext">RichText 富文本</el-menu-item>
          <el-menu-item index="/components/labtable-transfer">TableTransfer 表格穿梭</el-menu-item>
          <el-menu-item index="/components/labfuzzy-select">FuzzySelect 模糊查询</el-menu-item>
          <el-menu-item index="/components/labinput-new">InputNew 快捷新增</el-menu-item>
          <el-menu-item index="/components/labip-input">IpInput IP输入框</el-menu-item>
          <el-menu-item index="/components/labexcel-read">ExcelRead 表格读取</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="综合页面">
          <el-menu-item index="/components/labtable-page">TablePage 综合表格</el-menu-item>
        </el-menu-item-group>
      </el-menu>

      <!-- 滚动提示箭头 -->
      <transition name="el-fade-in">
        <div v-if="showScrollArrow" class="menu-scroll-indicator" @click="scrollToBottom">
          <i class="el-icon-arrow-down"></i>
        </div>
      </transition>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <i
            :class="isMenuVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
            class="menu-toggle-btn"
            @click="toggleMenu"
          ></i>
          <span>组件展示文档</span>
        </div>
        <div class="header-right">
          <!-- 移动端隐藏部分功能按钮，避免拥挤 -->
          <view-switcher v-if="!isMobile" />
          <theme-switcher />
          <a href="https://github.com/L3376679936/lab-ai" target="_blank" class="github-link" v-if="!isMobile"><i class="el-icon-link"></i> GitHub</a>
        </div>
      </el-header>
      
      <el-main class="main" ref="mainScroll">
        <!-- ROUTER MODE -->
        <transition name="fade-transform" mode="out-in">
          <div v-show="viewMode === 'router'" :class="{'router-content-wrapper': $route.path !== '/components/introduction'}">
            <router-view />
          </div>
        </transition>

        <!-- SCROLL MODE -->
        <div v-show="viewMode === 'scroll'" v-if="hasVisitedScrollMode" class="scroll-view-container">
          <div id="intro-section" class="scroll-section">
            <home-view />
          </div>
          
           <div id="download-section" class="scroll-section">
             <download-view />
          </div>

          <div id="ldirective-section" class="scroll-section">
             <lab-directive-doc />
          </div>

          <div id="download-directives-section" class="scroll-section">
             <download-directives-view />
          </div>
          
          <div id="ltable-section" class="scroll-section">
             <lab-table-doc />
          </div>

          <div id="lchart-section" class="scroll-section">
             <lab-chart-doc />
          </div>

          <div id="lqrcode-section" class="scroll-section">
             <lab-q-r-code-doc />
          </div>

          <div id="lvideo-section" class="scroll-section">
             <lab-video-doc />
          </div>

          <div id="lslice-frame-section" class="scroll-section">
             <lab-slice-frame-doc />
          </div>

          <div id="lform-section" class="scroll-section">
             <lab-form-doc />
          </div>

          <div id="lupload-section" class="scroll-section">
             <lab-upload-doc />
          </div>

          <div id="lrichtext-section" class="scroll-section">
             <lab-rich-text-doc />
          </div>

          <div id="ltable-transfer-section" class="scroll-section">
             <lab-table-transfer-doc />
          </div>

          <div id="lfuzzy-select-section" class="scroll-section">
             <lab-fuzzy-select-doc />
          </div>

          <div id="linput-new-section" class="scroll-section">
             <lab-input-new-doc />
          </div>

          <div id="lip-input-section" class="scroll-section">
             <lab-ip-input-doc />
          </div>

          <div id="lexcel-read-section" class="scroll-section">
             <lab-excel-read-doc />
          </div>

          <div id="ltext-roll-section" class="scroll-section">
             <lab-text-roll-doc />
          </div>

          <div id="ltable-page-section" class="scroll-section">
             <lab-table-page-doc />
          </div>
        </div>
      </el-main>
      <el-backtop target=".main" :bottom="40" :right="40">
        <div class="lab-backtop-tech">
          <div class="corner-top"></div>
          <div class="corner-bottom"></div>
          <div class="scan-line"></div>
          <i class="el-icon-caret-top"></i>
        </div>
      </el-backtop>
    </el-container>
  </el-container>
</template>

<script>
// ... existing imports ...
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue'
import ViewSwitcher from '@/components/ViewSwitcher/ViewSwitcher.vue'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import LabLogo from '@/components/LabLogo/LabLogo.vue'
const HomeView = () => import('@/views/Home.vue')
const DownloadView = () => import('@/views/Download.vue')
const LabTableDoc = () => import('@/views/components/labTableDoc.vue')
const LabFormDoc = () => import('@/views/components/labFormDoc.vue')
const LabChartDoc = () => import('@/views/components/labChartDoc.vue')
const LabUploadDoc = () => import('@/views/components/labUploadDoc.vue')
const LabTablePageDoc = () => import('@/views/components/labTablePageDoc.vue')
const LabSliceFrameDoc = () => import('@/views/components/labSliceFrameDoc.vue')
const LabQRCodeDoc = () => import('@/views/components/labQRCodeDoc.vue')
const LabTableTransferDoc = () => import('@/views/components/labTableTransferDoc.vue')
const LabVideoDoc = () => import('@/views/components/labVideoDoc.vue')
const LabRichTextDoc = () => import('@/views/components/labRichTextDoc.vue')
const LabDirectiveDoc = () => import('@/views/components/LabDirectiveDoc.vue')
const LabFuzzySelectDoc = () => import('@/views/components/LabFuzzySelectDoc.vue')
const LabInputNewDoc = () => import('@/views/components/LabInputNewDoc.vue')
const LabIpInputDoc = () => import('@/views/components/LabIpInputDoc.vue')
const LabTextRollDoc = () => import('@/views/components/LabTextRollDoc.vue')
const LabExcelReadDoc = () => import('@/views/components/LabExcelReadDoc.vue')
const DownloadDirectivesView = () => import('@/views/DownloadDirectives.vue')

import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    ThemeSwitcher,
    ViewSwitcher,
    DocTitle,
    LabLogo,
    HomeView,
    DownloadView,
    LabTableDoc,
    LabFormDoc,
    LabChartDoc,
    LabUploadDoc,
    LabTablePageDoc,
    LabSliceFrameDoc,
    LabQRCodeDoc,
    LabTableTransferDoc,
    LabVideoDoc,
    LabRichTextDoc,
    LabDirectiveDoc,
    LabFuzzySelectDoc,
    LabInputNewDoc,
    LabIpInputDoc,
    LabTextRollDoc,
    LabExcelReadDoc,
    DownloadDirectivesView
  },
  data() {
    return {
      activeMenu: this.$route.path,
      observer: null,
      isClickScrolling: false,
      isMenuVisible: true, 
      isMobile: false,
      showScrollArrow: false, // 是否显示向下滚动提示
      hasVisitedScrollMode: false, // 是否已访问过滚动视图，用于单例挂载
      sectionMap: {
        '/components/introduction': 'intro-section',
        '/download': 'download-section',
        '/download/directives': 'download-directives-section',
        '/components/directives': 'ldirective-section',
        '/components/labtable': 'ltable-section',
        '/components/labchart': 'lchart-section',
        '/components/labqrcode': 'lqrcode-section',
        '/components/labvideo': 'lvideo-section',
        '/components/labslice-frame': 'lslice-frame-section',
        '/components/labform': 'lform-section',
        '/components/labupload': 'lupload-section',
        '/components/labrichtext': 'lrichtext-section',
        '/components/labtable-transfer': 'ltable-transfer-section',
        '/components/labfuzzy-select': 'lfuzzy-select-section',
        '/components/labinput-new': 'linput-new-section',
        '/components/labip-input': 'lip-input-section',
        '/components/labexcel-read': 'lexcel-read-section',
        '/components/labtext-roll': 'ltext-roll-section',
        '/components/labtable-page': 'ltable-page-section'
      }
    }
  },
  computed: {
    ...mapState(['theme', 'viewMode']),
    menuBgColor() {
      return 'transparent' 
    },
    menuTextColor() {
      return this.theme === 'tech' ? '#b0b0b0' : '#606266'
    },
    activeTextColor() {
      return this.theme === 'tech' ? '#00d9ff' : '#409EFF'
    }
  },
  watch: {
    $route(to) {
      if (this.viewMode === 'router') {
        this.activeMenu = to.path
        if (to.hash) {
          this.$nextTick(() => this.handleHashScroll(to.hash))
        }
      } else {
        // Scroll mode: handle section or hash
        if (to.hash) {
          this.$nextTick(() => this.handleHashScroll(to.hash))
        } else if (to.path) {
          this.handleMenuSelect(to.path)
        }
      }
    },
    viewMode(newMode) {
      if (newMode === 'scroll') {
        this.hasVisitedScrollMode = true
        this.$nextTick(() => {
          this.handleMenuSelect(this.$route.path)
          this.initObserver()
        })
      } else {
        this.destroyObserver()
      }
    }
  },
  mounted() {
    this.checkIsMobile()
    window.addEventListener('resize', this.checkIsMobile)
    
    if (!this.isMobile) {
      this.isMenuVisible = true
    } else {
      this.isMenuVisible = false
    }

      if (this.viewMode === 'scroll') {
      this.hasVisitedScrollMode = true
      this.$nextTick(() => {
        this.initObserver()
      })
    }

    // 初始化滚动检查
    this.$nextTick(() => {
      this.initMenuScroll()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIsMobile)
    this.destroyObserver()
  },
  methods: {
    checkIsMobile() {
      const isMobile = window.innerWidth < 768
      if (isMobile !== this.isMobile) {
        this.isMobile = isMobile
        if (isMobile) {
          this.isMenuVisible = false
        } else {
          this.isMenuVisible = true
        }
      }
    },
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible
    },
    closeMenu() {
      this.isMenuVisible = false
    },
    initObserver() {
      this.destroyObserver()
      
      if (!this.$refs.mainScroll) return;

      const options = {
        root: this.$refs.mainScroll.$el,
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-80px 0px -50% 0px' 
      }

      this.observer = new IntersectionObserver((entries) => {
        const entry = entries.find(e => e.isIntersecting)
        if (entry && !this.isClickScrolling) {
          const id = entry.target.id
          const path = Object.keys(this.sectionMap).find(key => this.sectionMap[key] === id)
          if (path) {
            this.activeMenu = path
          }
        }
      }, options)

      Object.values(this.sectionMap).forEach(id => {
        const el = document.getElementById(id)
        if (el) this.observer.observe(el)
      })
    },
    destroyObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
    handleMenuSelect(index) {
      this.activeMenu = index
      
      // 移动端点击菜单后自动收起
      if (this.isMobile) {
        this.isMenuVisible = false
      }
      
      if (this.viewMode === 'router') {
        if (this.$route.path !== index) {
          this.$router.push(index)
        }
      } else {
        const id = this.sectionMap[index]
        if (id) {
          const el = document.getElementById(id)
          if (el) {
            this.isClickScrolling = true
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => {
              this.isClickScrolling = false
            }, 1000)
          }
        }
      }
    },
    handleHashScroll(hash) {
      const id = hash.replace('#', '')
      // 增加延时以适配异步组件加载后的 ID 捕获
      const executeScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          this.isClickScrolling = true
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => {
            this.isClickScrolling = false
          }, 1000)
        }
      }
      
      // 尝试两次捕获，应对不同加载阶段
      this.$nextTick(executeScroll)
      setTimeout(executeScroll, 300)
    },
    initMenuScroll() {
      const menuEl = this.$el.querySelector('.el-menu-vertical')
      if (menuEl) {
        menuEl.addEventListener('scroll', this.handleMenuScroll)
        // 初次加载和窗口变化时检查
        this.handleMenuScroll()
        window.addEventListener('resize', this.handleMenuScroll)
      }
    },
    handleMenuScroll() {
      const menuEl = this.$el.querySelector('.el-menu-vertical')
      if (menuEl) {
        // 判断是否还有向下滚动的空间 (留出 5px 缓冲)
        const canScrollDown = menuEl.scrollHeight > menuEl.clientHeight + menuEl.scrollTop + 5
        this.showScrollArrow = canScrollDown
      }
    },
    scrollToBottom() {
      const menuEl = this.$el.querySelector('.el-menu-vertical')
      if (menuEl) {
        menuEl.scrollTo({
          top: menuEl.scrollTop + 100,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;
  background-color: var(--bg-color);
  background-image: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(0, 243, 255, 0.05) 0%, transparent 20%);
  transition: all 0.3s ease;
}

.aside {
  background-color: var(--sidebar-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: var(--glass-border);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 10;
  overflow: hidden; // Important for hiding content
  position: relative; // For positioning scroll indicator
  width: 260px !important; // Standard width
  
  &.is-hidden {
    width: 0 !important;
    border-right: none;
    padding: 0;
  }
  
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-bottom: var(--glass-border);
    background: rgba(0,0,0,0.02);
    white-space: nowrap; // Prevent text wrap on shrink
    
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
  }
  
  .el-menu-vertical {
    border-right: none;
    flex: 1;
    background: transparent !important;
    padding: 24px 0;
    overflow-y: auto;
    width: 260px; // Keep content fixed width to avoid reflow during collapse
    position: relative;
    
    // Hide scrollbar
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE/Edge
    &::-webkit-scrollbar {
      display: none; // Chrome/Safari
    }

    // Menu Group Title
    ::v-deep .el-menu-item-group__title {
      padding-left: 24px !important;
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 8px;
      margin-top: 10px;
      letter-spacing: 1px;
    }

    ::v-deep .el-menu-item {
      height: 48px;
      line-height: 48px;
      padding-left: 32px !important;
      font-size: 14px;
      border-radius: 0; 
      margin: 0;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      color: var(--text-color);
      position: relative;
      overflow: hidden;
      
      &:hover {
        background-color: rgba(59, 130, 246, 0.04) !important;
        color: var(--primary-color) !important;
        padding-left: 36px !important; // Subtle push on hover
      }
      
      &.is-active {
        background-color: rgba(59, 130, 246, 0.1) !important;
        color: var(--primary-color) !important;
        border-right: 3px solid var(--primary-color);
        font-weight: 600;
        box-shadow: inset 4px 0 12px -8px var(--primary-color);
        
        // 基础粒子动画 (默认适配亮色/所有主题)
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 90% 40%, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: tech-particles 4s linear infinite, tech-flicker 2s ease-in-out infinite alternate;
          opacity: 0.5;
          z-index: -1;
        }
        
        // 扫描线效果
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
          animation: tech-scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 0;
        }

        // 科技主题下的特殊覆盖 (颜色更亮、带发光)
        .theme-tech & {
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.2), inset 0 0 15px rgba(0, 217, 255, 0.1);
          text-shadow: 0 0 8px rgba(0, 217, 255, 0.5);
          color: #fff !important;
          
          &::before {
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(0, 217, 255, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 30% 50%, rgba(0, 217, 255, 0.2) 1px, transparent 1px),
              radial-gradient(circle at 70% 80%, rgba(0, 217, 255, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 90% 40%, rgba(0, 217, 255, 0.2) 1px, transparent 1px);
            opacity: 0.7;
          }
          
          &::after {
            background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.15), transparent);
          }
        }
    }
  }
}

  // 滚动提示指示器
  .menu-scroll-indicator {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to top, var(--sidebar-bg), transparent);
    color: var(--primary-color);
    cursor: pointer;
    z-index: 100;
    backdrop-filter: blur(2px);
    pointer-events: auto;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 8px;
      width: 40px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 2px;
      opacity: 0.6;
      filter: blur(4px);
      animation: indicator-glow 2s infinite;
    }

    i {
      font-size: 24px;
      font-weight: bold;
      animation: bounce-down-new 2s infinite;
      text-shadow: 0 0 10px var(--primary-color);
    }

    &:hover {
      color: #fff;
      &::before {
        opacity: 0.9;
        filter: blur(6px);
        width: 60px;
      }
    }
  }
}
</style>

<style lang="scss">
@keyframes indicator-glow {
  0%, 100% { opacity: 0.3; transform: scaleX(1); }
  50% { opacity: 0.7; transform: scaleX(1.5); }
}

@keyframes bounce-down-new {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
  40% { transform: translateY(6px) scale(1.1); opacity: 1; }
  60% { transform: translateY(3px) scale(1.05); opacity: 0.9; }
}

@keyframes tech-particles {
  from { background-position: 0 0; }
  to { background-position: 50px 100px; }
}

@keyframes tech-flicker {
  0% { opacity: 0.4; }
  100% { opacity: 0.8; }
}

@keyframes tech-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}



.header {
  background-color: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px !important;
  transition: all 0.3s ease;
  z-index: 9;
  
  .header-left {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    
    .menu-toggle-btn {
      margin-right: 15px;
      cursor: pointer;
      font-size: 20px;
      color: var(--text-secondary);
      transition: color 0.2s;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;
    
    .github-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

.main {
  padding: 0;
  overflow-y: auto;
  position: relative;
  
  // Custom scrollbar for main content
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }
}

.scroll-view-container {
  padding: 40px;
  padding-bottom: 100px;
  max-width: 95%; // Increased for wider view
  margin: 0 auto;
  
  .scroll-section {
    margin-bottom: 80px;
    scroll-margin-top: 80px; 
  }
}

.router-content-wrapper {
  padding: 40px;
  max-width: 95%;
  margin: 0 auto;
  padding-bottom: 60px;
}

// 路由过渡动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

// Mobile Responsiveness
@media (max-width: 768px) {
  .aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    &.is-hidden {
      width: 260px !important; // Restore width to allow transition
      transform: translateX(-100%);
      border-right: none;
    }
    
    &.mobile {
      box-shadow: 2px 0 8px rgba(0,0,0,0.15);
    }
  }

  .header {
    padding: 0 16px;
    
    .header-left span {
      font-size: 16px;
      // Shorten title for mobile maybe
    }
  }

  .scroll-view-container, .router-content-wrapper {
    padding: 20px;
    padding-bottom: 80px; // More space for bottom
    max-width: 100%;
  }

  .lab-table-page {
    padding: 10px;
  }
}
.theme-tech {
  .lab-directive-doc {
    .demo-block {
      background: rgba(10, 25, 47, 0.4) !important;
      border-color: rgba(0, 243, 255, 0.2) !important;
    }
    .key-status {
      background: rgba(0, 243, 255, 0.05) !important;
      border-color: rgba(0, 243, 255, 0.3) !important;
    }
    .ellipsis-wrapper {
      background: rgba(255, 255, 255, 0.03) !important;
      border-color: rgba(0, 243, 255, 0.2) !important;
    }
    .demo-dropdown {
      background: #0d1b2a !important;
      border-color: rgba(0, 243, 255, 0.3) !important;
      li:hover {
        background: rgba(0, 243, 255, 0.1) !important;
      }
    }
    .best-practice-tip {
      background: rgba(230, 162, 60, 0.1) !important;
      border: 1px solid rgba(230, 162, 60, 0.2) !important;
    }
    .demo-tip, .meta-info {
      color: rgba(0, 243, 255, 0.7) !important;
    }
    .custom-wave-box {
      background: rgba(0, 243, 255, 0.15) !important;
      border: 1px solid rgba(0, 243, 255, 0.4) !important;
      color: #00f3ff !important;
    }
    .el-input__inner {
      background-color: rgba(0, 20, 40, 0.8) !important;
      border-color: rgba(0, 243, 255, 0.4) !important;
      color: #00f3ff !important;
      box-shadow: inset 0 0 10px rgba(0, 243, 255, 0.1) !important;
      &::placeholder { color: rgba(0, 243, 255, 0.3) !important; }
    }
    .el-input-number {
      .el-input-number__decrease, .el-input-number__increase {
        background-color: rgba(0, 243, 255, 0.2) !important;
        border-color: rgba(0, 243, 255, 0.4) !important;
        color: #00f3ff !important;
        &:hover {
          background-color: rgba(0, 243, 255, 0.4) !important;
          color: #fff !important;
          box-shadow: 0 0 12px rgba(0, 243, 255, 0.5);
        }
      }
    }
    .el-input-group__append {
      background-color: rgba(0, 243, 255, 0.2) !important;
      border-color: rgba(0, 243, 255, 0.4) !important;
      color: #00f3ff !important;
      .el-button {
        color: #00f3ff !important;
        background-color: transparent !important;
        border: none !important;
        &:hover {
          color: #fff !important;
          text-shadow: 0 0 8px rgba(0, 243, 255, 0.8);
        }
      }
    }
    .el-button--primary:not(.is-plain) {
      background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%) !important;
      box-shadow: 0 0 10px rgba(0, 198, 255, 0.3) !important;
      border: none !important;
    }
  }

  // 全局适配下载页「代码集成」标签页样式
  .el-tabs--border-card {
    background: rgba(0, 20, 40, 0.4) !important;
    border: 1px solid rgba(0, 243, 255, 0.2) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
    
    .el-tabs__header {
      background-color: rgba(0, 243, 255, 0.05) !important;
      border-bottom: 1px solid rgba(0, 243, 255, 0.2) !important;
    }
    
    .el-tabs__item {
      color: rgba(255, 255, 255, 0.5) !important;
      border-right-color: rgba(0, 243, 255, 0.1) !important;
      transition: all 0.3s ease;
      
      &.is-active {
        background-color: rgba(0, 243, 255, 0.1) !important;
        color: #00f3ff !important;
        border-right-color: rgba(0, 243, 255, 0.2) !important;
        border-left-color: rgba(0, 243, 255, 0.2) !important;
        text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
      }
      
      &:hover:not(.is-active) {
        color: #00f3ff !important;
        background-color: rgba(0, 243, 255, 0.02) !important;
      }
    }
    
    .el-tabs__content {
      background: transparent !important;
      padding: 15px !important;
    }
  }

  .code-block {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(0, 243, 255, 0.15) !important;
    color: #4fe3ff !important;
    padding: 15px !important;
    border-radius: 4px;
    font-family: 'Fira Code', Consolas, monospace;
    line-height: 1.6;
    margin: 0;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
  }
}
</style>
