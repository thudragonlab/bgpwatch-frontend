import {
  shallowMount,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import Dashboard from "@/views/Dashboard";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import AsInfoTab from '@/components/Dashboard/DashboardAsInfoTab.vue'
import IpTab from '@/components/Dashboard/DashboardIPTab.vue'
import { getPeerTypeDistribute, getAsInfoByList } from '@/api/DashBoardApi'
import * as testData from '../mockData/Organization'

Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


jest.mock('@/api/routeMonitor', () => {
  // const _inner = [...testData]
  const mock = require('../mockData/Organization')
  return {
    getAsInfo: jest.fn(() => Promise.resolve(mock.default))
  }
})

jest.mock('@/api/DashBoardApi', () => {
  const mock = require('../mockData/Dashboard')
  const getPeerTypeDistributeMockData = mock.getPeerTypeDistribute
  const getAsInfoByListMockData = mock.getAsInfoByList
  return {
    getPeerTypeDistribute: jest.fn(() => Promise.resolve(getPeerTypeDistributeMockData)),
    getAsInfoByList: jest.fn(() => Promise.resolve(getAsInfoByListMockData)),

  }
})

const getElementByIdSpy = jest.spyOn(document, 'getElementById');
getElementByIdSpy.mockImplementation(() => ({
  clientHeight: 100
}));


describe('Dashboard.vue', () => {
  let wrapper
  const $route = {
    query: {},
  }
  beforeEach(() => {
    wrapper = shallowMount(Dashboard, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should render correct contents', () => {
    expect(wrapper.html()).toMatchSnapshot();
  })

  it('should call getAsInfoByASN when chickSearch is called', async () => {
    const inputAsn = '4538'
    wrapper.vm.getAsInfoByASN = jest.fn()
    wrapper.vm.inputAsn = inputAsn
    await wrapper.vm.chickSearch()
    expect(wrapper.vm.getAsInfoByASN).toBeCalledWith(inputAsn)
  })

  it('should update DashboardTabs when getAsInfoByASN is called', async () => {
    const inputAsn = '4538'
    const peerTypeData = {
      peer_type: ['type1', 'type2'],
      customer_prefixes: [{ name: 'name1' }],
      provider_prefixes: [{ name: 'name2' }],
      peer_prefixes: [{ name: 'name3' }],
      country_distribute: [{ name: 'country1' }],
    }
    const mockParam = {
      inputAsn,
      clickHandler: wrapper.vm.clickHandler,
      distribution: {
        peer_type: peerTypeData.peer_type,
        customer_prefixes: peerTypeData.customer_prefixes,
        provider_prefixes: peerTypeData.provider_prefixes,
        peer_prefixes: peerTypeData.peer_prefixes,
        country_distribute: peerTypeData.country_distribute,
      },
      ipVersion: 4,
    }
    const expectedBasicParam = { inputAsn }
    const expectedIp4Param = mockParam
    const expectedIp6Param = { ...mockParam, ipVersion: 6 }
    getPeerTypeDistribute.mockResolvedValueOnce(peerTypeData)
    await wrapper.vm.getAsInfoByASN(inputAsn)
    expect(wrapper.vm.DashboardTabs.Basic.param).toEqual(expectedBasicParam)
    expect(wrapper.vm.DashboardTabs['IPv4 Peers'].param).toEqual(expectedIp4Param)
    expect(wrapper.vm.DashboardTabs['IPv6 Peers'].param).toEqual(expectedIp6Param)
  })
  it('should call clickHandler when clickHandler is called', () => {
    const mockParam = { data: { name: '4538|peer1' } }
    wrapper.vm.clickHandler = jest.fn()
    wrapper.vm.clickHandler(mockParam)
    expect(wrapper.vm.clickHandler).toBeCalledWith(mockParam)
  })
  it('should call getAsInfoByList when getAsInfoByList is called', async () => {
    const asnList = ['4538', '1234']
    const mockData = [{ name: 'asn1' }, { name: 'asn2' }]
    getAsInfoByList.mockResolvedValueOnce(mockData)
    const result = await wrapper.vm.getAsInfoByList(asnList)
    expect(getAsInfoByList).toBeCalledWith(asnList)
    expect(result).toEqual(mockData)
  })
  it('should render AsInfoTab component when selectedTab is "Basic"', () => {
    wrapper.vm.selectedTab = 'Basic'
    expect(wrapper.findComponent(AsInfoTab).exists()).toBe(true)
  })
  it('should render IpTab component when selectedTab is "IPv4 Peers"', () => {
    wrapper.vm.selectedTab = 'IPv4 Peers'
    expect(wrapper.findComponent(IpTab).exists()).toBe(true)
  })
  it('should render IpTab component when selectedTab is "IPv6 Peers"', () => {
    wrapper.vm.selectedTab = 'IPv6 Peers'
    expect(wrapper.findComponent(IpTab).exists()).toBe(true)
  })

  it('doSearch',async () => {
    await wrapper.vm.doSearch()
    expect(wrapper.vm.tabldata).toEqual(testData.default)
  })

  
  it('clickAsn', () => {
    wrapper.vm.chickSearch = jest.fn()
     wrapper.vm.clickAsn('123')
    expect(wrapper.vm.inputText).toBe('123')
    expect(wrapper.vm.chickSearch).toHaveBeenCalled()
  })

  it('chickSearch', () => {
    const doSearch = jest.fn()
    const getAsInfoByASN = jest.fn()
    
    wrapper.vm.doSearch = doSearch
    wrapper.vm.getAsInfoByASN = getAsInfoByASN
    wrapper.vm.inputText = '123'
    wrapper.vm.chickSearch()
    expect(wrapper.vm.inputAsn).toBe('123')
    expect(wrapper.vm.searchAsName).toBe('')
    expect(wrapper.vm.searchOrg).toBe('')
    expect(getAsInfoByASN).toHaveBeenCalled()
    wrapper.vm.inputText = 'cernet'
    wrapper.vm.chickSearch()
    expect(wrapper.vm.inputAsn).toBe('')
    expect(wrapper.vm.searchAsName).toBe('CERNET')
    expect(wrapper.vm.searchOrg).toBe('CERNET')
    expect(doSearch).toHaveBeenCalled()
    


  })
  describe('handleFloatSearch method', () => {
    it('should set showSticktyRow to true when scrollTop is greater than or equal to searchRowHeight', () => {
      wrapper.vm.showSticktyRow = false
      wrapper.vm.searchRowHeight = 100
      document.documentElement.scrollTop = 150
      wrapper.vm.handleFloatSearch({ target: { scrollTop: 150 } })
      expect(wrapper.vm.showSticktyRow).toBe(true)
    })
    it('should set showSticktyRow to false when scrollTop is less than searchRowHeight', () => {
      wrapper.vm.showSticktyRow = true
      wrapper.vm.searchRowHeight = 100
      document.documentElement.scrollTop = 50
      wrapper.vm.handleFloatSearch({ target: { scrollTop: 50 } })
      expect(wrapper.vm.showSticktyRow).toBe(false)
    })
  })
  describe('clickHandler method', () => {
    it('should set inputAsn correctly when name is not equal to inputAsn', () => {
      const paramMock = { data: { name: 'test|123' } }
      wrapper.vm.inputAsn = 'abc'
      wrapper.vm.getAsInfoByASN = jest.fn()
      wrapper.vm.clickHandler(paramMock)
      expect(wrapper.vm.inputAsn).toBe('abc')
      expect(wrapper.vm.getAsInfoByASN).toHaveBeenCalledWith('test')
    })
    it('should not call getAsInfoByASN method when name is equal to inputAsn', () => {
      const paramMock = { data: { name: 'abc|123' } }
      wrapper.vm.inputAsn = 'abc'
      wrapper.vm.getAsInfoByASN = jest.fn()
      wrapper.vm.clickHandler(paramMock)
      expect(wrapper.vm.getAsInfoByASN).not.toHaveBeenCalled()
    })

  })
})

describe('create Dashboard',() => {
  const $route = {
    query: {
      asn:'174'
    },
  }
  it('create',() => {
    const wrapper = shallowMount(Dashboard, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    });
    expect(wrapper.vm.inputAsn).toBe('174')
    expect(wrapper.vm.inputText).toBe('174')
  })
})