import {
  shallowMount,
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import ReverseRoutingPathD3 from "@/views/ReverseRoutingPathD3";
import { getRtreeByPrefixData } from '@/api/RoutePathApi'
import Vue from "vue";
jest.mock('@/api/RoutePathApi', () => {
  return {
    getRtreeByPrefixData: jest.fn(() => Promise.resolve({
      nodes:[{name:'A'},{name:'B'},{name:'C'}],
      links:[['A','B'],['C','B']]
    }))
  }
})


Vue.use(ElementUI)
Vue.prototype.$message = jest.fn()

describe('ReverseRoutingPathD3.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ReverseRoutingPathD3)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should call getRtreeByPrefixData when searchPrefix is called with valid IP', async () => {
    wrapper.setData({ inputPrefix: '1.0.128.0/17' })
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefixData).toBeCalledWith('1.0.128.0/17')
    expect(wrapper.vm.nodes).toEqual(['A','B','C'])
    expect(wrapper.vm.links).toEqual([{'from':'A','to':'B'},{'from':'C','to':'B'}])
  })
  it('should not call getRtreeByPrefixData when searchPrefix is called with invalid IP', async () => {
    getRtreeByPrefixData.mockReset()
    wrapper.setData({ inputPrefix: 'invalid_ip' })
    await wrapper.vm.searchPrefix()
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: 'IP invalid',
      type: 'warning',
      duration: 2000,
    })
    expect(getRtreeByPrefixData).not.toHaveBeenCalled()
    expect(wrapper.vm.nodes).toEqual(['A','B','C'])
    expect(wrapper.vm.links).toEqual([{'from':'A','to':'B'},{'from':'C','to':'B'}])

    getRtreeByPrefixData.mockResolvedValueOnce(undefined)
    wrapper.setData({ inputPrefix: '1.0.128.0/17' })
    await wrapper.vm.searchPrefix()
    expect(getRtreeByPrefixData).toHaveBeenCalled()
    
  })
it("should set viewBox and height correctly", () => {
  let svg, g, inner, svgId;
    // 调用 moreAction() 函数
    svg = {
      attr: jest.fn()
    };
    g = {
      graph: jest.fn(() => ({ width: 100, height: 200 })),
      _nodeCount: 4
    };
    inner = {};
    svgId = "svg-id";

    wrapper.vm.moreAction(g, inner, svg, svgId);
    // 验证 svg 的属性是否正确设置
    expect(svg.attr.mock.calls[0][0]).toBe("viewBox");
    expect(svg.attr.mock.calls[0][1]).toBe("-25 -10 150 220");
    expect(svg.attr.mock.calls[1][0]).toBe("height");
    expect(svg.attr.mock.calls[1][1]).toBe(400);
  });
})
