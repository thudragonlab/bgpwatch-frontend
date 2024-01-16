import {
  Wrapper,
    mount
  } from '@vue/test-utils'
  import AnomalyOptionColumn from "@/components/Column/AnomalyOptionColumn.vue";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe.skip('ToDashboardColumn.vue',  () => {
    let wrapper:Wrapper<any>
    beforeEach(() => {
      wrapper = mount(AnomalyOptionColumn,{
        stubs:{
          transition: false
        }
      })
    })
    it('default',async () => {
      
      window.open = jest.fn()
      const div = wrapper.find('span')
      expect(div.classes()).toContain('el-tag--success')
      await wrapper.setProps({
        row:{asn:'4538','accept/reject':'reject'},
      })
      const div2 = wrapper.find('span')
      expect(div2.classes()).toContain('el-tag--danger')
      
    })
    
  })