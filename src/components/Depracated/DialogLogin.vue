<template>
  <div class="login-box">
    <el-form :model="model" status-icon class="login-form" label-width="100px" >
    <el-form-item label="UserName:" :prop="param.FirstItemName" style="font-weight: bold">
      <el-input v-model="model[param.FirstItemName]" placeholder="Please input username" class="login-input"></el-input>
    </el-form-item>
    <el-form-item label="Password:" prop="password" style="font-weight: bold">
      <el-input
        type="password"
        v-model="model.password"
        placeholder="Please input password"
        show-password
        class="login-input"
      ></el-input>
    </el-form-item>
    
    <el-button :loading="loading" class="login-submit" @click="param.login">Login</el-button>
    <div class="forget" @click="param.forget">forget password</div>
    <!-- <div>For a trial account, please contact dev@dragonlab.org</div> -->
  </el-form>
  </div>
</template>

<script>
// import { Login, forgetPwd } from '@/api/UserApi'
export default {
  name: 'DialogLogin',
  created() {},
  data() {
    return {
      loading: false,
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
  },
}
</script>

<style lang="scss" scoped>
.login-box{
  display: flex;
  justify-content: center;
}
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
  margin-bottom: 10px;
}

.forget {
  margin-bottom: 20px;
  font-weight: bold;
  float: right;
  color:#4b127d;
  text-decoration-line: underline;
}
</style>
