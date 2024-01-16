import {
    shallowMount,
    mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import DashboardIPTabIEGraph from "@/components/Dashboard/DashboardIPTabIEGraph";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";

import {
    setDataInGraphData
} from '@/templates/chart/graphTemplate'

import {
    getASList
} from '@/api/DashBoardApi'
import {
    getAsList as mock_getAsList,
    peers,
    asNameInfoMap,
    graphSeries,
    graphSeries_length,
    graphSeries_length2
} from '../../mockData/DashboardIPTabIEGraph'



Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))


jest.mock('@/api/DashBoardApi', () => {
    const mock = require('../../mockData/DashboardIPTabIEGraph')
    return {
        getASList: jest.fn(() => Promise.resolve(mock.getAsList)),

    }
})


describe('DashboardIPTabIEGraph.vue', () => {
    let wrapper
    const inputAsn = '4538'
    beforeEach(() => {
        wrapper = shallowMount(DashboardIPTabIEGraph, {
            stubs: {
                transition: false
            },
            propsData: {
                title: '',
                inputAsn: '4538',
                clickHandler: jest.fn(),
                peers,
                version: 'ipv4'


            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it('watich asNameInfoMap', async () => {

        const handleGraph = jest.spyOn(wrapper.vm, 'handleGraph')
        wrapper.vm.windowWidth = 1000
        await wrapper.setProps({
            asNameInfoMap: {},
            inputAsn: undefined
        })
        expect(wrapper.vm.providerAses).toEqual([])
        expect(wrapper.vm.peerAses).toEqual([])
        expect(wrapper.vm.customerAses).toEqual([])
        expect(wrapper.vm.graphSeries).toEqual([])


        await wrapper.setProps({
            asNameInfoMap: asNameInfoMap,
            inputAsn: '4538'
        })
        expect(wrapper.vm.providerAses).toEqual(mock_getAsList['providerAses'])
        expect(wrapper.vm.peerAses).toEqual(mock_getAsList['peerAses'])
        expect(wrapper.vm.customerAses).toEqual(mock_getAsList['customerAses'])
        expect(wrapper.vm.graphSeries).toEqual(graphSeries)
        // console.log(JSON.stringify(wrapper.vm.graphSeries))


    })
    it('handleGraph empty_peers', async () => {

        const handleGraph = jest.spyOn(wrapper.vm, 'handleGraph')

        const test_fn = jest.fn()
        wrapper.vm.providerAses.includes = test_fn

        const empty_peers = {

        }

        await wrapper.setProps({
            peers: empty_peers
        })

        wrapper.vm.handleGraph()
        expect(test_fn).not.toHaveBeenCalled()


    })


    it('handleGraph empty_ip_peers', async () => {

        const handleGraph = jest.spyOn(wrapper.vm, 'handleGraph')
        wrapper.vm.windowWidth = 1000

        const empty_ip_peers = {
            export_peers: {},
            import_peers: {},

        }

        await wrapper.setProps({
            peers: empty_ip_peers,
            inputAsn: '453822',
        })
        wrapper.vm.handleGraph().catch(e => console.error(e))

        expect(wrapper.vm.graphSeries).toEqual([{
            "data": [{
                "name": "453822",
                "y": -0,
                "x": 0,
                "org": "Unknown",
                "asName": "Unknown",
                "country": "Unknown",
                "itemStyle": {
                    "color": {
                        "type": "radial",
                        "x": 0.5,
                        "y": 0.5,
                        "r": 0.5,
                        "colorStops": [{
                            "offset": 0,
                            "color": "#7E5ECA"
                        }, {
                            "offset": 0.81,
                            "color": "#7E5ECA"
                        }, {
                            "offset": 0.82,
                            "color": "#fff"
                        }, {
                            "offset": 1,
                            "color": "#fff"
                        }],
                        "global": false
                    },
                    "borderColor": "#ffffff"
                },
                "symbol": "circle",
                "symbolOffset": [0, 0],
                "symbolSize": 70
            }],
            "links": [],
            "name": "ASN Relation",
            "width": 375.7440476190476,
            "zoom": 0.7
        }])


    })

    it('handleGraph length', async () => {

        const handleGraph = jest.spyOn(wrapper.vm, 'handleGraph')
        wrapper.vm.windowWidth = 1000

        const length_peers = {
            export_peers: {
                ipv4: {
                    "23911": 56,
                    "24348": 56,
                    "24364": 56,
                    "24369": 56,
                    "133111": 56,
                    "9405": 56,
                }
            },
            import_peers: {
                ipv4: {
                    "132337": 56,
                    "7660": 56,
                    "4608": 56,
                    "132825": 56,
                    "2603": 56,
                    "7497": 56,
                }
            },
        }

        await wrapper.setProps({
            peers: length_peers,
            asNameInfoMap: asNameInfoMap,
            inputAsn: '453822',
        })

        expect(wrapper.vm.graphSeries).toEqual(graphSeries_length)


        const length_peers2 = {
            export_peers: {
                ipv4: {
                    "23911": 56,
                    "24348": 56,
                    "24364": 56,
                    "9405": 56,
                }
            },
            import_peers: {
                ipv4: {
                    "132337": 56,
                    "7660": 56,
                    "4608": 56,
                    "132825": 56,
                    "2603": 56,
                    "7497": 56,
                }
            },
        }

        await wrapper.setProps({
            peers: length_peers2,
            asNameInfoMap: Object.assign({},asNameInfoMap),
            inputAsn: '453822',
        })

        expect(wrapper.vm.graphSeries).toEqual(graphSeries_length2)

    })

})