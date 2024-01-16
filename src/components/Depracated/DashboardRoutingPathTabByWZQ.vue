<template>
  <div class="routing-path-container">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputPrefix">
          <template slot="prepend">IP</template>
          <el-button slot="append" icon="el-icon-search" @click="searchPrefix"></el-button>
        </el-input>
      </div>
      <!-- <div style="text-align: left; padding-right: 20px">
        <div>You can input an IP address or the preceding part of an IP address.For example:</div>
        <div>
          1.0.0.1 : The system will return all of the prefixes containing this IP 1.0.* : The system will return all of
          the prefixes containing 1.0.*.*, such as 1.0.1.0, 1.0.128.0, etc.
        </div>
      </div> -->
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
        <div class="chart-box" :style="{ '--chart-box-height': chartBoxHeight }">
          <chart
            ref="sub_graph3"
            class="path-graph"
            chartId="sub_graph3"
            :option="new PrefixGraphOption('AS path').getOption(['title', 'series', 'tooltip'])"
            :series="graphPrefixSeries"
            :extraOption="extraOption"
          ></chart>
        </div>
      </el-col>
    </el-row>
    <!-- <TopoGraph
      type="simple"
      :links="simpleTopoLinks"
      :result="topoResult"
      :inputAsn="param.inputAsn"
      :tier1List="tier1List"
    ></TopoGraph>
    <TopoGraph
      type="full"
      :links="fullTopoLinks"
      :result="topoResult"
      :inputAsn="param.inputAsn"
      :tier1List="tier1List"
      style="margin-bottom: 0px"
    ></TopoGraph> -->
  </div>
</template>

