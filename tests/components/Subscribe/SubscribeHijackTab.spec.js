import {
    shallowMount,
    createLocalVue,
    mount
  } from "@vue/test-utils";
  import 'jest-localstorage-mock';
  import ElementUI from '@/lib/element.js'
  import SubscribeHijackTab from "@/components/Subscribe/SubscribeHijackTab.vue";
  import "jest-canvas-mock";
  import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
  import Vue from "vue";
  import {getHijackEvent} from '../../mockData/SubscribeHijackTab'
  import HtmlColumn from '@/components/Column/HtmlColumn'
  import LevelColumn from '@/components/Column/LevelColumn'
  import StartDateColumn from '@/components/Column/StartDateColumn'
  import PrefixNumCol from '@/components/Column/PrefixNumCol'
  import EndDateColumn from '@/components/Column/EndDateColumn'
  import AnomalyDetailColumn from '@/components/Column/AnomalyDetailColumn'
  import AnomalyOptionColumn from '@/components/Column/AnomalyOptionColumn'
  Vue.use(ElementUI)
  Vue.component('subComponent1', LevelColumn)
  Vue.component('subComponent2', HtmlColumn)
  Vue.component('subComponent3', PrefixNumCol)
  Vue.component('subComponent4', HtmlColumn)
  Vue.component('subComponent5', StartDateColumn)
  Vue.component('subComponent6', EndDateColumn)
  Vue.component('subComponent8', AnomalyDetailColumn)
  Vue.component('subComponent9', AnomalyOptionColumn)
  Vue.use(MyC)
  
  jest.mock('@/api/SubscribeApi', () => {
    const mock = require('../../mockData/SubscribeHijackTab')
    return {
        getHijackEvent: jest.fn(() => Promise.resolve(mock.getHijackEvent))
    }
  })
let wrapper
describe('SubscribeHijackTab',() => {
    beforeEach(() => {
        localStorage.setItem('userInfo', JSON.stringify({ name: 'John Doe' ,_id:'1'}));
        wrapper = mount(SubscribeHijackTab,{
            stubs:{
                transition: false
            },
        })
      })
    
    it('init',async () => {
        expect(wrapper.vm.loading).toBeFalsy()
        expect(wrapper.vm.originalData).toEqual(getHijackEvent)
    })
    it('clickReject',async () => {
        await Vue.nextTick()
        wrapper.vm.clickReject(0)
        expect(wrapper.vm.dialogVisible).toBeTruthy()
        expect(wrapper.vm.submitFunc).toBeInstanceOf(Function)
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
    localStorage.setItem('userInfo', JSON.stringify({ name: 'John Doe' ,_id:'1'}));
      wrapper = mount(SubscribeHijackTab, {
        stubs: {
          transition: false
        }
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
      expect(PaginationTable.vm.originData).toHaveLength(getHijackEvent.length)
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