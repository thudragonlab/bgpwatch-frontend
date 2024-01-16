import {
  shallowMount,
  mount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import EventDetail from "@/views/EventDetail";
import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import {
  getEventDetail
} from '@/api/AnomalyApi'
import code_country from '@/../public/static/code_country.json'
import testData from '../mockData/EventDetail'
Vue.use(ElementUI)
Vue.use(MyC)



jest.mock('@/api/AnomalyApi', () => {
  const mock = require('../mockData/EventDetail')
  return {
    getEventDetail: jest.fn(() => Promise.resolve(mock.default)),
  }
})


describe('EventDetail', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(EventDetail, {
      mocks: {
        $route: {
          query: {
            type: 'hijack',
            detail_url: '/events/66.231.68.0_24-sub1680121793|Possible Hijack',
          },
        },
      },
    })
  })
  afterEach(() => {
    wrapper.destroy()
  })
  it('should render correct contents', () => {
    expect(wrapper.html()).toMatchSnapshot();
  })
  it('should correctly set up initial data', () => {
    expect(wrapper.vm.imageUrl).toEqual(expect.any(String))
    expect(wrapper.vm.event).toEqual(testData)
    expect(wrapper.vm.type).toEqual('Possible Hijack')
    expect(wrapper.vm.tabs_components).toEqual({
      'Event review': 'EventReplay',
      "Comments": "EventDetailOperationLog"
    })
    expect(wrapper.vm.isSelectedComponent).toEqual('EventReplay')
    expect(wrapper.vm.codeCountry).toEqual(code_country)
  })
  it('should call getEventDetail with the correct parameter', async () => {
    const tabs_components = {
      'Event review': 'EventReplay',
      "Comments": "EventDetailOperationLog"
    }
    expect(getEventDetail).toHaveBeenCalledWith('/events/66.231.68.0_24-sub1680121793|Possible Hijack')
    // Wait for getEventDetail to resolve
    expect(wrapper.vm.event).toEqual(testData)
    expect(wrapper.vm.isSelectedComponent).toEqual('EventReplay')
    expect(wrapper.vm.tabs_components).toEqual(tabs_components)
    expect(getEventDetail).toHaveBeenCalledTimes(3)
    expect(getEventDetail).toHaveBeenCalledWith('/events/66.231.68.0_24-sub1680121793|Possible Hijack')
    // Check that event data is correctly set after getEventDetail resolves
    await Vue.nextTick()

    expect(wrapper.vm.event).toEqual(testData)
    expect(wrapper.vm.event.websites).toEqual(['example.com', 'test.com'])
    expect(wrapper.vm.event.prefix_list).toEqual(['209.16.0.0/18'])
    expect(wrapper.vm.isSelectedComponent).toEqual('EventReplay')
    expect(wrapper.vm.tabs_components).toEqual(tabs_components)
  })
  it('should handle an empty website list in the event data', () => {
    const eventDetail = {
      websites: [],
      event_type:'Possible Hijack',
      prefix_list: ['1.1.1.0/24', '2.2.2.0/24'],
    }
    getEventDetail.mockResolvedValueOnce(eventDetail)
    expect(wrapper.vm.event).toEqual(testData)
    wrapper = shallowMount(EventDetail, {
      mocks: {
        $route: {
          query: {
            type: 'hijack',
            detail_url: '/events/66.231.68.0_24-sub1680121793|Possible Hijack',
          },
        },
      },
    })
    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.event).toEqual(eventDetail)
      expect(wrapper.vm.event.websites).toEqual([])
      expect(wrapper.vm.event.prefix_list).toEqual(['1.1.1.0/24', '2.2.2.0/24'])
    })
  })
  it('should correctly sort the website list in the event data', () => {
    const eventDetail = {
      websites: ['test.com', 'example.com'],
      event_type:'Possible Hijack',
      prefix_list: ['2.2.2.0/24', '1.1.1.0/24'],
    }
    getEventDetail.mockResolvedValueOnce(eventDetail)
    wrapper = shallowMount(EventDetail, {
      mocks: {
        $route: {
          query: {
            type: 'hijack',
            detail_url: '/events/66.231.68.0_24-sub1680121793|Possible Hijack',
          },
        },
      },
    })
    expect(wrapper.vm.event).toEqual('')
    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.event).toEqual(eventDetail)
      expect(wrapper.vm.event.websites).toEqual(eventDetail.websites)
      expect(wrapper.vm.event.prefix_list).toEqual(['2.2.2.0/24','1.1.1.0/24'])
    })
  })
  it('should correctly set the event type based on the query string', async () => {
    const eventDetail = {
      websites: ['test.com', 'example.com'],
      event_type:'Possible SubHijack',
      prefix_list: ['2.2.2.0/24', '1.1.1.0/24'],
    }
    getEventDetail.mockResolvedValueOnce(eventDetail)
    wrapper = shallowMount(EventDetail, {
      mocks: {
        $route: {
          query: {
            type: 'sub',
            detail_url: '/events/66.231.68.0_24-sub1680121793|Possible SubHijack',
          },
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isSelectedComponent).toEqual('SubHijackEventReplay')
    expect(wrapper.vm.tabs_components).toEqual({
      'Event review': 'SubHijackEventReplay',
      "Comments": "EventDetailOperationLog"
    })

  })
  it('should correctly update the selected component when the user clicks on a tab', () => {
    expect(wrapper.vm.isSelectedComponent).toEqual('EventReplay')
    wrapper.vm.select('SubHijackEventReplay')
    expect(wrapper.vm.isSelectedComponent).toEqual('SubHijackEventReplay')
  })
})