<script>
// import TopoGraph from '@/components/Dashboard/DashboardRoutingPathTabTopoGraph.vue'
// import AsPathByD3 from '@/components/Dashboard/AsPathByD3.vue'
import { getRoutingPath, getAsInfoByList } from '@/api/DashBoardApi'
import { PrefixGraphOption } from '@/templates/chart/graphTemplate'
import { middleFontSize } from '@/styles/font.scss'
const X_INEDX_OFFSET = 100
let Y_INEDX_OFFSET = 40
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[6-9]|2[0-4])$)/
const DEFAULT_POINT_COLOR = '#5470c6'
const MatchAny = '*'
export default {
  name: 'RoutingPathTab',
  created() {},
  data() {
    return {
      PrefixGraphOption,
      fullTopoLinks: [],
      simpleTopoLinks: [],
      topoResult: {},
      chartBoxHeight: '100%',
      chartWidth: 0,
      chartHeight: 0,
      tier1List: [],
      inputPrefix: '59.66.196.0',
      graphPrefixSeries: [],
      prefixData: {},
      prefixList: [],
      prefixLinks: [],
      choosePrefix: '',
      chooseIndex: 0,
      extraOption: {},
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
      searchType: 'prefix',
    }
  },
  components: {
    // TopoGraph,
    // AsPathByD3,
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  watch: {
    param(newV) {
      // this.getGraphData(newV)
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
    this.chartWidth = document.getElementById('sub_graph3').clientWidth
    this.chartHeight = document.getElementById('sub_graph3').clientHeight
    this.$nextTick(() => {
      this.searchPrefix()
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

      // const {layer,links}  = this.prefixData[this.choosePrefix]
      // this.handleGraph(layer,links)
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
      }

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
      this.graphPrefixSeries = [
        {
          name: 'Test',
          data: data,
          links: this.prefixLinks,
          center: [Math.floor(layer.length / 2) * X_INEDX_OFFSET - (layer.length % 2 === 0 ? 50 : 0), 0],
        },
      ]
      this.$refs['sub_graph3'].getChartIntance().resize()
    },
    shapeResultData(resultData) {
      const {
        from: { asns, routes },
      } = resultData
      const newResult = {}
      let newLayer = []
      const newLinks = {}
      const distinctRoute = {}
      Object.keys(routes).forEach(prefix => {
        const distinctKey = JSON.stringify(routes[prefix])
        if (distinctRoute[distinctKey]) {
          const oldKey = distinctRoute[distinctKey]
          const staticData = Object.assign({}, newResult[oldKey])
          const key = distinctRoute[distinctKey] + `_${prefix}`
          newResult[key] = staticData
          distinctRoute[distinctKey] = key
          delete newResult[oldKey]
          return
        }
        distinctRoute[distinctKey] = prefix
        newResult[prefix] = {}
        const layer = Array(routes[prefix].length + 1)
        const links = routes[prefix].map((link, index) => {
          const source = link[0]
          const target = link[1]
          if (!layer[index]) {
            layer[index] = []
          }
          layer[index].push(source)
          if (!layer[index + 1]) {
            layer[index + 1] = []
          }
          layer[index + 1].push(target)
          return {
            source,
            target,
          }
        })
        newResult[prefix].layer = layer
        newResult[prefix].links = links
      })
      Object.values(newResult).forEach(({ layer, links }) => {
        layer.forEach((l, index) => {
          if (!newLayer[index]) {
            newLayer[index] = new Set()
          }
          l.forEach(item => {
            newLayer[index].add(item)
          })
        })
        links.forEach(link => {
          newLinks[JSON.stringify(link)] = link
        })
      })

      newLayer = newLayer.map(layer => {
        return Array.from(layer)
      })
      return {
        result: newResult,
        layer: newLayer,
        links: Object.values(newLinks),
      }
      // console.log(newLayer, Object.values(newLinks), newResult)
    },
    async searchPrefix() {
      if (!IP_REGEX.test(this.inputPrefix)) {
        this.$messageBox({
          message: `IP invalid`,
          type: 'warning',
          duration: 2 * 1000,
        })
        return
      }
      const inpit_list = this.inputPrefix.split('/')
      if (inpit_list[1]) {
        if (inpit_list[1] < 8) {
          this.$messageBox({
            message: `Please input prefix length between 8 and 24`,
            type: 'warning',
            duration: 2 * 1000,
          })
          return
        }
      }
      this.graphPrefixSeries = []
      this.choosePrefix = ''
      const resultData = await getRoutingPath(this.param.inputAsn, this.inputPrefix)
      const { result, layer, links } = this.shapeResultData(resultData)
      this.prefixList = Object.keys(result).map(prefixs => {
        // 5678956789defdef
        const staticColor = ['5', '6', '7', '8', '9', '5', '6', '7', '8', '9', 'd', 'e', 'd', 'e', 'f']
        const color =
          '#' +
          [0, 0, 0, 0, 0, 0]
            .map(() => {
              return staticColor[Math.floor(Math.random() * 15)]
            })
            .join('')
        return {
          prefixs,
          color: color,
        }
      })
      this.prefixData = result
      if (this.prefixList.length === 0) {
        this.$messageBox({
          message: `Not found data for ${this.inputPrefix}`,
          type: 'warning',
          duration: 5 * 1000,
        })
        return
      }
      this.handleGraph(layer)
      this.choosePrefix = this.prefixList[0].prefixs
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
    async getProviderGraph(inputAsn) {
      const { sub_link, link, tier1List, result } = await getAsRoute(inputAsn, 'provider')
      const fullLink = sub_link.concat(link)
      this.topoResult = result
      this.tier1List = tier1List
      this.fullTopoLinks = fullLink
      this.simpleTopoLinks = link
    },

    getGraphData({ inputAsn }) {
      this.getProviderGraph(inputAsn)
    },
  },
}
</script>

<style lang="scss" scoped>
.routing-path-container {
  // padding-top:20px;
  background-color: #f0f0f0;
  height: 100%;
}

.prefix-input {
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-col,
.part {
  background-color: #fff;
  height: calc(80vh - 44px);
  overflow-y: scroll;
}

.graph {
  height: calc(80vh - 44px);
}

.prefixTab {
  font-weight: bold;
  padding: 10px 0;
  width: 100%;
  background: var(--bgcolor);
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
  height: calc(80vh - 44px);
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

.d3-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 0 50px;
}

.prefix-item {
  height: 30px;
  line-height: 30px;
}

.selectStyle {
  width: 120px;
}
.dot {
  font-size: var(--max-font-size);
  line-height: 0px;
}

.path-graph {
  overflow-y: scroll;
}

.chart-box {
  height: var(--chart-box-height);
  width: 100%;
}
</style>
