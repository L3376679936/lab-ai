<template>
  <div class="lab-video" :class="[themeClass, { 'is-tech-frame': false }]" :style="customStyleVars">
    <!-- 暗色边框装饰 (HUD风格) -->
    <div v-if="displayTechFrame" class="tech-frame-overlay pointer-events-none">
      <div class="tf-corner tf-corner-tl"></div>
      <div class="tf-corner tf-corner-tr"></div>
      <div class="tf-corner tf-corner-bl"></div>
      <div class="tf-corner tf-corner-br"></div>
      <div class="tf-scan-line"></div>
    </div>

    <video-player
      class="lab-video__player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @statechanged="playerStateChanged($event)"
      @ready="playerReadied"
    />
  </div>
</template>

<script>
/**
 * @component LabVideo
 * @description 基于 video.js 封装的视频播放器组件
 * 集成了暗色主题 HUD 装饰外框，支持多种播放配置和事件监听。
 * 
 * @prop {String} src - 视频源地址 (必填)
 * @prop {String} type - 视频类型，默认 'video/mp4'
 * @prop {String} poster - 视频封面图片地址
 * @prop {Array} playbackRates - 可选的播放倍速列表
 * @prop {Boolean} autoplay - 是否自动播放
 * @prop {Boolean} muted - 是否静音
 * @prop {Boolean} loop - 是否循环播放
 * @prop {String} preload - 预加载策略 ('auto', 'metadata', 'none')
 * @prop {String} aspectRatio - 播放器宽高比，如 '16:9', '4:3'
 * @prop {Boolean} fluid - 是否流体布局（自适应父容器宽度）
 * @prop {Boolean} isTechFrame - 是否强制开启科技外框效果
 * @prop {String} notSupportedMessage - 视频无法播放时的提示信息
 */
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import { videoPlayer } from 'vue-video-player';
import { mapState } from 'vuex';

export default {
  name: 'LabVideo',
  components: {
    videoPlayer
  },
  props: {
    // 视频类型
    type: { type: String, default: 'video/mp4' },
    // 视频源地址
    src: { type: String, required: true },
    // 封面图
    poster: { type: String, default: '' },
    // 播放倍速配置
    playbackRates: { type: Array, default: () => [0.5, 1.0, 1.5, 2.0] },
    // 自动播放
    autoplay: { type: Boolean, default: false },
    // 静音
    muted: { type: Boolean, default: false },
    // 循环播放
    loop: { type: Boolean, default: false },
    // 预加载
    preload: { type: String, default: 'auto' },
    // 宽高比
    aspectRatio: { type: String, default: '16:9' },
    // 流体布局
    fluid: { type: Boolean, default: true },
    // 不支持播放时的提示
    notSupportedMessage: { type: String, default: '此视频暂无法播放，请稍后再试' },
    // 自定义播放按钮样式
    playBtnStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 内部状态
    };
  },
  computed: {
    ...mapState(['theme']),
    // 根据全局主题生成类名
    themeClass() {
      return `theme-${this.theme}`;
    },
    // 是否显示暗色装饰边框：仅当全局主题为 tech (暗色) 时显示
    displayTechFrame() {
      return this.theme === 'tech';
    },
    // 计算 CSS 变量
    customStyleVars() {
      const s = this.playBtnStyle || {};
      const vars = {};
      if (s.width) vars['--pb-width'] = s.width;
      if (s.height) vars['--pb-height'] = s.height;
      if (s.backgroundColor) vars['--pb-bg-color'] = s.backgroundColor;
      if (s.borderColor) vars['--pb-border-color'] = s.borderColor;
      if (s.borderWidth) vars['--pb-border-width'] = s.borderWidth;
      if (s.color) vars['--pb-color'] = s.color;
      if (s.fontSize) vars['--pb-font-size'] = s.fontSize;
      if (s.borderRadius) vars['--pb-radius'] = s.borderRadius;
      return vars;
    },
    // video.js 播放器配置对象
    playerOptions() {
      return {
        playbackRates: this.playbackRates,
        autoplay: this.autoplay,
        muted: this.muted,
        loop: this.loop,
        preload: this.preload,
        language: 'zh-CN',
        aspectRatio: this.aspectRatio,
        fluid: this.fluid,
        sources: [{ type: this.type, src: this.src }],
        poster: this.poster,
        notSupportedMessage: this.notSupportedMessage,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      };
    },
    // 获取播放器实例
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    // 播放器事件透传
    onPlayerPlay(player) { this.$emit('play', player); },
    onPlayerPause(player) { this.$emit('pause', player); },
    onPlayerEnded(player) { this.$emit('ended', player); },
    onPlayerWaiting(player) { this.$emit('waiting', player); },
    onPlayerPlaying(player) { this.$emit('playing', player); },
    onPlayerLoadeddata(player) { this.$emit('loaded-data', player); },
    onPlayerTimeupdate(player) { this.$emit('time-update', player); },
    onPlayerCanplay(player) { this.$emit('can-play', player); },
    onPlayerCanplaythrough(player) { this.$emit('can-play-through', player); },
    playerStateChanged(playerCurrentState) { this.$emit('state-changed', playerCurrentState); },
    
    // 播放器准备就绪
    playerReadied(player) {
      // 可以在此处添加额外的初始化逻辑
      this.$emit('ready', player);
    }
  }
};
</script>

