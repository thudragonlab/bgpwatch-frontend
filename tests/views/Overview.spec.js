import {
  shallowMount,
  createLocalVue,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import Overview from "@/views/Overview";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {mockdata,lineData,lineData1,lineData2,monthLineData,monthLineData1,monthLineData2,targetLO,targetLO1,targetLO2,targetLO3} from '../mockData/Overview'
import {
  getOverviewData
} from '@/api/OverviewApi'
// const mockData = testData.default
Vue.use(ElementUI)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


jest.mock('@/api/OverviewApi', () => {
  const mock = require('../mockData/Overview')
  return {
    getOverviewData: jest.fn(() => Promise.resolve(mock.mockdata))
  }
})
const st = '2021-01-01'
const et = '2021-01-31'

describe('Overview.vue', () => {
  let wrapper;
  const ccList = ['CN', 'US', 'JP']
  beforeEach(() => {
    wrapper = shallowMount(Overview, {
      data() {
        return {
          ccList,
          options: [],
          defaultDateTime: [],
          timeFrame: '',
        }
      },
    })
  })
  afterEach(() => {
    wrapper.destroy();
  });

  it('should generate correct options based on ccList', async () => {
    const expectedOptions = [{
      "value": "AS",
      "label": "Asia",
      "children": [{
        "value": "CN",
        "label": "China"
      }, {
        "value": "JP",
        "label": "Japan"
      }]
    }, {
      "value": "NA",
      "label": "North America",
      "children": [{
        "value": "US",
        "label": "United States"
      }]
    }]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.options).toEqual(expectedOptions)
  })
  it('should set defaultDateTime to the past year', () => {

    expect(wrapper.vm.defaultDateTime).toHaveLength(2)
  })
  it('should set timeFrame to "Last Year"', () => {
    expect(wrapper.vm.timeFrame).toEqual('Last Year')
  })
  it('_yearSortFunc', () => {
    const arr = [{
        year: 'obj1',
        name: 2010
      },
      {
        year: 'obj2',
        name: 2008
      },
      {
        year: 'obj3',
        name: 2015
      }
    ]
    const expected = [{
        year: 'obj2',
        name: 2008
      },
      {
        year: 'obj1',
        name: 2010
      },
      {
        year: 'obj3',
        name: 2015
      }
    ]

    arr.sort(wrapper.vm._yearSortFunc)
    expect(arr).toEqual(expected)
  })



  describe('getOverviewData', () => {
    it('正确处理输入', async () => {
      wrapper.setData({
        asInput: 'true'
      })
      await wrapper.vm.getOverviewData('2021-01-01', '2021-01-31')
      expect(wrapper.vm.showVAA).toBe(true)
    })
    it('正确处理非选项和非输入', async () => {
      wrapper.setData({
        selectedOption: ['option1']
      })
      await wrapper.vm.getOverviewData('2021-01-01', '2021-01-31')
      expect(wrapper.vm.showVAA).toBe(false)
    })

    it('正确处理选项', async () => {
      wrapper.setData({
        selectedOption: ['option1', 'option2']
      })
      await wrapper.vm.getOverviewData('2021-01-01', '2021-01-31')
      expect(wrapper.vm.showVAA).toBe(true)
    })
    it('正确处理结果', async () => {

      wrapper.setData({
        selectedOption: ['option1', 'option2'],
        asInput: 'true'
      })
      const defaultHandleFuncSpy = jest.spyOn(wrapper.vm, wrapper.vm.defaultHandleFunc)
      await wrapper.vm.getOverviewData(st, et)
      expect(wrapper.vm.OriginLineData).toEqual(mockdata.stat_series)
      expect(defaultHandleFuncSpy).toHaveBeenCalled()
      expect(wrapper.vm.byWhat).toBe(wrapper.vm.HandleFuncTitleMapping[wrapper.vm.defaultHandleFunc])
      expect(wrapper.vm.lastLaunchLineFunc).toBe(wrapper.vm.defaultHandleFunc)
      expect(getOverviewData).toHaveBeenCalledWith(st, et, 'option2', 'true')
    })
  })

  describe('makeLineData', () => {
    const dataObj = {
      'A': {
        min_ts: '1627612800000',
        max_ts: '1627616400000',
        value: 10
      },
      'B': {
        min_ts: '1627620000000',
        max_ts: '1627623600000',
        value: 20
      },
      'C': {
        min_ts: '1627627200000',
        max_ts: '1627630800000',
        value: 30
      }
    }

    it('should aggregate data when use selector and aggregate is true', () => {
        const lineData = {}
        wrapper.setData({
          selectedOption: ['option1', 'option2'],
          useSelector: true,
        })
        wrapper.vm.makeLineData(dataObj, lineData, 'value', true)
        expect(lineData).toEqual({
          'A': {
            value: 10,
            st: 1627612800000,
            et: 1627616400000,
            condition: 'option2'
          },
          'B': {
            value: 20,
            st: 1627620000000,
            et: 1627623600000,
            condition: 'option2'
          },
          'C': {
            value: 30,
            st: 1627627200000,
            et: 1627630800000,
            condition: 'option2'
          }
        })
      }),
      it('should aggregate data when not use selector and aggregate is true', () => {
        const lineData = {}
        wrapper.setData({
          asInput: 0,
          useSelector: false,
        })
        wrapper.vm.makeLineData(dataObj, lineData, 'value', true)
        expect(lineData).toEqual({
          'A': {
            value: 10,
            st: 1627612800000,
            et: 1627616400000,
            condition: 0
          },
          'B': {
            value: 20,
            st: 1627620000000,
            et: 1627623600000,
            condition: 0
          },
          'C': {
            value: 30,
            st: 1627627200000,
            et: 1627630800000,
            condition: 0
          }
        })
      })
    it('should create an array of line data when aggregate is false', () => {
      const result = []
      wrapper.setData({
        selectedOption: ['option1', 'option2'],
        useSelector: true,
      })
      wrapper.vm.makeLineData(dataObj, result, 'value', false)
      expect(result).toEqual([{
          name: 'A',
          value: ['A', 10],
          condition: 'option2',
          st: 1627612800000,
          et: 1627616400000
        },
        {
          name: 'B',
          value: ['B', 20],
          condition: 'option2',
          st: 1627620000000,
          et: 1627623600000
        },
        {
          name: 'C',
          value: ['C', 30],
          condition: 'option2',
          st: 1627627200000,
          et: 1627630800000
        }
      ])
    })
  })
  describe('makeLineDataFormObj', () => {
    const dataObj = {
      'A': {
        value: 10,
        st: 1627612800000,
        et: 1627616400000,
        condition: false
      },
      'B': {
        value: 20,
        st: 1627620000000,
        et: 1627623600000,
        condition: false
      },
      'C': {
        value: 30,
        st: 1627627200000,
        et: 1627630800000,
        condition: false
      }
    }
    it('should transform object to array of line data', () => {
      const result = wrapper.vm.makeLineDataFormObj(dataObj)
      expect(result).toEqual([{
          name: 'A',
          value: ['A', 10],
          groupId: 'A',
          st: 1627612800000,
          et: 1627616400000,
          condition: false
        },
        {
          name: 'B',
          value: ['B', 20],
          groupId: 'B',
          st: 1627620000000,
          et: 1627623600000,
          condition: false
        },
        {
          name: 'C',
          value: ['C', 30],
          groupId: 'C',
          st: 1627627200000,
          et: 1627630800000,
          condition: false
        }
      ])
    })
  })

  it('makeNewSeriesVAT', () => {
    const series = {
      name: 'Possible Hijack',
    }
    const index = 0
    const VAT = 'Victim'
    const newSeries = wrapper.vm.makeNewSeriesVAT(series, VAT, index)
    expect(newSeries).toEqual(Object.assign({
        name: `${series.name}-${VAT}`,
        stack: series.name,
        itemStyle: {
          color: wrapper.vm.colorMap[series.name][index],
        },
        data: []
      },
      wrapper.vm.staticLineSeries
    ))
  })

  describe('processDataWithCond', () => {
    it('should process data with condition (x_index is passed in)', async () => {
      const sortFuncName = '_weekSortFunc'
      const layer = 'week'
      const super_layer = 'month'
      const x_index = undefined
      await wrapper.vm.getOverviewData(st, et)

      const result = wrapper.vm.processDataWithCond(sortFuncName, layer, super_layer, x_index)
      expect(result).toEqual([{
        "name": "Possible Hijack-Victim",
        "stack": "Possible Hijack",
        "itemStyle": {
          "color": "#529ADE"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "Possible Hijack-Attacker",
        "stack": "Possible Hijack",
        "itemStyle": {
          "color": "#5470c6"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "Possible SubHijack-Victim",
        "stack": "Possible SubHijack",
        "itemStyle": {
          "color": "#91cc75"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "Possible SubHijack-Attacker",
        "stack": "Possible SubHijack",
        "itemStyle": {
          "color": "#BFE376"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "All-Victim",
        "stack": "All",
        "itemStyle": {
          "color": "#fac858"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "All-Attacker",
        "stack": "All",
        "itemStyle": {
          "color": "#E3A144"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }])
    })
    it('should process data with condition (x_index is passed in)', async () => {
      const sortFuncName = '_weekSortFunc'
      const layer = 'day'
      const super_layer = 'week'
      const x_index = 'Week 12, 2023'
      await wrapper.vm.getOverviewData(st, et)

      const result = wrapper.vm.processDataWithCond(sortFuncName, layer, super_layer, x_index)
      expect(result).toEqual(
        [{
          "name": "Possible Hijack-Victim",
          "stack": "Possible Hijack",
          "itemStyle": {
            "color": "#529ADE"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }, {
          "name": "Possible Hijack-Attacker",
          "stack": "Possible Hijack",
          "itemStyle": {
            "color": "#5470c6"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }, {
          "name": "Possible SubHijack-Victim",
          "stack": "Possible SubHijack",
          "itemStyle": {
            "color": "#91cc75"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }, {
          "name": "Possible SubHijack-Attacker",
          "stack": "Possible SubHijack",
          "itemStyle": {
            "color": "#BFE376"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }, {
          "name": "All-Victim",
          "stack": "All",
          "itemStyle": {
            "color": "#fac858"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }, {
          "name": "All-Attacker",
          "stack": "All",
          "itemStyle": {
            "color": "#E3A144"
          },
          "type": "bar",
          "data": [],
          "universalTransition": {
            "enabled": true,
            "divideShape": "clone"
          },
          "dataGroupId": "Week 12, 2023"
        }])
    })
  })
  describe('processDataWithNoCond', () => {
    it('should process data with condition (x_index is passed in)', async () => {
      const sortFuncName = '_weekSortFunc'
      const layer = 'week'
      const super_layer = 'month'
      const x_index = undefined
      await wrapper.vm.getOverviewData(st, et)

      const result = wrapper.vm.processDataWithNoCond(sortFuncName, layer, super_layer, x_index)
      expect(result).toEqual([{
        "name": "Possible Hijack",
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "Possible SubHijack",
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }, {
        "name": "All",
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        }
      }])
    })
    it('should process data with condition (x_index is passed in)', async () => {
      const sortFuncName = '_weekSortFunc'
      const layer = 'day'
      const super_layer = 'week'
      const x_index = 'Week 12, 2023'
      await wrapper.vm.getOverviewData(st, et)

      const result = wrapper.vm.processDataWithCond(sortFuncName, layer, super_layer, x_index)
      expect(result).toEqual([{
        "name": "Possible Hijack-Victim",
        "stack": "Possible Hijack",
        "itemStyle": {
          "color": "#529ADE"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }, {
        "name": "Possible Hijack-Attacker",
        "stack": "Possible Hijack",
        "itemStyle": {
          "color": "#5470c6"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }, {
        "name": "Possible SubHijack-Victim",
        "stack": "Possible SubHijack",
        "itemStyle": {
          "color": "#91cc75"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }, {
        "name": "Possible SubHijack-Attacker",
        "stack": "Possible SubHijack",
        "itemStyle": {
          "color": "#BFE376"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }, {
        "name": "All-Victim",
        "stack": "All",
        "itemStyle": {
          "color": "#fac858"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }, {
        "name": "All-Attacker",
        "stack": "All",
        "itemStyle": {
          "color": "#E3A144"
        },
        "type": "bar",
        "data": [],
        "universalTransition": {
          "enabled": true,
          "divideShape": "clone"
        },
        "dataGroupId": "Week 12, 2023"
      }])
    })
  })

  it('makeYearLineData', async () => {
    await wrapper.vm.getOverviewData(st, et)
    wrapper.setData({
      selectedOption: [1, 2],
      asInput: 0
    })
    wrapper.vm.makeYearLineData()
    expect(wrapper.vm.lineData).toEqual(lineData)
    wrapper.setData({
      selectedOption: [1],
      asInput: 'true'
    })
    wrapper.vm.makeYearLineData()
    // console.log(JSON.stringify(wrapper.vm.lineData))
    expect(wrapper.vm.lineData).toEqual(lineData1)
    wrapper.setData({
      selectedOption: [1],
      asInput: 0
    })
    wrapper.vm.makeYearLineData()
    // console.log(JSON.stringify(wrapper.vm.lineData))
    expect(wrapper.vm.lineData).toEqual(lineData2)
  })

  it('_monthSortFunc', async () => {
    let result = wrapper.vm._monthSortFunc({
      value: ['1,2020']
    }, {
      value: ['1,2021']
    })
    expect(result).toBe(-1)
    result = wrapper.vm._monthSortFunc({
      value: ['1,2020']
    }, {
      value: ['2,2020']
    })
    expect(result).toBe(-1)
    result = wrapper.vm._monthSortFunc({
      value: ['2,2020']
    }, {
      value: ['1,2020']
    })
    expect(result).toBe(1)
  })

  it('makeMonthLineData', async () => {
    await wrapper.vm.getOverviewData(st, et)
    wrapper.setData({
      selectedOption: [1, 2],
      asInput: 0
    })
    wrapper.vm.makeMonthLineData()
    
    expect(wrapper.vm.lineData).toEqual(monthLineData)
    wrapper.setData({
      selectedOption: [1],
      asInput: 'true'
    })
    wrapper.vm.makeMonthLineData()
    expect(wrapper.vm.lineData).toEqual(monthLineData1)
    wrapper.setData({
      selectedOption: [1],
      asInput: 0
    })
    wrapper.vm.makeMonthLineData()
    expect(wrapper.vm.lineData).toEqual(monthLineData2)
  })
  
  it('_weekSortFunc', () => {
    let a = {
      value: ['week 1,2020']
    }
    let b = {
      value: ['week 2,2020']
    }
    let result = wrapper.vm._weekSortFunc(a, b)
    expect(result).toBe(-1)
     a = {
      value: ['week 2,2020']
    }
     b = {
      value: ['week 1,2020']
    }
     result = wrapper.vm._weekSortFunc(a, b)
    expect(result).toBe(1)
     a = {
      value: ['1,2020']
    }
     b = {
      value: ['1,2021']
    }
     result = wrapper.vm._weekSortFunc(a, b)
    expect(result).toBe(-1)
  })

  it('makeWeekLineData', async() => {
    await wrapper.vm.getOverviewData(st, et)
    const expectData = [{"name":"Possible Hijack-Victim","stack":"Possible Hijack","itemStyle":{"color":"#529ADE"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"Possible Hijack-Attacker","stack":"Possible Hijack","itemStyle":{"color":"#5470c6"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"Possible SubHijack-Victim","stack":"Possible SubHijack","itemStyle":{"color":"#91cc75"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"Possible SubHijack-Attacker","stack":"Possible SubHijack","itemStyle":{"color":"#BFE376"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"All-Victim","stack":"All","itemStyle":{"color":"#fac858"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"All-Attacker","stack":"All","itemStyle":{"color":"#E3A144"},"type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"}]
    const imk = '1,2020'
    wrapper.setData({
      selectedOption: [1, 2],
      asInput: 0
    })
    wrapper.vm.makeWeekLineData(imk)
    expect(wrapper.vm.lineData).toEqual(expectData)
    wrapper.setData({
      selectedOption: [1],
      asInput: 'true'
    })
    wrapper.vm.makeWeekLineData(imk)
    expect(wrapper.vm.lineData).toEqual(expectData)
    wrapper.setData({
      selectedOption: [1],
      asInput: 0
    })
    wrapper.vm.makeWeekLineData(imk)
    expect(wrapper.vm.lineData).toEqual([{"name":"Possible Hijack","type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"Possible SubHijack","type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"},{"name":"All","type":"bar","data":[],"universalTransition":{"enabled":true,"divideShape":"clone"},"dataGroupId":"1,2020"}])
  })

  describe('makeDaysLineData', () => {

    it('should call processDataWithCond if selectedOption length is 2 or asInput is true', () => {
      wrapper.vm.processDataWithCond = jest.fn()
      wrapper.vm.processDataWithNoCond = jest.fn()
      const processDataWithCondSpy = jest.spyOn(wrapper.vm, 'processDataWithCond')
      wrapper.setData({
        selectedOption: ['2022-12-01', '2022-12-31'],
        asInput: 0,
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithCondSpy).toHaveBeenCalledWith('_daySortFunc', 'days', 'weeks', undefined)
      processDataWithCondSpy.mockReset()
      wrapper.setData({
        selectedOption: ['2022-12-01', '2022-12-31'],
        asInput: 'true',
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithCondSpy).toHaveBeenCalledWith('_daySortFunc', 'days', 'weeks', undefined)
      processDataWithCondSpy.mockReset()
      wrapper.setData({
        selectedOption: ['2022-12-01'],
        asInput: 0,
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithCondSpy).not.toHaveBeenCalled()
      processDataWithCondSpy.mockReset()
    })
    it('should call processDataWithNoCond if selectedOption length is not 2 and asInput is false', () => {
      wrapper.vm.processDataWithCond = jest.fn()
      wrapper.vm.processDataWithNoCond = jest.fn()
      const processDataWithNoCondSpy = jest.spyOn(wrapper.vm, 'processDataWithNoCond')
      wrapper.setData({
        selectedOption: ['2022-12-01'],
        asInput: 0,
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithNoCondSpy).toHaveBeenCalledWith('_daySortFunc', 'days', 'weeks', undefined)
      processDataWithNoCondSpy.mockReset()
      wrapper.setData({
        selectedOption: ['2022-12-01', '2022-12-31', '2022-12-15'],
        asInput: 0,
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithNoCondSpy).toHaveBeenCalledWith('_daySortFunc', 'days', 'weeks', undefined)
      processDataWithNoCondSpy.mockReset()
      wrapper.setData({
        selectedOption: ['2022-W01'],
        asInput: 'true',
      })
      wrapper.vm.makeDaysLineData()
      expect(processDataWithNoCondSpy).not.toHaveBeenCalled()
      processDataWithNoCondSpy.mockReset()
    })
  })
  describe('_daySortFunc', () => {
    it('should return -1 if a is earlier than b', () => {
      const a = { value: ['2022-12-01'] }
      const b = { value: ['2022-12-05'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(-4)
    })
    it('should return 1 if a is later than b', () => {
      const a = { value: ['2022-12-05'] }
      const b = { value: ['2022-12-01'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(4)
    })
    it('should return 0 if a and b are the same', () => {
      const a = { value: ['2022-12-01'] }
      const b = { value: ['2022-12-01'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(0)
    })
    it('should sort by year first', () => {
      const a = { value: ['2021-12-01'] }
      const b = { value: ['2022-12-01'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(-1)
    })
    it('should sort by month second', () => {
      const a = { value: ['2022-01-01'] }
      const b = { value: ['2022-02-01'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(-1)
    })
    it('should sort by day last', () => {
      const a = { value: ['2022-12-01'] }
      const b = { value: ['2022-12-02'] }
      const result = wrapper.vm._daySortFunc(a, b)
      expect(result).toBe(-1)
    })
  })
  it('makeNewSeriesObj', () => {
    const series = {
      name: 'Possible Hijack',
    }
    const newSeries = wrapper.vm.makeNewSeriesObj(series)
    expect(newSeries).toEqual(Object.assign({
        name: series.name,
        data: []
      },
      wrapper.vm.staticLineSeries
    ))
  })
  describe('recursiveData', () => {
    it('should push source data to currentDataList if stopProp is year', () => {
      const source = mockdata.stat_series[0].data
      const stopProp = 'year'
      const targetLO = {}
      const valueProp = 'victim_count'
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp)
      // console.log(JSON.stringify(targetLO))
      expect(targetLO).toEqual(targetLO)
    })
    it('should push month data to currentDataList if stopProp is month', () => {
      const source = mockdata.stat_series[0].data
      const stopProp = 'month'
      const targetLO = {}
      const valueProp = 'victim_count'
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp)
      // console.log(JSON.stringify(targetLO))
      expect(targetLO).toEqual(targetLO1)
    })
    it('should push weeks data to currentDataList if stopProp is weeks', () => {
      const source = mockdata.stat_series[0].data
      const stopProp = 'weeks'
      const targetLO = {}
      const valueProp = 'victim_count'
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp)
      // console.log(JSON.stringify(targetLO))
      expect(targetLO).toEqual(targetLO2)
    })
    it('should push days data to currentDataList if stopProp is days', () => {
      const source = mockdata.stat_series[0].data
      const stopProp = 'days'
      const targetLO = {}
      const valueProp = 'victim_count'
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp)
      // console.log(JSON.stringify(targetLO))
      expect(targetLO).toEqual(targetLO3)
    })
    it('should call makeLineData with doaggregate true if i is undefined and stopProp is month or weeks', () => {
      const source = {
        2022: {
          month: {
            Jan: { weeks: { 1: { days: [{ value: 10 }] } } },
            Feb: { weeks: { 2: { days: [{ value: 20 }] } } }
          }
        }
      }
      const stopProp = 'month'
      const targetLO = {}
      const valueProp = 'value'
      wrapper.vm.makeLineData = jest.fn()
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp)
      expect(wrapper.vm.makeLineData.mock.calls[0][3]).toBe(true)
      jest.clearAllMocks()
      const stopProp2 = 'weeks'
      wrapper.vm.recursiveData(source, stopProp2, targetLO, valueProp)
      expect(wrapper.vm.makeLineData.mock.calls[0][3]).toBe(true)
    })
    it('should call makeLineData with doaggregate false if i is defined', () => {
      const source = {
        2022: {
          month: {
            Jan: { weeks: { 1: { days: [{ value: 10 }] } } },
            Feb: { weeks: { 2: { days: [{ value: 20 }] } } }
          }
        }
      }
      const stopProp = 'days'
      const targetLO = {}
      const valueProp = 'value'
      const i = 0
      wrapper.vm.makeLineData = jest.fn()
      wrapper.vm.recursiveData(source, stopProp, targetLO, valueProp, i)
      expect(wrapper.vm.makeLineData.mock.calls[0]).toHaveLength(3)
    })
  })
  describe('switchToDays', () => {
    it('should update lastLaunchLineFunc and byWhat properties correctly', () => {
      wrapper.vm.makeDaysLineData = jest.fn()
      const makeDaysLineData = jest.spyOn(wrapper.vm,'makeDaysLineData')
      wrapper.vm.switchToDays();
      expect(makeDaysLineData).toHaveBeenCalled()
      expect(wrapper.vm.lastLaunchLineFunc).toBe('makeDaysLineData');
      expect(wrapper.vm.byWhat).toBe('Daily');
    });
  });
  
  describe('switchToWeek', () => {
    it('should update lastLaunchLineFunc and byWhat properties correctly', () => {
      wrapper.vm.makeWeekLineData = jest.fn()
      const makeWeekLineData = jest.spyOn(wrapper.vm,'makeWeekLineData')
      wrapper.vm.switchToWeek();
      expect(makeWeekLineData).toHaveBeenCalled()
      expect(wrapper.vm.lastLaunchLineFunc).toBe('makeWeekLineData');
      expect(wrapper.vm.byWhat).toBe('Weekly');
    });
  });
  
  describe('switchToMonth', () => {
    it('should update lastLaunchLineFunc and byWhat properties correctly', () => {
      wrapper.vm.makeMonthLineData = jest.fn()
      const makeMonthLineData = jest.spyOn(wrapper.vm,'makeMonthLineData')
      wrapper.vm.switchToMonth();
      expect(makeMonthLineData).toHaveBeenCalled()
      expect(wrapper.vm.lastLaunchLineFunc).toBe('makeMonthLineData');
      expect(wrapper.vm.byWhat).toBe('Monthly');
    });
  });
  
  describe('switchToYear', () => {
    it('should update lastLaunchLineFunc and byWhat properties correctly', () => {
      wrapper.vm.makeYearLineData = jest.fn()
      const makeYearLineData = jest.spyOn(wrapper.vm,'makeYearLineData')
      wrapper.vm.switchToYear();
      expect(makeYearLineData).toHaveBeenCalled()
      expect(wrapper.vm.lastLaunchLineFunc).toBe('makeYearLineData');
      expect(wrapper.vm.byWhat).toBe('Yearly');
    });
  });

  
  describe('clickPoint', () => {
    it('should call makeDaysLineData method with a parameter if e.data.value[0] includes "Week"', () => {
      const e = {
        data: {
          value: ['Week 1', 100]
        },
        name: '2021'
      };
      wrapper.vm.makeDaysLineData = jest.fn();
      wrapper.vm.clickPoint(e);
      expect(wrapper.vm.byWhat).toBe('Daily');
      expect(wrapper.vm.makeDaysLineData).toHaveBeenCalledWith(e.name);
    });
    it('should call makeWeekLineData method if e.data.value[0] includes ","', () => {
      const e = {
        data: {
          value: ['2021,10', 100]
        },
        name: '2021'
      };
      wrapper.vm.makeWeekLineData = jest.fn();
      wrapper.vm.clickPoint(e);
      expect(wrapper.vm.byWhat).toBe('Weekly');
      expect(wrapper.vm.makeWeekLineData).toHaveBeenCalledWith(e.name);
    });
    it('should call makeMonthLineData method if e.data.value[0] does not include "-" but is not "Week" and includes no ","', () => {
      const e = {
        data: {
          value: ['2021', 100]
        },
        name: '2021'
      };
      wrapper.vm.makeMonthLineData = jest.fn();
      wrapper.vm.clickPoint(e);
      expect(wrapper.vm.byWhat).toBe('Monthly');
      expect(wrapper.vm.makeMonthLineData).toHaveBeenCalledWith(e.name);
    });
    it('should not call any method if e.data.value[0] includes "-"', () => {
      const e = {
        data: {
          value: ['2021-10-01', 100]
        },
        name: '2021'
      };
      wrapper.vm.makeDaysLineData = jest.fn();
      wrapper.vm.makeWeekLineData = jest.fn();
      wrapper.vm.makeMonthLineData = jest.fn();
      wrapper.vm.clickPoint(e);
      expect(wrapper.vm.byWhat).toBe('');
      expect(wrapper.vm.makeDaysLineData).not.toHaveBeenCalled();
      expect(wrapper.vm.makeWeekLineData).not.toHaveBeenCalled();
      expect(wrapper.vm.makeMonthLineData).not.toHaveBeenCalled();
    });
  });
  describe('selectDate', () => {
    it('should call updateDataByTime method with the correct parameter', () => {
      const utcDateArray = ['2021-10-01T00:00:00.000Z', '2021-10-31T23:59:59.999Z'];
      wrapper.vm.updateDataByTime = jest.fn();
      wrapper.vm.selectDate(utcDateArray);
      expect(wrapper.vm.updateDataByTime).toHaveBeenCalledWith(utcDateArray);
    });
  });
  describe('selectDateZone', () => {
    it('should update dataZone property and call updateDataByTime method with the correct parameter', () => {
      const nowDateZone = 'Asia/Shanghai';
      const utcDateArray = ['2021-10-01T00:00:00.000Z', '2021-10-31T23:59:59.999Z'];
      wrapper.vm.updateDataByTime = jest.fn();
      wrapper.vm.selectDateZone(nowDateZone, utcDateArray);
      expect(wrapper.vm.dataZone).toBe('Asia/Shanghai');
      expect(wrapper.vm.updateDataByTime).toHaveBeenCalledWith(utcDateArray);
    });
  });
  describe('updateDataByTime', () => {
    it('should call getOverviewData method with the correct parameters', () => {
      const startdate = '2021-10-01T00:00:00.000Z';
      const enddate = '2021-10-31T23:59:59.999Z';
      wrapper.vm.getOverviewData = getOverviewData;
      wrapper.vm.updateDataByTime([startdate, enddate]);
      expect(getOverviewData).toHaveBeenCalledWith(startdate, enddate);
    });
  });
  
  describe('setDateTo2022', () => {
    const setTime = jest.fn()
    beforeEach(() => {
      const tz = { setTime }
      wrapper.vm.$refs = { tz }
      wrapper.vm.setDateTo2022()
    })
    it('should set time frame to 2022', () => {
      expect(wrapper.vm.timeFrame).toBe('2022')
    })
    it('should set default handle function to makeMonthLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeMonthLineData')
    })
    it('should call setTime method with correct date range', () => {
      expect(setTime).toHaveBeenCalledWith(new Date('2022-01-01'), new Date('2022-12-31'))
    })
  })
  describe('setDateTo2023', () => {
    const setTime = jest.fn()
    beforeEach(() => {
      const tz = { setTime }
      wrapper.vm.$refs = { tz }
      wrapper.vm.setDateTo2023()
    })
    it('should set time frame to 2023', () => {
      expect(wrapper.vm.timeFrame).toBe('2023')
    })
    it('should set default handle function to makeMonthLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeMonthLineData')
    })
    it('should call setTime method with correct date range', () => {
      expect(setTime).toHaveBeenCalledWith(new Date('2023-01-01'), new Date('2023-12-31'))
    })
  })
  describe('setDateToAllData', () => {
    const getOverviewData = jest.fn()
    beforeEach(() => {
      wrapper.vm.getOverviewData = getOverviewData
      wrapper.vm.setDateToAllData()
    })
    it('should set time frame to AllData', () => {
      expect(wrapper.vm.timeFrame).toBe('AllData')
    })
    it('should set default handle function to makeYearLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeYearLineData')
    })
    it('should call getOverviewData method with correct parameters', () => {
      expect(getOverviewData).toHaveBeenCalledWith(-1, expect.any(Number))
    })
  })
  describe('setDateToLastYear', () => {
    const setTime = jest.fn()
    beforeEach(() => {
      const tz = { setTime }
      wrapper.vm.$refs = { tz }
      wrapper.vm.setDateToLastYear()
    })
    it('should set time frame to Last Year', () => {
      expect(wrapper.vm.timeFrame).toBe('Last Year')
    })
    it('should set default handle function to makeMonthLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeMonthLineData')
    })
    it('should call setTime method with correct date range', () => {
      expect(setTime).toHaveBeenCalledTimes(3)
    })
  })
  describe('setDateToLast30Days', () => {
    const setTime = jest.fn()
    beforeEach(() => {
      const tz = { setTime }
      wrapper.vm.$refs = { tz }
      wrapper.vm.setDateToLast30Days()
    })
    it('should set time frame to Last 30 Days', () => {
      expect(wrapper.vm.timeFrame).toBe('Last 30 Days')
    })
    it('should set default handle function to makeWeekLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeWeekLineData')
    })
    it('should call setTime method with correct date range', () => {
      expect(setTime).toHaveBeenCalledTimes(3)
    })
  })
  describe('setDateToLast7Days', () => {
    const setTime = jest.fn()
    beforeEach(() => {
      const tz = { setTime }
      wrapper.vm.$refs = { tz }
      wrapper.vm.setDateToLast7Days()
    })
    it('should set time frame to Last 7 Days', () => {
      expect(wrapper.vm.timeFrame).toBe('Last 7 Days')
    })
    it('should set default handle function to makeDaysLineData', () => {
      expect(wrapper.vm.defaultHandleFunc).toBe('makeDaysLineData')
    })
    it('should call setTime method with correct date range', () => {
      expect(setTime).toHaveBeenCalledTimes(3)
    })
  })
  it('switchToVictim', () => {
    const lastLaunchLineFunc = 'makeMonthLineData'
    wrapper.vm.lastLaunchLineFunc = lastLaunchLineFunc
    wrapper.vm[lastLaunchLineFunc] =jest.fn()
    wrapper.vm.switchToVictim()
    expect(wrapper.vm[lastLaunchLineFunc]).toHaveBeenCalled()
  })

  it('switchToAttcker', () => {
    const lastLaunchLineFunc = 'makeMonthLineData'
    wrapper.vm.lastLaunchLineFunc = lastLaunchLineFunc
    wrapper.vm[lastLaunchLineFunc] =jest.fn()
    wrapper.vm.switchToAttcker()
    expect(wrapper.vm[lastLaunchLineFunc]).toHaveBeenCalled()
  })
  
  it('switchToAmount', () => {
    const lastLaunchLineFunc = 'makeMonthLineData'
    wrapper.vm.lastLaunchLineFunc = lastLaunchLineFunc
    wrapper.vm[lastLaunchLineFunc] =jest.fn()
    wrapper.vm.switchToAmount()
    expect(wrapper.vm[lastLaunchLineFunc]).toHaveBeenCalled()
  })

  it('calls getOverviewData when DoSelect is called', async () => {
    await wrapper.vm.DoSelect()
    expect(getOverviewData).toHaveBeenCalled()
  })
  it('calls getOverviewData when doSearch is called', async () => {
    await wrapper.vm.doSearch()
    expect(getOverviewData).toHaveBeenCalled()
  })
  it('generates csv file when downloadData is called', () => {
    const spy = jest.spyOn(document, 'createElement')
    wrapper.vm.lineData = [
      { name: 'a', data: [{ name: 'b', value: [0, 1] }] },
      { name: 'c', data: [{ name: 'd', value: [0, 2] }] }
    ]
    wrapper.vm.downloadData()
    expect(spy).toHaveBeenCalledWith('a')
  })
});

describe('Overview-HTML', () => {
  let wrapper;
  let realDate
  beforeAll(() => {
    realDate = Date;
    global.Date = class extends Date {
      constructor() {
        super();
      }
      getTimezoneOffset() {
        return 0;
      }
    };
  });
  afterAll(() => {
    global.Date = realDate;
  });
  beforeEach(() => {
    wrapper = mount(Overview,{
      stubs: {
        transition: false
      }
    })
  })
  afterEach(() => {
    wrapper.destroy();
  });

  it('displays the correct title', () => {
    // const wrapper = shallowMount(YourComponent);
    const title = wrapper.find('.line1 .left-btn').text();
    expect(title).toEqual('DOWNLOAD DATA(CSV)');
  });
  it('switches to daily view when "Daily" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.find('.line1 .switch-btn .mini-btn:nth-child(1)');
    wrapper.vm.makeDaysLineData = jest.fn()
    button.trigger('click');
    expect(wrapper.vm.byWhat).toEqual('Daily');
  });
  it('shows search input when "ASN" is selected', () => {
    // const wrapper = shallowMount(YourComponent);
    const switchButton = wrapper.find('.switch-box .my-switch');
    switchButton.trigger('click');
    const input = wrapper.find('.right-input');
    expect(input.exists()).toBe(true);
  });
  it('switches to weekly view when "Weekly" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.line1 .switch-btn .mini-btn').at(1);
    button.trigger('click');
    expect(wrapper.vm.byWhat).toEqual('Weekly');
  });
  it('switches to monthly view when "Monthly" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.line1 .switch-btn .mini-btn').at(2);
    button.trigger('click');
    expect(wrapper.vm.byWhat).toEqual('Monthly');
  });
  it('switches to yearly view when "Yearly" button is clicked', async () => {
    expect(wrapper.findAll('.line1 .switch-btn .mini-btn')).toHaveLength(3)
    let button = wrapper.findAll('.btn').at(4);
    await button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('2023');
    expect(wrapper.findAll('.line1 .switch-btn .mini-btn')).toHaveLength(4)
    button = wrapper.findAll('.line1 .switch-btn .mini-btn').at(3);
    button.trigger('click');
    expect(wrapper.vm.byWhat).toEqual('Yearly');
  });
  it('shows cascader when "Selector" is selected', () => {
    // const wrapper = shallowMount(YourComponent);
    const switchButton = wrapper.find('.switch-box .my-switch');
    switchButton.trigger('click');
    const cascader = wrapper.find('.selector');
    expect(cascader.exists()).toBe(true);
  });
  it('sets date to last 7 days when "Last 7 days" button is clicked', async () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(0);
    await button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('Last 7 Days');
    expect(wrapper.findAll('.line1 .switch-btn .mini-btn')).toHaveLength(1)
  });
  it('sets date to last 30 days when "Last 30 days" button is clicked', async () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(1);
    await button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('Last 30 Days');
    expect(wrapper.findAll('.line1 .switch-btn .mini-btn')).toHaveLength(2)
  });
  it('sets date to last 12 months when "Last 12 months" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(2);
    button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('Last Year');
  });
  it('sets date to 2022 when "2022" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(3);
    button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('2022');
  });
  it('sets date to 2023 when "2023" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(4);
    button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('2023');
  });
  it('sets date to all data when "All Data" button is clicked', () => {
    // const wrapper = shallowMount(YourComponent);
    const button = wrapper.findAll('.btn').at(5);
    button.trigger('click');
    expect(wrapper.vm.timeFrame).toEqual('AllData');
  });
  // it('emits "clickPoint" event when a point on the chart is clicked', async () => {
  //   const spy = jest.spyOn(wrapper.vm, 'clickPoint');
  //   const chart = wrapper.findComponent({ name: 'Chart' });
  //   await chart.find('.echart').trigger('click');
  //   // wrapper.find('.echarts').simulate('click');
  //   // wrapper.update()
  //   // expect(spy).toHaveBeenCalled();
  // });
});
