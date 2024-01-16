<template>
  <div class="statistic-box">
    <div class="time-zone-selector">
      <div class="time-zone-box">
        <TimeZone @change="selectDate" @changeDateZone="selectDateZone">
          <!-- <el-button class="document-route" @click="gotoDocument">Document</el-button> -->
        </TimeZone>
      </div>
    </div>
    <div class="statistic-grid">
      <div :class="['pie2', clickPieClassName == 'pie2' ? 'enlarge-pie2' : '', 'shadow']">
        <Chart
          chartId="left_middle_pie"
          :option="
            new PieOption('Attacker country/region', 'pie2', enlarge, reduce).getOption([
              'title',
              'tooltip',
              'legend',
              'series',
              'toolbox',
            ])
          "
          :sourceData="chartData && chartData.attacker_country_pie_chart"
          :extraOption="pieExtraOption"
        ></Chart>
      </div>
      <div :class="['pie3', clickPieClassName == 'pie3' ? 'enlarge-pie3' : '', 'shadow']">
        <Chart
          chartId="left_bottom_pie"
          :option="
            new PieOption('Victim country/region', 'pie3', enlarge, reduce).getOption([
              'title',
              'tooltip',
              'legend',
              'series',
              'toolbox',
            ])
          "
          :sourceData="chartData && chartData.victim_country_pie_chart"
          :extraOption="pieExtraOption"
        ></Chart>
      </div>
      <div :class="['pie1', clickPieClassName == 'pie1' ? 'enlarge-pie1' : '', 'shadow']">
        <Chart
          chartId="left_top_pie"
          :option="
            new PieOption('Proportion of event type', 'pie1', enlarge, reduce).getOption([
              'title',
              'tooltip',
              'legend',
              'series',
              'toolbox',
            ])
          "
          :sourceData="chartData && chartData.event_type_pie_chart"
          :extraOption="pieExtraOption"
        ></Chart>
      </div>
      <div :class="['map1', clickPieClassName == 'map1' ? 'enlarge-map1' : '', 'shadow']">
        <Chart
          chartId="top_map"
          ref="top_map"
          :option="
            new MapOption(
              'Distribution map of victim and attacker',
              mapName,
              'map1',
              addZoomfunc,
              reduceZoomfunc,
              enlarge,
              reduce
            ).getOption(['title', 'tooltip', 'legend', 'geo', 'series', 'toolbox'])
          "
          :series="mapSeries"
          :extraOption="mapExtraOption"
          :EventList="{
            click: clickMapPoint,
          }"
        ></Chart>
      </div>
      <div class="line1 shadow">
        <Chart
          chartId="bottom_line"
          :option="new LineOption('Event Count').getOption(['title', 'tooltip', 'xAxis', 'yAxis', 'grid', 'legend'])"
          :series="chartData.stat_series"
        ></Chart>
      </div>
      <div :class="['bar1', clickPieClassName == 'bar1' ? 'enlarge-bar1' : '', 'shadow']">
        <Chart
          chartId="top_right_top_bar"
          :option="
            new BarOption('Hijacked IPv4 Prefix', 'bar1', enlarge, reduce).getOption([
              'title',
              'tooltip',
              'xAxis',
              'yAxis',
              'grid',
              'series',
              'toolbox',
            ])
          "
          :sourceData="v4_bar"
          :extraOption="barExtraOption"
        ></Chart>
      </div>
      <div :class="['bar2', clickPieClassName == 'bar2' ? 'enlarge-bar2' : '', 'shadow']">
        <Chart
          chartId="top_right_bottom_bar"
          :option="
            new BarOption('Hijacked IPv6 Prefix', 'bar2', enlarge, reduce).getOption([
              'title',
              'tooltip',
              'xAxis',
              'yAxis',
              'grid',
              'series',
              'toolbox',
            ])
          "
          :sourceData="v6_bar"
          :extraOption="barExtraOption"
        ></Chart>
      </div>
    </div>
    <!-- <div class="component-container">
      <div class="table-box">
        <div class="table-title">Attacker</div>
        <PaginationTable
          :v-loading="loading"
          :originData="chartData && chartData.attacker_as_list"
          :showRule="addTableFirstHeadWith('Attack')"
          :usePagination="false"
        ></PaginationTable>
      </div>
      <div class="table-box">
        <div class="table-title">Victim</div>
        <PaginationTable
          :originData="chartData && chartData.victim_as_list"
          :showRule="addTableFirstHeadWith('Victim')"
          :usePagination="false"
        ></PaginationTable>
      </div>
    </div> -->
    <div class="mask" v-show="clickPieClassName" @click="reduce"></div>
  </div>
