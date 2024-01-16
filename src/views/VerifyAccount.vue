<template>
  <div class="wait-title">Registering Please wait a moment...</div>
</template>

<script>
import { Register } from '@/api/UserApi'

export default {
  name: 'VerifyAccount',
  created() {
    if (!this.$route.query) {
      return
    }
    const that = this
    const { token } = this.$route.query

    Register(token).then(res => {
      const { status, data } = res
      if (status === 'success') {
        this.$message({
          message: 'Register Success',
          type: 'success',
          duration: 1 * 1000,
          onClose: () => {
            localStorage.setItem('userInfo', JSON.stringify(data))
            this.$router.replace('/')
          },
        })
      } else {
        this.$message({
          message: 'Register Failed',
          type: 'error',
          duration: 5 * 1000,
        })
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.wait-title {
  font-size: var(--max-font-size);
  font-weight: bold;
}
</style>
