<template>
  <div class="dashboard-container">
    <div class="data-card-box" ref="abc">
      <DataCard
        v-for="(item, index) in dataCardList"
        :key="index"
        :index="index"
        :chartData="item.chartData"
        :chartId="item.chartId"
        :subTitle="item.subTitle"
        :checked="index === clickedIndex"
        @click="clickCard"
      ></DataCard>
    </div>
    <div class="main-chart-box">
      <div class="main-chart" :style="mainChartStyle">
        <Chart
          chartId="mainChart"
          :option="
            new LineOption(dataCardList[clickedIndex].subTitle).getOption([
              'title',
              'tooltip',
              'xAxis',
              'yAxis',
              'grid',
              'legend',
              'series',
            ])
          "
          :series="dataCardList[clickedIndex].chartData"
          :sourceData="dataCardList[clickedIndex].chartData[0] && dataCardList[clickedIndex].chartData[0].data"
          :extraOption="{
            title: {
              text: dataCardList[clickedIndex].subTitle,
            },
          }"
        ></Chart>
      </div>
    </div>
    <div class="table-chart-box">
      <div class="table-chart">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="name" width="180" align="center"> </el-table-column>
          <el-table-column prop="name" width="180" align="center"> </el-table-column>
          <el-table-column prop="address" align="center"> </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <Chart
                :chartId="`mainChart${scope.row.date}`"
                :option="getLineOption('dashboardLine')"
                :series="dataCardList[0].chartData"
                :sourceData="dataCardList[clickedIndex].chartData[0] && dataCardList[clickedIndex].chartData[0].data"
              ></Chart>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// import Chart from '@/components/RouteMonitor/Chart'
// import DataCard from '@/components/RouteMonitor/DataCard'
import { LineOption } from '@/templates/chart/lineTemplate'
export default {
  name: 'Dashboard',
  components: {
    // Chart,
    // DataCard,
  },
  created() {},
  data() {
    return {
      LineOption,
      stat_series: [],
      dataCardBoxHeight: 0,
      mainChartStyle: {},
      dataCardList: [
        {
          chartData: [],
          chartId: 'chart_line1',
          subTitle: 'subTitle1',
        },
        { chartData: [], chartId: 'chart_line2', subTitle: 'subTitle2' },
        { chartData: [], chartId: 'chart_line3', subTitle: 'subTitle3' },
        { chartData: [], chartId: 'chart_line5', subTitle: 'subTitle5' },
        { chartData: [], chartId: 'chart_line6', subTitle: 'subTitle6' },
        { chartData: [], chartId: 'chart_line7', subTitle: 'subTitle7' },
        { chartData: [], chartId: 'chart_line8', subTitle: 'subTitle8' },
        {
          chartData: [],
          chartId: 'chart_line4',
          subTitle: 'subTitle4',
        },
      ],
      clickedIndex: 0,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
  props: {},
  mounted() {
    this.dataCardBoxHeight = this.$refs.abc.offsetHeight
    this.mainChartStyle = {
      height: `calc(100vh - ${this.dataCardBoxHeight}px - 72px - 44px - 20px)`,
    }
    const color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
    this.dataCardList.forEach((item, index) => {
      item.chartData = [
        {
          name: 'All',
          lineStyle: {
            color: color[index],
          },
          areaStyle: {
            color: color[index],
          },
          itemStyle: {
            color: color[index],
          },
          data: [],
        },
      ]
    })
    const that = this
    setInterval(function () {
      that.dataCardList.forEach((item, index) => {
        const tempData = [...item.chartData[0].data]
        if (tempData.length >= 100) {
          tempData.shift()
        }
        tempData.push([new Date().getTime(), parseInt(Math.random() * 50)])

        item.chartData[0].data = tempData
      })
    }, 1000)
  },
  methods: {
    clickCard(index) {
      this.clickedIndex = index
    },
    getDefaultDateArray() {
      const dateArray = []
      const now = new Date().getTime()
      for (let index = 0; index < 100; index++) {
        dateArray.push([now - index * 1000, 0])
      }
      return dateArray
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
  .main-chart {
    background-color: #fff;
  }
  .main-chart-box,
  .table-chart-box {
    padding: 10px;
  }
}
.data-card-box {
  display: flex;
  flex-wrap: wrap;
}
</style>
