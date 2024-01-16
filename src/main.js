import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from '@/lib/element.js'
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import 'dragonlab-component/lib/dragonLab-Component.css'
import '@/styles/index.scss' // global css
import '@/assets/theme/index.css'
import axios from 'axios'
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
import assert from 'assert'
// Viewer.setDefaults({
//   navbar: false, //底部缩略图
//   toolbar: true, //底部工具栏
//   button: true, //右上角按钮
//   title: false, //当前图片标题
//   movable: true, //是否可以移动
//   zoomable: true, //是否可以缩放
//   transition: true //使用 CSS3 过度
// })
// Vue.use(Viewer)
Vue.use(MyC)
Vue.use(ElementUI)


Vue.directive('animation',{
  inserted: function (el, binding) {
    // 聚焦元素
    binding.addClass = () => {
      const { top } = el.getBoundingClientRect()
      const h = document.documentElement.clientHeight || document.body.clientHeight
      if (top < h) {
        if(el.className.indexOf(binding.value) == -1 ){
          // 初次还未绑定过，则新增类名(注意：下面单引号中间是一个空格！！！)
          el.className = el.className.replace(binding.value[0],binding.value[1])
        }
        if (binding.addClass) {
          window.removeEventListener('scroll', binding.addClass)
        }
      }
    }
    window.addEventListener('scroll', binding.addClass,true)
    binding.addClass()
},
unbind: function (el, binding) {
  if (binding.addClass) {
    window.removeEventListener('scroll', binding.addClass)
  }
}}
)

window.Vue = Vue

Vue.prototype.$axios = axios
Vue.prototype.$assert = assert


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')