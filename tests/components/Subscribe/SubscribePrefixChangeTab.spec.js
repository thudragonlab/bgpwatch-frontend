import {
    shallowMount
  } from '@vue/test-utils'
  
  import SubscribePrefixChangeTab from "@/components/Subscribe/SubscribePrefixChangeTab.vue";
  import "jest-canvas-mock";
  import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
  import ElementUI from '@/lib/element.js'
  import Vue from "vue";
  import {
    SubscribeTo,
    delAsInList
  } from '@/api/SubscribeApi'
  import {
    add_as_with_list as mock_add_as_with_list,
    get_subscribed_by_token as mock_get_subscribed_by_token,
    del_as_in_list as mock_del_as_in_list,
    getAsInfoByList as mock_getAsInfoByList,
    route_history_stats as mock_route_history_stats,
    subscribedAsDetail,
    add_as_with_list_error
  } from '@/../tests/mockData/Subscribe'
  Vue.use(ElementUI)
  Vue.use(MyC)
  Vue.prototype.$message = jest.fn()
  Vue.prototype.$messageBox = jest.fn()
  // Vue.prototype.$alert = jest.fn(() => Promise.resolve({ action: 'confirm' }))
  
  // Vue.prototype.$alert = jest.fn()
  jest.mock('@/api/SubscribeApi', () => {
    const mock = require('@/../tests/mockData/Subscribe')
    return {
      SubscribeTo: jest.fn(() => Promise.resolve(mock.add_as_with_list)),
      getSubscribedByToken: jest.fn(() => Promise.resolve(mock.get_subscribed_by_token)),
      delAsInList: jest.fn(() => Promise.resolve(mock.del_as_in_list)),
    }
  })
  
  jest.mock('@/api/DashBoardApi', () => {
    const mock = require('@/../tests/mockData/Subscribe')
    return {
      getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),
      getRouteHistoryStats: jest.fn(() => Promise.resolve(mock.route_history_stats)),
    }
  })
  
  describe('SubscribePrefixChangeTab.vue', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SubscribePrefixChangeTab, {
        propsData:{
            subscribedAsList:[]
        }
      })
      wrapper.setProps({
        subscribedAsList:mock_get_subscribed_by_token['as_list']
      })
    })
    afterEach(() => {
      wrapper.destroy()
    })
  
    it('init', async () => {
      
      await Vue.nextTick()
      expect(wrapper.vm.subscribedAsList).toEqual(mock_get_subscribed_by_token['as_list'])
      expect(wrapper.vm.asesDetail).toEqual(mock_getAsInfoByList)
      expect(wrapper.vm.asns).toEqual(wrapper.vm.subscribedAsDetail.map(item => item.asn))
    })
  
  
    it('packetAsDetail', async () => {
      await Vue.nextTick()
      wrapper.vm.subscribedAsDetail = []
      wrapper.vm.packetAsDetail()
      expect(wrapper.vm.subscribedAsDetail).toEqual(subscribedAsDetail)
    })
  
  
    it('showPreifxChangeDialog', () => {
      const e = {
        target: {
          dataset: {
            index: 1
          }
        }
      }
      wrapper.vm.showPreifxChangeDialog(e)
      expect(wrapper.vm.clickIndex).toBe(e.target.dataset.index)
      expect(wrapper.vm.showPrefixChangeDialog).toBeTruthy()
  
      wrapper.vm.showPrefixChangeDialog = false
      expect(wrapper.vm.showPrefixChangeDialog).toBeFalsy()
      const e2 = {
        target: {
          dataset: {
            index: -1
          }
        }
      }
      wrapper.vm.showPreifxChangeDialog(e2)
      expect(wrapper.vm.clickIndex).toBe(e2.target.dataset.index)
      expect(wrapper.vm.showPrefixChangeDialog).toBeFalsy()
    })
  
    it('currentChange', () => {
      const processHistoryData = jest.spyOn(wrapper.vm, 'processHistoryData')
      const current = 1
      wrapper.vm.currentPage = 0
      expect(wrapper.vm.currentPage).toBe(0)
      wrapper.vm.currentChange(current)
      expect(wrapper.vm.currentPage).toBe(current)
      expect(processHistoryData).toHaveBeenCalledWith(
        wrapper.vm.asns.slice((wrapper.vm.currentPage - 1) * wrapper.vm.pageSize, wrapper.vm.currentPage * wrapper.vm.pageSize),
        (wrapper.vm.currentPage - 1) * wrapper.vm.pageSize
      )
  
    })
  

  
    it('unsubscribe', async () => {
      await Vue.nextTick()
      delAsInList.mockClear()
      const subscribedAsDetail = wrapper.vm.subscribedAsDetail.length
      const subscribedAsListLength = wrapper.vm.subscribedAsList.length
      const e = {
        target: {
          dataset: {
            index: 1
          }
        }
      }
      const expect_id = wrapper.vm.subscribedAsList[e.target.dataset.index]['_id']
      await wrapper.vm.unsubscribe(e)
      expect(wrapper.vm.subscribedAsDetail).toHaveLength(subscribedAsDetail - 1)
      expect(delAsInList).toHaveBeenCalledWith([expect_id])
      expect(wrapper.vm.$messageBox).toHaveBeenCalledWith({
        message: mock_del_as_in_list['message'],
        type: mock_del_as_in_list['status'],
        duration: 2 * 1000,
      })
      expect(wrapper.vm.subscribedAsList).toHaveLength(subscribedAsListLength - 1)
  
    })
    
    it('getAsInfoByList', async () => {
      wrapper.vm.packetAsDetail = jest.fn()
      await wrapper.vm.getAsInfoByList()
      expect(wrapper.vm.asesDetail).toEqual(mock_getAsInfoByList)
      expect(wrapper.vm.packetAsDetail).toHaveBeenCalled()
  
    })
  
    
  

  })