import {
    shallowMount,
    mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import DashboardIPTab from "@/components/Dashboard/DashboardIPTab";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
    getAsInfoByList as mock_getAsInfoByList,
    peer_list as mock_peer_list,
    tableDataMap,
    countryList,
    tableData,
    expectPeerTypeListWillReturn,
    expectSortPrefixData,
    input_processedPieData,
    willReturnList,
    peerTypeList
} from '../../mockData/DashboardIPTab'

import {
    getPeerTypeDistribute
} from '../../mockData/Dashboard'


Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))


jest.mock('@/api/DashBoardApi', () => {
    const mock = require('../../mockData/DashboardIPTab')
    return {
        getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList)),
        getPeerList: jest.fn(() => Promise.resolve(mock.peer_list)),

    }
})

describe('DashboardIPTab.vue', () => {
    let wrapper
    const inputAsn = '4538'
    beforeEach(() => {
        wrapper = shallowMount(DashboardIPTab, {
            stubs: {
                transition: false
            },
            propsData: {
                param: {
                    inputAsn: '4538',
                    clickHandler: jest.fn(),
                    distribution: getPeerTypeDistribute,
                    ipVersion: 4,
                }


            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it('init', () => {
        expect(wrapper.vm.peers).toEqual(mock_peer_list)
        expect(wrapper.vm.tableDataMap).toEqual(tableDataMap)
        expect(wrapper.vm.asNameInfoMap).toEqual(mock_getAsInfoByList)
    })


    it('getPeer', async () => {
        wrapper.vm.handlePie = jest.fn()
        wrapper.vm.handleTable = jest.fn()
        const getParam = jest.spyOn(wrapper.vm, 'getParam')
        await wrapper.vm.getPeer()
        expect(wrapper.vm.peers).toEqual(mock_peer_list)
        expect(wrapper.vm.tableDataMap).toEqual({})
        expect(wrapper.vm.asNameInfoMap).toEqual(mock_getAsInfoByList)
        expect(getParam).toHaveBeenCalled()
        expect(wrapper.vm.handlePie).toHaveBeenCalled()
        expect(wrapper.vm.handleTable).toHaveBeenCalled()
    })

    it('doSearch', () => {
        wrapper.vm.searchKey_h = '123'
        wrapper.vm.doSearch()
        expect(wrapper.vm.searchKey).toBe('123')
    })

    it('getParam', async () => {
        const clickHandler = jest.fn()
        await wrapper.setProps({
            param: {
                inputAsn: '4538',
                clickHandler,
                ipVersion: '4',
                distribution: {}
            }
        })
        wrapper.vm.getParam()
        expect(wrapper.vm.inputAsn).toBe('4538')
        expect(wrapper.vm.clickHandler).toBe(clickHandler)
        expect(wrapper.vm.ipVersion).toBe('4')
        expect(wrapper.vm.distribution).toEqual({})
    })

    it('handleTable', async () => {
        await Vue.nextTick()
        wrapper.vm.handleTable()
        expect(wrapper.vm.countryList).toEqual(countryList)
        expect(wrapper.vm.tableData).toEqual(tableData)
    })

    it('handlePie', async () => {
        wrapper.vm.processPieDataOfPeerType = jest.fn()
        wrapper.vm.handlePie()
        expect(wrapper.vm.processPieDataOfPeerType).toHaveBeenCalled()
    })
    it('processPieDataOfPeerType', () => {
        const processPrefixDataAndSetInChart = jest.fn()
        wrapper.vm.processPrefixDataAndSetInChart = processPrefixDataAndSetInChart

        wrapper.vm.processPieDataOfPeerType()
        expect(processPrefixDataAndSetInChart).toHaveBeenCalledTimes(3)
        processPrefixDataAndSetInChart.mockClear()
        wrapper.vm.distribution = undefined
        wrapper.vm.processPieDataOfPeerType()
        expect(processPrefixDataAndSetInChart).not.toHaveBeenCalled()

    })
    it('processPrefixDataAndSetInChart', () => {
        const processPrefixDatafrom = jest.fn(() => '123')
        const setPrefixDataInPieChart = jest.fn(() => '234')
        wrapper.vm.setPrefixDataInPieChart = setPrefixDataInPieChart
        wrapper.vm.processPrefixDatafrom = processPrefixDatafrom
        wrapper.vm.processPrefixDataAndSetInChart(123, '_', 'aaa')
        expect(processPrefixDatafrom).toHaveBeenCalledWith(123)
        expect(setPrefixDataInPieChart).toHaveBeenCalledWith('123')
        expect(wrapper.vm.aaa).toBe('234')
    })
    it('setPrefixDataInPieChart', () => {
        const a = wrapper.vm.setPrefixDataInPieChart(input_processedPieData)
        expect(a).toEqual(willReturnList)
    })
    it('processPrefixDatafrom', () => {
        const sortPrefixData = jest.fn(() => '234')
        const simplifyPerfixData = jest.fn()
        wrapper.vm.simplifyPerfixData = simplifyPerfixData
        wrapper.vm.sortPrefixData = sortPrefixData
        wrapper.vm.processPrefixDatafrom('123')
        expect(sortPrefixData).toHaveBeenCalledWith('123')
        expect(simplifyPerfixData).toHaveBeenCalledWith('234', 'prefiexCountForV4', [])
    })

    it('simplifyPerfixData', () => {
        const peerTypeListWillReturn = []
        const simplifyPerfixData = jest.spyOn(wrapper.vm, 'simplifyPerfixData')
        wrapper.vm.simplifyPerfixData(undefined, undefined, undefined)
        expect(simplifyPerfixData).toHaveReturned()
        wrapper.vm.simplifyPerfixData(peerTypeList, 'prefiexCountForV4', peerTypeListWillReturn)
        expect(peerTypeListWillReturn).toEqual(expectPeerTypeListWillReturn)
    })

    it('sortPrefixData', () => {
        const sortPrefixData = jest.spyOn(wrapper.vm, 'sortPrefixData')
        wrapper.vm.sortPrefixData(undefined)
        expect(sortPrefixData).toHaveReturnedWith([])
        const result = wrapper.vm.sortPrefixData(peerTypeList)
        expect(result).toEqual(expectSortPrefixData)
    })

    it('generateCellStyle', () => {
        const generateCellStyle = jest.spyOn(wrapper.vm, 'generateCellStyle')
        wrapper.vm.generateCellStyle({
            columnIndex: 4
        })
        expect(generateCellStyle).toHaveReturnedWith('full-cell')
    })

    describe('showRule', () => {
        it('AS neighbors', () => {
            const list = [{
                asn: 3
            }, {
                asn: 1
            }, {
                asn: 2
            }]
            list.sort(wrapper.vm.showRule[0].compare)
            expect(list).toEqual([{
                asn: 1
            }, {
                asn: 2
            }, {
                asn: 3
            }])
            const o = {
                asn: 3
            }
            expect(wrapper.vm.showRule[0].rowFormat(o)).toBe(3)
        })
        it('Organization', () => {
            const o = {
                org_name: 3
            }
            expect(wrapper.vm.showRule[1].rowFormat(o)).toBe(3)
        })
        it('Country/Region', () => {
            const list = [{
                country: 'Asia'
            }, {
                country: 'China'
            }, {
                country: 'Japan'
            }, {
                country: 'America'
            }, {
                country: '3'
            }]
            list.sort(wrapper.vm.showRule[2].compare)
            expect(list).toEqual([{
                "country": "3"
            }, {
                "country": "Asia"
            }, {
                "country": "China"
            }, {
                "country": "Japan"
            }, {
                "country": "America"
            }])

        })
        it('AS customer cone', () => {
            const list = [{
                cone: 3
            }, {
                cone: 1
            }, {
                cone: 2
            }]
            list.sort(wrapper.vm.showRule[3].compare)
            expect(list).toEqual([{cone:1},{cone:2},{cone:3}])
        })
    })

})