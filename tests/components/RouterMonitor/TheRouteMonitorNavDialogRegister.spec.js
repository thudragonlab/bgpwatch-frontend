import { mount, createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';
import Vue from "vue";
import RegistrationForm from '@/components/RouteMonitor/TheRouteMonitorNavDialogRegister'; // 替换为你的组件路径
const localVue = createLocalVue();
Vue.use(ElementUI);


jest.mock('@/api/UserApi', () => {
  return {
    VerifyMail: jest.fn(() => Promise.resolve({ status: 'success' }))
  }
})
Vue.prototype.$alert = jest.fn()

describe('RegistrationForm.vue', () => {
  let wrapper;
  const reload = jest.fn()
  beforeEach(() => {
    wrapper = mount(RegistrationForm, {
      // localVue,
      provide: {
        reload
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays error messages when form is submitted with invalid data', async () => {
    await wrapper.setData({
      RegisterForm: {
        userName: '',
        password: '',
        new_password: '',
        email: '',
      },
    });

    const button = wrapper.find('.login-submit');
    await button.trigger('click');

    const errorMessageElements = wrapper.findAll('.el-form-item__error');
    expect(errorMessageElements.length).toBeGreaterThan(0);
  });


  it('calls update method when Register button is clicked', async () => {
    const updateMethod = jest.spyOn(wrapper.vm, 'update');

    // Set form data to valid values
    await wrapper.setData({
      RegisterForm: {
        userName: 'username',
        password: 'password',
        new_password: 'password',
        email: 'test@example.com',
      },
    });

    // Trigger click event on the Register button
    const button = wrapper.find('.login-submit');
    await button.trigger('click');

    // Check if the update method was called
    expect(updateMethod).toHaveBeenCalled();

    // Restore the original method
    updateMethod.mockRestore();
  });

  it('displays success alert and triggers reload on successful registration', async () => {
    // Mock VerifyMail function to return a successful response
    // Set form data to valid values
    const alert = jest.spyOn(wrapper.vm, '$alert')

    await wrapper.setData({
      RegisterForm: {
        userName: 'username',
        password: 'password',
        new_password: 'password',
        email: 'test@example.com',
      },
    });

    // Trigger click event on the Register button
    const button = wrapper.find('.login-submit');
    await button.trigger('click');

    // Check if success alert is displayed
    // const alert = wrapper.find('.el-message--success');
    // expect(alert.exists()).toBe(true);
    expect(alert.mock.calls[0][2]).toEqual({
      confirmButtonText: 'OK',
      type: 'success',
      callback: expect.any(Function)
    })
    
    alert.mock.calls[0][2].callback('confirm')

    // Check if reload method was triggered
    expect(reload).toHaveBeenCalledTimes(1);

  });

});
