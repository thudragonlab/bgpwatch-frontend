<template>
  <div>
    <el-button
      style="padding: 0; padding-bottom: 2px; border-bottom: 1px solid gray"
      type="text"
      @click="toDetail(row.detail_url, row.event_type)"
      >detail</el-button
    >
  </div>
</template>

<script>
export default {
  name: 'DetailColumn',
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
    toDetail(detail_url, event_type) {
      // console.log('detail_url:', detail_url)
      let { href } = this.$router.resolve({
        name: this.tableParam.detailRoute,
        query: { detail_url: detail_url, type: event_type },
      })
      window.open(href, '_blank')
      // this.$router.push() //带参跳转
    },
  },
}
</script>

<style lang="scss" scoped></style>