<style lang="scss" scoped>
.lab-video {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #000;
  
  .tech-frame-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none; // 点击穿透
    
    .tf-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(0, 243, 255, 0.8);
      transition: all 0.3s;
    }
    
    .tf-corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .tf-corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
    .tf-corner-bl { bottom: 35px; // 避开控制栏
                    left: 10px; border-right: none; border-top: none; }
    .tf-corner-br { bottom: 35px; right: 10px; border-left: none; border-top: none; }
    
    .tf-scan-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.5), transparent);
      animation: video-scan 4s linear infinite;
      opacity: 0.3;
    }
  }
  
  // 全局播放器样式覆盖
  ::v-deep .video-js {
    // 播放按钮强制居中及自定义样式支持
    .vjs-big-play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      
      // 动态样式绑定 (默认值保持 vjs 原生或原有预设)
      width: var(--pb-width, 1.63em);
      height: var(--pb-height, 1.63em);
      line-height: var(--pb-height, 1.63em);
      background-color: var(--pb-bg-color, rgba(43, 51, 63, 0.7));
      color: var(--pb-color, #fff);
      border: var(--pb-border-width, 0.06666em) solid var(--pb-border-color, #fff);
      border-radius: var(--pb-radius, 0.3em);
      font-size: var(--pb-font-size, 3em);
      transition: all 0.3s;
    }
  }
  
  &.theme-tech {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 243, 255, 0.1);
    
    ::v-deep .video-js {
      .vjs-control-bar {
        background-color: rgba(13, 27, 45, 0.85);
        border-top: 1px solid rgba(0, 243, 255, 0.2);
      }
      
      .vjs-play-progress {
        background-color: var(--primary-color, #00d9ff);
        &::before {
          color: #fff;
          text-shadow: 0 0 5px var(--primary-color);
        }
      }
      
      .vjs-slider {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      // 科技主题播放按钮样式 (优先使用 CSS 变量，否则使用科技主题默认值)
      .vjs-big-play-button {
        width: var(--pb-width, 2em);
        height: var(--pb-height, 2em);
        line-height: var(--pb-height, 2em);
        font-size: var(--pb-font-size, 4em);
        background-color: var(--pb-bg-color, rgba(13, 27, 45, 0.6));
        border: var(--pb-border-width, 1px) solid var(--pb-border-color, var(--primary-color));
        color: var(--pb-color, var(--primary-color));
        border-radius: var(--pb-radius, 50%);
        
        &:hover {
          background-color: var(--primary-color);
          color: #fff;
          box-shadow: 0 0 20px var(--primary-color);
        }
      }
    }
  }
}

@keyframes video-scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
}

.pointer-events-none {
  pointer-events: none;
}
</style>
