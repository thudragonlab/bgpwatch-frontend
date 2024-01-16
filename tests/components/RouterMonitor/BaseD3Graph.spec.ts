import {
    Wrapper,
    mount,
    shallowMount
  } from '@vue/test-utils'
  import BaseD3Graph from "@/components/RouteMonitor/BaseD3Graph.vue";
  import ElementUI from '@/lib/element.js'
  import Vue from "vue";
  
  import 'jest-canvas-mock'
  
  Vue.use(ElementUI)
  
  
  describe('BaseD3Graph.vue', () => {
         // 测试节点和边的信息是否正确传递并渲染成功
  it('renders nodes and links correctly', async () => {
    const links = [
      { from: 'node1', to: 'node2' },
      { from: 'node2', to: 'node3' }
    ]
    const nodes = ['node1', 'node2', 'node3']
    const wrapper:Wrapper<any> = mount(BaseD3Graph, {
      propsData: {
        d3Id:'ggg',
        links,
        nodes,
        customerFunc:jest.fn(),
        moreAction:jest.fn()
      }
    })
    expect(wrapper.html()).toMatchSnapshot();
    const drawGraph = jest.fn()
    wrapper.vm.drawGraph = drawGraph
    await wrapper.setProps({
        nodes:['node1', 'node2']
    })
    expect(drawGraph).toHaveBeenCalled()

  })
  // 测试自定义操作函数是否被正确调用
  it('calls custom function correctly', () => {
    const links = [
      { from: 'node1', to: 'node2' }
    ]
    const nodes = ['node1', 'node2']
    const customerFunc = jest.fn((graph, links, nodes) => {
      graph.setNode('node3', {
        label: 'node3',
        labelStyle: 'font-size: 10px',
        shape: 'circle',
        style: 'stroke: darkgray; fill: Gainsboro',
      })
      graph.setEdge('node2', 'node3', {
        style: 'stroke: rgb(20, 20, 20); fill: none;',
        arrowheadStyle: 'fill: rgb(20, 20, 20); stroke: rgb(20, 20, 20);',
        arrowhead: 'vee',
      })
    })
    const wrapper = mount(BaseD3Graph, {
      propsData: {
        links,
        nodes,
        customerFunc,
        moreAction:jest.fn()
      }
    })
    expect(customerFunc).toHaveBeenCalledWith(expect.any(Object), links, nodes)
  })
  // 测试更多操作函数是否被正确调用
  it('calls more action function correctly', () => {
    const links = [
      { from: 'node1', to: 'node2' }
    ]
    const nodes = ['node1', 'node2']
    const moreAction = jest.fn((graph, inner, svg, svgId) => {
      svg.attr('width', '100%')
      svg.attr('height', '100%')
    })
    const wrapper = mount(BaseD3Graph, {
      propsData: {
        links,
        nodes,
        customerFunc:jest.fn(),
        moreAction

      }
    })
    expect(moreAction).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Object), expect.any(String))
  })
    
  })