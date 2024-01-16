<template>
  <div class="roa-router">
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="input2">
          <el-button slot="append" icon="el-icon-search"></el-button>
    <template slot="prepend">Prefix</template>
  </el-input>
      </el-col>
      <el-col :span="6" :offset="12">
        <div style="float:right">
        <el-button>ROA</el-button>
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ROA",
  created() {},
  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>

<style lang="scss" scoped>

.roa-router {
  padding: 10px;
  background-color: #f0f0f0;
  /* height: calc(100vh - 72px); */
}
</style>