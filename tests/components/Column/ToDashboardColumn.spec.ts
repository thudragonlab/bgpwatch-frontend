import {
  Wrapper,
    shallowMount
  } from '@vue/test-utils'
  import ToDashboardColumn from "@/components/Column/ToDashboardColumn.vue";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('ToDashboardColumn.vue',  () => {
    let wrapper:Wrapper<any>
    const push = jest.fn(() => {return {then:() => {}}})
    it('init',async () => {
      wrapper = shallowMount(ToDashboardColumn,{
        propsData:{
          row:{asn:'4538'},
          rowFormat:(row: { asn: any; }) => {return row.asn},
          tableParam:{DataZone:0}
        },
        mocks:{
          $router:{resolve:jest.fn(() => {return {href:'2'}}),
          push}
      }
      })
      window.open = jest.fn()
      const div = wrapper.find('div')
      expect(div.text()).toBe('4538')
      wrapper.vm.toDashboard()
      expect(push).toBeCalledWith({ path: '/dashBoard', query: { asn: wrapper.vm.rowFormat(wrapper.vm.row) } })
      
    })
  })