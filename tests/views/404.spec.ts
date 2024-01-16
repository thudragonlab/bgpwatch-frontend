import {
  Wrapper,
  shallowMount
} from '@vue/test-utils'
import _404 from "@/views/404.vue";


describe('404.vue', () => {
  it('renders correctly', () => {
  
    const wrapper:Wrapper<any> = shallowMount(_404, {
      mocks: {
      }
    })

    expect(wrapper.html()).toMatchSnapshot();
  });
  
})