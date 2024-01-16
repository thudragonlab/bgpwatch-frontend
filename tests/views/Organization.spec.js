import {
  mount,
  shallowMount
} from "@vue/test-utils";
import ElementUI from '@/lib/element.js'
import ToDashboardColumn from '@/components/Column/ToDashboardColumn.vue'

import Organization from "@/views/Organization";

import MyC from 'dragonlab-component/lib/dragonLab-Component.umd.js'
import Vue from "vue";
import * as testData from '../mockData/Organization'

import {
  getAsInfo
} from '@/api/routeMonitor'

jest.mock('@/api/routeMonitor', () => {
  // const _inner = [...testData]
  const mock = require('../mockData/Organization')
  return {
    getAsInfo: jest.fn(() => Promise.resolve(mock.default))
  }
})

Vue.use(MyC)
Vue.use(ElementUI);
Vue.component('subComponent0', ToDashboardColumn)


describe('Organization-HTML', () => {

  it('test all event', async () => {
    const wrapper = mount(Organization, {
      stubs: {
        transition: false
      },
    })
    expect(wrapper.html()).toMatchSnapshot();
    const inputContent = jest.spyOn(wrapper.vm,'inputContent')
    const changeModel = jest.spyOn(wrapper.vm,'changeModel')
    const doSearch = jest.spyOn(wrapper.vm,'doSearch')
    // wrapper.vm.inputContent = inputContent
    const input = wrapper.find('#searchInput')
    const inputBox = wrapper.find('.el-input')
    
    await input.setValue('4262')
    inputBox.vm.$emit('input','4262')
    
    // input.vm.$emit('input')
    expect(inputContent).toHaveBeenCalled()
    expect(wrapper.vm.inputText).toBe('4262')
    expect(wrapper.vm[wrapper.vm.selectedType]).toBe('4262')

    const select = wrapper.find('#searchSelect')
    const selectBox = wrapper.find('.el-select')

    await select.setValue('searchASN')
    selectBox.vm.$emit('change','searchASN')
    await Vue.nextTick()
    expect(wrapper.vm.inputText).toBe('')
    wrapper.vm.propList.forEach(prop => {
      expect(wrapper.vm[prop]).toBe('')
    })

    expect(changeModel).toHaveBeenCalledWith('searchASN')

    const button = wrapper.find('.el-button')
    await button.trigger('click')

    expect(doSearch).toHaveBeenCalled()
    
  })
})

// describe('Organization-HTML.vue', () => {

//   it('searches ASNs by ASN, AS name, or organization', async () => {
//     // Arrange
//     const wrapper = mount(Organization, { 
//       mocks: {
//         $nextTick: fn => fn(),
//         $message: () => {},
//       },
//     });
//     expect(wrapper.html()).toMatchSnapshot();
//     // Act
//     wrapper.find('[placeholder="Please input asn"]').setValue('4262')
//     wrapper.find('[placeholder="Please input asn"]').trigger('input')
//     await wrapper.vm.doSearch();
//     let rows = wrapper.findAll('.el-table__row');
//     expect(rows.length).toBe(3);
//     expect(rows.at(0).text()).toContain('4262');

//     // wrapper.setData({ searchAsName: 'CERNET' });
//     wrapper.find('[placeholder="Please input as name"]').setValue('CERNET')
//     wrapper.find('[placeholder="Please input as name"]').trigger('input')
//     await wrapper.vm.doSearch();
//     rows = wrapper.findAll('.el-table__row');
//     expect(rows.length).toBe(3);
//     expect(rows.at(0).text()).toContain('4262');
//     expect(rows.at(1).text()).toContain('4263');
//     expect(rows.at(2).text()).toContain('4264');

//     // wrapper.setData({ searchOrg: 'California Education' });
//     wrapper.find('[placeholder="Please input as organization"]').setValue('California Education')
//     wrapper.find('[placeholder="Please input as organization"]').trigger('input')
//     await wrapper.vm.doSearch();
//     rows = wrapper.findAll('.el-table__row');
//     expect(rows.length).toBe(3);
//     expect(rows.at(0).text()).toContain('4262');
//     expect(rows.at(1).text()).toContain('4263');
//     expect(rows.at(2).text()).toContain('4264');

//     // Assert
//     expect(getAsInfo).toHaveBeenCalledTimes(4);
//     expect(getAsInfo).toHaveBeenCalledWith('', 'CERNET', '');
//     expect(getAsInfo).toHaveBeenCalledWith('4262', '', '');
//     expect(getAsInfo).toHaveBeenCalledWith('', 'CERNET', '');
//     expect(getAsInfo).toHaveBeenCalledWith('', '', 'California Education');
//   });
// });

describe('Organization.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Organization)
  })
  afterEach(() => {
    wrapper.destroy()
  })
  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
  it('calls getAsInfo on mount', async () => {
    await wrapper.vm.$nextTick()
    expect(getAsInfo).toHaveBeenCalledWith('', 'CERNET', '')
  })
  it('calls getAsInfo on doSearch', async () => {
    wrapper.vm.searchASN = '123'
    wrapper.vm.searchOrg = 'ABC'
    await wrapper.vm.doSearch()
    expect(getAsInfo).toHaveBeenCalledWith('123', 'CERNET', 'ABC')
    expect(wrapper.vm.tabldata).toEqual([{
        "as_name": "CERNET-ASN-BLOCK (US)",
        "asn": "4262",
        "org_name": "California Education and Research Federation Network"
      },
      {
        "as_name": "CERNET-ASN-BLOCK (US)",
        "asn": "4263",
        "org_name": "California Education and Research Federation Network"
      },
      {
        "as_name": "CERNET-ASN-BLOCK (US)",
        "asn": "4264",
        "org_name": "California Education and Research Federation Network"
      }
    ])
  })
  it('inputContent', () => {
    wrapper.vm.selectedType = 'searchASN'
    wrapper.vm.inputText = '123'
    wrapper.vm.inputContent()
    expect(wrapper.vm.searchASN).toBe('123')
  })

  it('changeModel', () => {
    wrapper.vm.selectedType = 'searchASN'
    wrapper.vm.searchASN = '123'
    wrapper.vm.searchAsName = '123'
    wrapper.vm.searchOrg = '123'
    wrapper.vm.changeModel(wrapper.vm.selectedType)
    expect(wrapper.vm.searchASN).toBe('123')
    expect(wrapper.vm.searchOrg).toBe('')
    expect(wrapper.vm.searchAsName).toBe('')
    expect(wrapper.vm.inputText).toBe('')
  })



})