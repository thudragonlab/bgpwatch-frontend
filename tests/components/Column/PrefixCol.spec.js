import {
    shallowMount
  } from '@vue/test-utils'
  import PrefixCol from "@/components/Column/PrefixCol";
  import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('PrefixCol.vue',  () => {
    let wrapper
    
    it('init',async () => {
      wrapper = shallowMount(PrefixCol,{
        propsData:{
          row:{prefix:[1,2,3,4,5]},
        }
      })
      const div = wrapper.findAll('.prefix-box div')
      expect(div).toHaveLength(5)
      expect(div.at(0).text()).toBe('1')
      expect(div.at(1).text()).toBe('2')
      expect(div.at(2).text()).toBe('3')
      expect(div.at(3).text()).toBe('4')
      expect(div.at(4).text()).toBe('5')
      
    })
  })