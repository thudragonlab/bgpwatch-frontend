import {
  Wrapper,
    mount
  } from '@vue/test-utils'
  import TagColumn from "@/components/Column/TagColumn.vue";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('ToDashboardColumn.vue',  () => {
    let wrapper:Wrapper<any>
    const push = jest.fn(() => {return {then:() => {}}})
    it('init',async () => {
      wrapper = mount(TagColumn,{
        propsData:{
          row:{asn:'4538','accept/reject':'accept'},
        },
      })
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