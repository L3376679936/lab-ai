import Vue from 'vue'
import Hotkey from 'v-hotkey'

Vue.use(Hotkey)

const requireDirective = require.context(
  '.',    // 当前目录
  false,  // 不查找子目录（因为指令通常是 index.js 或 单文件）
  /\.js$/ // 匹配 js 文件
)

const install = function(Vue) {
  requireDirective.keys().forEach(fileName => {
    if (fileName === './index.js') return // 跳过自身

    const directiveConfig = requireDirective(fileName)
    // 获取指令名：优先使用 export default 的 name，否则使用文件名
    // 例如 copyDirective.js -> v-copyDirective (或者我们强制处理命名)
    
    // 命名策略：
    // 1. 如果文件名是 directiveName.js，则指令名为 directiveName
    // 2. 如果是 folder/index.js，则需要在 index.js 里通过 export default { name: 'xxx' } 指定，或者我们也扫描子目录？
    
    // 观察原项目结构：
    // copyDirective.js
    // debounce.js
    // clickOutside/index.js
    
    // 所以我们需要扫描子目录。
  })
}

// 重新设计：
// 为了兼容文件和目录结构，我们使用递归扫描。

const files = require.context('.', true, /\.js$/)

const directives = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  // 排除非入口文件 (比如 someDirective/utils.js)，这里简单假设 index.js 是入口，或者根目录下的 .js 是入口
  // 如果是 ./clickOutside/index.js -> name = clickOutside
  // 如果是 ./copyDirective.js -> name = copyDirective
  
  const parts = key.split('/')
  const fileName = parts[parts.length - 1]
  
  let name = ''
  let directive = files(key).default || files(key)

  if (parts.length === 2) {
    // ./copyDirective.js
    name = fileName.replace(/\.js$/, '')
  } else if (parts.length === 3 && fileName === 'index.js') {
    // ./clickOutside/index.js
    name = parts[1]
  } else {
    return // 忽略深层或非标准结构
  }

  if (name) {
    directives[name] = directive
  }
})

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
