<template>
  <div class="routing-path-container">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputPrefix">
          <template slot="prepend">IP</template>
          <el-button slot="append" icon="el-icon-search" @click="searchPrefix"></el-button>
        </el-input>
      </div>
      <div style="text-align: left; padding-right: 20px">
        <div>You can input an IP address or prefix address. For example:</div>
        <div>1.0.0.0/16, 2001:200::/32. The system will return all the subset and superset network of it.</div>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6" class="prefix-box">
        <div
          :class="['prefixTab', index == chooseIndex ? 'clickPrefix' : '']"
          v-for="(prefixsItem, index) in prefixList"
          :style="{
            '--bgcolor': `${index == chooseIndex ? prefixsItem.color : prefixsItem.color + '30'}`,
          }"
          :key="index"
        >
          <div
            class="prefix-item"
            v-for="(prefix, idx) in prefixsItem.prefixs.split('_')"
            :key="idx"
            @click="switchPrefixTab"
            :data-prefix="prefixsItem.prefixs"
            :data-prefix2="prefix"
            :data-index="index"
          >
            {{ prefix }}
          </div>
        </div>
      </el-col>
      <el-col :span="18" class="chart-col">
        <div class="prefix-total">
          <div class="prefix-count">{{ prefixTotal }}</div>
          <div>Prefix Total</div>
        </div>
        <div class="chart-box" :style="{ '--chart-box-height': chartBoxHeight }">
          <!-- {{ lastUpdateTimestamp }} -->
          <chart
            ref="sub_graph2"
            class="path-graph"
            chartId="sub_graph2"
            :option="new PrefixGraphOption(`AS path\n${lastUpdateTimestamp}`).getOption(['title', 'series', 'tooltip'])"
            :series="graphPrefixSeries"
            :extraOption="extraOption"
          ></chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import chart from '@/components/Depracated/Chart.vue'
