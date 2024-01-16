import {
    shallowMount,
    mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import DashboardAsInfoTab from "@/components/Dashboard/DashboardAsInfoTab";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
    peerColor
} from '@/templates/chart/graphTemplate'
import {
    getRouteHistoryStats,
    getPrefixList,
    getAsInfoByList
} from '@/api/DashBoardApi'
import {
    getAsInfoByList as mock_getAsInfoByList,
    route_history_stats as mock_route_history_stats,
    prefix_list as mock_prefix_list,
    rawTableData,
    prefixListOrigin,
    barDataV6,
    routingHistoryData,
    GaugeOptionProp,
    barDataLabelV6
} from '../../mockData/DashboardAsInfoTab'

Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))


jest.mock('@/api/DashBoardApi', () => {
    const mock = require('../../mockData/DashboardAsInfoTab')
    return {
        getRouteHistoryStats: jest.fn(() => Promise.resolve(mock.route_history_stats)),
        getPrefixList: jest.fn(() => Promise.resolve(mock.prefix_list)),
        getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),

    }
})

describe('DashboardAsInfoTab.vue', () => {
    let wrapper
    const inputAsn = '4538'
    beforeEach(() => {
        wrapper = shallowMount(DashboardAsInfoTab, {
            stubs: {
                transition: false
            },
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('watch param', async () => {
        const getPrefixList = jest.spyOn(wrapper.vm, 'getPrefixList')
        const processPeersData = jest.spyOn(wrapper.vm, 'processPeersData')
        const processHistoryData = jest.spyOn(wrapper.vm, 'processHistoryData')
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })

        expect(wrapper.vm.inputAsn).toBe(inputAsn);
        expect(getPrefixList).toBeCalledWith(inputAsn);
        expect(processPeersData).toBeCalledWith({
            inputAsn
        });
        expect(processHistoryData).toBeCalledWith({
            inputAsn
        });

    })

    it('watch activeIpVersion', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const oldBarIndex = wrapper.vm.barIndexclicked
        await wrapper.setData({
            activeIpVersion: 6,
        })
        expect(wrapper.vm.barDataV4[oldBarIndex].itemStyle.color).toBe(wrapper.vm.barColorStyle)
        expect(wrapper.vm.barIndexclicked).toBe(wrapper.vm.barDataV6.findIndex(item => item.name === `${wrapper.vm.clickBar}`))
    })

    it('watch barIndexclicked', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })

        let oldBarIndex = wrapper.vm.barIndexclicked
        await wrapper.setData({
            barIndexclicked: 1,
        })
        expect(wrapper.vm[`barDataV${wrapper.vm.activeIpVersion}`][1].itemStyle.color).toBe(peerColor)

        await wrapper.setData({
            barIndexclicked: 2,
        })
        expect(wrapper.vm[`barDataV${wrapper.vm.activeIpVersion}`][1].itemStyle.color).toBe(wrapper.vm.barColorStyle)
        expect(wrapper.vm[`barDataV${wrapper.vm.activeIpVersion}`][2].itemStyle.color).toBe(peerColor)

        await wrapper.setData({
            barIndexclicked: -1,
        })
        expect(wrapper.vm[`barDataV${wrapper.vm.activeIpVersion}`][2].itemStyle.color).toBe(wrapper.vm.barColorStyle)


    })

    it('switchAll', async () => {

        const useAll = jest.fn()
        const useSelected = jest.fn()
        wrapper.vm.useAll = useAll
        wrapper.vm.useSelected = useSelected
        wrapper.vm.switchAll(false)
        expect(wrapper.vm.prefixSearchKey).toBe('')
        expect(useSelected).toHaveBeenCalled()
        expect(useAll).not.toHaveBeenCalled()
        useSelected.mockClear()
        useAll.mockClear()
        wrapper.vm.switchAll(true)
        expect(useSelected).not.toHaveBeenCalled()
        expect(useAll).toHaveBeenCalled()


    })

    it('useAll', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const refrushData = jest.fn()

        wrapper.vm.refrushData = refrushData
        wrapper.vm.useAll()

        expect(refrushData).toBeCalledWith(rawTableData)
        expect(wrapper.vm.rawTableData).toEqual(rawTableData)
    })

    it('useSelected', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const refrushData = jest.fn()

        wrapper.vm.refrushData = refrushData
        wrapper.vm.useSelected()
        expect(refrushData).toBeCalledWith(wrapper.vm.prefixListOrigin[wrapper.vm.clickBarVersion][wrapper.vm.clickBar])
        expect(wrapper.vm.rawTableData).toEqual(wrapper.vm.prefixListOrigin[wrapper.vm.clickBarVersion][wrapper.vm.clickBar])
    })

    it('clickBarFuncV4', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const moveScrollBar = jest.fn()
        const processBarStyle = jest.fn()
        wrapper.vm.processBarStyle = processBarStyle
        wrapper.vm.moveScrollBar = moveScrollBar
        wrapper.vm.clickBarFuncV4({
            name: '4'
        })

        expect(moveScrollBar).toHaveBeenCalled()
        expect(wrapper.vm.clickBar).toBe('4')
        expect(processBarStyle).toBeCalledWith(4)
    })

    it('clickBarFuncV6', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const moveScrollBar = jest.fn()
        const processBarStyle = jest.fn()
        wrapper.vm.processBarStyle = processBarStyle
        wrapper.vm.moveScrollBar = moveScrollBar
        wrapper.vm.clickBarFuncV6({
            name: '4'
        })

        expect(moveScrollBar).toHaveBeenCalled()
        expect(wrapper.vm.clickBar).toBe('4')
        expect(processBarStyle).toBeCalledWith(6)
    })

    it('moveScrollBar', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        document.documentElement.height = 100
        wrapper.vm.$refs['prefixTable'].$el.getBoundingClientRect = jest.fn(() => {
            return {
                top: 200
            }
        })
        const scrollIntoView = jest.fn()
        wrapper.vm.$refs['prefixBar'].$el.scrollIntoView = scrollIntoView
        wrapper.vm.moveScrollBar()
        expect(scrollIntoView).toBeCalledWith({
            behavior: 'smooth',
        })
    })
    it('processBarStyle', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const refrushData = jest.spyOn(wrapper.vm, 'refrushData')
        wrapper.vm.clickBar = 21
        wrapper.vm.clickBarVersion = 'ipv6'
        // console.log(wrapper.vm.clickBarVersion)
        wrapper.vm.processBarStyle(6)
        expect(wrapper.vm.prefixSearchKey).toBe('')
        expect(wrapper.vm.selectPrefixInAll).toBe(false)
        expect(wrapper.vm.activeIpVersion).toBe(6)
        expect(wrapper.vm.clickBarVersion).toBe('ipv6')

        expect(refrushData).toBeCalledWith(wrapper.vm.prefixListOrigin[wrapper.vm.clickBarVersion][wrapper.vm.clickBar])
        expect(wrapper.vm.rawTableData).toEqual(wrapper.vm.prefixListOrigin[wrapper.vm.clickBarVersion][wrapper.vm.clickBar])
    })

    it('handleSingleBar', async () => {
        const ip_distribution = {
            "21": 2,
            "32": 130,
            "40": 7,
            "48": 28,
            "56": 1,
            "60": 1,
            "61": 1,
            "62": 1,
            "63": 1,
            "64": 87,
            "65": 1,
            "68": 1,
            "69": 1,
            "77": 1,
            "112": 1,
            "126": 17,
            "128": 14
        }

        wrapper.vm.handleSingleBar(ip_distribution, 'V6')

        expect(wrapper.vm.barDataV6).toEqual(barDataV6)
        expect(wrapper.vm.barDataLabelV6).toEqual(barDataLabelV6)
    })

    it('getPrefixList', async () => {
        const processBarStyle = jest.fn()
        wrapper.vm.processBarStyle = processBarStyle
        getPrefixList.mockResolvedValueOnce('no')
        await wrapper.vm.getPrefixList()
        expect(wrapper.vm.barIndexclicked).toBe(-1)
        expect(wrapper.vm.prefixListOrigin).toBe('no')
        getPrefixList.mockResolvedValueOnce({
            'ipv4': {},
            'ipv6': {}
        })
        await wrapper.vm.getPrefixList()
        expect(wrapper.vm.barDataV4).toEqual([])
        expect(wrapper.vm.barDataV6).toEqual([])
        expect(wrapper.vm.clickBarVersion).toBe('ipv6')
        expect(wrapper.vm.clickBar).toBe('')
        expect(processBarStyle).toBeCalledWith(6)
    })
    it('handlePrefixList', async () => {
        await wrapper.setProps({
            param: {
                inputAsn
            },
        })
        const refrushData = jest.spyOn(wrapper.vm, 'refrushData')
        wrapper.vm.prefixSearchKey = undefined
        wrapper.vm.handlePrefixList()
        expect(wrapper.vm.loading).toBeFalsy()
        expect(refrushData).toBeCalledWith([...wrapper.vm.rawTableData])

        wrapper.vm.prefixSearchKey = '222'
        wrapper.vm.handlePrefixList()
        expect(refrushData).toBeCalledWith([...wrapper.vm.rawTableData].filter(prefix => prefix.includes('222')))

        wrapper.vm.prefixSearchKey = '103.28.121.0/24'
        wrapper.vm.loading = false
        expect(wrapper.vm.loading).toBeFalsy()
        wrapper.vm.handlePrefixList()
        expect(wrapper.vm.prefixList.map(item => Object.values(item)).flat().includes('203.28.120.0/22'))
    })
    it('ipToBinary', async () => {
        const ipv4ToBinary = jest.fn()
        const ipv6ToBinary = jest.fn()
        const ipv6Full = jest.fn()
        wrapper.vm.ipv4ToBinary = ipv4ToBinary
        wrapper.vm.ipv6ToBinary = ipv6ToBinary
        wrapper.vm.ipv6Full = ipv6Full

        wrapper.vm.ipToBinary('103.28.121.0/24')
        expect(ipv4ToBinary).toHaveBeenCalled()
        expect(ipv6ToBinary).not.toHaveBeenCalled()
        expect(ipv6Full).not.toHaveBeenCalled()

        ipv4ToBinary.mockClear()
        ipv6ToBinary.mockClear()
        ipv6Full.mockClear()

        wrapper.vm.ipToBinary('2001:da8::/32')
        expect(ipv4ToBinary).not.toHaveBeenCalled()
        expect(ipv6ToBinary).toHaveBeenCalled()
        expect(ipv6Full).toHaveBeenCalled()
    })

    it('ipv4ToBinary', async () => {
        expect(wrapper.vm.ipv4ToBinary('103.28.121.0/24')).toBe('01100111000111000111100100000000')
    })

    it('ipv6Full', async () => {
        expect(wrapper.vm.ipv6Full('240a:afce::/32')).toBe('240a:afce:0000:0000:0000:0000:0000:0/32')
    })

    it('ipv6ToBinary', async () => {
        expect(wrapper.vm.ipv6ToBinary('240a:afce:0000:0000:0000:0000:0000:0/32')).toBe('00100100000010101010111111001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
    })

    it('refrushData', async () => {
        wrapper.vm.refrushData(['1', '2', '3', '4'])
        expect(wrapper.vm.prefixList).toEqual([{
            prefix1: '1',
            prefix2: '2',
            prefix3: '3'
        }, {
            prefix1: '4'
        }])
        expect(wrapper.vm.loading).toBeFalsy()
        expect(wrapper.vm.showingDataTotal).toBe(4)
        wrapper.vm.refrushData([])
        expect(wrapper.vm.rawTableData).toEqual([])
        expect(wrapper.vm.prefixList).toEqual([])
        expect(wrapper.vm.loading).toBeFalsy()
    })


    it('processHistoryData', async () => {
        const packingToLineData = jest.spyOn(wrapper.vm, 'packingToLineData')
        await wrapper.vm.processHistoryData({
            inputAsn: '4538'
        })
        expect(packingToLineData).toHaveBeenCalledTimes(4)
        expect(wrapper.vm.routingHistoryData).toEqual(routingHistoryData)
        expect(wrapper.vm.GaugeOptionProp).toEqual(GaugeOptionProp)
    })


    it('processPeersData', async () => {
        await wrapper.vm.processPeersData({
            inputAsn: '4538'
        })
        expect(wrapper.vm.asInfo).toEqual({
            "asn": {
                "label": "AS NUM",
                "value": "4538",
                "span": 4
            },
            "as_country": {
                "label": "Country/Region",
                "value": "China",
                "span": 4
            },
            "as_name": {
                "label": "AS Name",
                "value": "ERX-CERNET-BKB",
                "span": 6
            },
            "as_org": {
                "label": "AS Organization",
                "value": "China Education and Research Network Center",
                "span": 10
            }
        })
        await wrapper.vm.processPeersData({
            inputAsn: '438'
        })
        expect(wrapper.vm.asInfo).toEqual({"asn":{"label":"AS NUM","value":"438","span":4},"as_country":{"label":"Country/Region","value":"Unknown","span":4},"as_name":{"label":"AS Name","value":"Unknown","span":6},"as_org":{"label":"AS Organization","value":"Unknown","span":10}})
    })

})