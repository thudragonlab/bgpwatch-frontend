<template>
  <div class="prefix-box">
    <div v-for="(prefix, index) in row.prefix" :key="index" class="item">
      {{ prefix }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrefixCol',
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

<style lang="scss" scoped>
.prefix-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100%;
  place-content: center center;
}

.item {
  text-align: left;
  padding-left: 40%;
}
</style>
