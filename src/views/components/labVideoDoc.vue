<template>
  <div class="lab-video-doc" :class="`theme-${theme}`">
    <doc-title title="LabVideo" subtitle="基于 video.js 的封装组件，提供统一的视频播放体验，并集成暗色主题 HUD 装饰外框。" />

    <code-display 
      title="基础用法" 
      description="支持多种比例、封面设置以及暗色装饰边框（在暗色主题下自动激活）。" 
      :code="baseCode"
    >
      <div class="demo-controls">
        <span>比例：</span>
        <el-radio-group v-model="aspectRatio" size="mini" style="margin-right: 20px;">
          <el-radio-button label="16:9">16:9</el-radio-button>
          <el-radio-button label="4:3">4:3</el-radio-button>
          <el-radio-button label="21:9">21:9</el-radio-button>
        </el-radio-group>
      </div>

      <div class="video-container" :style="{ width: '100%', maxWidth: '800px' }">
        <lab-video 
          ref="video"
          src="http://vjs.zencdn.net/v/oceans.mp4" 
          poster="https://vjs.zencdn.net/v/oceans.png"
          :aspect-ratio="aspectRatio"
          @play="onPlay"
          @pause="onPause"
        />
      </div>
      
      <div style="margin-top: 15px; font-size: 13px; color: var(--text-secondary);">
        当前状态：{{ status }}
      </div>
    </code-display>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>

    <h3>组件事件 (Events)</h3>
    <el-table :data="events" border size="small" class="api-table">
      <el-table-column prop="name" label="事件名" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="params" label="回调参数" />
    </el-table>
  </div>
</template>

<script>
import LabVideo from '@/components/LabVideo/index.vue'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'
import { mapState } from 'vuex'

export default {
  name: 'LabVideoDoc',
  components: {
    LabVideo,
    DocTitle,
    CodeDisplay
  },
  computed: {
    ...mapState(['theme'])
  },
  data() {
    return {
      aspectRatio: '16:9',
      status: '就绪',
      baseCode: `
<lab-video 
  src="http://vjs.zencdn.net/v/oceans.mp4" 
  poster="cover.png"
  aspect-ratio="16:9"
/>
`.trim(),
      attributes: [
        { prop: 'src', desc: '视频地址', type: 'String', default: '-' },
        { prop: 'type', desc: '视频类型', type: 'String', default: 'video/mp4' },
        { prop: 'poster', desc: '封面图片地址', type: 'String', default: '' },
        { prop: 'autoplay', desc: '是否自动播放', type: 'Boolean', default: 'false' },
        { prop: 'loop', desc: '是否循环播放', type: 'Boolean', default: 'false' },
        { prop: 'aspectRatio', desc: '宽高比 (16:9, 4:3 等)', type: 'String', default: '16:9' },
        { prop: 'playBtnStyle', desc: '自定义播放按钮样式对象', type: 'Object', default: '{}' },
      ],
      events: [
        { name: 'play', desc: '开始播放', params: 'player instance' },
        { name: 'pause', desc: '暂停播放', params: 'player instance' },
        { name: 'ended', desc: '播放结束', params: 'player instance' },
        { name: 'time-update', desc: '播放进度更新', params: 'player instance' },
      ]
    }
  },
  methods: {
    onPlay() { this.status = '播放中...' },
    onPause() { this.status = '已暂停' }
  }
}
</script>

<style lang="scss" scoped>
.lab-video-doc {
  .demo-controls {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    .divider {
      width: 1px;
      height: 14px;
      background: #dcdfe6;
      margin: 0 15px;
    }
  }

  &.theme-tech {
    .demo-controls {
      ::v-deep .el-radio-button__inner {
        background: rgba(13, 27, 45, 0.6);
        border-color: rgba(0, 243, 255, 0.3);
        color: #b0b0b0;
        box-shadow: none !important;
      }

      ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: rgba(0, 243, 255, 0.2);
        border-color: #00d9ff;
        color: #00d9ff;
        box-shadow: none;
      }
    }
  }
}
</style>
