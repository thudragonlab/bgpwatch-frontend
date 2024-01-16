<template>
  <div style="text-align:left">
    <span  v-html="rowFormat(row)"></span>
  </div>
</template>

<script>
export default {
  name: 'LeftColumn',
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
      default: () => {},
    },
    rowFormat: {
      type: Function,
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
