import {
    Wrapper,
    mount,
    shallowMount
  } from '@vue/test-utils'
  import 'jest-localstorage-mock';
  import TheRouteMonitorNav from "@/components/RouteMonitor/TheRouteMonitorNav.vue";
  import ElementUI from '@/lib/element.js'
  import Vue from "vue";
  import UserApi from '@/api/UserApi';
// mock UserApi 中的 Login 和 forgetPwd 方法
jest.mock('@/api/UserApi', () => ({
  Login: jest.fn(),
  forgetPwd: jest.fn(),
  getSourceIP:jest.fn(() => Promise.resolve({'source-ips':[]}))
}));
  
  import 'jest-canvas-mock'
  
  Vue.use(ElementUI)
  Vue.prototype.$messageBox = jest.fn()
  
  describe('TheRouteMonitorNav.vue', () => {
    let wrapper:Wrapper<any>;
    const $route = {
        path: '?',
      }
    const replace = jest.fn()
    const $router = {
        replace
    }
    const reload = jest.fn()
    beforeEach(() => {
      wrapper = mount(TheRouteMonitorNav, {
        stubs: {
          transition: false
        },mocks: {
            $route,
            $router
          },      provide: {
            reload
          }
      });
    });
    afterEach(() => {
      wrapper.destroy();
      reload.mockClear()
    });
    it('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
    describe('isVisible', () => {
        it('returns all items if user is not logged in', async () => {
          await wrapper.setData({ userInfo: undefined });
          const visibleItems = wrapper.vm.isVisible([
            { navItem: 'Item 1', needLogin: false },
            { navItem: 'Item 2', needLogin: true },
          ]);
          expect(visibleItems).toHaveLength(1);
          expect(visibleItems[0].navItem).toEqual('Item 1');
        });
        it('returns only non-needLogin items if user is logged in', async () => {
          await wrapper.setData({ userInfo: true });
          const visibleItems = wrapper.vm.isVisible([
            { navItem: 'Item 1', needLogin: false },
            { navItem: 'Item 2', needLogin: true },
          ]);
          expect(visibleItems).toHaveLength(2);
          expect(visibleItems[0].navItem).toEqual('Item 1');
          expect(visibleItems[1].navItem).toEqual('Item 2');
          
        });
      });
      describe('signOut', () => {
        it('removes userInfo from local storage and redirects to home page', async () => {
          // 设置用户已登录
          await wrapper.setData({ userInfo: true });
          localStorage.setItem('userInfo', JSON.stringify({ name: 'John Doe',_id:'1' }));
          // 模拟点击退出登录按钮
          wrapper.find('.exit').trigger('click');
          // 期望 userInfo 被清除
          expect(localStorage.getItem('userInfo')).toBeNull();
          // 期望重新加载页面
          expect(reload).toHaveBeenCalledTimes(1);
          // 期望跳转到首页
          expect(replace).toHaveBeenCalledWith('/');
        });
      });
      describe('updateUser', () => {
        it('sets UpdaterVisible to true when called', async () => {
          await wrapper.vm.updateUser();
          expect(wrapper.vm.UpdaterVisible).toBe(true);
        });
      });
      describe('login', () => {
        it('calls the Login API method and stores userInfo in local storage when login succeeds', async () => {
          // 模拟 Login 方法返回登录成功
          
          UserApi.Login.mockResolvedValueOnce({ status: true, data: { name: 'John Doe' } });
          // 模拟用户输入
          const loginForm = { userName: 'johndoe', password: 'password' };
          // 模拟点击登录按钮
          await wrapper.vm.login(loginForm)
          // 期望调用 Login 方法
          expect(UserApi.Login).toHaveBeenCalledWith('johndoe', 'password');
          // 期望 userInfo 被存储到本地存储
          expect(localStorage.getItem('userInfo')).toEqual(JSON.stringify({ name: 'John Doe' }));
          // 期望重新加载页面
          expect(reload).toHaveBeenCalledTimes(1);
        });
        it('does not store userInfo in local storage when login fails', async () => {
          // 模拟 Login 方法返回登录失败
          localStorage.removeItem('userInfo')
          UserApi.Login.mockResolvedValueOnce({ status: false, data: {} });
          // 模拟用户输入
          const loginForm = { userName: 'johndoe', password: 'password' };
          // 模拟点击登录按钮
          await wrapper.vm.login(loginForm)
          // 期望 userInfo 没有被存储到本地存储
          expect(localStorage.getItem('userInfo')).toBeNull();
          // 期望不会重新加载页面
          expect(reload).not.toHaveBeenCalled();
        });
      });
      describe('forgetPwd', () => {
        it('calls the forgetPwd API method and displays the message box with the returned message', async () => {
          // 模拟 forgetPwd 方法返回消息
          UserApi.forgetPwd.mockResolvedValueOnce({ message: 'A message' });
          // 模拟用户输入
          const loginForm = { userName: 'johndoe' };
          // 模拟点击忘记密码按钮
          
          await wrapper.vm.forgetPwd(loginForm)
          // 期望调用 forgetPwd 方法
          expect(UserApi.forgetPwd).toHaveBeenCalledWith('johndoe');
          // 期望显示消息框
          expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('A message');
        });
        it('does not call the forgetPwd API method if userName is not provided', async () => {
          // 模拟用户输入
          UserApi.forgetPwd.mockClear()
          wrapper.vm.$messageBox.mockClear()
          const loginForm = { userName: '' };
          // 模拟点击忘记密码按钮
          await wrapper.vm.forgetPwd(loginForm)
          // 期望 forgetPwd 方法没有被调用
          expect(UserApi.forgetPwd).not.toHaveBeenCalled();
          // 期望不会显示消息框
          expect(wrapper.vm.$messageBox).not.toHaveBeenCalled();
        });
      });
  })