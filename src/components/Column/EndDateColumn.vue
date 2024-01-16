<template>
  <div>
    <span v-if="!row || row.end_time === 'Unknown'"> Unknown </span>
    <span v-else-if="row.end_time === '-'">-</span>
    <span v-else>{{ row.end_time | TransformDate(tableParam.DataZone) }}</span>
  </div>
</template>

<script>
export default {
  name: 'EndDateColumn',
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
