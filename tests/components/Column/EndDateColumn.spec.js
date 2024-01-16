import {
    shallowMount
  } from '@vue/test-utils'
  import EndDateColumn from "@/components/Column/EndDateColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('EndDateColumn.vue',  () => {
    let wrapper
    let realDate
    beforeAll(() => {
      realDate = Date;
      global.Date = class extends Date {
        constructor(date) {
          super(date);
        }
        getTimezoneOffset() {
          return 0;
        }
      };
    });
    afterAll(() => {
      global.Date = realDate;
    });

    it('init',async () => {
      wrapper = shallowMount(EndDateColumn,{
        propsData:{
          row:{end_time:'Unknown'}
        }
      })
      const div = wrapper.find('div')
      expect(div.text()).toBe('Unknown')
      await wrapper.setProps({
        row:{end_time:'-'}
      })
      expect(div.text()).toBe('-')
      await wrapper.setProps({
        row:{end_time:'2023-04-08 20:47:52'},
        tableParam:{DataZone:0}
      })
      expect(div.text()).toBe('2023-04-08 20:47:52')

      expect(wrapper.vm.$options.filters.TransformDate('2022-01-01 12:00:00',8)).toBe('2022-01-01 04:00:00')
      expect(wrapper.vm.$options.filters.TransformDate('2022-01-01 12:00:00',-5)).toBe('2022-01-01 17:00:00')
      expect(wrapper.vm.$options.filters.TransformDate('2022-01-01 12:00:00',0)).toBe('2022-01-01 12:00:00')
      expect(wrapper.vm.$options.filters.TransformDate('2022-01-01 01:02:03',8)).toBe('2021-12-31 17:02:03')
      expect(wrapper.vm.$options.filters.TransformDate('2022-11-11 01:02:03',8)).toBe('2022-11-10 17:02:03')
      
    })
  })