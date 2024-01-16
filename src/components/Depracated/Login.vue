<template>
  <div id="login-tab">
    <span @click="LoginVisible = true">Login</span>
    <Dialog title="Login" :visible.sync="LoginVisible" :sub-component="Login" width="600px" :showFooter="false"
      @close_diolog="LoginVisible = false" :model="loginModel" :param="{
          forget: forgetWatcher,
          login: loginWatcher,
          FirstItemName: firstItemName
        }">
    </Dialog>
  </div>
</template>

<script>
import Dialog from './Dialog'
import Login from './DialogLogin'


export default {
  name: "Login",
  props: {
    firstItemName: {
      type: String,
      default: 'userName'
    },
    forgetFunc: {
      type: Function,
      default: () => {
        return () => { }
      }
    },
    loginFunc: {
      type: Function,
      default: () => {
        return () => { }
      }
    },
  },
  components: {
    Dialog,
  },
  data() {
    return {
      Login,
      LoginVisible: false,
      loginModel: {}
    }
  },
  created() {

  },
  methods: {

    forgetWatcher() {
      // console.log('FORGET!!!!!')
      this.forgetFunc(this.loginModel)
    },
    loginWatcher() {
      // console.log('Login!!!!!')
      this.loginFunc(this.loginModel)
    }
  },
};
</script>

<style scoped>
#login-tab {
  width: 100%;
  height: 100px;
}
</style>
