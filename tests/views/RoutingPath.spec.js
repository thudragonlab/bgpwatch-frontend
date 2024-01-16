import {
  shallowMount
} from '@vue/test-utils'
import RoutingPath from "@/views/RoutingPath";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)
Vue.use(MyC)

describe('RoutingPath.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(RoutingPath)
  })
  afterEach(() => {
    wrapper.destroy()
  })
  
  it('should call switchAS method correctly', async () => {
    wrapper.vm.switchAS({
      target: {
        dataset: {
          cc: 'cc'
        }
      }
    })
    expect(wrapper.vm.inputAsn).toBe('cc')
  })
})