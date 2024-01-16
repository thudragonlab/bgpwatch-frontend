<template>
  <div>
    <div class="clickable" @click="toReverseTopo">{{ rowFormat(row) }}</div>
  </div>
</template>

<script>
export default {
  name: 'ToReverseTOPOColumn',
  created() {},
  data() {
    return {}
  },
  props: {
    row: {
      type: Object,
    },
    tableParam: {
      type: Object,
    },
    rowFormat: {
      type: Function,
    },
  },
  methods: {
    toReverseTopo() {
      window.open(`/#/reverse-routing-path-topo?prefix=${this.rowFormat(this.row)}`, '_blank');
      // this.$router
      //   .push({ path: '/reverse-routing-path-topo', query: { prefix: this.rowFormat(this.row) } })
      //   .then(() => {
      //     location.reload()
      //   })
    },
  },
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
  color: #2440b3;
  text-decoration: underline;
}
.clickable:hover {
  color: #315efb;
}
</style>
