import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import request from './api/request'
import treeTable from 'vue-table-with-tree-grid'
import quillEditor from 'vue-quill-editor'

//富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//引入全局样式
import './assets/css/global.css'
//引入element组件
import './assets/element/element'
import './assets/font/iconfont.css'
import './assets/filter'
// Vue.use(ElementUI)
Vue.prototype.$http = request

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
Vue.use(quillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
