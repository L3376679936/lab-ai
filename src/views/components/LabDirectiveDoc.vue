<template>
  <div class="lab-directive-doc">
    <doc-title title="自定义指令库" subtitle="提供一系列实用的 Vue 自定义指令，支持在线体验与源码下载。" />

    <div class="directive-list">
      
      <!-- 1. v-debounce (防抖) -->
      <code-display
        id="debounce"
        title="v-debounce 防抖指令"
        description="防止按钮或输入框等在短时间内被触发多次，支持自定义时间、事件类型及传递参数。"
        :code="debounceCode"
      >
        <div class="demo-block">
          <p class="demo-tip">配置对象：{ fn, event, time, args }</p>
          <div class="demo-row">
            <el-button type="primary" v-debounce="{ fn: handleDebounceClick, event: 'click', time: 1000, args: ['重要操作'] }">
              操作按钮 (1s防抖)
            </el-button>
            <span class="count-badge">触发次数：{{ debounceCount }}</span>
          </div>
          <p class="meta-info">最近参数：{{ lastDebounceArg }}</p>
        </div>
      </code-display>

      <!-- 2. v-throttle (节流) -->
      <code-display
        id="throttle"
        title="v-throttle 节流指令"
        description="限制事件在指定时间内只触发一次，适用于滚动、窗口缩放等高频触发场景。"
        :code="throttleCode"
      >
        <div class="demo-block">
          <p class="demo-tip">配置数组：[fn, time, event, ...args]</p>
          <div class="demo-row" @mousemove="onThrottleMove">
            <div 
              class="throttle-box"
              v-throttle="[handleThrottleClick, 1000, 'click', '节流数据']"
            >
              点击我 (1s节流)
            </div>
            <span class="count-badge">触发次数：{{ throttleCount }}</span>
          </div>
        </div>
      </code-display>

      <!-- 3. v-hotkey (键盘指令) -->
      <code-display
        id="hotkey"
        title="v-hotkey 键盘热键"
        description="为页面元素绑定快捷键操作。注意：绑定在容器上时，容器或其子元素（如输入框）需获得焦点。"
        :code="hotkeyCode"
      >
        <div class="demo-block hotkey-container" v-hotkey="keymap">
          <p class="demo-tip">点击下方输入框并按下 [Ctrl + S] 触发保存，按 [Esc] 清空提示。</p>
          <div class="demo-row">
            <el-input 
              v-model="hotkeyInput" 
              placeholder="在这里输入文字并测试快捷键" 
              style="width: 300px;"
            ></el-input>
          </div>
          <div :class="['key-status', { active: hotkeyActive }]" style="margin-top: 12px;">
            {{ hotkeyMsg || '等待快捷键输入...' }}
          </div>
        </div>
      </code-display>

      <!-- 4. v-copy (复制) -->
      <code-display
        id="copy"
        title="v-copy 复制指令"
        description="一键复制文本到剪贴板，使用现代 Clipboard API，并向下兼容。"
        :code="copyCode"
      >
        <div class="demo-block">
          <el-input v-model="copyText" style="width: 260px; margin-right: 12px;" placeholder="输入要复制的内容">
            <el-button slot="append" v-copy="copyText">复制</el-button>
          </el-input>
        </div>
      </code-display>

      <!-- 5. v-ellipsis (文本省略) -->
      <code-display
        id="ellipsis"
        title="v-ellipsis 文本省略"
        description="自动处理单行或多行文本省略，超出时鼠标悬浮显示完整内容的内容预览（Tooltip）。"
        :code="ellipsisCode"
      >
        <div class="demo-block">
          <div class="ellipsis-controls">
            <span class="demo-tip">调整行数限制：</span>
            <el-input-number v-model="ellipsisLines" :min="1" :max="5" size="mini"></el-input-number>
            <span class="demo-tip" style="margin-left: 20px;">当前状态：{{ ellipsisLines }}行省略</span>
          </div>

          <div class="ellipsis-comparison">
            <div class="comparison-item">
              <p class="demo-tip">应用指令后 (鼠标悬浮查看完整内容)：</p>
              <div class="ellipsis-wrapper tall">
                <div :key="ellipsisLines" v-ellipsis="ellipsisLines" class="ellipsis-content">
                  Vue 指令（Directives）是带有 v- 前缀的特殊属性。指令属性的值预期是单个 JavaScript 表达式（v-for 是例外情况）。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。通常用于底层 DOM 渲染逻辑的封装。
                </div>
              </div>
              <p class="best-practice-tip">
                <i class="el-icon-info"></i> 最佳实践：多行省略建议在无 padding 的子元素上使用，避免截断位置出现“半行”残留。
              </p>
            </div>
          </div>
        </div>
      </code-display>

      <!-- 6. v-waves (水波纹) -->
      <code-display
        id="waves"
        title="v-waves 水波纹"
        description="Material Design 风格的点击交互效果，支持自定义波纹颜色。"
        :code="wavesCode"
      >
        <div class="demo-block waves-demo">
          <el-button type="primary" v-waves>默认波纹</el-button>
          <el-button type="info" v-waves="'rgba(255, 255, 255, 0.4)'">半透明白</el-button>
          <div v-waves class="custom-wave-box">Div 容器</div>
        </div>
      </code-display>

      <!-- 7. v-waterMarker (水印) -->
      <code-display
        id="waterMarker"
        title="v-waterMarker 水印"
        description="为指定容器生成背景水印，防截图防盗用。"
        :code="waterMarkerCode"
      >
        <div 
          class="watermark-demo" 
          v-waterMarker="{ text: 'Lab AI Project', textColor: 'rgba(180, 180, 180, 0.15)' }"
        >
          <p>此容器已被 v-waterMarker 指令保护</p>
          <div class="content-placeholder"></div>
        </div>
      </code-display>

      <!-- 8. v-clickOutside (点击外部) -->
      <code-display
        id="clickOutside"
        title="v-clickOutside 点击外部"
        description="检测点击事件是否发生在目标元素之外，常用于关闭下拉框、弹窗等。"
        :code="clickOutsideCode"
      >
        <div class="demo-block">
          <el-button type="primary" plain @click.stop="isDropdownOpen = !isDropdownOpen">
            {{ isDropdownOpen ? '点击外部关闭' : '打开下拉菜单' }}
          </el-button>
          <transition name="el-zoom-in-top">
            <ul v-if="isDropdownOpen" v-clickOutside="() => isDropdownOpen = false" class="demo-dropdown">
              <li>菜单项 1</li>
              <li>菜单项 2</li>
              <li>菜单项 3</li>
            </ul>
          </transition>
        </div>
      </code-display>

      <!-- 9. v-progressive-img (渐进式加载) -->
      <code-display
        id="progressiveImg"
        title="v-progressive-img 渐进式加载"
        description="通过模糊占位并在大图加载完成后平滑切换，提升视觉连贯性，避免生硬闪烁。"
        :code="progressiveImgCode"
      >
        <div class="demo-block">
          <p class="demo-tip">点击按钮模拟图片更换 (由于 Pixabay 响应较快，可能需要开启 Network Throttle 查看效果)：</p>
          <div class="progressive-demo-container">
            <div class="progressive-viewport shadow-card">
              <img 
                v-progressive-img="currentProgressiveImg" 
                class="progressive-img" 
                alt="Progressive Demo"
              >
            </div>
            <div class="progressive-controls">
              <el-button size="small" type="primary" plain @click="reloadProgressiveImg">随机模拟</el-button>
              <span class="img-source">来源：Pixabay 高清图库</span>
            </div>
          </div>
        </div>
      </code-display>

      <!-- 10. v-lazyload (懒加载) -->
      <code-display
        id="lazyload"
        title="v-lazyload 图片懒加载"
        description="基于 IntersectionObserver API，仅在图片进入视口时才开始加载，有效减少首屏请求量。"
        :code="lazyloadCode"
      >
        <div class="demo-block">
          <p class="demo-tip">请向下滚动下方区域查看懒加载效果 (已增加 50px 预加载边距)：</p>
          <div class="lazy-demo-scroll-box">
             <div class="spacer-top">
                <i class="el-icon-bottom"></i>
                <span>向上滚动，下方图片正在等待加载...</span>
             </div>
             <div class="lazy-img-wrapper">
               <img 
                 v-lazyload="'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'" 
                 class="lazy-img"
               >
               <div class="lazy-label">科技芯片 (Lazy Loaded)</div>
             </div>
          </div>
          <p class="meta-info">提示：打开浏览器 F12 控制台，搜索 "[Lazyload]" 可查看实时触发日志。</p>
        </div>
      </code-display>

    </div>


  </div>
