<template>
  <div style="height:100vh">
    <ReverseRoutingPathChart
        ref="rrpc"
        :chartCategories="chartCategories"
        title=""
        :chartData="chartData"
        :chartlinks="chartlinks"
        root="166.111.0.0/16"
        :asPathDict="asPathDict"
      >
      </ReverseRoutingPathChart>
  </div>
</template>

<script>
import ReverseRoutingPathChart from '@/components/RouteMonitor/ReverseRoutingPathChart.vue'
import asPathDict from '@/../public/static/asPathDict.json'
import chartCategories from '@/../public/static/chartCategories.json'
import chartData from '@/../public/static/chartData.json'
import chartlinks from '@/../public/static/chartlinks.json'
export default {
  name: "Test",
  components: {
    ReverseRoutingPathChart,
  },
  created() {},
  data() {
    return {
      asPathDict:[],
      chartCategories:[],
      chartData:[],
      chartlinks:[]

    };
  },
  mounted(){
    this.$nextTick(() => {
      this.asPathDict = asPathDict
      this.chartCategories = chartCategories
      this.chartData = chartData
      this.chartlinks = chartlinks
    })
  },
  props: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>