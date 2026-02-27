<template>
  <div class="lab-text-roll-doc">
    <doc-title title="LabTextRoll" subtitle="无缝文字滚动组件，支持水平/垂直方向与悬停暂停。" />

    <code-display 
      title="基础用法 (水平滚动)" 
      description="默认从右向左滚动，鼠标悬停时自动暂停。" 
      :code="codeSnippet1"
    >
      <div class="demo-wrapper">
        <lab-text-roll :speed="80" style="background: #fdf6ec; color: #e6a23c; border-radius: 4px; padding: 0 10px;">
          <i class="el-icon-bell"></i> 
          <span>重要通知：系统将于今晚 24:00 进行维护升级，请提前保存数据。LabTextRoll 组件测试...</span>
        </lab-text-roll>
      </div>
    </code-display>

    <code-display 
      title="垂直滚动" 
      description="设置 direction 为 'up' 或 'down' 实现纵向滚动。" 
      :code="codeSnippet2"
    >
      <div class="demo-wrapper" style="height: 150px; border: 1px solid #ebeef5;">
        <lab-text-roll direction="up" :speed="40" height="100%">
          <div v-for="item in list" :key="item" class="list-item">
            <span class="tag">最新</span>
            {{ item }}
          </div>
        </lab-text-roll>
      </div>
    </code-display>

    <code-display 
      title="自定义速度与样式" 
      description="通过 speed 控制滚动速度 (px/s)，利用 slot 自定义任意内容。" 
      :code="codeSnippet3"
    >
      <div class="demo-wrapper">
        <lab-text-roll :speed="150" style="background: #ecf5ff; color: #409eff; border-radius: 20px; padding: 5px 15px;">
           🚀 极速模式！这条消息滚动得非常快！抓紧时间阅读！
        </lab-text-roll>
        <div style="margin-top: 20px;"></div>
        <lab-text-roll :speed="20" style="background: #f0f9eb; color: #67c23a; border-radius: 4px;">
           🐢 慢速模式... 慢慢来... 比较快...
        </lab-text-roll>
      </div>
    </code-display>

    <h3>组件参数</h3>
    <el-table :data="attributes" class="api-table" border size="small">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>
  </div>
</template>

<script>
import LabTextRoll from '@/components/LabTextRoll'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabTextRollDoc',
  components: {
    LabTextRoll,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      list: [
        '用户 User123 完成了注册',
        '订单 #88291 已发货',
        '系统检测到新的版本更新',
        'LabTextRoll 组件上线啦',
        '欢迎使用 Lab AI 平台'
      ],
      codeSnippet1: `
<lab-text-roll :speed="80" style="background: #fdf6ec; color: #e6a23c;">
  <i class="el-icon-bell"></i> 
  <span>重要通知：系统将于今晚...</span>
</lab-text-roll>
`.trim(),
      codeSnippet2: `
<div style="height: 150px;">
  <lab-text-roll direction="up" :speed="40" height="100%">
    <div v-for="item in list" :key="item">{{ item }}</div>
  </lab-text-roll>
</div>
`.trim(),
      codeSnippet3: `
<lab-text-roll :speed="150">🚀 极速模式...</lab-text-roll>
<lab-text-roll :speed="20">🐢 慢速模式...</lab-text-roll>
`.trim(),
      attributes: [
        { prop: 'speed', desc: '滚动速度 (像素/秒)', type: 'Number', default: '60' },
        { prop: 'direction', desc: '滚动方向 (left/right/up/down)', type: 'String', default: 'left' },
        { prop: 'hoverStop', desc: '鼠标悬停是否暂停', type: 'Boolean', default: 'true' },
        { prop: 'width', desc: '容器宽度', type: 'String/Number', default: '100%' },
        { prop: 'height', desc: '容器高度', type: 'String/Number', default: 'auto' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-wrapper {
  overflow: hidden;
}
.list-item {
  padding: 10px;
  border-bottom: 1px dashed #eee;
  display: flex;
  align-items: center;
  
  .tag {
    background: #f56c6c;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 8px;
    transform: scale(0.8);
  }
}
</style>
