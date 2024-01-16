import {
  mount,
  shallowMount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import ReverseRoutingPathTopo from "@/views/ReverseRoutingPathTopo";
import "jest-canvas-mock";
import Vue from "vue";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import {
  getRtreeByPrefixData
} from '@/api/RoutePathApi.js'
import {
  getAsInfoByList
} from '@/api/DashBoardApi'
import {
  mock,
  links,
  nodes
} from '../mockData/ReverseRoutingPathTopo'
const mockData = mock
jest.mock('@/api/RoutePathApi', () => {
  const mock = require('../mockData/ReverseRoutingPathTopo')
  return {
    getRtreeByPrefixData: jest.fn(() => Promise.resolve(mock.mock))
  }
})
jest.mock('@/api/DashBoardApi', () => {
  return {
    getAsInfoByList: jest.fn(() => Promise.resolve({
      "4538": {
        "announcingNumberAddresses": 17187328,
        "cone": 28,
        "country": "CN",
        "name": "ERX-CERNET-BKB",
        "org": "China Education and Research Network Center",
        "rank": 1115
      }
    }))
  }
})

document.getElementById = jest.fn(() => {
  return {
    clientWidth: 100
  }
})


window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

Vue.use(ElementUI)
Vue.use(MyC)
Vue.prototype.$message = jest.fn()
Vue.prototype.$messageBox = jest.fn()


describe('ReverseRoutingPathTopo', () => {
  let wrapper
  const treeData = {
    path_dict: {},
    links: [],
    nodes: [],
    categories: [],
    date: '2021-01-01',
  }
  const $route = {
    query: {},
  }
  beforeEach(() => {
    wrapper = mount(ReverseRoutingPathTopo,{
      mocks: {
        $route,
      },
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render input fields', () => {
    expect(wrapper.find('.prefix-input').exists()).toBe(true)
    expect(wrapper.find('.inner-input').exists()).toBe(true)
  })
  it('should call getRtreeByPrefix when searchPrefix is called with valid IP', async () => {
    await wrapper.vm.getRtreeByPrefix()
    expect(getRtreeByPrefixData).toHaveBeenCalledWith(wrapper.vm.inputPrefix)
    expect(wrapper.vm.treeData).toEqual(mock)
    expect(wrapper.vm.asPath).toEqual(mock.path_dict)
    // expect(wrapper.vm.dateOfData).toEqual(mock.date)
    expect(wrapper.vm.links).toEqual(links)
    // console.log(JSON.stringify(wrapper.vm.data))
    expect(wrapper.vm.data).toEqual(nodes)
  })
  it('should call searchPrefix', async () => {
    const getRtreeByPrefix = jest.spyOn(wrapper.vm,'getRtreeByPrefix')
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefix).toHaveBeenCalled()
  })
  it('should call searchPathByPoint and switchHighlightStyle when searchASN is called with valid AS number', async () => {
    const chartInstance = {
      test: 'chartInstance',
      dispatchAction:jest.fn()
    }
    wrapper.vm.$refs.rrpc.$refs.topoGraph.getChartIntance = jest.fn(() => chartInstance)
    const switchHighlightStyle = jest.spyOn(wrapper.vm.$refs.rrpc,'switchHighlightStyle')
    wrapper.vm.$refs.rrpc.searchPathByPoint = jest.fn()
    await wrapper.vm.getRtreeByPrefix()
    await wrapper.setData({
      inputASN: '210937'
    })
    await wrapper.vm.searchASN()
    expect(wrapper.vm.$refs.rrpc.searchPathByPoint).toHaveBeenCalledWith('210937')
    expect(switchHighlightStyle).toHaveBeenCalledWith('210937', chartInstance)
    expect(wrapper.vm.inputASN).toEqual("210937")
  })

  
  it('should show warning message when searchPrefix is called with invalid IP', async () => {
    getRtreeByPrefixData.mockReset()
    await wrapper.setData({
      inputPrefix: 'invalidIP'
    })
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefixData).not.toHaveBeenCalled()
    expect(wrapper.vm.treeData).toEqual(mockData)
    expect(wrapper.vm.asPath).toEqual(mockData.path_dict)
    // expect(wrapper.vm.dateOfData).toEqual(mockData.date)
    expect(wrapper.vm.links).toEqual(links)
    expect(wrapper.vm.data).toEqual(nodes)
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith({"duration": 2000, "message": "IP invalid", "type": "warning"})
  })

  it('should call getAsInfoByList when getRtreeByPrefix is called', async () => {
    getRtreeByPrefixData.mockResolvedValueOnce(treeData)
    const asList = ['AS1', 'AS2']
    treeData.nodes = [{
        name: 'AS1',
        category: 0
      },
      {
        name: 'AS2',
        category: 1
      },
    ]
    getAsInfoByList.mockResolvedValueOnce({
      AS1: {
        country: 'US',
        org: 'Org1',
        name: 'AS1'
      },
      AS2: {
        country: 'CN',
        org: 'Org2',
        name: 'AS2'
      },
    })
    await wrapper.vm.getRtreeByPrefix()
    expect(getAsInfoByList).toHaveBeenCalledWith(asList)
    expect(wrapper.vm.data).toEqual([{
      "name": "AS1",
      "category": undefined,
      "categoryIndex": 0,
      "country": "US",
      "org": "Org1",
      "asName": "AS1",
      "symbolSize": 64,
      "x": 500,
      "y": 1500,
      "emphasis": {
        "scale": false
      }
    }, {
      "name": "AS2",
      "category": undefined,
      "categoryIndex": 1,
      "country": "CN",
      "org": "Org2",
      "asName": "AS2",
      "symbolSize": 59,
      "x": 500,
      "y": 1500,
      "emphasis": {
        "scale": false
      }
    }])
  })
  
  it('should show message when searchASN is called with invalid AS number', async () => {
    getRtreeByPrefixData.mockResolvedValueOnce(treeData)
    const searchPathByPoint = jest.spyOn(wrapper.vm.$refs.rrpc,'searchPathByPoint')
    const switchHighlightStyle = jest.spyOn(wrapper.vm.$refs.rrpc,'switchHighlightStyle')
    await wrapper.vm.getRtreeByPrefix()
    await wrapper.setData({
      inputASN: 'invalidAS'
    })
    await wrapper.vm.searchASN()
    expect(searchPathByPoint).not.toHaveBeenCalled()
    expect(switchHighlightStyle).not.toHaveBeenCalled()
    expect(wrapper.vm.inputASN).toEqual('invalidAS')
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith({
      message: 'Not found ASinvalidAS',
      duration: 5000,
    })
  })
  it('should call focus in clearable', async () => {
    const prefix_focus = jest.spyOn(wrapper.vm.$refs['prefix-input'],'focus')
    const asn_focus = jest.spyOn(wrapper.vm.$refs['asn-input'],'focus')
    await wrapper.vm.clearable()
    expect(prefix_focus).toHaveBeenCalled()
    expect(asn_focus).toHaveBeenCalled()
  })
  it('test for nodeSearch',  () => {
    const cb = jest.fn()
    wrapper.vm.nodeSearch('1',cb)
    expect(cb).toHaveBeenCalledWith(wrapper.vm.data.filter(i => i.name.indexOf('1') === 0))
  })
  it('test for nodeSearch',  () => {
    const cb = jest.fn()
    wrapper.vm.nodeSearch('1',cb)
    expect(cb).toHaveBeenCalledWith(wrapper.vm.data.filter(i => i.name.indexOf('1') === 0))
  })

  it('test for clickPoint',  () => {
    const e = {data:{name:'123'}}
    wrapper.vm.clickPoint(e)
    expect(wrapper.vm.inputASN).toBe('123')
  })
})

describe('create ReverseRoutingPathTopo',() => {
  const $route = {
    query: {
      prefix:'38.130.87.0/24'
    },
  }
  it('create',() => {
    const wrapper = shallowMount(ReverseRoutingPathTopo, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    });
    expect(wrapper.vm.inputPrefix).toBe('38.130.87.0/24')
  })
})