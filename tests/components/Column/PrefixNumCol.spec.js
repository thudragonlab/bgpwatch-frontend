import {
  mount,
  shallowMount
} from '@vue/test-utils'
import PrefixNumCol from "@/components/Column/PrefixNumCol";
import ElementUI from '@/lib/element.js'
import Vue from "vue";
Vue.use(ElementUI)

describe('PrefixNumCol.vue', () => {
  let wrapper

  it('init', async () => {
    wrapper = mount(PrefixNumCol, {
      propsData: {
        row: {
          example_prefix: 'example'
        },
      }
    })
    expect(wrapper.find('.el-button').exists()).toBe(true);
    expect(wrapper.find('.content-box').exists()).toBe(false);
    expect(wrapper.find('.el-tag').exists()).toBe(true);
    expect(wrapper.find('.el-tag').text()).toBe('example');
  })

  it('should render prefix list when it exists', () => {
    const row = {
      prefix_list: ['prefix1', 'prefix2', 'prefix3'],
      example_prefix: 'example'
    };
    const wrapper = mount(PrefixNumCol, {
      propsData: {
        row
      }
    });
    expect(wrapper.find('.content-box').exists()).toBe(true);
    expect(wrapper.findAll('.content')).toHaveLength(row.prefix_list.length);
  });

  it('should show popover with correct content when button is clicked', async () => {
    const row = {
      prefix_list: ['prefix1', 'prefix2', 'prefix3'],
      example_prefix: 'example'
    };
    const wrapper = mount(PrefixNumCol, {
      propsData: {
        row
      }
    });
    // Click the button to trigger the popover
    await wrapper.find('.el-button').trigger('click');
    expect(wrapper.find('.el-popover').isVisible()).toBe(true);
    // Check that the popover content is correct
    const prefixList = row.prefix_list.join('');
    const examplePrefix = row.example_prefix;
    const content = wrapper.find('.content-box').text();
    expect(content).toBe(prefixList);
    expect(content).not.toBe(examplePrefix);
  });
})