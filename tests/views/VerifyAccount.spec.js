import {
  mount
} from '@vue/test-utils'
import 'jest-localstorage-mock';
import VerifyAccount from "@/views/VerifyAccount";
import {
  Register
} from '@/api/UserApi'
import ElementUI from '@/lib/element.js'
import VueRouter from 'vue-router'
import Vue from "vue";

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home'
    }
  ]
})

Vue.use(ElementUI)
Vue.prototype.$message = jest.fn((o) => {
  if (o.onClose){
  o.onClose()

  }
})


jest.mock('@/api/UserApi', () => {
  return {
    Register: jest.fn(() => Promise.resolve('hxzgkgfkahg'))
  }
})


describe('VerifyAccount.vue', () => {
  it('renders correctly', () => {
    const $route = {
      query: {
        token: 'test-token'
      }
    }
    const wrapper = mount(VerifyAccount, {
      mocks: {
        $route
      }
    })

    expect(wrapper.html()).toMatchSnapshot();
  });
  it('renders correctly', () => {
    Register.mockClear()
    const $route = {
    }
    const wrapper = mount(VerifyAccount, {
      mocks: {
        $route
      }
    })
    expect(Register).not.toHaveBeenCalled()

  });
  it('should call Register function with token when created', async () => {
    const $route = {
      query: {
        token: 'test-token'
      }
    }
    const wrapper = mount(VerifyAccount, {
      mocks: {
        $route
      }
    })
    await wrapper.vm.$nextTick()
    expect(Register).toHaveBeenCalledTimes(1) // 确保Register函数被调用一次
    expect(Register).toHaveBeenCalledWith('test-token') // 确保Register函数被正确调用

  })

  it('should show success message and save user info to localStorage when Register function returns success', async () => {
    Vue.prototype.$message.mockClear()
    const $route = {
      query: {
        token: 'test-token'
      },
      
    }
    const data = {
      name: 'test-user'
    }
    Register.mockResolvedValueOnce({
      status: 'success',
      data
    }) // mock Register函数返回值

    const wrapper = mount(VerifyAccount, {
      mocks: {
        $route,
        $router:{replace:jest.fn()}
      }
    })
    const spyReplace = jest.spyOn(wrapper.vm.$router, 'replace');
    
    const messageSpy = wrapper.vm.$message

    await wrapper.vm.$nextTick()
    expect(messageSpy).toHaveBeenCalledTimes(1) // 确保Message.success被调用一次
    expect(messageSpy).toHaveBeenCalledWith({
      message: 'Register Success',
      type: 'success',
      duration: 1000,
      onClose: expect.any(Function)
    }) // 确保Message.success被正确调用
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('userInfo', JSON.stringify(data))
    expect(localStorage.getItem('userInfo')).toBe(JSON.stringify(data)) // 确保用户信息被正确保存到localStorage中
    expect(spyReplace).toHaveBeenLastCalledWith('/')


  })
  it('should show error message when Register function returns error', async () => {
    Vue.prototype.$message.mockClear()
    const $route = {
      query: {
        token: 'test-token'
      }
    }
    const wrapper = mount(VerifyAccount, {
      mocks: {
        $route
      }
    })
    Register.mockResolvedValueOnce({
      status: 'error'
    }) // mock Register函数返回值


    await wrapper.vm.$nextTick()
    const messageSpy = Vue.prototype.$message
    expect(messageSpy).toHaveBeenCalledTimes(1) // 确保Message.success被调用一次
    expect(messageSpy).toHaveBeenCalledWith({
      message: 'Register Failed',
      type: 'error',
      duration: 5000,
    }) // 确保Message.success被正确调用

  })
})