<template>
  <div>
    {{ rowFormat(row) | TransformDate(tableParam.DataZone) }}
  </div>
</template>

<script>
export default {
  name: 'StartDateColumn',
  created() {},
  data() {
    return {}
  },
  filters: {
    TransformDate(timeStr, DataZone) {
      const originDate = new Date(timeStr) // UTC被当成了本地的时间
      const date = new Date(
        originDate.getTime() - (DataZone + parseInt(new Date().getTimezoneOffset() / 60)) * 60 * 60000
      ) //真正变成选择的时区的本地时间
      const month = date.getMonth() + 1
      return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + month : month}-${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      } ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
    },
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
  methods: {},
}
</script>

<style lang="scss" scoped></style>
