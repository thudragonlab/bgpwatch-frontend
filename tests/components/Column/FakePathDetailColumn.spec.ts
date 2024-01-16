import {
  Wrapper,
    shallowMount
  } from '@vue/test-utils'
  import FakePathDetailColumn from "@/components/Column/FakePathDetailColumn.vue";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('FakePathDetailColumn.vue',  () => {
    let wrapper:Wrapper<any>
    const push = jest.fn(() => {return {then:() => {}}})
    it('init',async () => {
      wrapper = shallowMount(FakePathDetailColumn,{
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
      wrapper.vm.toDetail()
      expect(window.open).toBeCalledWith('2','_blank')
      
    })
  })