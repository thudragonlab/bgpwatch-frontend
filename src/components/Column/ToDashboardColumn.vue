<template>
  <div>
    <div class="clickable" @click="toDashboard">{{ rowFormat(row) }}</div>
  </div>
</template>

<script>
export default {
  name: 'ToDashboardColumn',
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
    toDashboard() {
      this.$router.push({ path: '/dashBoard', query: { asn: this.rowFormat(this.row) } }).then(() => {
        location.reload()
      })
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
