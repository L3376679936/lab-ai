// 主题配置对象
export const themes = {
  normal: {
    // Element UI默认主题变量
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
    
    // 自定义变量
    '--lab-bg-color': '#f5f7fa',
    '--lab-card-bg': '#ffffff',
    '--lab-text-color': '#303133',
    '--lab-border-color': '#ebeef5',
    '--lab-shadow': '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
    '--lab-radius': '4px'
  },
  tech: {
    // 科技主题变量
    primary: '#00d9ff',
    success: '#00ff9d',
    warning: '#ffb300',
    danger: '#ff005c',
    info: '#8a2be2',
    
    // 科技主题特有
    '--lab-bg-color': '#0a0a0f',
    '--lab-card-bg': 'rgba(20, 20, 30, 0.8)',
    '--lab-text-color': '#e0e0e0',
    '--lab-border-color': 'rgba(0, 217, 255, 0.3)',
    '--lab-shadow': '0 0 20px rgba(0, 217, 255, 0.2)',
    '--lab-radius': '8px',
    '--lab-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--lab-neon-glow': '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff'
  }
}
