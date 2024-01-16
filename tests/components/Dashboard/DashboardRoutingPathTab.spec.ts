import {
    shallowMount,
    mount,
    Wrapper,
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import DashboardRoutingPathTab from "@/components/Dashboard/DashboardRoutingPathTab.vue";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
    getAsPathByPrefix,getPrefixTotalByAsn,getAsInfoByList,handleLinksResult,seriesResult
} from '../../mockData/DashboardRoutingPathTab'
Vue.use(ElementUI)
Vue.prototype.$messageBox = jest.fn()
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

jest.mock('@/api/DashBoardApi', () => {
    const mock = require('../../mockData/DashboardRoutingPathTab')
    return {
        getAsPathByPrefix: jest.fn(() => Promise.resolve(mock.getAsPathByPrefix)),
        getPrefixTotalByAsn: jest.fn(() => Promise.resolve(mock.getPrefixTotalByAsn)),
        getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),

    }
})


document.getElementById = jest.fn(() => {
    return {
        clientWidth:100,
        clientHeight:100
    } as HTMLElement
})


describe('DashboardRoutingPathTab.vue', () => {
    let wrapper:Wrapper<any>;
    beforeEach(() => {
        wrapper = shallowMount(DashboardRoutingPathTab, {
            stubs: {
                transition: false
            },
            propsData: {
                param: {},
                inputAsn: '4538',
            },
            methods:{
                getRandomColor: jest.fn(() => '#ffffff')
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('switchPrefixTab', async () => {
        // await Vue.nextTick()
        const e = {target:{dataset:{
            prefix:'165.124.188.0/22_165.124.236.0/22',
            index:1
        }}}
        wrapper.vm.switchPrefixTab(e)
        expect(wrapper.vm.extraOption).toEqual({"title":{"left":"center","text":"165.124.188.0/22 AS PATH","textStyle":{"color":"#000"}}})
        expect(wrapper.vm.choosePrefix).toBe(e.target.dataset.prefix)
        expect(wrapper.vm.chooseIndex).toBe(e.target.dataset.index)
    })

    it('handleLinks', async () => {
        const res = wrapper.vm.handleLinks()
        expect(res).toEqual(handleLinksResult)
    })
    it('handleGraph', async () => {
        await wrapper.vm.handleGraph(getAsPathByPrefix.layer).catch(e => console.error(e))
        // console.log(JSON.stringify(wrapper.vm.graphPrefixSeries))
        expect(wrapper.vm.graphPrefixSeries).toEqual(seriesResult)
    })

    it('getPrefixTotalByAsn',async () => {
        await wrapper.vm.getPrefixTotalByAsn()
        expect(wrapper.vm.prefixTotal).toBe(getPrefixTotalByAsn.total)
    })
    
    it('searchPrefix',async () => {
        await wrapper.vm.searchPrefix()
        expect(wrapper.vm.graphPrefixSeries).toEqual(seriesResult)
        wrapper.vm.inputPrefix = '123'
        await wrapper.vm.searchPrefix()
        expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('IP invalid')
        wrapper.vm.inputPrefix = '123.0.0.0/8'
        await wrapper.vm.searchPrefix()
        expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('Please input prefix length between 16 and 24')
    })
    it('getRandomColor',() => {
        const color = wrapper.vm.getRandomColor()
        expect(color.charAt(0)).toBe('#')
    })

    it('watch inputAsn',async () => {
        const getPrefixTotalByAsn = jest.fn()
        const searchPrefix = jest.fn()
        wrapper.vm.getPrefixTotalByAsn = getPrefixTotalByAsn
        wrapper.vm.searchPrefix = searchPrefix
        await wrapper.setProps({
            inputAsn:'1234'
        })
        expect(getPrefixTotalByAsn).toHaveBeenCalled()
        expect(searchPrefix).toHaveBeenCalled()
    })
    
})