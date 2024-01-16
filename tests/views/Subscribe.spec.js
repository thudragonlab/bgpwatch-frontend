import {
  shallowMount
} from '@vue/test-utils'
import Subscribe from "@/views/Subscribe";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import ElementUI from '@/lib/element.js'
import Vue from "vue";
import {
  SubscribeTo,
  getSubscribedByToken,
  delAsInList
} from '@/api/SubscribeApi'
import {
  getAsInfoByList,
  getRouteHistoryStats
} from '@/api/DashBoardApi'
import {
  add_as_with_list as mock_add_as_with_list,
  get_subscribed_by_token as mock_get_subscribed_by_token,
  del_as_in_list as mock_del_as_in_list,
  getAsInfoByList as mock_getAsInfoByList,
  route_history_stats as mock_route_history_stats,
  subscribedAsDetail,
  add_as_with_list_error
} from '../mockData/Subscribe'
Vue.use(ElementUI)
Vue.use(MyC)
Vue.prototype.$message = jest.fn()
Vue.prototype.$messageBox = jest.fn()
Vue.prototype.$alert = jest.fn()
// Vue.prototype.$alert = jest.fn(() => Promise.resolve({ action: 'confirm' }))

// Vue.prototype.$alert = jest.fn()
jest.mock('@/api/SubscribeApi', () => {
  const mock = require('../mockData/Subscribe')
  return {
    SubscribeTo: jest.fn(() => Promise.resolve(mock.add_as_with_list)),
    getSubscribedByToken: jest.fn(() => Promise.resolve(mock.get_subscribed_by_token)),
    delAsInList: jest.fn(() => Promise.resolve(mock.del_as_in_list)),
  }
})

jest.mock('@/api/DashBoardApi', () => {
  const mock = require('../mockData/Subscribe')
  return {
    getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),
    getRouteHistoryStats: jest.fn(() => Promise.resolve(mock.route_history_stats)),
  }
})

describe('Subscribe.vue', () => {
  let wrapper
  beforeEach(() => {
    localStorage.setItem('userInfo', JSON.stringify({ name: 'John Doe' ,_id:'1'}));
    wrapper = shallowMount(Subscribe, {
      provide: {
        reload: jest.fn()
      }
    })
  })
  afterEach(() => {
    wrapper.destroy()
  })

  it('init', async () => {
    await Vue.nextTick()
    expect(wrapper.vm.subscribedAsList).toEqual(mock_get_subscribed_by_token['as_list'])
  })


  it('deleteAll', async () => {
    const alert = jest.spyOn(wrapper.vm, '$alert')
    const messageBox = jest.spyOn(wrapper.vm, '$messageBox')
    wrapper.vm.deleteAll()
    expect(alert).toHaveBeenCalledWith('Are you sure unsubscribe ALL AS?', 'Delete All', expect.any(Object))
    await Vue.nextTick()
    expect(alert.mock.calls[0][2]).toEqual({
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      callback: expect.any(Function)
    })
    // alert.mock.calls[0][2].callback('cancel')
    alert.mock.calls[0][2].callback('confirm')
    expect(delAsInList).toHaveBeenCalledWith(wrapper.vm.subscribedAsList.map(item => item['_id']))
    await Vue.nextTick()
    expect(messageBox).toHaveBeenCalledWith({
      message: mock_del_as_in_list['message'],
      type: mock_del_as_in_list['status'],
      duration: 1 * 1000,
    })
    expect(wrapper.vm.subscribedAsList).toHaveLength(0)
  })


  it('parseAsnExpressToParam', async () => {
    const test1 = '4538'
    const test2 = '4538,4134'
    const test3 = '[4535,4540]'
    const test4 = '(4535,4540)'
    const parseAsnExpressToParam = jest.spyOn(wrapper.vm, 'parseAsnExpressToParam')
    wrapper.vm.asnExpress = test1
    wrapper.vm.parseAsnExpressToParam()
    expect(parseAsnExpressToParam).toHaveLastReturnedWith([test1])
    wrapper.vm.asnExpress = test2
    wrapper.vm.parseAsnExpressToParam()
    expect(parseAsnExpressToParam).toHaveLastReturnedWith(test2.split(','))
    wrapper.vm.asnExpress = test3
    wrapper.vm.parseAsnExpressToParam()
    expect(parseAsnExpressToParam).toHaveLastReturnedWith([4535, 4536, 4537, 4538, 4539, 4540])
    wrapper.vm.asnExpress = test4
    wrapper.vm.parseAsnExpressToParam()
    expect(parseAsnExpressToParam).toHaveLastReturnedWith([4536, 4537, 4538, 4539])
  })


  it('getSubscribedByToken', async () => {
    wrapper.vm.getAsInfoByList = jest.fn()
    await wrapper.vm.getSubscribedByToken()
    expect(wrapper.vm.subscribedAsList).toEqual(mock_get_subscribed_by_token['as_list'])

  })
  

  it('SubsribeAs', async () => {
    await Vue.nextTick()
    const parseAsnExpressToParam = jest.spyOn(wrapper.vm,'parseAsnExpressToParam')
    const getSubscribedByToken = jest.spyOn(wrapper.vm,'getSubscribedByToken')
    
    await wrapper.vm.SubsribeAs()
    expect(parseAsnExpressToParam).toHaveBeenCalled()
    expect(getSubscribedByToken).toHaveBeenCalled()
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith({
      message: mock_add_as_with_list['message'],
      type: mock_add_as_with_list['status'],
      duration: 1 * 1000,
    })
    SubscribeTo.mockResolvedValue(add_as_with_list_error)
    parseAsnExpressToParam.mockClear()
    getSubscribedByToken.mockClear()
    wrapper.vm.$message.mockClear()
    await wrapper.vm.SubsribeAs()
    expect(parseAsnExpressToParam).toHaveBeenCalled()
    expect(getSubscribedByToken).not.toHaveBeenCalled()
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith({
      message: add_as_with_list_error['message'],
      type: add_as_with_list_error['status'],
      duration: 1 * 1000,
    })

  })
})