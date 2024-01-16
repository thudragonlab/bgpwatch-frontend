import {
  Wrapper,
    shallowMount
  } from '@vue/test-utils'
  import ToReverseTOPOColumn from "@/components/Column/ToReverseTOPOColumn.vue";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('ToReverseTOPOColumn.vue',  () => {
    let wrapper:Wrapper<any>
    const push = jest.fn(() => {return {then:() => {}}})
    it('init',async () => {
      wrapper = shallowMount(ToReverseTOPOColumn,{
        propsData:{
          row:{asn:'4538'},
          rowFormat:(row: { asn: any; }) => {return row.asn},
        },
        mocks:{
          $router:{resolve:jest.fn(() => {return {href:'2'}}),
          push}
      }
      })
      window.open = jest.fn()
      const div = wrapper.find('div')
      expect(div.text()).toBe('4538')
      wrapper.vm.toReverseTopo()
      expect(window.open).toHaveBeenCalled()
      
    })
  })