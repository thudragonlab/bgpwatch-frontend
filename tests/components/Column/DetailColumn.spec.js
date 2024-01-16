import {
    shallowMount
  } from '@vue/test-utils'
  import AnomalyDetailColumn from "@/components/Column/AnomalyDetailColumn";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('AnomalyDetailColumn.vue', () => {
    let wrapper
    
    it('toDetail',async () => {
      wrapper = shallowMount(AnomalyDetailColumn,{
        mocks:{
            $router:{resolve:jest.fn(() => {return {href:'2'}})}
        }
      })
      window.open = jest.fn()
      await wrapper.setProps({tableParam:{detailRoute:'333'}})
      wrapper.vm.toDetail('1','22')
      expect(wrapper.vm.$router.resolve).toBeCalledWith({
        name: wrapper.vm.tableParam.detailRoute,
        query: { detail_url: '1', type: '22' },
      })
      expect(window.open).toBeCalledWith('2','_blank')
        
    })
  })