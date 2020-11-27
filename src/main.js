import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import request from './api/request'
import treeTable from 'vue-table-with-tree-grid'

//引入全局样式
import './assets/css/global.css'
//引入element组件
import './assets/element/element'
import './assets/font/iconfont.css'
// Vue.use(ElementUI)
Vue.prototype.$http = request

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
