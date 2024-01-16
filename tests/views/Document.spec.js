import {
  mount
} from '@vue/test-utils'
import Document from "@/views/Document";
import ElementUI from '@/lib/element.js'
import Vue from "vue";

window.open = jest.fn()
Vue.use(ElementUI)

describe('Document.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Document, {
      stubs: {
        transition: false
      }
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should call gotoDocument with the correct arguments', () => {
    const docBtn = wrapper.find('.download-video')
    docBtn.trigger('click')
    // expect(window.open).toHaveBeenCalledWith('https://www.cgtf.net/wp-content/uploads/2023/07/BGP-Watch-Video-V4.mp4', '_blank')
    expect(window.open).toHaveBeenCalledWith('https://www.cgtf.net/wp-content/uploads/2023/07/BGP-Watch-Video-V4.mp4', '_blank')
    
  });
})