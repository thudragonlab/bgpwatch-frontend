import {
    shallowMount
  } from '@vue/test-utils'
  import DateColumn from "@/components/Column/DateColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('DateColumn.vue',  () => {
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
      wrapper = shallowMount(DateColumn,{
        propsData:{
          row:{start_time:1691043438973.2612},
          rowFormat:(row) => {return row.start_time},
        }
      })
      const div = wrapper.find('div')
      expect(div.text()).toBe('2023-08-03 06:17:18')

      expect(wrapper.vm.$options.filters.TransformDate(1691043438973.2612)).toBe('2023-08-03 06:17:18')
      expect(wrapper.vm.$options.filters.TransformDate(1700301668000)).toBe('2023-11-18 10:01:08')
      
      
    })
  })