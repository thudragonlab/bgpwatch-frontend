import {
    shallowMount,
    mount
} from "@vue/test-utils";
import * as dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import ElementUI from '@/lib/element.js'
import EventDetailHijackEventReplay from "@/components/Anomaly/EventDetailHijackEventReplay";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
    subdata,
    linkArray,
    nodes,
    timeSelection,
    hijackData
} from '../../mockData/EventDetailHijackEventReplay'

Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))


describe('EventDetailHijackEventReplay.vue', () => {
let wrapper
beforeEach(() => {
    wrapper = shallowMount(EventDetailHijackEventReplay, {
        stubs: {
            transition: false
        },
        propsData: {
            subdata
        }
    });
});
afterEach(() => {
    wrapper.destroy();
});

it('moreAction', () => {
    const setTooltip = jest.fn()
    wrapper.vm.setTooltip = setTooltip
    wrapper.vm.moreAction()
    expect(setTooltip).toHaveBeenCalled()
})
it('setTooltip', () => {
    const g = new dagreD3.graphlib.Graph()
    g.graph = jest.fn(() => {
        return {width:100,height:100}
    })
    document.getElementById = jest.fn(() => {
        return document.createElement('div')
    })
    const s = d3.select('#before')
    var svg = s.append('svg')
    var inner = svg.append('g')
    wrapper.vm.setTooltip(g,svg,inner,'before')
})
it('drawGraph1_hijack', () => {
    wrapper.vm.drawGraph1_hijack(subdata)
    expect(wrapper.vm.linkArray).toEqual(linkArray)
    expect(wrapper.vm.nodes).toEqual(nodes)
})
it('TimeSelect && drawGraph2_hijack', async () => {
    wrapper = shallowMount(EventDetailHijackEventReplay, {
        stubs: {
            transition: false
        },
        propsData: {}
    });
const drawGraph2_hijack = jest.spyOn(wrapper.vm, 'drawGraph2_hijack')
// const TimeSelect = jest.spyOn(wrapper.vm, 'TimeSelect')
const drawGraph1_hijack = jest.spyOn(wrapper.vm, 'drawGraph1_hijack')
wrapper.vm.TimeSelect(subdata)
expect(wrapper.vm.timeSelection).toEqual(timeSelection)
expect(wrapper.vm.time).toBe('-1')
await wrapper.setProps({
    subdata
})
wrapper.vm.drawGraph2_hijack(subdata,{value:-1})
expect(wrapper.vm.hijackData).toEqual(hijackData)
expect(drawGraph2_hijack).toHaveBeenCalledTimes(Object.keys(subdata.replay).length * 2 + 1)
expect(drawGraph1_hijack).toHaveBeenCalledTimes(1)

})
})