<template>
  <div class="prefix-box">
    <el-popover placement="top" trigger="click">
      <div v-if="row.prefix_list" class="content-box">
        <div v-for="(prefix, index) in prefixList" :key="index" class="content">
          <el-tag type="info">{{ prefix }}</el-tag>
        </div>
      </div>
      <div v-else>
        <el-tag type="info">{{ row.example_prefix }}</el-tag>
      </div>
      <el-button size="mini" slot="reference">{{ rowFormat(row) }}</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'PrefixNumCol',
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
      default: () => {},
    },
  },
  computed:{
    prefixList(){
      if(typeof this.row.prefix_list[0] === 'object'){
        return this.row.prefix_list.map(item => {
          return item.sort((a,b) => a.split('/')[1] - b.split('/')[1])
        })
      }
      return this.row.prefix_list
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.content-box {
  max-height: 200px;
  overflow-y: auto;
  .content {
    text-align: center;
  }
}
</style>
