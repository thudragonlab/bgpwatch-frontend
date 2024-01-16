import {
  shallowMount,
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import Resilience from "@/views/Resilience";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
  getResilienceByccCode as mock_getResilienceByccCode,
  graphLink,
  graphSourceData
} from '../mockData/Resilience'
import {
  getResilienceByccCode
} from '@/api/ResilienceApi'

const mockData = mock_getResilienceByccCode
Vue.use(ElementUI)
Vue.use(MyC)

Vue.prototype.$message = jest.fn()
Vue.prototype.$alert = jest.fn()

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

jest.mock('@/api/DashBoardApi', () => {
  const mock = require('../mockData/Resilience')
  return {
    getAsInfoByList: jest.fn(() => Promise.resolve(mock.getAsInfoByList))
  }
})

jest.mock('@/api/ResilienceApi', () => {
  const mock = require('../mockData/Resilience')
  return {
    getResilienceByccCode: jest.fn(() => Promise.resolve(mock.getResilienceByccCode))
  }
})



describe('Resilience', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Resilience)
    jest.useFakeTimers();
  })

  afterEach(() => {
    expect(wrapper.vm.showLoading).toBeFalsy()
    wrapper.destroy()
    jest.clearAllTimers();
  })
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should search by cone when regex result is provided', async () => {
    await Vue.nextTick()
    const regex = /^(\[|\()(\d+|),(\d+|)(\]|\))/
    wrapper.vm.searchInput = '[123,456]'
    const searchByCone = jest.spyOn(wrapper.vm,'searchByCone')
    // const updateSeries = jest.spyOn(wrapper.vm,'updateSeries')
    wrapper.vm.searchAsnInTOPO()
    jest.runAllTimers();
    expect(wrapper.vm.filterDataMethod).toBe('searchByCone')
    expect(searchByCone).toHaveBeenCalled()
  })
  it('should search by ASN when only numbers are provided', () => {
    const searchByAsn = jest.spyOn(wrapper.vm,'searchByAsn')
    wrapper.vm.searchInput = '123456'
    wrapper.vm.searchAsnInTOPO()
    jest.runAllTimers();
    expect(wrapper.vm.filterDataMethod).toBe('searchByAsn')
    expect(searchByAsn).toHaveBeenCalled()

  })
  it('should show error message when search input is invalid', async () => {
    wrapper.vm.searchInput = 'invalid input'
    wrapper.vm.searchAsnInTOPO()
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: 'Expression format Error',
      type: 'error',
      duration: 1000,
    })
    expect(wrapper.vm.showLoading).toBeFalsy()
  })

  it('initLinks', () => {
    wrapper.vm.initLinks()
    // console.log(JSON.stringify(wrapper.vm.graphLink))
    expect(wrapper.vm.graphLink).toEqual(graphLink)
    expect(wrapper.vm.LinkAmount).toBe(graphLink.length)
    expect(wrapper.vm.topCone).toEqual(Object.entries(wrapper.vm.graphDataCone)
      .sort((a, b) => b[1] - a[1])
      .slice(0, wrapper.vm.topAsLenght))
  })

  it('initTopCone', () => {
    wrapper.vm.initConeMap()
    wrapper.vm.initTopCone()
    expect(wrapper.vm.topCone).toEqual(Object.entries(wrapper.vm.graphDataCone)
      .sort((a, b) => b[1] - a[1])
      .slice(0, wrapper.vm.topAsLenght))
  })

  it('should update graphLink and LinkAmount when showNodeSortByCone is called', () => {
    const updateSeries = jest.fn()
    wrapper.vm.updateSeries = updateSeries
    wrapper.vm.showNodeSortByCone()
    expect(updateSeries).toHaveBeenCalled()

  })
  it('should update series when updateSeries is called', async () => {
    const data = ['1', '3']
    wrapper.vm.graphLink = [{
        source: '1',
        target: '3'
      },
      {
        source: '1',
        target: '4'
      }
    ]
    wrapper.vm.graphSerise = []
    wrapper.vm.AsAmountOnGraph = 0
    wrapper.vm.LinkAmountOnGraph = 0
    wrapper.vm.updateSeries(data)
    expect(wrapper.vm.graphSerise.length).toBe(1)
    expect(wrapper.vm.graphSerise[0].data).toEqual([{
      "name": '1',
      "value": 1,
      "x": 500,
      "y": 0,
      "asName": "Unknown"
    }, {
      "name": '3',
      "value": 1,
      "x": -500,
      "y": 6.123233995736766e-14,
      "asName": "Unknown"
    }])
    expect(wrapper.vm.graphSerise[0].links).toEqual([{
      "source": "1",
      "target": "3"
    }])
    expect(wrapper.vm.AsAmountOnGraph).toBe(2)
    expect(wrapper.vm.LinkAmountOnGraph).toBe(1)
  })
  it('should call getResilienceByccCode and update data when ImportDataFor is called', async () => {
    wrapper.vm.showTopo = false
    wrapper.vm.graphDataCone = {}
    wrapper.vm.AsAmount = 0
    wrapper.vm.graphSourceData = {}
    const initLinks = jest.spyOn(wrapper.vm, 'initLinks')
    const initConeMap = jest.spyOn(wrapper.vm, 'initConeMap')
    const initTopCone = jest.spyOn(wrapper.vm, 'initTopCone')
    const switchMethodByClickIndex = jest.spyOn(wrapper.vm, 'switchMethodByClickIndex')
    const showNodeSortByCone = jest.spyOn(wrapper.vm, 'showNodeSortByCone')
    await wrapper.vm.ImportDataFor('CN')
    jest.runAllTimers();
    expect(getResilienceByccCode).toHaveBeenCalledWith('CN')
    expect(wrapper.vm.graphDataCone).toEqual(mockData.cone)
    expect(wrapper.vm.AsAmount).toBe(Object.keys(mockData.cone).length)
    expect(wrapper.vm.graphSourceData).toEqual(graphSourceData)
    expect(wrapper.vm.clickIndex).toBe(-1)
    expect(wrapper.vm.filterDataMethod).toBe('showNodeSortByCone')
    expect(initLinks).toHaveBeenCalled()
    expect(initConeMap).toHaveBeenCalled()
    expect(initTopCone).toHaveBeenCalled()
    expect(switchMethodByClickIndex).toHaveBeenCalled()
    expect(showNodeSortByCone).toHaveBeenCalled()
  })

  it('should filter points based on regexResult', async () => {
    wrapper.vm.searchInput = '[123,234]'
    const updateSeries = jest.spyOn(wrapper.vm, 'updateSeries')
    wrapper.vm.graphDataCone['point1'] = '123'
    wrapper.vm.graphDataCone['point2'] = '123'
    wrapper.vm.graphDataCone['point3'] = '124'
    wrapper.vm.asInfoMap['point3'] = {
      name: '123'
    }

    wrapper.vm.AsAmountOnGraph = 0
    wrapper.vm.LinkAmountOnGraph = 0

    wrapper.vm.searchByCone()

    expect(updateSeries).toHaveBeenCalledWith(['point1', 'point2', 'point3'])


    wrapper.vm.searchInput = '(123,234)'
    wrapper.vm.searchByCone()
    expect(updateSeries).toHaveBeenCalledWith(['point3'])


  })

  it('should highlight searchInput if found in links', () => {
    wrapper.vm.searchASN = '1110'
    wrapper.vm.graphDataCone['1110'] = 1
    wrapper.vm.updateSeries = jest.fn()
    wrapper.vm.graphSerise = [{
      data: []
    }]
    wrapper.vm.searchByAsn()
    expect(wrapper.vm.searchInput).toBe(wrapper.vm.searchASN)
    expect(wrapper.vm.updateSeries).toHaveBeenCalled()
  })
  it('should show error message if searchInput is not found in links or graphDataCone', () => {
    wrapper.vm.searchASN = 'point4'
    wrapper.vm.searchByAsn()
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: `Not Found As ${wrapper.vm.searchASN}`,
      type: 'error',
      duration: 1 * 1000,
    })
  })
  it('searchByAsn should update graphSerise', async () => {
    await Vue.nextTick()
    await wrapper.setData({
      graphDataCone: {
        '760': 12
      },
      graphLink: [{
          source: 'A',
          target: 'B'
        },
        {
          source: 'B',
          target: 'C'
        },
      ],
      maxCount: 2,
      searchASN: '760',
      graphSerise: [{
        data: [{
            name: 'A'
          },
          {
            name: '760'
          },
          {
            name: 'C'
          },
        ],
        links: [{
            source: 'A',
            target: '760'
          },
          {
            source: '760',
            target: 'C'
          },
        ],
      }, ],
    })
    const updateSeries = jest.spyOn(wrapper.vm, 'updateSeries')
    wrapper.vm.searchByAsn()
    expect(updateSeries).toHaveBeenCalledWith(['A', '760', 'C', '760'], '760')

  })
  it('searchByAsn should show message when not found', () => {
    wrapper.setData({
      graphLink: [{
          source: 'A',
          target: 'B'
        },
        {
          source: 'B',
          target: 'C'
        },
      ],
      graphDataCone: {
        A: {
          name: 'A'
        },
        B: {
          name: 'B'
        },
        C: {
          name: 'C'
        },
      },
      maxCount: 2,
      searchASN: 'A',
      graphSerise: [{
        data: [{
            name: 'A'
          },
          {
            name: 'B'
          },
          {
            name: 'C'
          },
        ],
        links: [{
            source: 'A',
            target: 'B'
          },
          {
            source: 'B',
            target: 'C'
          },
        ],
      }, ],
    })
    const updateSeries = jest.spyOn(wrapper.vm,'updateSeries')
    wrapper.vm.searchByAsn()
    expect(wrapper.vm.searchInput).toBe('A')
    expect(updateSeries).toHaveBeenCalledWith(["A", "B", "B", "C", "A"], "A")
  })

  it('addZoom should call setSeriesZoom with correct parameter', () => {
    wrapper.vm.setSeriesZoom = jest.fn()
    wrapper.setData({
      zoom: 2,
      minZoom: 1,
      maxZoom: 5
    })
    wrapper.vm.addZoom()
    expect(wrapper.vm.setSeriesZoom).toHaveBeenCalledWith(2.1)
  })
  it('reduceZoom should call setSeriesZoom with correct parameter', () => {
    wrapper.vm.setSeriesZoom = jest.fn()
    wrapper.setData({
      zoom: 4,
      minZoom: 1,
      maxZoom: 5
    })
    wrapper.vm.reduceZoom()
    expect(wrapper.vm.setSeriesZoom).toHaveBeenCalledWith(3.9)
  })
  it('setSeriesZoom should set zoom and update graphSerise', () => {
    wrapper.setData({
      zoom: 3,
      minZoom: 1,
      maxZoom: 5,
      graphSerise: [{
        zoom: 2,
        data: [],
        links: [],
      }, ],
    })
    wrapper.vm.setSeriesZoom(4)
    expect(wrapper.vm.zoom).toBe(4)
    expect(wrapper.vm.graphSerise).toEqual([{
      zoom: 4,
      data: [],
      links: [],
    }, ])
  })

  it('updateSeries should show alert when data.length > 1000 and reset searchInput', () => {
    wrapper.vm.updateSeries(Array.from({
      length: 2000
    }, (_, i) => i + 1))
    expect(wrapper.vm.$alert).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        confirmButtonText: 'OK',
        type: 'warn',
      })
    )
    expect(wrapper.vm.searchInput).toBe('')
  })
  it('updateSeries should update AsAmountOnGraph, LinkAmountOnGraph and graphSerise', () => {
    wrapper.vm.updateSeries([1, 2])
    expect(wrapper.vm.AsAmountOnGraph).toBe(wrapper.vm.graphSerise[0].data.length)
    expect(wrapper.vm.LinkAmountOnGraph).toBe(wrapper.vm.graphSerise[0].links.length)
    expect(wrapper.vm.graphSerise).toEqual([{
      "data": [{
        "name": 1,
        "value": 1,
        "x": 500,
        "y": 0,
        "asName": "Unknown"
      }, {
        "name": 2,
        "value": 1,
        "x": -500,
        "y": 6.123233995736766e-14,
        "asName": "Unknown"
      }],
      "links": [],
      "type": "graph",
      "categories": [{
        "name": "P2P",
        "itemStyle": {
          "color": "#F03600"
        }
      }, {
        "name": "P2C",
        "itemStyle": {
          "color": "#0191FF"
        }
      }],
      "layout": "none",
      "roam": false,
      "label": {
        "position": "right"
      },
      "zoom": 0.5,
      "width": 1000,
      "emphasis": {
        "focus": "adjacency",
        "scale": 1.5,
        "itemStyle": {
          "color": "#8249B8"
        },
        "lineStyle": {
          "color": "#8249B8",
          "width": 5
        }
      }
    }])
  })
  it('switchChart', async () => {
    const ImportDataFor = jest.fn()
    wrapper.vm.ImportDataFor = ImportDataFor
    wrapper.vm.switchChart('China')
    expect(ImportDataFor).toHaveBeenCalledWith('China')
  })

  it('switchChart should update selectedCC, continentNameMap, searchInput, graphLink, rtree_images and call ImportDataFor', async () => {
    wrapper.setData({
      selectedCN: 'Asia',
      selectedCC: '',
      initGraph:true,
      clickIndex:0,
      continentNameMap: {
        China: {
          name: 'Asia',
          selectedCC: ''
        },
        Japan: {
          name: 'Asia',
          selectedCC: ''
        },
        Korea: {
          name: 'Asia',
          selectedCC: ''
        },
      },
      searchInput: 'input',
      graphLink: ['link'],
    })
    wrapper.vm.ImportDataFor('China')
    // expect(wrapper.vm.initGraph).toBeTruthy()
    await Vue.nextTick()
    expect(wrapper.vm.searchInput).toBe('')
    expect(wrapper.vm.graphLink).toEqual([])
    expect(wrapper.vm.showLoading).toBeTruthy()
    await Vue.nextTick()
    // expect(wrapper.vm.initGraph).toBeFalsy()
    expect(wrapper.vm.clickIndex).toBe(-1)
    jest.runAllTimers();
    
  })

  it('ImportDataFor', async () => {
    wrapper.vm.searchInput = '123'
    wrapper.vm.$alert.mockClear()
    getResilienceByccCode.mockResolvedValueOnce({graph_data:{customer:[],peer:[]}})
    await wrapper.vm.ImportDataFor('China')
    expect(wrapper.vm.searchInput).toBe('123')
    expect(wrapper.vm.$alert).toHaveBeenCalledWith('undefined(China) No Data!')
    
  })

  it('pullOn', () => {
    const searchByAsn = jest.fn()
    const showNodeSortByCone = jest.fn()
    const updateSeries = jest.fn()
    const switchMethodByClickIndex = jest.spyOn(wrapper.vm, 'switchMethodByClickIndex')
    wrapper.vm.searchByAsn = searchByAsn
    wrapper.vm.showNodeSortByCone = showNodeSortByCone
    wrapper.vm.updateSeries = updateSeries
    const e = {
      target: {
        dataset: {
          index: 0
        }
      }
    }
    wrapper.vm.clickIndex = 1
    wrapper.vm.pullOn(e)
    expect(switchMethodByClickIndex).toHaveBeenCalled()
    jest.runAllTimers()
    expect(wrapper.vm.searchInput).toBe('')
    expect(wrapper.vm.clickIndex).toBe(0)
    expect(searchByAsn).toHaveBeenCalled()


    wrapper.vm.pullOn(e)
    jest.runAllTimers()
    expect(wrapper.vm.searchInput).toBe('')
    expect(wrapper.vm.clickIndex).toBe(-1)
    expect(showNodeSortByCone).toHaveBeenCalled()

  })
  it('DoSelect', () => {
    const switchChart = jest.fn()
    wrapper.vm.switchChart = switchChart
    wrapper.vm.selectedOption = [1, 2]
    wrapper.vm.DoSelect()
    expect(wrapper.vm.showLoading).toBeTruthy()
    expect(switchChart).toHaveBeenCalled()
    switchChart.mockClear()

    wrapper.vm.selectedOption = []
    wrapper.vm.DoSelect()
    expect(switchChart).not.toHaveBeenCalled()
    expect(wrapper.vm.$alert).toHaveBeenCalledWith(
      'Please choose country!'
    )
  })
})