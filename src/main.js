import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/global.scss' // 引入全局样式/主题
import '@/components' // 全局组件自动注册
import Directives from '@/directives' // 全局指令自动注册

Vue.use(Directives)

Vue.config.productionTip = false

Vue.use(ElementUI)

// 简单的事件总线，如果需要的话
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
