import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'

import FastClick from 'fastclick'
//导入懒加载
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//解决移动端300毫秒延迟
FastClick.attach(document.body)

//安装toast插件
Vue.use(toast)

//安装懒加载的插件
Vue.use(VueLazyLoad,{
  loading:require('./assets/images/common/placeholder.png')
  // loading:'./assets/images/common/placeholder.png'
})

Vue.prototype.$bus=new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
  
}).$mount('#app')
