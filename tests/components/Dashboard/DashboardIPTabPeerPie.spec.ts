import {
    shallowMount,
    mount,
} from "@vue/test-utils";
import DashboardIPTabPeerPie from "@/components/Dashboard/DashboardIPTabPeerPie.vue";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))



describe('DashboardIPTabPeerPie.vue', () => {
    const test_type = ['pieDataOfPeerTypeV4', 'P-C']
    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(DashboardIPTabPeerPie, {
            stubs: {
                transition: false
            },
            propsData: {
                type: test_type,
                dataList: [{
                    name: 'a',
                    value: 2
                }, {
                    name: 'b',
                    value: 21
                }],
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it('init', () => {
        
        expect(wrapper.vm[test_type[0]][test_type[1]]).toEqual({
            "title": "IPv4 Provider\nranked by\nImport + Export",
            "data": [{
                "name": "a",
                "value": 2
            }, {
                "name": "b",
                "value": 21
            }],
            "color": ["#91cc75", "#9bd181", "#a5d58e", "#afda9a", "#b9dea7", "#c2e3b3", "#cce7bf", "#d6eccc", "#e0f1d8", "#eaf5e5", "#f4faf1", "#fefefd"]
        })
    })

    it('watch', async () => {
        
        await wrapper.setProps({
            dataList:[{
                "name": "aaa",
                "value": 22
            }, {
                "name": "baa",
                "value": 221
            }]
        })
        expect(wrapper.vm[test_type[0]][test_type[1]]).toEqual({
            "title": "IPv4 Provider\nranked by\nImport + Export",
            "data": [{
                "name": "aaa",
                "value": 22
            }, {
                "name": "baa",
                "value": 221
            }],
            "color": ["#91cc75", "#9bd181", "#a5d58e", "#afda9a", "#b9dea7", "#c2e3b3", "#cce7bf", "#d6eccc", "#e0f1d8", "#eaf5e5", "#f4faf1", "#fefefd"]
        })
    })

})