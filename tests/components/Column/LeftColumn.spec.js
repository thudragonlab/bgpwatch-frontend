import {
    shallowMount
  } from '@vue/test-utils'
  import LeftColumn from "@/components/Column/LeftColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('LeftColumn.vue',  () => {
    let wrapper
    
    it('init',async () => {
      wrapper = shallowMount(LeftColumn,{
        propsData:{
          row:{end_time:'<div>abcabc</div>'},
          rowFormat:(row) => {
            return row.end_time
          }
        }
      })
      const div = wrapper.find('div')
      expect(div.html()).toBe('<div style="text-align: left;"><span><div>abcabc</div></span></div>')
      expect(div.text()).toBe('abcabc')
     
    })
  })