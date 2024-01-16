import {
  Wrapper,
  shallowMount
} from '@vue/test-utils'
import UpdatePassword from "@/views/UpdatePassword.vue";
import { updatePwd } from '@/api/UserApi'
import Vue from "vue";


Vue.prototype.$message = jest.fn()
Vue.prototype.$alert = jest.fn((_,__,{callback}) => {
  callback()
})


jest.mock('@/api/UserApi', () => {
  return {
    updatePwd: jest.fn(() => Promise.resolve({'message': 'Success'}))
  }
})


describe('UpdatePassword.vue', () => {
  it('renders correctly',async () => {
    const $route = {
      query: {
        user: 'test-token'
      },
      
    }
    const push = jest.fn()
    const wrapper:Wrapper<any> = shallowMount(UpdatePassword, {
      mocks: {
        $route,
        $router:{
          push
        }
      }
    })

    expect(wrapper.html()).toMatchSnapshot();
    const user = wrapper.vm.decode('ZHJhZ29uTGFiX1RTVTE=')
    expect(user).toBe('1')
    await wrapper.vm.Submit(user,{pass:'1'})
    expect(updatePwd).toHaveBeenCalled()
    expect(wrapper.vm.$alert).toHaveBeenCalledWith('Success', '', {
      confirmButtonText: 'OK',
      callback: expect.any(Function),
    });
    expect(wrapper.vm.$message).toHaveBeenCalledWith('Please login again');
    expect(push).toHaveBeenCalledWith('/');

  });
  
})