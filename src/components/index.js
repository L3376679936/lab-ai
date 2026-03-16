import Vue from 'vue'

const requireComponent = require.context(
  './',
  true,
  /index\.vue$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件名
  // fileName 格式通常为 ./ComponentName/index.vue 或 ./ComponentName.vue
  const pathParts = fileName.split('/')
  let componentName = ''

  if (pathParts.length > 2) {
    // 对应 ./LabButton/index.vue 格式
    componentName = pathParts[1]
  } else {
    // 对应 ./LabLogo.vue 格式
    componentName = pathParts[pathParts.length - 1].replace(/\.\w+$/, '')
  }

  // 异步注册组件
  // 只有当该组件被渲染时，Webpack 才会加载对应的 chunk 文件
  Vue.component(componentName, () => {
    // 必须通过 requireComponent 返回一个 Promise 以符合 Vue 异步组件规范
    // 这里利用 require.context 的同步特性配合 Promise.resolve 模拟异步加载
    // 实际上 Webpack 在构建时会处理这种 import 关系
    return Promise.resolve(requireComponent(fileName).default || requireComponent(fileName))
  })
})
