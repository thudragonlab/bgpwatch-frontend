import {
    shallowMount,
    mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import ReverseRoutingPathChart from "@/components/RouteMonitor/ReverseRoutingPathChart";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
    title,
    chartCategories,
    chartData,
    chartlinks,
    asPathDict,
    root,
    seriesTemplate,
    seriesData,
    seriesData2,
    dataExpect1,
    dataExpect2,
    dataExpect3,
    dataExpect4,
    dataExpect5,
    dataExpect6,
    dataExpect7,
    linkExpect1,
    linkExpect2,
    linkExpect3,
    linkExpect4,
    linkExpect5,
} from '../../mockData/ReverseRoutingPathChart'

Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
// document.getElementById = jest.fn(() => {
//     return {
//       clientWidth: 100
//     }
//   })

describe('ReverseRoutingPathChart.vue', () => {
    let wrapper
    beforeEach(() => {
        wrapper = mount(ReverseRoutingPathChart, {
            stubs: {
                transition: false
            },
            propsData: {
                title,
                chartCategories,
                chartData,
                chartlinks,
                asPathDict,
                root
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it('should initialize with correct default data', () => {
        expect(wrapper.vm.zoom).toBe(1)
        expect(wrapper.vm.seriesTemplate).toEqual(seriesTemplate)
        expect(wrapper.vm.seriesData).toEqual([])
        expect(wrapper.vm.categoriesColorMap).toEqual({})
        expect(wrapper.vm.chartData).toEqual(chartData)
    })
    it('should update seriesData and zoom when addZoom is called', () => {
        wrapper.vm.addZoom()
        expect(wrapper.vm.seriesData).toEqual([{
            zoom: 1.1
        }])
        expect(wrapper.vm.zoom).toBe(1.1)
    })
    it('should update seriesData and zoom when reduceZoom is called', () => {
        wrapper.vm.reduceZoom()
        expect(wrapper.vm.seriesData).toEqual([{
            zoom: 0.9
        }])
        expect(wrapper.vm.zoom).toBe(0.9)
    })
    it('should update seriesData when setSeries is called', () => {
        const obj = {
            data: [],
            links: []
        }
        wrapper.vm.setSeries(obj)
        expect(wrapper.vm.seriesData).toEqual(seriesData)
    })
    it('should update seriesData and zoom when setSeriesZoom is called', () => {
        wrapper.vm.setSeriesZoom(2)
        expect(wrapper.vm.seriesData).toEqual([{
            zoom: 2
        }])
        expect(wrapper.vm.zoom).toBe(2)
        wrapper.vm.setSeriesZoom(-1)
        expect(wrapper.vm.seriesData).toEqual([{
            zoom: 0
        }])
        expect(wrapper.vm.zoom).toBe(0)
        wrapper.vm.setSeriesZoom(4)
        expect(wrapper.vm.seriesData).toEqual([{
            zoom: 3
        }])
        expect(wrapper.vm.zoom).toBe(3)
    })
    it('should update seriesData and categoriesColorMap when legendselectchanged is called', () => {
        // Setup initial data
        wrapper.vm.$refs['topoGraph'].getChartIntance = jest.fn(() => {
            return {
                dispatchAction: jest.fn()
            }
        })
        wrapper.setData({
            categoriesColorMap: {
                'category1': {
                    show: true
                },
                'category2': {
                    show: true
                },
                'category3': {
                    show: true
                }
            },
            chartData: [{
                category: 'category1',
                value: 1
            }, {
                category: 'category2',
                value: 2
            }, {
                category: 'category3',
                value: 3
            }]
        })
        // Simulate legendselectchanged event
        const e = {
            name: 'category1',
            selected: {
                category1: true,
                category2: false,
                category3: true
            }
        }
        const echartObj = {
            dispatchAction: jest.fn()
        }
        wrapper.vm.legendselectchanged(e, echartObj)
        // Check that seriesData is updated correctly
        expect(wrapper.vm.seriesData).toEqual(seriesData2)
        // Check that categoriesColorMap is updated correctly
        expect(wrapper.vm.categoriesColorMap).toEqual({
            "category1": {
                "show": true
            },
            "category2": {
                "show": true
            },
            "category3": {
                "show": true
            }
        })
        // Check that zoom is updated correctly
        expect(wrapper.vm.zoom).toBe(1)
    })

    it('searchPathByPoint should set the series data, links and layout', async () => {
        const point = '10099';
        const updateLegend = true;
        const dataNumberWithlegendOpen = 10; // you can set the number here for testing
        await wrapper.setProps({
            chartCategories: ["layer0",
                "layer1",
                "layer2",
                "layer3",
                "layer4",
                "layer5"
            ]
        });
        const getGraphDataMock = jest.fn().mockReturnValue([]);
        const getGraphLinkMock = jest.fn().mockReturnValue([]);
        const setSeries = jest.spyOn(wrapper.vm, 'setSeries')
        wrapper.vm.getGraphData = getGraphDataMock;
        wrapper.vm.getGraphLink = getGraphLinkMock;
        await wrapper.vm.searchPathByPoint(point, updateLegend);
        expect(wrapper.vm.categoriesColorMap['layer3'].show).toBe(true);
        expect(getGraphDataMock).toHaveBeenCalled();
        expect(getGraphLinkMock).toHaveBeenCalled();
        expect(setSeries).toHaveBeenCalledWith({
            data: [],
            links: [],
            layout: dataNumberWithlegendOpen > 30 ? 'force' : 'circular',
        });
    });
    it('switchHighlightStyle should dispatch action with downplay and highlight types', () => {
        const point = '10099';
        const chartInstance = {
            dispatchAction: jest.fn()
        };
        wrapper.vm.switchHighlightStyle(point, chartInstance);
        expect(chartInstance.dispatchAction).toHaveBeenCalledWith({
            type: 'highlight',
            name: ['202.127.237.0/24', '4538', '4837', '9929', '10099'],
        });
        expect(chartInstance.dispatchAction).toHaveBeenCalledWith({
            type: 'downplay',
            name: ["8888", "3214", "138373"],
        });
        const anotherPoint = '8888';
        wrapper.vm.switchHighlightStyle(anotherPoint, chartInstance);
        expect(chartInstance.dispatchAction).toHaveBeenCalledWith({
            type: 'highlight',
            name: ['202.127.237.0/24', '4538', '4837', '9929', '10099', '3214', '8888'],
        });
        expect(chartInstance.dispatchAction).toHaveBeenCalledWith({
            type: 'downplay',
            name: ["138373"],
        });
    });
    it('clickPoint should call switchHighlightStyle and searchPathByPoint, and emit clickPoint event', () => {
        const e = {
            data: {
                name: 'testName'
            }
        };
        const chartInstance = {};
        wrapper.vm.switchHighlightStyle = jest.fn();
        wrapper.vm.searchPathByPoint = jest.fn();
        wrapper.vm.$emit = jest.fn();
        wrapper.vm.clickPoint(e, chartInstance);
        expect(wrapper.vm.switchHighlightStyle).toHaveBeenCalledWith('testName', chartInstance);
        expect(wrapper.vm.searchPathByPoint).toHaveBeenCalledWith('testName');
        expect(wrapper.vm.$emit).toHaveBeenCalledWith('clickPoint', e);
    });
    it('getGraphLink should return the correct link data based on the clickNodeList and layer01', async () => {
        await wrapper.setData({
            chartlinks: [{
                    source: 'source1',
                    target: 'target1'
                },
                {
                    source: 'target1',
                    target: 'source1'
                },
                {
                    source: 'source2',
                    target: 'target2'
                },
                {
                    source: 'target2',
                    target: 'source2'
                },
            ],
            clickNodeList: ['target1_source1'],
            layer01: ['source1', 'target1'],
            root: 'root',
        });
        expect(wrapper.vm.getGraphLink()).toEqual(linkExpect1);

        await wrapper.setData({
            chartlinks: [{
                    source: 'source1',
                    target: 'target1'
                },
                {
                    source: 'target1',
                    target: 'source1'
                },
                {
                    source: 'source2',
                    target: 'target2'
                },
                {
                    source: 'target2',
                    target: 'source2'
                },
            ],
            clickNodeList: ['target1_source1'],
            layer01: ['source1', 'target1'],
            root: 'target1',
        });
        const result1 = wrapper.vm.getGraphLink()
        expect(result1).toEqual(linkExpect2);
        await wrapper.setData({
            chartlinks: [{
                    source: 'source1',
                    target: 'target1'
                },
                {
                    source: 'target1',
                    target: 'source1'
                },
                {
                    source: 'source2',
                    target: 'target2'
                },
                {
                    source: 'target2',
                    target: 'source2'
                },
            ],
            clickNodeList: ['target1_source1'],
            layer01: [],
            root: 'target1',
        });
        const result2 = wrapper.vm.getGraphLink()
        expect(result2).toEqual(linkExpect3);

        await wrapper.setData({
            chartlinks: [{
                    source: 'source1',
                    target: 'target1'
                },
                {
                    source: 'target1',
                    target: 'source1'
                },
                {
                    source: 'source2',
                    target: 'target2'
                },
                {
                    source: 'target2',
                    target: 'source2'
                },
            ],
            clickNodeList: [],
            layer01: ['source2', 'target2'],
            root: 'target2',
        });
        const result3 = wrapper.vm.getGraphLink()
        expect(result3).toEqual(linkExpect4);
    });

    it('getGraphData renders root node correctly', async () => {
        wrapper.vm.$refs['topoGraph'].getChartIntance = jest.fn(() => {
            return {
                dispatchAction: jest.fn()
            }
        })
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
            }],
            clickNodeList: [],
            root: 'Root',
            layer01: [],
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        const result = wrapper.vm.getGraphData()
        expect(result).toEqual(dataExpect1)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
                categoryIndex:0
            }],
            clickNodeList: [],
            root: 'Rot',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        const result1 = wrapper.vm.getGraphData()
        expect(result1).toEqual(dataExpect2)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
            }],
            clickNodeList: [],
            root: 'Rot',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        const result2 = wrapper.vm.getGraphData()
        expect(result2).toEqual(dataExpect3)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
            }],
            clickNodeList: ['Rot'],
            root: 'Root',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        wrapper.vm.clickNodeList= ['Rot']
        const result3 = wrapper.vm.getGraphData()
        expect(result3).toEqual(dataExpect4)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
                categoryIndex:0
            }],
            root: 'Rot',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        wrapper.vm.clickNodeList= ['Rot']
        const result4 = wrapper.vm.getGraphData()
        expect(result4).toEqual(dataExpect5)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
            }],
            // clickNodeList: ['Root'],
            root: 'Rot',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        wrapper.vm.clickNodeList= ['Root']
        const result5 = wrapper.vm.getGraphData()
        expect(result5).toEqual(dataExpect6)
        await wrapper.setData({
            chartData: [{
                name: 'Root',
                category: 'root',
            }],
            clickNodeList: ['Rot'],
            root: 'Rot',
            categoriesColorMap: {
                root: {
                    color: '#000',
                }
            }
        })
        wrapper.vm.clickNodeList= ['Rot']
        const result6 = wrapper.vm.getGraphData()
        expect(result6).toEqual(dataExpect7)
    })
   
})