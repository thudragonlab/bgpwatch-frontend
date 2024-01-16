<template>
  <div style="height: 100%">
    <update-password-inner :submitFunc="Submit" :decodeFunc="decode" />
  </div>
</template>

<script>
import { updatePwd } from '@/api/UserApi'
export default {
  name: 'UpdatePassword',
  methods: {
    async Submit(userName, ruleForm) {
      const result = await updatePwd(userName, ruleForm.pass)
      this.$alert(result.message, '', {
        confirmButtonText: 'OK',
        callback: action => {
          this.$message('Please login again')
          this.$router.push('/')
        },
      })
    },
    decode(userkey) {
      const decode_str = Buffer.from(userkey, 'base64').toString()
      return decode_str.split('dragonLab_TSU').join('')
    },
  },
}
</script>

<style lang="scss" scoped>
.statistic-box {
  // background-color: #f0f0f0;
  height: 100%;
  background-image: linear-gradient(45deg, #efbdfa, #cbe3fd, #f9d9d9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  font-size: var(--max-font-size);
  font-weight: bold;
}

.box-card {
  width: 580px;
}

.bnt {
  margin: 0;
  margin-top: 10px;
  width: 100%;
}
</style>