</template>

<script>
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabDirectiveDoc',
  components: {
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      // 状态变量
      copyText: 'Lab-AI 智联 UI 库',
      debounceCount: 0,
      lastDebounceArg: '无',
      throttleCount: 0,
      isDropdownOpen: false,
      hotkeyMsg: '',
      hotkeyActive: false,
      hotkeyInput: '',
      ellipsisLines: 2,
      currentProgressiveImg: 'https://cdn.pixabay.com/photo/2023/03/20/20/35/sunset-7865844_1280.jpg',
      progressiveImgIndex: 0,
      progressiveImgList: [
        'https://cdn.pixabay.com/photo/2023/03/20/20/35/sunset-7865844_1280.jpg', // 夕阳
        'https://cdn.pixabay.com/photo/2016/11/29/04/19/ocean-1867285_1280.jpg', // 海洋
        'https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg', // 代码
        'https://cdn.pixabay.com/photo/2017/08/10/08/47/laptop-2619495_1280.jpg', // 电脑
        'https://cdn.pixabay.com/photo/2015/01/08/18/27/startup-593341_1280.jpg', // 创业
        'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg', // 星空
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=80', // 森林 (Unsplash)
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1280&q=80' // 风景 (Unsplash)
      ],
      
      // 代码片段
      debounceCode: `<el-button v-debounce="{ 
  fn: handleDebounceClick, 
  event: 'click', 
  time: 1000,
  args: ['重要操作'] 
}">
  操作按钮 (1s防抖)
</el-button>`,
      throttleCode: `<div 
  class="throttle-box"
  v-throttle="[handleThrottleClick, 1000, 'click', '节流数据']"
>
  点击我 (1s节流)
</div>`,
      hotkeyCode: `<div class="demo-block hotkey-container" v-hotkey="{
  'ctrl+s': onSaveHotkey,
  'esc': onClearHotkey
}">
  监听按键区域 (需先获得焦点)
</div>`,
      copyCode: `<el-button v-copy="'要复制的内容'">复制</el-button>`,
      ellipsisCode: `<!-- 单行省略 -->
<div v-ellipsis>长文本...</div>

<!-- 多行省略 (指定行数) -->
<div v-ellipsis="3">更长的文本...</div>`,
      wavesCode: `<el-button type="primary" v-waves>默认波纹</el-button>
<el-button type="info" v-waves="'rgba(255, 255, 255, 0.4)'">半透明白</el-button>
<div v-waves class="custom-wave-box">Div 容器</div>`,
      waterMarkerCode: `<div v-waterMarker="{ 
  text: 'Lab AI Project', 
  textColor: 'rgba(180, 180, 180, 0.15)' 
}"></div>`,
      clickOutsideCode: `<ul v-if="isDropdownOpen" v-clickOutside="() => isDropdownOpen = false">
  <li>菜单项...</li>
</ul>`,
      progressiveImgCode: `<img 
  v-progressive-img="currentProgressiveImg" 
  class="progressive-img"
>`,
      lazyloadCode: `<img v-lazyload="'https://example.com/image.jpg'">`
    }
  },
  computed: {
    keymap() {
      return {
        'ctrl+s': this.onSaveHotkey,
        'esc': this.onClearHotkey
      }
    }
  },
  methods: {
    handleDebounceClick(val) {
      this.debounceCount++
      this.lastDebounceArg = val
      this.$message.success('防抖函数执行成功！')
    },
    handleThrottleClick(val) {
      this.throttleCount++
      this.$message.info('节流触发：' + val)
    },
    onThrottleMove() {
       // 节流通常用于 move 等高频事件，此处仅为演示点击节流
    },
    onSaveHotkey(e) {
      e.preventDefault()
      this.hotkeyMsg = '检测到 [Ctrl + S]，已执行保存逻辑'
      this.hotkeyActive = true
      setTimeout(() => this.hotkeyActive = false, 1000)
    },
    onClearHotkey() {
      this.hotkeyMsg = ''
      this.$message('提示已清空')
    },
    reloadProgressiveImg() {
       this.progressiveImgIndex = (this.progressiveImgIndex + 1) % this.progressiveImgList.length
       this.currentProgressiveImg = this.progressiveImgList[this.progressiveImgIndex]
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-directive-doc {
  padding-bottom: 80px;
  
  .directive-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-block {
    .demo-tip {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 12px;
      font-family: inherit;
    }

    .demo-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .count-badge {
      font-size: 14px;
      color: var(--primary-color);
      font-weight: 600;
    }

    .meta-info {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
  }

  .throttle-box {
    width: 150px;
    height: 40px;
    background: var(--primary-gradient);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity 0.3s;
    &:hover { opacity: 0.9; }
  }

  .key-status {
    padding: 15px;
    background: var(--bg-color-soft);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    font-family: monospace;
    transition: all 0.3s;
    &.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
      box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
    }
  }

  .ellipsis-wrapper {
    background: var(--bg-color-soft);
    padding: 10px;
    border-radius: 4px;
    width: 450px;
    border: 1px solid var(--border-color);
  }

  .ellipsis-content {
    font-size: 14px;
    color: var(--text-color);
    line-height: 1.6;
    height: auto;
  }

  .ellipsis-controls {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .best-practice-tip {
    margin-top: 12px;
    font-size: 12px;
    color: #e6a23c;
    background: rgba(230, 162, 60, 0.05);
    padding: 8px 12px;
    border-radius: 4px;
    display: inline-block;
  }

  .waves-demo {
    display: flex;
    align-items: center;
    gap: 12px;
    .custom-wave-box {
      width: 100px;
      height: 40px;
      background: #333;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
  }

  .watermark-demo {
    height: 180px;
    border: 1px dashed var(--border-color);
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content-placeholder {
       height: 60px;
       background: rgba(0,0,0,0.02);
       width: 100%;
       border-radius: 4px;
    }
  }

  .demo-dropdown {
    list-style: none;
    margin: 10px 0 0;
    padding: 5px 0;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    border-radius: 4px;
    width: 150px;
    li {
      padding: 0 20px;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      &:hover { background: var(--bg-color-soft); color: var(--primary-color); }
    }
  }

  .progressive-demo-container {
    width: 100%;
    max-width: 600px; // 给予充足的呼吸空间，防止右侧显示不全

    .progressive-viewport {
      width: 100%;
      max-width: 500px;
      height: 300px;
      overflow: hidden; // 只在图片观察口开启裁剪
      border-radius: 8px;
      background: #f0f2f5;
      position: relative;
      border: 1px solid var(--border-color); // 增加默认边框
      
      &.shadow-card {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }

    .progressive-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .progressive-controls {
      margin-top: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 2px; // 确保按钮阴影/边框不被容器紧邻裁剪

      .img-source {
        font-size: 12px;
        color: var(--text-secondary);
        font-style: italic;
      }
    }
  }

  .download-section {
    margin-top: 50px;
    text-align: center;
    border-top: 1px solid var(--border-color);
    padding-top: 40px;
  }

  /* 懒加载专用演示样式 */
  .lazy-demo-scroll-box {
    height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color-soft);
    
    .spacer-top {
      height: 450px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
      color: var(--text-secondary);
      background: repeating-linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 10px, transparent 10px, transparent 20px);
      i { font-size: 24px; animation: bounce 2s infinite; }
    }

    .lazy-img-wrapper {
      padding: 20px;
      .lazy-img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: block;
        transition: all 0.5s;
        cursor: pointer; // 提示可以手动点击
        &:hover { transform: scale(1.01); }
      }
      .lazy-label {
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        color: var(--primary-color);
        font-weight: bold;
      }
    }
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
</style>

<style lang="scss">
/* 科技主题深度策略适配 (非 Scoped，确保匹配全局 .theme-tech 类) */
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

    /* Element UI 组件深度适配 */
    .el-input__inner {
      background-color: rgba(0, 20, 40, 0.8) !important;
      border-color: rgba(0, 243, 255, 0.4) !important;
      color: #00f3ff !important;
      box-shadow: inset 0 0 10px rgba(0, 243, 255, 0.1) !important;
      &::placeholder {
        color: rgba(0, 243, 255, 0.3) !important;
      }
    }

    .el-input-number {
      .el-input-number__decrease, 
      .el-input-number__increase {
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

    .progressive-viewport {
      border: 1px solid rgba(0, 243, 255, 0.4) !important;
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.1) !important;
    }
  }
}
</style>
