import Vue from 'vue'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\.vue$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  // 优先使用组件内部的 name 选项
  const componentName = componentConfig.default.name || 
    // 否则从文件名中获取 (去除目录和扩展名)
    fileName.split('/').pop().replace(/\.\w+$/, '')

  // 过滤掉不应该全局注册的组件（可选，例如只注册 Lab 开头的）
  // 这里我们假设 components 下的所有组件都应当注册
  
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
