<template>
  <el-row class="table-box">
    <el-col :span="24" class="chart line">
      <div class="test-box">
        <span class="avg-title">Average announced number:</span>
        <span class="avg-title">{{ announcedAvgNum }}</span>
      </div>
      <chart
        chartId="dashboard_right_line"
        :option="
          new BashboardBarOption(title).getOption([
            'title',
            'tooltip',
            'xAxis',
            'yAxis',
            'grid',
            'series',
          ])
        "
        :sourceData="lineSeries"
      ></chart>
    </el-col>
  </el-row>
</template>

<script>
import {BashboardBarOption} from '@/templates/chart/barTemplate'

export default {
  name: 'RealTimeData',
  created() {},
  data() {
    return {
      BashboardBarOption,
      announcedAvgNum: 0,
      realTimeInterval: {},
      lineSeries: [],
    }
  },
  props: {
    realTimeData: {
      type: Array,
      defalut: [],
    },
    propAnnouncedAvgNum:{
      type:Number,
      default:0
    },
    title:{
      type:String,
      default:""
    }
  },
  watch: {
    realTimeData(newV) {
      this.setRealTimeData(newV)
    },
  },

  methods: {
    setRealTimeData(realTimeData) {
      let lineSourceData = this.lineSeries
      if (!lineSourceData) {
        lineSourceData = []
      }

      lineSourceData = lineSourceData.concat(realTimeData)
      let discardList = []
      let newDataAvg = 0
      let discardAvg = 0

      const temporaryAvg = this.announcedAvgNum||Number(this.propAnnouncedAvgNum)
      if (lineSourceData.length !== realTimeData.length) {
        discardList = lineSourceData.splice(0, realTimeData.length)
        discardAvg = discardList.reduce((sum, a) => sum + a[1], 0) / lineSourceData.length
        newDataAvg =
          realTimeData.reduce((sum, a) => sum + a[1], 0) / lineSourceData.length
      }
      this.announcedAvgNum = (temporaryAvg - discardAvg + newDataAvg).toFixed(3)
      this.lineSeries = lineSourceData
    },
  },
}
</script>

<style lang="scss" scoped>
.table-box {
  padding: 20px;
  background-color: #fff;
  // border-radius: 20px;
}

.chart,
.part {
  background-color: #fff;
}

.line {
  height: 20vh;
}

.avg-title {
  font-size: var(--middle-font-size);
  padding: 0px;
  font-weight: bold;
}
// .el-row{
//     margin-bottom: 0px !important;
//   }

</style>
