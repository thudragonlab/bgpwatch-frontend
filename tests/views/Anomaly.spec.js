import {
  shallowMount,
  createLocalVue,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import Anomaly from "@/views/Anomaly2";
import "jest-canvas-mock";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import * as testData from '../mockData/Anomaly'
import HtmlColumn from '@/components/Column/HtmlColumn'
import LevelColumn from '@/components/Column/LevelColumn'
import StartDateColumn from '@/components/Column/StartDateColumn'
import PrefixNumCol from '@/components/Column/PrefixNumCol'
import EndDateColumn from '@/components/Column/EndDateColumn'
import AnomalyDetailColumn from '@/components/Column/AnomalyDetailColumn'
const mockData = testData.default
Vue.use(ElementUI)
Vue.component('subComponent1', LevelColumn)
Vue.component('subComponent2', HtmlColumn)
Vue.component('subComponent3', PrefixNumCol)
Vue.component('subComponent4', HtmlColumn)
Vue.component('subComponent5', StartDateColumn)
Vue.component('subComponent6', EndDateColumn)
Vue.component('subComponent8', AnomalyDetailColumn)
Vue.use(MyC)

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


jest.mock('@/api/AnomalyApi', () => {
  const mock = require('../mockData/Anomaly')
  return {
    getEventlistByDate: jest.fn(() => Promise.resolve(mock.default))
  }
})



describe('Anomaly create method', () => {
  let wrapper


  // 针对 selectDateZone() 函数的测试用例
  it('should set defaultDateTime if st and et are present in query params', () => {
    const $route = {
      query: {
        st: 1620064800000, // May 4, 2021 00:00:00 UTC
        et: 1620151200000, // May 5, 2021 00:00:00 UTC
      },
    }
    const wrapper = shallowMount(Anomaly, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    })
    expect(wrapper.vm.defaultDateTime).toEqual([
      new Date(1620064800000),
      new Date(1620151200000),
    ])
  })
  it('should set searchObj.event_type if event_type is present in query params', () => {
    const $route = {
      query: {
        event_type: 'click',
      },
    }
    const wrapper = shallowMount(Anomaly, {
      mocks: {
        $route,
      },
    })
    expect(wrapper.vm.searchObj.event_type).toBe('click')
  })
  it('should set searchObj.search if searchContent is present in query params', () => {
    const $route = {
      query: {
        searchContent: 'example search',
      },
    }
    const wrapper = shallowMount(Anomaly, {
      mocks: {
        $route,
      },
    })
    expect(wrapper.vm.searchObj.search).toBe('example search')
  })
  it('should not update defaultDateTime if st or et are not present in query params', () => {
    const $route = {
      query: {},
    }
    const wrapper = shallowMount(Anomaly, {
      mocks: {
        $route,
      },
      data() {
        return {
          defaultDateTime: [new Date(0), new Date(0)],
        }
      },
    })
    expect(wrapper.vm.defaultDateTime).toEqual([new Date(0), new Date(0)])
  })
  it('should not update searchObj.event_type if event_type is not present in query params', () => {
    const $route = {
      query: {},
    }
    const wrapper = shallowMount(Anomaly, {
      mocks: {
        $route,
      },
      data() {
        return {
          searchObj: {
            event_type: 'click',
          },
        }
      },
    })
    expect(wrapper.vm.searchObj.event_type).toBe('click')
  })
  it('should not update searchObj.search if searchContent is not present in query params', () => {
    const $route = {
      query: {},
    }
    const wrapper = shallowMount(Anomaly, {
      mocks: {
        $route,
      },
      data() {
        return {
          searchObj: {
            search: 'example search',
          },
        }
      },
    })
    expect(wrapper.vm.searchObj.search).toBe('example search')
  })


})

