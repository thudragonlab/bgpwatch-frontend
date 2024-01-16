import {
  shallowMount,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import IP2IPRoutingPath from "@/views/IP2IPRoutingPath";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
  getRouteByIP
} from '@/api/RoutePathApi'
import "jest-canvas-mock";
import {getRouteByIP as mock_getRouteByIP,getAsInfoByList as mock_getAsInfoByList,l2rSeries,r2lSeries} from '../mockData/IP2IPRoutingPath'
import assert from 'assert'
import {
  IPPathRouteGraphOption
} from '@/templates/chart/graphTemplate'

// Vue.use(Input, { shallow: true })
Vue.use(MyC)
Vue.use(ElementUI)
Vue.prototype.$message = jest.fn()
Vue.prototype.$messageBox = jest.fn()
Vue.prototype.$assert = assert

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


const mockData = mock_getRouteByIP

jest.mock('@/api/RoutePathApi', () => {
  const mock = require('../mockData/IP2IPRoutingPath')
  return {
    getRouteByIP: jest.fn(() => Promise.resolve(mock.getRouteByIP)),
  }
})

jest.mock('@/api/DashBoardApi', () => {
  const mock = require('../mockData/IP2IPRoutingPath')
  return {
    getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),
  }
})


describe('IP2IPRoutingPath.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(IP2IPRoutingPath, {
      data() {
        return {
          IPPathRouteGraphOption,
          l2r: true,
          r2l: true,
          l2r_empty: false,
          r2l_empty: false,
          left_ip: '115.24.128.0/17',
          right_ip: '87.237.165.0/24',
          chartData: {},
          l2rSeries: [],
          r2lSeries: [],
          windowWidth: document.documentElement.clientWidth,
          loading: false,
        }
      },
    })
  })
  afterEach(() => {
    wrapper.destroy()
  })
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  describe('clickBtn', () => {
    it('should toggle the specified data property', () => {

      wrapper.vm.clickBtn({
        currentTarget: {
          dataset: {
            d: 'l2r'
          }
        }
      })
      expect(wrapper.vm.l2r).toBe(false)
      wrapper.vm.clickBtn({
        currentTarget: {
          dataset: {
            d: 'r2l'
          }
        }
      })
      expect(wrapper.vm.r2l).toBe(false)
    })
  })
  describe('make_chart', () => {
    it('should display a message and return if IP versions are different', async () => {
      getRouteByIP.mockReset()
      wrapper.vm.left_ip = '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      wrapper.vm.right_ip = '115.24.128.0/17'
      await wrapper.vm.make_chart().catch(() => {})
      expect(wrapper.vm.$messageBox).toHaveBeenCalledWith("Not support")
      expect(getRouteByIP).not.toHaveBeenCalled()
    })
    it('should display a message and return if left IP is invalid', async () => {
      getRouteByIP.mockReset()
      wrapper.vm.left_ip = 'invalid ip address'
      await wrapper.vm.make_chart().catch(() => {})
      expect(wrapper.vm.$messageBox).toHaveBeenCalledWith("IP left invalid")
      expect(getRouteByIP).not.toHaveBeenCalled()
    })
    it('should display a message and return if right IP is invalid', async () => {
      getRouteByIP.mockReset()
      wrapper.vm.right_ip = 'invalid ip address'
      await wrapper.vm.make_chart().catch(() => {})
      expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('IP right invalid')
      expect(getRouteByIP).not.toHaveBeenCalled()
    })
    it('should set loading to true before calling getRouteByIP', async () => {
      getRouteByIP.mockResolvedValue(mockData)
      wrapper.vm.make_chart()
      expect(wrapper.vm.loading).toBe(true)
      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.asInfoMap).toEqual(mock_getAsInfoByList)
      expect(getRouteByIP).toHaveBeenCalledWith('115.24.128.0/17', '87.237.165.0/24')
    })
    it('should set chartData, call make_chart_data and set loading to false after calling getRouteByIP', async () => {
      // getRouteByIP.mockResolvedValue(mockChartData)
      const make_chart_data = jest.spyOn(wrapper.vm, 'make_chart_data')
      await wrapper.vm.make_chart().catch(() => {})
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.chartData).toEqual(mockData)
      expect(make_chart_data).toHaveBeenCalledWith('l2r')
      expect(make_chart_data).toHaveBeenCalledWith('r2l')
    })
  })
  describe('doSearch', () => {
    it('should call make_chart', () => {
      const make_chart = jest.spyOn(wrapper.vm, 'make_chart')
      wrapper.vm.doSearch()
      expect(make_chart).toHaveBeenCalled()
    })
  })
  describe('make_chart_data', () => {
    it('should display a message and return if there are no links in chartData', () => {
      wrapper.vm.$message.mockReset()
      wrapper.vm.chartData = {
        l2r: {
          nodes: [],
          links: []
        }
      }
      wrapper.vm.make_chart_data('l2r')
      expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('Not found left to right path')
      expect(wrapper.vm.l2rSeries).toEqual([])
      expect(wrapper.vm.l2r_empty).toBe(true)
    })
    it('should set l2r_empty to false if it is called with r2l and there are links in chartData.r2l', () => {
      wrapper.vm.chartData = {
        r2l: {
          nodes: [
            ['4538']
          ],
          links: [{
            source: 'source',
            target: 'target'
          }]
        }
      }
      wrapper.vm.r2l_empty = true
      expect(wrapper.vm.r2l_empty).toBe(true)
      wrapper.vm.make_chart_data('r2l')
      expect(wrapper.vm.r2l_empty).toBe(false)
    })
    it('should set l2rSeries to the correct value if it is called with l2r and there are nodes and links in chartData.l2r', async() => {
      await Vue.nextTick()
      await Vue.nextTick()
      await wrapper.setData({
        chartData:mockData
      })
      
      wrapper.vm.make_chart_data('l2r')
      // console.log(JSON.stringify(mockData['l2r']))
      expect(wrapper.vm.l2rSeries).toEqual(l2rSeries)
      expect(wrapper.vm.r2lSeries).toEqual(r2lSeries)

      wrapper.vm.chartData = {}
      const make_chart_data = jest.spyOn(wrapper.vm,'make_chart_data')
      wrapper.vm.make_chart_data('l2r')
      expect(make_chart_data).toHaveLastReturnedWith(false)

    })
  })
})