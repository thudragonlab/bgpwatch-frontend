<template>
  <el-form :model="LoginForm" status-icon class="login-form" label-width="100px">
    <el-form-item label="UserName:" prop="userName" style="font-weight: bold">
      <el-input v-model.number="LoginForm.userName" placeholder="Please input username" class="login-input"></el-input>
    </el-form-item>
    <el-form-item label="Password:" prop="password" style="font-weight: bold">
      <el-input
        type="password"
        v-model="LoginForm.password"
        placeholder="Please input password"
        show-password
        class="login-input"
      ></el-input>
    </el-form-item>
    <el-button size="mini" class="forget" @click="forgetPwd">forget password</el-button>
    <el-button :loading="loading" class="login-submit" @click="login">Login</el-button>
    <!-- <div>For a trial account, please contact dev@dragonlab.org</div> -->
  </el-form>
</template>

<script>
import { Login, forgetPwd } from '@/api/UserApi'
export default {
  name: 'Login22',
  created() {},
  data() {
    return {
      loading: false,
      LoginForm: {
        userName: '',
        password: '',
      },
      heiquan: {},
    }
  },
  props: {
    model: {
      type: Object,
      default: () => {},
    },
    param: {
      type: Object,
      default: () => {},
    },
  },
  inject: ['reload'],
  methods: {
    async login() {
      this.loading = true
      const { status, data } = await Login(this.LoginForm.userName, this.LoginForm.password)
      this.loading = false
      if (status) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        this.reload()
      }
    },

    async forgetPwd() {
      if (this.LoginForm.userName) {
        const result = await forgetPwd(this.LoginForm.userName)
        this.$messageBox(result.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login-input {
  width: 300px;
}

.login-form {
  width: 400px;
  text-align: center;
}

.login-submit {
  width: 400px;
  background-color: #4b127d;
  border-color: #4b127d;
  color: #fff;
  margin-bottom: 50px;
}

.forget {
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
