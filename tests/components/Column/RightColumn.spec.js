import {
    shallowMount
  } from '@vue/test-utils'
  import RightColumn from "@/components/Column/RightColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('RightColumn.vue',  () => {
    let wrapper
    
    it('init',async () => {
      wrapper = shallowMount(RightColumn,{
        propsData:{
          row:{end_time:'<div>abcabc</div>'},
          rowFormat:(row) => {
            return row.end_time
          }
        }
      })
      const div = wrapper.find('div')
      expect(div.html()).toBe('<div style="text-align: right;"><span><div>abcabc</div></span></div>')
      expect(div.text()).toBe('abcabc')
     
    })
  })