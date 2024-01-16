<template>
  <el-button style="padding: 0; padding-bottom: 2px; border-bottom: 1px solid gray" type="text" @click="toDetail"
    >detail</el-button
  >
</template>

<script>
export default {
  name: 'FakePathDetailColumn',
  created() {},
  data() {
    return {}
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      },
    },
    tableParam: {
      type: Object,
      default: () => {
        return {}
      },
    },
    rowFormat: {
      type: Function,
    },
  },
  methods: {
    toDetail() {
      // console.log(this.row._id)
      let { href } = this.$router.resolve({
        name: 'FakeAsPathDetail',
        query: { id: this.row._id },
      })
      window.open(href, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped></style>
