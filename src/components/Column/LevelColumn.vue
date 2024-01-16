<template>
  <div>
    <span v-if="row.event_type === 'Benign MOAS'">-</span>
                  <span v-else
                    >{{ row.level }}<br />{{ row.level_reason }}</span
                  >
  </div>
</template>

<script>
export default {
  name: "LevelColumn",
  created() {},
  data() {
    return {};
  },
   props: {
    row: {
      type: Object,
    },
    tableParam: {
      type: Object,
      default: () => {}
    },
    rowFormat: {
      type: Function,
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>