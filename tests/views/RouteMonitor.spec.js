import {
  shallowMount
} from '@vue/test-utils'
import RouteMonitor from "@/views/RouteMonitor";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)
Vue.use(MyC)

document.getElementsByClassName = jest.fn(() => {
  return [{clientHeight:150}]
})

describe('RouteMonitor.vue', () => {
  let wrapper
  const $route = {
    path: '?',
  }
  beforeEach(() => {
    wrapper = shallowMount(RouteMonitor,{mocks: {
      $route,
    },})
  })
  afterEach(() => {
    wrapper.destroy()
  })
  
  it('should call switchAS method correctly', async () => {
    await Vue.nextTick()
    document.documentElement.scrollTop = 10
    expect(wrapper.vm.navbarHeight).toBe(100)
    wrapper.vm.navbarHeight = 0
    window.onscroll()
    expect(wrapper.vm.showShadow).toBe(true)
    wrapper.vm.navbarHeight = 100
    window.onscroll()
    expect(wrapper.vm.showShadow).toBe(false)

  })
})