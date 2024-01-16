import {
  shallowMount,
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import ReverseRoutingPath from "@/views/Depracated/ReverseRoutingPath";
import "jest-canvas-mock";
import { getRtreeByPrefix } from '@/api/RoutePathApi'
import Vue from "vue";
// import Viewer from 'v-viewer'
jest.mock('@/api/RoutePathApi', () => {
  return {
    getRtreeByPrefix: jest.fn(() => Promise.resolve({base64_code:''}))
  }
})

// Viewer.setDefaults()
// Vue.use(Viewer)

Vue.use(ElementUI)
Vue.prototype.$message = jest.fn()

describe.skip('ReverseRoutingPath.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ReverseRoutingPath)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should call getRtreeByPrefix when searchPrefix is called with valid IP', async () => {
    wrapper.setData({ inputPrefix: '1.0.128.0/17' })
    getRtreeByPrefix.mockResolvedValueOnce({ base64_code: 'base64_code' })
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefix).toBeCalledWith('1.0.128.0/17')
    expect(wrapper.vm.rtreeBase64Code).toBe('base64_code')
    expect(wrapper.vm.rtree_images).toEqual(['base64_code'])
  })
  it('should not call getRtreeByPrefix when searchPrefix is called with invalid IP', async () => {
    getRtreeByPrefix.mockReset()
    wrapper.setData({ inputPrefix: 'invalid_ip' })
    await wrapper.vm.searchPrefix()
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: 'IP invalid',
      type: 'warning',
      duration: 2000,
    })
    expect(getRtreeByPrefix).not.toHaveBeenCalled()
    expect(wrapper.vm.rtreeBase64Code).toBe('')
    expect(wrapper.vm.rtree_images).toEqual([""])

    getRtreeByPrefix.mockResolvedValueOnce(undefined)
    wrapper.setData({ inputPrefix: '1.0.128.0/17' })
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefix).toHaveBeenCalled()
    expect(wrapper.vm.rtreeBase64Code).toBe('')
    expect(wrapper.vm.rtree_images).toEqual([])
    
  })
  it('should show error message when getRtreeByPrefix fails', async () => {
    wrapper.setData({ inputPrefix: '1.0.128.0/17' })
    const errorMessage = {base64_code:'Error',msg:'Error Message'}
    getRtreeByPrefix.mockResolvedValueOnce(errorMessage)
    await wrapper.vm.searchPrefix()
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: errorMessage.msg,
      type: 'error',
      duration: 2000,
    })
    expect(getRtreeByPrefix).toBeCalledWith('1.0.128.0/17')
    expect(wrapper.vm.rtreeBase64Code).toBe('Error')
    expect(wrapper.vm.rtree_images).toEqual([])
  })
})
