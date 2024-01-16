<template>
  <div>
    <span v-html="rowFormat(row)"></span>
  </div>
</template>

<script>
export default {
  name: 'HtmlColumn',
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
  methods: {},
}
</script>

<style lang="scss" scoped></style>
