<template>
  <div class="lab-chart-doc">
    <doc-title title="LabChart" subtitle="基于 ECharts 5.x 封装的通用图表组件，支持自动缩放和主题切换。" />

    <code-display 
      title="基础图表展示" 
      description="支持折线图、柱状图、饼图等常见图表类型，只需传入标准的 ECharts option 配置即可。" 
      :code="codeSnippet"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <h4>折线图</h4>
          <lab-chart :options="lineOptions" height="300px"></lab-chart>
        </el-col>
        <el-col :span="12">
          <h4>饼图</h4>
          <lab-chart :options="pieOptions" height="300px"></lab-chart>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
         <el-col :span="24">
          <h4>柱状图</h4>
          <lab-chart :options="barOptions" height="300px"></lab-chart>
        </el-col>
      </el-row>
    </code-display>

    <h3>组件参数</h3>
    <el-table :data="attributes" class="api-table" border size="small">
      <el-table-column prop="prop" label="参数" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>

    <h3>组件事件</h3>
    <el-table :data="events" class="api-table" border size="small">
      <el-table-column prop="name" label="事件名称" width="140" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="param" label="回调参数" />
    </el-table>
  </div>
</template>

<script>
import LabChart from '@/components/LabChart'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'

export default {
  name: 'LabChartDoc',
  components: {
    LabChart,
    DocTitle,
    CodeDisplay
  },
  data() {
    const codeSnippet = `
<el-row>
  <el-col :span="12">
    <lab-chart :options="lineOptions" height="300px" />
  </el-col>
  <el-col :span="12">
    <lab-chart :options="pieOptions" height="300px" />
  </el-col>
</el-row>

<script>
export default {
  data() {
    return {
      lineOptions: {
        title: { text: '周业绩走势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '...'] },
        yAxis: { type: 'value' },
        series: [{ data: [820, 932, ...], type: 'line' }]
      },
      pieOptions: {
        // ... ECharts options
      }
    }
  }
}
<\/script>
`.trim()

    return {
      codeSnippet,
      lineOptions: {
        title: { text: '周业绩走势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.3 }
        }]
      },
      pieOptions: {
        title: { text: '用户来源' },
        tooltip: { trigger: 'item' },
        series: [{
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ]
        }]
      },
      barOptions: {
        title: { text: '各部门支出' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['HR', 'Dev', 'Sales', 'Marketing', 'Support'] },
        yAxis: { type: 'value' },
        series: [{
          data: [12000, 20000, 15000, 8000, 7000],
          type: 'bar',
          itemStyle: { borderRadius: [5, 5, 0, 0] }
        }]
      },
      attributes: [
        { prop: 'options', desc: 'ECharts 配置对象 (必填)', type: 'Object', default: '{}' },
        { prop: 'height', desc: '图表高度', type: 'String', default: '300px' },
        { prop: 'width', desc: '图表宽度', type: 'String', default: '100%' },
        { prop: 'theme', desc: '图表主题 (light / dark)', type: 'String', default: '跟随系统' }
      ],
      events: [
        { name: 'click', desc: '图表点击事件', param: 'params' },
        { name: 'legendselectchanged', desc: '图例开关切换事件', param: 'obj' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-chart-doc {
  h4 {
    margin-bottom: 15px;
    color: var(--text-color);
    font-weight: 500;
  }
}
</style>
