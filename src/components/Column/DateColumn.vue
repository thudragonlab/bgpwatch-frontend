<template>
  <div>
    {{ rowFormat(row) | TransformDate }}
  </div>
</template>

<script>
export default {
  name: 'DateColumn',
  created() {},
  data() {
    return {}
  },
  filters: {
    TransformDate(ts) {
      const date = new Date(ts)
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
