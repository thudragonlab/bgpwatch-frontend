<template>
  <div style="font-weight:bold">
    <el-tag v-if="row['accept/reject'] === 'accept'" type="success">Accept</el-tag>
    <el-tag v-else-if="row['accept/reject'] === 'reject'" type="danger">Reject</el-tag>
    
  </div>
</template>

<script>
export default {
  name: 'TagColumn',
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
