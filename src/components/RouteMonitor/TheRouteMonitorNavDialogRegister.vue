<template>
  <el-form ref="RegisterForm" :rules="rules" :model="RegisterForm" status-icon class="login-form" label-width="150px">
    <el-form-item label="UserName" prop="userName" style="font-weight: bold">
      <el-input
        v-model.number="RegisterForm.userName"
        placeholder="Please input username"
        class="login-input"
      ></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password" style="font-weight: bold">
      <el-input
        type="password"
        v-model="RegisterForm.password"
        placeholder="Please input password"
        show-password
        class="login-input"
      ></el-input>
    </el-form-item>
    <el-form-item label="New password" prop="new_password" style="font-weight: bold">
      <el-input
        type="password"
        v-model="RegisterForm.new_password"
        placeholder="Please input password again"
        show-password
        class="login-input"
      ></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email" style="font-weight: bold">
      <el-input v-model="RegisterForm.email" placeholder="Please input email" class="login-input"></el-input>
    </el-form-item>
    <el-button :loading="loading" class="login-submit" @click="update">Register</el-button>
  </el-form>
</template>

<script>
import { VerifyMail } from '@/api/UserApi'
export default {
  name: 'Information',
  created() {},
  data() {
    return {
      userInfo: {},
      loading: false,
      rules: {
        userName: [{ required: true, message: 'Please input userName', trigger: 'blur' }],
        password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
        new_password: [
          {
            trigger: 'blur',
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('Please input password again'))
              } else if (value !== this.RegisterForm.password) {
                callback(new Error('The two passwords are inconsistent!'))
              } else {
                callback()
              }
            },
          },
        ],
        email: [
          {
            trigger: 'blur',
            required: true,
            validator: (rule, value, callback) => {
              // regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              // console.log('value',value,regex)
              if (value === '') {
                callback(new Error('Please input email'))
              } else if (
                !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  value
                )
              ) {
                callback(new Error('Email is invaild'))
              } else {
                callback()
              }
            },
          },
        ],
        // email: [{required: true, message: 'Please input Email', trigger: 'blur'}],
      },
      RegisterForm: {
        userName: '',
        password: '',
        new_password: '',
        email: '',
      },
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
  mounted() {},
  inject: ['reload'],
  methods: {
    async update() {
      try {
        await this.$refs.RegisterForm.validate()
        this.loading = true
        const { status, data } = await VerifyMail(
          this.RegisterForm.userName,
          this.RegisterForm.password,
          this.RegisterForm.email
        )
        this.loading = false
        if (status !== 'failure') {
          this.$alert('Please check your Email', 'Success', {
            confirmButtonText: 'OK',
            type: 'success',
            callback: action => {
              this.reload()
            },
          })
        } else {
          Message({
            message: data,
            type: 'error',
            duration: 5 * 1000,
          })
        }
      } catch (e) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.login-input {
  width: 300px;
}

.login-form {
  width: 450px;
  text-align: center;
}

.login-submit {
  width: 450px;
  background-color: #4b127d;
  border-color: #4b127d;
  color: #fff;
  margin-bottom: 50px;
}
</style>
