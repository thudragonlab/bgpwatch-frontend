import {
    mount
  } from "@vue/test-utils";
  import 'jest-localstorage-mock';
  import ElementUI from '@/lib/element.js'
  import SubscribeASPeerChangeTab from "@/components/Subscribe/SubscribeASPeerChangeTab.vue";
  import Vue from "vue";
  import {getPeerDiff,result,getPeerStats} from '../../mockData/getPeerDiff'
  Vue.use(ElementUI)
  
  jest.mock('@/api/SubscribeApi', () => {
    const mock = require('../../mockData/getPeerDiff')
    return {
      getPeerDiff: jest.fn(() => Promise.resolve(mock.getPeerDiff)),
      getPeerStats: jest.fn(() => Promise.resolve(mock.getPeerStats))
    }
  })
let wrapper

describe('SubscribeASPeerChangeTab',() => {
    beforeEach(() => {
        localStorage.setItem('userInfo', JSON.stringify({ name: 'John Doe' ,_id:'1'}));
        wrapper = mount(SubscribeASPeerChangeTab,{
            stubs:{
                transition: false
            },
        })
      })
    
    it('getPeerDiff',async () => {
      const processPeerSet = jest.spyOn(wrapper.vm,'processPeerSet')
      const processChartPeerStats = jest.fn()
      wrapper.vm.processChartPeerStats = processChartPeerStats
      await wrapper.vm.getPeerDiff()
      expect(processPeerSet).toHaveBeenCalledWith(getPeerDiff)
      expect(processChartPeerStats).toHaveBeenCalled()
    })

  
})