import { getAsRoute, getPrefixTotalByAsn, getAsPathByPrefix, getAsInfoByList } from '@/api/DashBoardApi'
import { PrefixGraphOption } from '@/templates/chart/graphTemplate'
import { middleFontSize } from '@/styles/font.scss'
const X_INEDX_OFFSET = 100 // 7
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[0-9]|[1-9]|2[0-4])$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
const DEFAULT_POINT_COLOR = '#5470c6'
export default {
  name: 'RoutingPathTab',
  created() {},
  data() {
    return {
      PrefixGraphOption,
      lastUpdateTimestamp: '',
      fullTopoLinks: [],
      simpleTopoLinks: [],
      topoResult: {},
      tier1List: [],
      inputPrefix: '165.124.0.0/16',
      graphPrefixSeries: [],
      windowWidth: document.documentElement.clientWidth,
      prefixData: {},
      prefixMap: {},
      prefixList: [],
      prefixLinks: [],
      chartBoxHeight: '100%',
      choosePrefix: '',
      chooseIndex: 0,
      extraOption: {},
      prefixTotal: 0,
      options: [
        {
          value: 'prefix',
          label: 'Prefix',
        },
        {
          value: 'ip',
          label: 'IP',
        },
      ],
    }
  },
  components: {
    // MyChart: chart,
    // AsPathByD3,
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      },
    },
    inputAsn: {
      type: String,
      default: '',
    },
  },
  watch: {
    param(newV) {
      // console.log('!!!!!!!', this.$parent.$parent.$parent.$parent.DashboardActiveName)
      this.inputPrefix = '165.124.0.0/16'
      this.prefixList = []
      this.prefixLinks = []
      this.graphPrefixSeries = []
      if (this.$parent.$parent.$parent.$parent.DashboardActiveName === 'Routing Path') {
        this.getPrefixTotalByAsn().catch(e => console.error(e))
        this.searchPrefix().catch(e => console.error(e))
      }
    },
    inputAsn() {
      this.getPrefixTotalByAsn()
      this.searchPrefix()
    },
    choosePrefix(newPrefix, oldPrefx) {
      if (!newPrefix) {
        return
      }
      const newSeries = this.graphPrefixSeries[0]
      if (!newSeries || !newSeries.links) {
        return
      }
      const { links, data } = newSeries
      if (oldPrefx) {
        this.prefixData[oldPrefx].recordPointIndex.forEach(pointIndex => {
          data[pointIndex].itemStyle.color = DEFAULT_POINT_COLOR
        })

        this.prefixData[oldPrefx].recordLinkIndex.forEach(index => {
          links[index].lineStyle.color.colorStops.forEach(colorPart => {
            if (colorPart.color.length <= 7 && colorPart.offset >= 0.9 && colorPart.offset <= 1) {
              colorPart.color += '30'
              colorPart.offset -= 0.9
              colorPart.offset *= 10
            }
          })
          links[index].lineStyle.color.colorStops.shift()
          // console.log('old', links[index].lineStyle.color)
        })
      }
      const color = this.prefixMap[newPrefix].color

      this.prefixData[newPrefix].recordPointIndex.forEach(pointIndex => {
        data[pointIndex].itemStyle.color = color
      })

      // console.log(this.prefixMap)
      this.prefixData[newPrefix].recordLinkIndex.forEach(index => {
        // console.log(links[index].lineStyle.color.colorStops)
        links[index].lineStyle.color.colorStops.forEach(colorPart => {
          if (colorPart.color.length > 7 && colorPart.offset < 1) {
            colorPart.color = colorPart.color.slice(0, colorPart.color.length - 2)
            colorPart.offset /= 10
            colorPart.offset += 0.9
          }
        })
        links[index].lineStyle.color.colorStops.unshift({
          offset: 0.9,
          color: color,
        })
        // console.log('new', links[index].lineStyle.color)
      })
      this.graphPrefixSeries = [newSeries]
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartWidth = document.getElementById('sub_graph2').clientWidth
      this.chartHeight = document.getElementById('sub_graph2').clientHeight
      this.searchPrefix()
      this.getPrefixTotalByAsn()
    })
  },
  methods: {
    switchPrefixTab(e) {
      this.choosePrefix = e.target.dataset.prefix
      this.chooseIndex = e.target.dataset.index
      this.extraOption = {
        title: {
          left: 'center',
          text: `${e.target.dataset.prefix2 || e.target.dataset.prefix.split('_')[0]} AS PATH`,
          textStyle: {
            color: '#000',
            fontSize: middleFontSize,
          },
        },
      }
    },
    handleLinks() {
      const willReturnLinks = []
      this.prefixList.forEach(prefixItem => {
        const { links } = this.prefixData[prefixItem.prefixs]
        this.prefixData[prefixItem.prefixs].recordLinkIndex = []
        links.forEach(link => {
          link.prefixList = []
          const existIndex = willReturnLinks.findIndex(
            existLink => existLink.target === link.target && existLink.source === link.source
          )
          if (existIndex === -1) {
            link.prefixList.push(prefixItem)
            willReturnLinks.push(link)
            this.prefixData[prefixItem.prefixs].recordLinkIndex.push(willReturnLinks.length - 1)
          } else {
            willReturnLinks[existIndex].prefixList.push(prefixItem)
            this.prefixData[prefixItem.prefixs].recordLinkIndex.push(existIndex)
          }
        })
      })
      willReturnLinks.forEach(link => {
        let width = 0
        const colorStops = []
        const perPercent = 1 / link.prefixList.length
        link.prefixList.forEach((prefixItem, index) => {
          width += prefixItem.prefixs.split('_').length
          colorStops.push({
            offset: perPercent * index,
            color: prefixItem.color + '30',
          })
        })
        width = width >= 10 ? 10 : width
        link.lineStyle = {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops,
            global: false, // 缺省为 false
          },
          width: width === 1 ? 2 : width,
        }
        // console.log(link.target,link.source,link.symbolSize)
      })
      return willReturnLinks
    },
    async handleGraph(layer) {
      const dataObj = {}
      const data = []
      let index = 0
      let maxLength = -1
      let maxY = -1
      let maxX = -1
      let Y_INEDX_OFFSET = 40 // 3
      // X_INEDX_OFFSET = X_INEDX_OFFSET * (layer.length / 6)
      Y_INEDX_OFFSET = Y_INEDX_OFFSET * (layer.length / 6)
      // console.log(Y_INEDX_OFFSET, X_INEDX_OFFSET)
      layer.forEach((pointList, layerIndex) => {
        const x = layerIndex * X_INEDX_OFFSET
        let isNegative = false
        if (maxLength < pointList.length) {
          maxLength = pointList.length
        }
        pointList.forEach((point, pointIndex) => {
          if (pointList.length > 1 && pointList.length % 2 === 0) {
            pointIndex += 1
          }
          const yIndex = Math.ceil(pointIndex / 2)
          let y = yIndex * Y_INEDX_OFFSET
          if (isNegative) {
            y = -y
          }
          isNegative = !isNegative
          if (maxY < y) {
            maxY = y
          }
          if (maxX < x) {
            maxX = x
          }

          // if (minY > y) {
          //   minY = y
          // }
          dataObj[point] = {
            name: point,
            x,
            y,
            index,
            itemStyle: {
              color: DEFAULT_POINT_COLOR,
            },
          }
          data.push(dataObj[point])
          index += 1
        })
      })

      if (maxLength % 2 === 0) {
        maxLength += 1
      }
      // const realHeight = 375 * layer.length - maxLength * 733 - 1641
      // ( + 10 * maxLength)
      const real = (this.chartWidth / maxX) * maxY
      if (real * 2 > this.chartHeight) {
        this.chartBoxHeight = `${real * 2}px`
      } else {
        this.chartBoxHeight = `100%`
      }

      // console.log(real, this.chartHeight, maxY, this.chartWidth, maxX)

      const asNameInfoMap = await getAsInfoByList(Object.keys(dataObj))

      Object.keys(this.prefixData).forEach(key => {
        this.prefixData[key].recordPointIndex = []
        this.prefixData[key].layer.forEach(point => {
          dataObj[point].asName = asNameInfoMap[point] ? asNameInfoMap[point].name : 'Unknown'
          dataObj[point].org = asNameInfoMap[point] ? asNameInfoMap[point].org : 'Unknown'
          dataObj[point].country = asNameInfoMap[point] ? asNameInfoMap[point].country : 'Unknown'
          this.prefixData[key].recordPointIndex.push(dataObj[point].index)
        })
      })
      this.prefixLinks = this.handleLinks()
      this.choosePrefix = this.prefixList[0].prefixs
      this.chooseIndex = 0
      // console.log(this.windowWidth)
      this.graphPrefixSeries = [
        {
          name: 'Test',
          data: data,
          links: this.prefixLinks,
          center: [Math.floor(layer.length / 2) * X_INEDX_OFFSET - (layer.length % 2 === 0 ? 50 : 0), 0],
          width: 1.01 * this.windowWidth - 300,
        },
      ]
      if (this.$refs['sub_graph2'].getChartIntance) {
        this.$refs['sub_graph2'].getChartIntance().resize()
      }
    },
    async getPrefixTotalByAsn() {
      const { total } = await getPrefixTotalByAsn(this.inputAsn)

      this.prefixTotal = total
    },
    getRandomColor() {
      const staticColor = ['2', '3', '4', '2', '3', '4', 'a', 'b', 'c', 'a', 'b', 'c']
      return (
        '#' +
        [0, 0, 0, 0, 0, 0]
          .map(() => {
            return staticColor[Math.floor(Math.random() * 12)]
          })
          .join('')
      )
    },
    async searchPrefix() {
      if (!IP_REGEX.test(this.inputPrefix)) {
        this.$messageBox(`IP invalid`)
        return
      }
      const inpit_list = this.inputPrefix.split('/')
      if (inpit_list[1]) {
        if (inpit_list[1] < 16) {
          this.$messageBox(`Please input prefix length between 16 and 24`)
          return
        }
      }
      // this.showPrefixChart = true
      this.graphPrefixSeries = []
      this.choosePrefix = ''
      // console.log(this.inputPrefix.includes(':') ? 'v6' : 'v4')
      const resultData = await getAsPathByPrefix(
        inpit_list.length !== 2 ? this.inputPrefix + '/32' : this.inputPrefix,
        this.inputAsn,
        this.inputPrefix.includes(':') ? 'v6' : 'v4'
      )
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      const { result, layer, links } = resultData
      this.prefixList = Object.keys(result).map(prefixs => {
        // const staticColor = ['2', '3', '4', '2', '3', '4', 'a', 'b', 'c', 'a', 'b', 'c']
        const color = this.getRandomColor()
        // '#' +
        // [0, 0, 0, 0, 0, 0]
        //   .map(() => {
        //     return staticColor[Math.floor(Math.random() * 12)]
        //   })
        //   .join('')
        const obj = {
          prefixs,
          color: color,
        }
        this.prefixMap[prefixs] = obj
        return obj
      })
      this.prefixData = result
      if (this.prefixList.length === 0) {
        this.$messageBox(`Not found data for ${this.inputPrefix}`)
        return
      }
      this.handleGraph(layer).catch(e => console.error(e))
      this.extraOption = {
        title: {
          left: 'center',
          text: `${this.choosePrefix.split('_')[0]} AS PATH`,
          textStyle: {
            color: '#000',
            fontSize: middleFontSize,
          },
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  display: none;
}
.routing-path-container {
  // padding-top:20px;
  background-color: #f0f0f0;
  // height: 100%;
}

.prefix-input {
  width: 100%;
  padding: 0px 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-col {
  background-color: #fff;
  height: 80vh;
  overflow-y: scroll;
}

.prefixTab {
  font-weight: bold;
  padding: 0px 0px 10px 0;
  width: 100%;
  transition: all 0.2s linear;
  background-color: var(--bgcolor);
  cursor: pointer;
}

.prefixTab:hover {
  opacity: 0.8;
}

.prefix-box {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  background: #fff;
  margin-right: 10px;
  overflow: auto;
}

.d3-title {
  text-align: center;
  font-size: var(--subTitle-font-size);
  font-weight: bold;
}

.clickPrefix {
  // background-image: linear-gradient(to right, #7f5ac3, #af86d8);
  color: #fff;
  border-width: 0;
}

.even {
  background-color: #f9efff;
}

.singular {
  background-color: #f3e1ff;
}

// .d3-box {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   // padding: 0 50px;
// }

.prefix-item {
  height: 30px;
  line-height: 30px;
}

.selectStyle {
  width: 120px;
}

.prefix-total {
  z-index: 1;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  font-size: var(--middle-font-size);
  font-weight: bold;
  // border: 1px solid #7f5ac3;
  color: #7f5ac3;
  border-radius: 20px;
}
.prefix-count {
  font-size: var(--subTitle-font-size);
}

.path-graph {
  overflow-y: scroll;
}

.chart-box {
  height: var(--chart-box-height);
  width: 100%;
}
</style>
