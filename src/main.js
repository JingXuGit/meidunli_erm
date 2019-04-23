import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui';
import Axios from 'axios';
import Param from './func.js'
import config from './config'
/* 富文本编辑器 */
import { VueQuillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend } from 'quill-image-extend-module'
 Quill.register('modules/ImageExtend', ImageExtend)
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
/* axios配置默认接口地址 */
Axios.defaults.baseURL = config.url + '/admin/'
Axios.interceptors.request.use(config => {
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Axios.interceptors.response.use(config => {
  console.log(config.data.code)
  if (config.data.code == 1001) {
    window.localStorage.removeItem('token')
    router.push({path: '/'})
  }
  return config
})
/* 定义全局过滤器 使用新方法padStart 初始化时间 */
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1 + '').padStart(2, '0');
  const D = (date.getDate() + '').padStart(2, '0')
  const H = (date.getHours() + '').padStart(2, '0')
  const I = (date.getMinutes() + '').padStart(2, '0')
  const S = (date.getSeconds() + '').padStart(2, '0')
  return `${Y}-${M}-${D} ${H}:${I}:${S}`
})
/* 挂在到vue的原型上 */
Vue.prototype.$http = Axios
Vue.prototype.$param = Param
Vue.prototype.$config = config
Vue.use(ElementUI);
// Vue.use(VueQuillEditor)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
