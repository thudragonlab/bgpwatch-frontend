import {
    shallowMount
  } from '@vue/test-utils'
  import LevelColumn from "@/components/Column/LevelColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('LevelColumn.vue',  () => {
    let wrapper
    
    it('init',async () => {
      wrapper = shallowMount(LevelColumn,{
        propsData:{
          row:{level:'low',level_reason:'reason',event_type:'Benign MOAS'},
        }
      })
      const span = wrapper.find('span')
      expect(span.text()).toBe('-')
      await wrapper.setProps({
        row:{level:'low',level_reason:'reason',event_type:'MOAS'},
      })
      expect(span.html()).toBe('<span>low<br>reason</span>')
     
    })
  })