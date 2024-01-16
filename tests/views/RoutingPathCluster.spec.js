import {
  shallowMount
} from '@vue/test-utils'
import RoutingPathCluster from "@/views/RoutingPathCluster";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import ElementUI from '@/lib/element.js'
import Vue from "vue";
import { getAsInfoByList } from '@/api/DashBoardApi'
import { getRoutingPathCluster, getRtreeByHashes } from '@/api/RoutePathApi'
import {
  getAsInfoByList as mock_getAsInfoByList,
  getRtreeByHashes as mock_getRtreeByHashes,
  getRoutingPathCluster as mock_getRoutingPathCluster,
} from '../mockData/RoutingPathCluster'
Vue.use(ElementUI)
Vue.use(MyC)
Vue.prototype.$message = jest.fn()
Vue.prototype.$messageBox = jest.fn()
// Vue.prototype.$alert = jest.fn(() => Promise.resolve({ action: 'confirm' }))

// Vue.prototype.$alert = jest.fn()
jest.mock('@/api/RoutePathApi', () => {
  const mock = require('../mockData/RoutingPathCluster')
  return {
    getRoutingPathCluster: jest.fn(() => Promise.resolve(mock.getRoutingPathCluster)),
    getRtreeByHashes: jest.fn(() => Promise.resolve(mock.getRtreeByHashes)),
  }
})

jest.mock('@/api/DashBoardApi', () => {
  const mock = require('../mockData/RoutingPathCluster')
  return {
    getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),
  }
})

describe('RoutingPathCluster.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(RoutingPathCluster)
  })
  afterEach(() => {
    wrapper.destroy()
  })
  it('init',async () => {
    await Vue.nextTick()
    expect(wrapper.vm.clusterList).toHaveLength(mock_getRoutingPathCluster['result'].length)
    expect(Object.keys(wrapper.vm.prefixMap)).toHaveLength(mock_getRoutingPathCluster['result'].length)
    expect(wrapper.vm.chooseIndex).toBe(0)
    expect(wrapper.vm.categories).toEqual(mock_getRtreeByHashes['categories'])
    expect(wrapper.vm.path_dict).toEqual(mock_getRtreeByHashes['path_dict'])
    expect(wrapper.vm.root).toBe(mock_getRtreeByHashes['asn'])
    expect(wrapper.vm.links).toHaveLength(mock_getRtreeByHashes['links'].length)
    expect(wrapper.vm.data).toHaveLength(mock_getRtreeByHashes['nodes'].length)

  })

  it('chooseIndex', async () => {
    wrapper.vm.drawChartByHash = jest.fn()
    wrapper.vm.clusterList= []
    await wrapper.setData({
      chooseIndex:2,
    })
    expect(wrapper.vm.drawChartByHash).not.toHaveBeenCalled()
    wrapper.vm.clusterList= [{rtree_list:[]}]
    await wrapper.setData({
      chooseIndex:0,
    })
    expect(wrapper.vm.drawChartByHash).toHaveBeenCalled()
  })
  
  it('switchPrefixTab',() => {
    const e = {target:{dataset:{index:1}}}
    wrapper.vm.chooseIndex = 2
    wrapper.vm.switchPrefixTab(e)
    wrapper.vm.chooseIndex = 1
  })

  it('getRandomColorCode',() => {
    const color = wrapper.vm.getRandomColorCode()
    expect(color).toHaveLength(7)
  })
  it('OpenPrefixList',() => {
    wrapper.vm.showPrefixList = false
    expect(wrapper.vm.showPrefixList).toBeFalsy()
    wrapper.vm.OpenPrefixList()
    expect(wrapper.vm.showPrefixList).toBeTruthy()
    expect(wrapper.vm.chartWidth).toBe(wrapper.vm.fullWidth)

  })

  it('ClosePrefixList',() => {
    wrapper.vm.showPrefixList = true
    expect(wrapper.vm.showPrefixList).toBeTruthy()
    wrapper.vm.ClosePrefixList()
    expect(wrapper.vm.showPrefixList).toBeFalsy()
    expect(wrapper.vm.chartWidth).toBe(wrapper.vm.firstColWidth)
  })

  it('searchASN',async () => {
    const drawChartByHash = jest.spyOn(wrapper.vm,'drawChartByHash')
    getRoutingPathCluster.mockResolvedValueOnce({
      'result':[]
    })
    await wrapper.vm.searchASN()
    expect(drawChartByHash).not.toHaveBeenCalled()
    expect(wrapper.vm.$messageBox).toBeCalledWith({
      message: `Not found data for AS${wrapper.vm.inputASN}`,
      type: 'warning',
      duration: 2 * 1000,
    })
  })
})