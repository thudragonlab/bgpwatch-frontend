import {
  shallowMount,
  createLocalVue,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import Statistics from "@/views/Statistics";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {testData,victim_geo_list,attacker_geo_list} from '../mockData/Statistics'
import {
  getEventstat
} from '@/api/routeMonitor'
const mockData = testData
Vue.use(ElementUI)
Vue.use(MyC)

window.open = jest.fn()

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


jest.mock('@/api/routeMonitor', () => {
  const mock = require('../mockData/Statistics')
  return {
    getEventstat: jest.fn(() => Promise.resolve(mock.testData))
  }
})

describe.skip('Statistics.vue', () => {
  let wrapper;
  const startTime = 1679099518000
  const endTime = 1679963518000
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
    wrapper = mount(Statistics, {
      stubs: {
        transition: false
      }
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should set loading to true before calling getEventstat', async () => {
    wrapper.vm.loading = true
    expect(wrapper.vm.loading).toBe(true);
    await wrapper.vm.requestChartData(startTime, endTime);
    expect(wrapper.vm.loading).toBe(false);
  });
  it('should call getEventstat with the correct arguments', async () => {
    await wrapper.vm.requestChartData(startTime, endTime);
    expect(getEventstat).toHaveBeenCalledWith(startTime, endTime);
  });
  it('should set chartData with the response from getEventstat', async () => {
    wrapper.vm.OrgChartData = {}
    expect(wrapper.vm.OrgChartData).toEqual({});
    await wrapper.vm.requestChartData(startTime, endTime);
    expect(wrapper.vm.OrgChartData).toEqual(mockData);
  });
  it('should set loading to false after calling getEventstat', async () => {
    // jest.spyOn(wrapper.vm, 'getEventstat').mockResolvedValue({});
    expect(wrapper.vm.loading).toBe(false);
    await wrapper.vm.requestChartData(startTime, endTime);
    expect(wrapper.vm.loading).toBe(false);
  });
  it('should transform date with time zone correctly', () => {
    const lineitem = [1679702400000, 10];
    wrapper.vm.dataZone = -8;
    const result = wrapper.vm.transformDateWithTimeZone(lineitem);
    expect(result).toEqual([1679702400000 + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000, 10]);
  });
  it('should handle prefix len histogram correctly', () => {
    wrapper.vm.chartData.prefix_len_histogram = mockData.prefix_len_histogram
    wrapper.vm.handlePrefixLenHistogram();
    expect(wrapper.vm.v4_bar).toEqual([
      ['0', 2],
      ['16', 5],
      ['18', 2]
    ]);
    expect(wrapper.vm.v6_bar).toEqual([
      ['29', 1],
      ['32', 3],
      ['35', 1]
    ]);
  });
  it('should handle victim geo list correctly', () => {
    wrapper.vm.OrgChartData.victim_geo_list = testData.victim_geo_list

    wrapper.vm.handleVictimGeoList();
    
    expect(wrapper.vm.chartData.victim_geo_list).toEqual(victim_geo_list);
  });
  it('should handle attacker geo list correctly', () => {
    wrapper.vm.OrgChartData = mockData;
    wrapper.vm.handleAttackerGeoList();
    // console.log(JSON.stringify(wrapper.vm.chartData.attacker_geo_list))
    expect(wrapper.vm.chartData.attacker_geo_list).toEqual(attacker_geo_list);
  });
  it('should handle attacker country correctly', () => {
    const attacker_country_pie_chart = [{
        name: 'CN',
        value: 10
      },
      {
        name: 'US',
        value: 20
      },
    ];
    wrapper.vm.codeCountry = {
      CN: 'China',
      US: 'United States'
    };
    wrapper.vm.OrgChartData = {
      attacker_country_pie_chart
    };
    wrapper.vm.handleAttackerCountry();
    expect(wrapper.vm.chartData.attacker_country_pie_chart).toEqual([{
        name: 'United States',
        value: 20
      },
      {
        name: 'China',
        value: 10
      },
    ]);
  });
  it('should handle victim country correctly', () => {
    const victim_country_pie_chart = [{
        name: 'CN',
        value: 10
      },
      {
        name: 'US',
        value: 20
      },
    ];
    wrapper.vm.codeCountry = {
      CN: 'China',
      US: 'United States'
    };
    wrapper.vm.OrgChartData = {
      victim_country_pie_chart
    };
    wrapper.vm.handleVictimCountry();
    expect(wrapper.vm.chartData.victim_country_pie_chart).toEqual([{
        name: 'United States',
        value: 20
      },
      {
        name: 'China',
        value: 10
      },
    ]);
  });
  it('should handle event type data correctly', () => {
    const event_type_pie_chart = [{
        name: 'sql-injection',
        value: 10
      },
      {
        name: 'ddos',
        value: 20
      },
    ];
    wrapper.vm.OrgChartData = {
      event_type_pie_chart
    };
    wrapper.vm.handleEventTypeData();
    expect(wrapper.vm.chartData.event_type_pie_chart).toEqual([{
        name: 'ddos',
        value: 20
      },
      {
        name: 'sql-injection',
        value: 10
      },
    ]);
  });
  it('should handle events stat series stats correctly', () => {
    wrapper.vm.OrgChartData.stat_series = mockData.stat_series
    wrapper.vm.handleEventsStatSeriesStats();
    expect(wrapper.vm.chartData.stat_series).toEqual([{
      "data": [
        [1679616000000, 433],
        [1679702400000, 53],
        [1679788800000, 24],
        [1679875200000, 51]
      ],
      "name": "Possible Hijack",
      "type": "line"
    }, {
      "data": [
        [1679616000000, 327],
        [1679702400000, 24],
        [1679788800000, 20],
        [1679875200000, 11]
      ],
      "name": "Possible SubHijack",
      "type": "line"
    }, {
      "data": [
        [1679875200000, 62],
        [1679788800000, 44],
        [1679702400000, 77],
        [1679616000000, 760]
      ],
      "name": "All",
      "type": "line"
    }]);
  });
  it('should handle event type correctly', () => {
    wrapper.vm.OrgChartData.event_type_pie_chart = mockData.event_type_pie_chart
    wrapper.vm.handleEventTypeData();
    expect(wrapper.vm.chartData.event_type_pie_chart).toEqual([{
      "name": "Possible Hijack",
      "value": 561
    }, {
      "name": "Possible Subhijack",
      "value": 382
    }]);
  });
});