</template>

<script>
import { MapOption } from '@/templates/chart/mapTemplate'
import { PieOption } from '@/templates/chart/pieTemplate'
import { LineOption } from '@/templates/chart/lineTemplate'
import { BarOption } from '@/templates/chart/barTemplate'
import worldJson from '@/../public/static/ali.json'
import codeLat from '@/../public/static/code_lat.json'
import codeCountry from '@/../public/static/code_country.json'
import { getEventstat } from '@/api/routeMonitor'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone.vue'
import { getAsInfoByList } from '@/api/DashBoardApi'
const ZOOM_OFFSET = 0.1
const MAX_ZOOM = 3
const MIN_ZOOM = 1
export default {
  name: 'Statistics',
  components: {
    // Chart,
    TimeZone,
    // PaginationTable,
  },
  data() {
    return {
      selectedTimeStamp: [],
      mapName: 'aliMap',
      mapSeries: [],
      eventTypeData: {},
      eventLevelData: {},
      chartData: {},
      OrgChartData: {},
      loading: true,
      dataZone: parseInt(new Date().getTimezoneOffset() / 60),
      v4_bar: [],
      v6_bar: [],
      BarOption,
      LineOption,
      PieOption,
      MapOption,
      mapExtraOption: {},
      pieExtraOption: {},
      barExtraOption: {},
      extraOptionName: '',
      clickPieClassName: '',
      coordsLines: [],
    }
  },
  async mounted() {
    this.$refs.top_map.registerMapByGeo(this.mapName, worldJson)
  },
  created() {},

  methods: {
    clickMapPoint(param, b, c, d) {
      if (param.data['name']) {
        // console.log(param,param.data['name'])
        const searchContent = `${param.seriesName}:${param.data.cc}`
        this.$router.push({
          path: '/anomaly',
          query: { st: this.selectedTimeStamp[0], et: this.selectedTimeStamp[1], searchContent },
        })
      }
    },

    enlarge(className, extraOptionName) {
      this[extraOptionName] = { toolbox: { feature: { mybtnEnlarge: { show: false }, mybtnReduce: { show: true } } } }
      this.clickPieClassName = className
      this.extraOptionName = extraOptionName
    },
    reduce() {
      this[this.extraOptionName] = {
        toolbox: { feature: { mybtnEnlarge: { show: true }, mybtnReduce: { show: false } } },
      }
      this.clickPieClassName = ''
    },

    addZoomfunc() {
      if (!this.mapExtraOption['geo']) {
        this.mapExtraOption = { geo: { zoom: this.MapOption.getZoom() } }
      }
      const zoom = this.mapExtraOption['geo'].zoom + ZOOM_OFFSET
      if (zoom < MAX_ZOOM) {
        this.mapExtraOption = { geo: { zoom } }
      }
      // console.log('addZoomfunc')
    },
    reduceZoomfunc() {
      if (!this.mapExtraOption['geo']) {
        this.mapExtraOption = { geo: { zoom: this.MapOption.getZoom() } }
      }
      const zoom = this.mapExtraOption['geo'].zoom - ZOOM_OFFSET
      if (zoom > MIN_ZOOM) {
        this.mapExtraOption = { geo: { zoom } }
      }
      // console.log('reduceZoomfunc')
    },
    async requestChartData(startTime, endTime) {
      this.loading = true
      this.OrgChartData = await getEventstat(startTime, endTime)
      this.handleEventsStatSeriesStats()
      this.handleAttackerCountry()
      this.handleVictimCountry()
      this.handleVictimGeoList()
      this.handleAttackerGeoList()
      this.handlePrefixLenHistogram()
      this.handleEventTypeData()
      this.handleCoordsLines()
      console.log(this.coordsLines)
      this.mapSeries = [
        {
          data: this.chartData.victim_geo_list,
        },
        {
          data: this.chartData.attacker_geo_list,
        },
        {
          data: this.coordsLines,
        },
      ]
      this.loading = false
    },
    handleCoordsLines() {
      this.coordsLines = []
      const coordObj = {}
      this.OrgChartData.attacker_as_list.forEach((_, index) => {
        const attacker_lat = codeLat[this.OrgChartData.attacker_as_list[index]['country']]
        const victim_lat = codeLat[this.OrgChartData.victim_as_list[index]['country']]
        if (
          attacker_lat &&
          victim_lat
          //  && attacker_lat[0] !== victim_lat[0] && attacker_lat[1] !== victim_lat[1]
        ) {
          const VictimCoord = codeLat[this.OrgChartData.victim_as_list[index]['country']]
          // console.log(codeLat[this.OrgChartData.attacker_as_list[index]['country']],codeLat[this.OrgChartData.victim_as_list[index]['country']])
          
          const o = {
            fromCountry: this.OrgChartData.attacker_as_list[index]['country'],
            toCountry: this.OrgChartData.victim_as_list[index]['country'],
            coords: [
              codeLat[this.OrgChartData.attacker_as_list[index]['country']],
              [VictimCoord[0]-1,VictimCoord[1]-1],
            ],
          }
          const key = `${o.fromCountry}_${o.toCountry}`
          coordObj[key] = o
          // .push({
          //   fromCountry: this.OrgChartData.attacker_as_list[index]['country'],
          //   toCountry: this.OrgChartData.victim_as_list[index]['country'],
          //   coords: [
          //     codeLat[this.OrgChartData.attacker_as_list[index]['country']],
          //     [VictimCoord[0]-1,VictimCoord[1]-1],
          //   ],
          // })
        }
      })
      this.coordsLines = Object.values(coordObj)
    },
    handlePrefixLenHistogram() {
      const { v4, v6 } = this.OrgChartData && this.OrgChartData.prefix_len_histogram
      this.v4_bar = Object.keys(v4).map(key => {
        return [key, v4[key]]
      })
      this.v6_bar = Object.keys(v6).map(key => {
        return [key, v6[key]]
      })
    },
    handleVictimGeoList() {
      const victimObj = {}
      // console.log(JSON.stringify(this.chartData.victim_geo_list))
      this.OrgChartData &&
        this.OrgChartData.victim_geo_list.forEach(item => {
          victimObj[item.name] = item.name
        })
      this.chartData.victim_geo_list = Object.keys(victimObj).map(key => {
        let value = codeLat[key]
        if (value) {
          value = [value[0] - 1, value[1] - 1]
        }
        const count = this.OrgChartData.victim_as_list.filter(item => item.country === key).length
        // if (key === 'ZA') {
        // console.log(codeCountry[key], value, count, Math.log(count) * 10)
        // }
        return {
          cc: key,
          name: codeCountry[key],
          value,
          count,
          symbolSize: Math.log(count) * 10 || 5,
        }
      })
    },
    handleAttackerGeoList() {
      const attackerObj = {}
      this.OrgChartData &&
        this.OrgChartData.attacker_geo_list.forEach(item => {
          attackerObj[item.name] = item.name
        })
      this.chartData.attacker_geo_list = Object.keys(attackerObj).map(key => {
        const count = this.OrgChartData.attacker_as_list.filter(item => item.country === key).length
        return {
          cc: key,
          name: codeCountry[key],
          value: codeLat[key],
          count,
          symbolSize: count !== 1 ? Math.log(count) * 10 : Math.log(count + 1) * 10,
        }
      })
    },
    handleAttackerCountry() {
      this.chartData.attacker_country_pie_chart =
        this.OrgChartData &&
        this.OrgChartData.attacker_country_pie_chart.map(item => {
          item.name = codeCountry[item.name] || item.name
          return item
        })
      this.chartData.attacker_country_pie_chart.sort((a, b) => {
        return b.value - a.value
      })
    },
    handleVictimCountry() {
      this.chartData.victim_country_pie_chart =
        this.OrgChartData &&
        this.OrgChartData.victim_country_pie_chart.map(item => {
          item.name = codeCountry[item.name] || item.name
          return item
        })
      this.chartData.victim_country_pie_chart.sort((a, b) => {
        return b.value - a.value
      })
    },
    transformDateWithTimeZone(lineitem) {
      // console.log(lineitem)
      lineitem[0] = lineitem[0] + new Date().getTimezoneOffset() * 60 * 1000 - this.dataZone * 60 * 60 * 1000
      return lineitem
    },
    handleEventTypeData() {
      this.chartData.event_type_pie_chart =
        this.OrgChartData &&
        this.OrgChartData.event_type_pie_chart.map(item => {
          return item
        })
      this.chartData.event_type_pie_chart.sort((a, b) => {
        return b.value - a.value
      })
    },
    handleEventsStatSeriesStats() {
      const colorList = [
        '#ee6666',
        '#fac858',
        '#91cc75',
        '#73c0de',
        '#5470c6',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
      ]
      this.chartData.stat_series = this.OrgChartData.stat_series.map((item, index) => {
        item.data = item.data.map(this.transformDateWithTimeZone)
        item.type = 'line'
        if(item.name !== 'All'){
          item.stack = 'count'
          item.areaStyle = {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colorList[index], // 0% 处的颜色
              },
              {
                offset: 1,
                color: `${colorList[index]}75`, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        }
        }
        item.showSymbol = false
        item.color = colorList[index]
        return item
      })
    },
    updateDataByTime(utcTimeStamp) {
      this.selectedTimeStamp = utcTimeStamp
      const startdate = utcTimeStamp[0]
      const enddate = utcTimeStamp[1]
      this.requestChartData(startdate, enddate)
    },
    selectDate(utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectDateZone(nowDateZone, utcDateArray) {
      this.dataZone = nowDateZone
      this.updateDataByTime(utcDateArray)
    },
    gotoDocument() {
      window.open('#/document', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.statistic-box {
  // background-color: #f0f0f0;
  background-image: linear-gradient(45deg, #efbdfa, #cbe3fd, #f9d9d9);
  .time-zone-selector {
    padding: 20px 10px;
    height: 100%;
    animation-name: fade_in_line;
    animation-duration: var(--animation-during);
    animation-fill-mode: forwards;

    .time-zone-box {
      // padding: 0 0 6px 0;
      background-image: linear-gradient(45deg, #f69494, #e1ff7d, #8cff7d, #8cc0f8, #cb94ff, #f69494);
      background-size: 200%;
      transition: background-position 5s;
      box-shadow: var(--shadow-args);
      border-radius: var(--border-radius-deg);
      animation: move_background;
      animation-timing-function: cubic-bezier(0.62, 0.61, 1, 1);
      animation-duration: 5s;
      animation-iteration-count: infinite;
      animation-play-state: paused;
    }

    .time-zone-box:hover {
      animation-play-state: running;
    }

    .time-zone {
      padding: 6px 0;
      background-color: #ffffff;
      border-radius: var(--border-radius-deg);
      box-shadow: 0px 6px 7px -8px #00000071;
    }
  }

  @keyframes move_background {
    0% {
      background-position: 0%;
    }
    100% {
      background-position: 200%;
    }
  }

  .statistic {
    padding: 20px 20px 0 20px;
    display: flex;
    min-height: calc(100vh - 72px);

    .left-box {
      width: 20%;
      .left-top-box {
        width: 100%;
        height: calc(100% / 3);
      }
      .left-middle-box {
        @extend .left-top-box;
      }
      .left-bottom-box {
        @extend .left-top-box;
      }
    }
    .right-box {
      width: 80%;
      .top-box {
        width: 100%;
        height: calc((100% / 3) * 2);
        display: flex;
        .top-left-map {
          height: 100%;
          width: 70%;
        }
        .top-right-box {
          height: 100%;
          width: 30%;

          .top-right-top-table,
          .top-right-bottom-table {
            width: 100%;
            height: 50%;
            overflow: auto;
            &::-webkit-scrollbar {
              width: 0 !important ;
            }
          }
          .top-right-bottom-table {
            @extend .top-right-top-table;
          }
        }
      }
      .bottom-box {
        width: 100%;
        height: calc(100% / 3);
      }
    }
  }
}
.table-title {
  font-size: var(--max-font-size);
  margin: 20px;
}

.table {
  padding: 20px;
}
.table-box {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  &:first-child {
    margin-bottom: 20px;
  }
}

.statistic-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 30vh);
  grid-auto-flow: column;
  // padding-top:20px;
  // background-color: #f0f0f0;
}

/* .pie2 {
  position: absolute;
  width: 33.3vh;
  height: 33.3vh;
  z-index: 5;
} */

.enlarge-bar1 {
  z-index: 3 !important;
  transform: translate(-200%, 50%) scale(2);
}

.enlarge-bar2 {
  z-index: 3 !important;
  transform: translate(-200%, calc(-50% - 20px)) scale(2);
}

.enlarge-pie2 {
  z-index: 3 !important;
  transform: translate(200%, 50%) scale(2);
}

.enlarge-pie3 {
  z-index: 3 !important;
  transform: translate(200%, calc(-50% - 20px)) scale(2);
}

.enlarge-pie1 {
  z-index: 3 !important;
  transform: translate(200%, calc(-150% - 40px)) scale(2);
}

.enlarge-map1 {
  z-index: 3 !important;
  transform: translate(0px, 40px) scale(1.2);
}

.pie1,
.pie2,
.pie3,
.map1,
.line1,
.bar1,
.bar2 {
  background-color: #fff;
  margin: 10px;
  transition: all ease 0.5s;
}

.map1 {
  grid-column: 2/5;
  grid-row: 1/3;
  animation-name: fade_in_map;
  animation-duration: var(--animation-during);
  animation-fill-mode: backwards;
  z-index: 0;
}

@keyframes fade_in_map {
  0% {
    opacity: 0;
    transform: translate(0, var(--animation-offset));
  }

  100% {
    opacity: 1;
  }
}

.pie1,
.pie2,
.pie3 {
  animation-name: fade_in_pie;
  animation-duration: var(--animation-during);
  animation-delay: 1s;
  animation-fill-mode: backwards;
  z-index: 1;
}

@keyframes fade_in_pie {
  0% {
    opacity: 0;
    transform: translate(-var(--animation-offset), 0);
  }

  100% {
    opacity: 1;
  }
}

.bar1,
.bar2 {
  animation-name: fade_in_bar;
  animation-duration: var(--animation-during);
  animation-delay: 1s;
  animation-fill-mode: backwards;
}

@keyframes fade_in_bar {
  0% {
    opacity: 0;
    transform: translate(var(--animation-offset), 0);
  }

  100% {
    opacity: 1;
  }
}

.line1 {
  grid-column: 2/6;
  animation-name: fade_in_line;
  animation-duration: var(--animation-during);
  animation-delay: 2s;
  animation-fill-mode: backwards;
}

@keyframes fade_in_line {
  0% {
    opacity: 0;
    transform: translate(0, -var(--animation-offset));
  }

  100% {
    opacity: 1;
  }
}

.document-route {
  position: absolute;
  right: 20px;
}

.mask {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #0000005e;
  z-index: 1;
  animation-name: fade_in;
  animation-duration: var(--animation-during);
  animation-fill-mode: backwards;
}

@keyframes fade_in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