describe('Anomaly', () => {
  let wrapper
  const utcTimeStamp = [1234567890000, 1234567899000]
  const expectTypes = ['All', "Possible Hijack"]
  const $route = {
    query: {},
  }
  beforeEach(() => {
    wrapper = shallowMount(Anomaly, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });

  // 针对 selectDateZone() 函数的测试用例

  describe('selectDateZone', () => {
    it('should update DataZone, searchObj, TypeOptions, originalData and loading when called', async () => {
      // const wrapper = shallowMount(YourComponent)
      const newDateZone = 'newDateZone'
      // 模拟调用 selectDateZone() 函数
      await wrapper.vm.selectDateZone(newDateZone, utcTimeStamp)
      // 验证 DataZone 是否被更新
      expect(wrapper.vm.DataZone).toBe(newDateZone)
      // 验证 searchObj 是否被更新
      expect(wrapper.vm.searchObj.start_time).toBe(new Date(utcTimeStamp[0] - new Date().getTimezoneOffset() * 60 * 1000).toJSON().replace('T', ' ').split('.')[0])
      expect(wrapper.vm.searchObj.end_time).toBe(new Date(utcTimeStamp[1] - new Date().getTimezoneOffset() * 60 * 1000).toJSON().replace('T', ' ').split('.')[0])
      // 验证 TypeOptions 是否被更新
      expect(wrapper.vm.TypeOptions).toEqual(expectTypes)
      // 验证 originalData 是否被更新
      expect(wrapper.vm.originalData).toEqual(mockData.data)
      // 验证 loading 是否被更新
      expect(wrapper.vm.loading).toBe(false)
    })
  })
  // 针对 timeFilter() 函数的测试用例
  describe('timeFilter', () => {
    it('should update searchObj, TypeOptions, originalData and loading when called with valid utcTimeStamp', async () => {
      // const wrapper = shallowMount(YourComponent)
      // const utcTimeStamp = [1234567890, 1234567899]
      // 模拟调用 timeFilter() 函数
      await wrapper.vm.timeFilter(utcTimeStamp)
      // 验证 searchObj 是否被更新
      expect(wrapper.vm.searchObj.start_time).toBe(new Date(utcTimeStamp[0] - new Date().getTimezoneOffset() * 60 * 1000).toJSON().replace('T', ' ').split('.')[0])
      expect(wrapper.vm.searchObj.end_time).toBe(new Date(utcTimeStamp[1] - new Date().getTimezoneOffset() * 60 * 1000).toJSON().replace('T', ' ').split('.')[0])
      // 验证 TypeOptions 是否被更新
      expect(wrapper.vm.TypeOptions).toEqual(expectTypes)
      // 验证 originalData 是否被更新
      expect(wrapper.vm.originalData).toEqual(mockData.data)
      // 验证 loading 是否被更新
      expect(wrapper.vm.loading).toBe(false)
    })
    it('should update searchObj, TypeOptions, originalData and loading when called with invalid utcTimeStamp', async () => {
      // const wrapper = shallowMount(YourComponent)
      const utcTimeStamp = undefined
      // 模拟调用 timeFilter() 函数
      await wrapper.vm.timeFilter(utcTimeStamp)
      // 验证 searchObj 是否被更新
      expect(wrapper.vm.searchObj.start_time).toBe(null)
      expect(wrapper.vm.searchObj.end_time).toBe(null)
      // 验证 TypeOptions 是否被更新
      expect(wrapper.vm.TypeOptions).toEqual(expectTypes)
      // 验证 originalData 是否被更新
      expect(wrapper.vm.originalData).toEqual(mockData.data)
      // 验证 loading 是否被更新
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  it('should set minWidth correctly', () => {
    const event = {
      srcElement: {
        clientWidth: 100
      }
    };
    wrapper.vm.setMinWidth(event);
    expect(wrapper.vm.minWidth).toBe(100);
  });

  describe('showRule', () => {
    it('Description', async () => {
      expect(wrapper.vm.showRule[2].rowFormat({
        Description: '123'
      })).toBe('123')
    })
    it('prefix_num', async () => {
      expect(wrapper.vm.showRule[3].rowFormat({
        prefix_num: '123'
      })).toBe('123')
      const events = [{
          prefix_num: 3
        },
        {
          prefix_num: 1
        },
        {
          prefix_num: 2
        },
      ];
      const sortedEvents = events.sort(wrapper.vm.showRule[3].compare);
      expect(sortedEvents[0].prefix_num).toBe(1);
      expect(sortedEvents[1].prefix_num).toBe(2);
      expect(sortedEvents[2].prefix_num).toBe(3);
    })
    it('example_prefix', async () => {
      expect(wrapper.vm.showRule[4].rowFormat({
        example_prefix: '123'
      })).toBe('123')
    })

    it('start_time', async () => {
      expect(wrapper.vm.showRule[5].rowFormat({
        start_time: '123'
      })).toBe('123')
      const events = [{
          start_time: '2023-03-27 22:58:46'
        },
        {
          start_time: '2023-03-29 22:58:46'
        },
        {
          start_time: '2023-03-28 22:58:46'
        },
      ];
      const sortedEvents = events.sort(wrapper.vm.showRule[5].compare);
      expect(sortedEvents[0].start_time).toBe('2023-03-27 22:58:46');
      expect(sortedEvents[1].start_time).toBe('2023-03-28 22:58:46');
      expect(sortedEvents[2].start_time).toBe('2023-03-29 22:58:46');
    })
    it('end_time', async () => {
      expect(wrapper.vm.showRule[6].rowFormat({
        end_time: '123'
      })).toBe('123')
      const events = [{
          end_time: '2023-03-27 22:58:46'
        },
        {
          end_time: '2023-03-29 22:58:46'
        },
        {
          end_time: '2023-03-28 22:58:46'
        },
      ];
      const sortedEvents = events.sort(wrapper.vm.showRule[6].compare);
      expect(sortedEvents[0].end_time).toBe('2023-03-27 22:58:46');
      expect(sortedEvents[1].end_time).toBe('2023-03-28 22:58:46');
      expect(sortedEvents[2].end_time).toBe('2023-03-29 22:58:46');
    })
    it('duration', async () => {
      const duration1 = '01:30:00';
      const duration2 = '02:15:30';
      const duration3 = '00:45:15';
      const result1 = wrapper.vm.showRule[7].compare({
        duration: duration1
      }, {
        duration: duration2
      });
      const result2 = wrapper.vm.showRule[7].compare({
        duration: duration2
      }, {
        duration: duration1
      });
      const result3 = wrapper.vm.showRule[7].compare({
        duration: duration2
      }, {
        duration: duration3
      });
      expect(result1).toBeLessThan(0);
      expect(result2).toBeGreaterThan(0);
      expect(result3).toBeGreaterThan(0);

    })


  })
  it('download', async () => {
    const spy = jest.spyOn(document, 'createElement')
    wrapper.vm.filterdata = jest.fn(() => {
      return [{
        a: 1,
        b: [2, 3],
        c: '123,23'
      }]
    })

    
    wrapper.vm.download()
    expect(spy).toHaveBeenCalled()
    // expect(spy).toHaveLastReturnedWith(expect_link)

    wrapper.vm.filterdata = jest.fn(() => {
      return []
    })
    spy.mockClear()
    wrapper.vm.download()
    expect(spy).not.toHaveBeenCalled()


  })

})

describe('Anomaly HTML', () => {
  let wrapper

  const $route = {
    query: {},
  }
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
    wrapper = mount(Anomaly, {
      stubs: {
        transition: false
      },
      mocks: {
        $route,
      },
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });

  it('sets default durationGt3 to false', () => {
    expect(wrapper.vm.durationGt3).toBe(false);
  });

  it('changes durationGt3 value when switch is toggled', async () => {
    const switchInput = wrapper.find('.select-in-all-switch');
    await switchInput.trigger('click');
    expect(wrapper.vm.durationGt3).toBe(true);
  });



  it('PaginationTable', async () => {
    const PaginationTable = wrapper.findComponent({
      name: 'PaginationTable'
    });
    expect(PaginationTable.vm.originData).toHaveLength(mockData.data.length)
    await wrapper.setData({
      searchObj: {
        event_type: 'Possible Hijack'
      }
    })
    expect(PaginationTable.vm.originData.every(item => item.event_type === 'Possible Hijack')).toBeTruthy()
    await wrapper.setData({
      searchObj: {
        level: 'high'
      }
    })
    expect(PaginationTable.vm.originData.every(item => item.event_type === 'Possible Hijack' && item.level === 'high')).toBeTruthy()
    await wrapper.setData({
      searchObj: {
        search: 'CN'
      }
    })
    expect(PaginationTable.vm.originData.every(item => item.event_type === 'Possible Hijack' && item.level === 'high' && (item.event_type.toLowerCase().includes('CN'.toLowerCase()) ||
      item.Description.toLowerCase().includes('CN'.toLowerCase()) ||
      item.level.toLowerCase().includes('CN'.toLowerCase())))).toBeTruthy()
    await wrapper.setData({
      durationGt3: true
    })
    expect(PaginationTable.vm.originData.every(item => item.event_type === 'Possible Hijack' && item.level === 'high' && (item.event_type.toLowerCase().includes('CN'.toLowerCase()) ||
      item.Description.toLowerCase().includes('CN'.toLowerCase()) ||
      item.level.toLowerCase().includes('CN'.toLowerCase())) && item.duration.split(':')[1] >= 3)).toBeTruthy()

    await wrapper.setData({
      searchObj: {
        search: 'attacker,1628',
        level: 'All'
      }
    })
    expect(PaginationTable.vm.originData.every(item => item.attacker === '1628')).toBeTruthy()
    await wrapper.setData({
      searchObj: {
        search: 'US',

      }
    })
    expect(PaginationTable.vm.originData.every(item => item.Description.toLowerCase().includes('US'.toLowerCase()))).toBeTruthy()
  });
});