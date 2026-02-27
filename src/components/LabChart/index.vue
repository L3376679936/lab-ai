<template>
  <div class="lab-chart-container" :class="themeClass">
    <div ref="chart" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'LabChart',
  props: {
    options: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return `theme-${this.theme}`
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    theme() {
      // 切换主题时重新渲染，使用防抖避免卡顿
      if (this.timer) clearTimeout(this.timer)
      
      this.timer = setTimeout(() => {
        if (this.chartInstance) {
          this.chartInstance.dispose()
          this.chartInstance = null
        }
        this.initChart()
      }, 350)
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) return
      
      // ECharts 主题设置
      // 简单模拟 tech 主题的一些颜色配置，实际开发通常引入专门的 theme json
      const themeName = this.theme === 'tech' ? 'dark' : undefined
      
      this.chartInstance = echarts.init(this.$refs.chart, themeName)
      this.renderChart()
    },
    renderChart() {
      if (!this.chartInstance) return

      let finalOptions = { ...this.options }
      
      // 针对科技主题的特定样式注入
      if (this.theme === 'tech') {
        finalOptions = this.injectTechStyles(finalOptions)
      }

      this.chartInstance.setOption(finalOptions)
    },
    injectTechStyles(opts) {
      // 简单注入一些科技风配置
      // 实际应更深度合并
      const techColor = ['#00d9ff', '#00ff9d', '#ffb300', '#ff005c', '#8a2be2']
      
      return {
        backgroundColor: 'transparent', // 保持透明，使用容器背景
        color: techColor,
        ...opts,
        textStyle: {
          color: '#e0e0e0',
          ...opts.textStyle
        }
      }
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-chart-container {
  padding: 16px;
  background-color: var(--card-bg, #fff);
  border-radius: var(--lab-radius, 4px);
  box-shadow: var(--lab-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));
  transition: all 0.3s;
}

// Tech theme specific overrides if needed
.theme-tech {
  // e.g. add a glow border
  border: 1px solid rgba(0, 217, 255, 0.1);
}
</style>
