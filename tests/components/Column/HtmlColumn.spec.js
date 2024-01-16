import {
    shallowMount
  } from '@vue/test-utils'
  import HtmlColumn from "@/components/Column/HtmlColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('HtmlColumn.vue',  () => {
    let wrapper
    
    it('init',async () => {
      wrapper = shallowMount(HtmlColumn,{
        propsData:{
          row:{end_time:'<div>abcabc</div>'},
          rowFormat:(row) => {
            return row.end_time
          }
        }
      })
      const span = wrapper.find('span')
      expect(span.html()).toBe('<span><div>abcabc</div></span>')
      expect(span.text()).toBe('abcabc')
     
    })
  })