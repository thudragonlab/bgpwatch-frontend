<template>
  <div class="dashboard-container">
    <div class="cone">
      <div class="selector-box">
        <div class="selector-box-suffix">
          <div>Selector</div>
        </div>
        <el-cascader
          class="selector"
          placeholder="country/region"
          :options="options"
          filterable
          v-model="selectedOption"
          @change="DoSelect"
          :show-all-levels="false"
        >
        </el-cascader>
      </div>
      <el-input
        placeholder="eg:[10,) search cone; 4538 search asn"
        style="width: 500px"
        v-model="searchInput"
        clearable
      >
        <template slot="prepend">
          <div class="switch-box">
            <span style="padding-left: 10px">Search By cone</span>
          </div>
        </template>
        <el-button slot="append" icon="el-icon-search" @click="searchAsnInTOPO"></el-button>
      </el-input>
    </div>
    <div class="grid-box">
      <div class="topo-graph" v-loading="showLoading">
        <div class="as-statistic">
          <span>AS in the region:{{ AsAmount }}</span>
          <br />
          <span>AS in the graph:{{ AsAmountOnGraph }}</span>
          <br />
          <span>Link in the region:{{ LinkAmount }}</span>
          <br />
          <span>Link in the graph:{{ LinkAmountOnGraph }}</span>
        </div>
        <chart
          class="graph"
          :chartId="`line_123`"
          height="100vh"
          :option="
            new GraphOption(
              filterDataMethod !== 'searchByAsn'
                ? `AsRank topo of ${code_country[selectedCC.toUpperCase()]}\n${lastUpdateTimestamp}`
                : `Nodes within two hops of ${searchASN}`,
              topCone[0] ? topCone[0][1] : 10,
              addZoom,
              reduceZoom
            ).getOption(['title', 'tooltip', 'visualMap', 'legend', 'toolbox'])
          "
          :series="graphSerise"
        ></chart>
      </div>
      <div class="top-cone-as">
        <div class="top-cone-as-title">Top {{ topAsLenght }} AS By cone</div>
        <div
          :class="[
            'top-cone-as-as-code',
            clickIndex !== index ? 'top-cone-as-as-code-unclick' : 'top-cone-as-as-code-click',
          ]"
          v-for="(asItem, index) in topCone"
          :key="index"
          @click="pullOn"
          :data-index="index"
        >
          AS{{ asItem[0] }}
          <div class="top-cone-as-as-code2" :data-index="index">
            {{ asInfoMap[asItem[0]] ? asInfoMap[asItem[0]].name : '' }}
          </div>
          <div class="top-cone-as-as-code2" :data-index="index">cone:{{ asItem[1] }}</div>
        </div>

        <!-- <div :class="['top-cone-as-as']">
          

          
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const ZOOM_OFFSET = 0.1
const DEFAULT_AS_COUNT = 100
const TIMEOUT_DELAY = 100
// import heatMapDataAvg from '@/../public/static/temporaryData/3.json'
import { getResilienceByccCode } from '@/api/ResilienceApi'
import { getAsInfoByList } from '@/api/DashBoardApi'
import continent2ccMap from '@/../public/static/continent2ccMap.json'
import code_country from '@/../public/static/code_country.json'
import { ResilienceLineOption } from '@/templates/chart/lineTemplate'
import {
  ResilienceGraphOption,
  customerSoftColor,
  customerDeepColor,
  findPoint,
  calPointIndex,
  renderPointInSeries,
} from '@/templates/chart/graphTemplate'

export default {
  name: 'Resilience',
  created() {},
  data() {
    return {
      LineOption: ResilienceLineOption,
      GraphOption: ResilienceGraphOption,
      code_country,
      selectedOption: ['EU', 'AT'],
      topAsLenght: 10,
      lastUpdateTimestamp: '',
      // initGraph: true,
      asInfoMap: {},
      useCone: true,
      showLoading: true,
      filterDataMethod: 'searchByAsn',
      searchASN: '',
      searchInput: '',
      selectedCC: 'AT',
      graphLink: [],
      graphSerise: [],
      options: [],
      graphDataCone: {},
      maxCount: 15,
      clickIndex: -1,
      AsAmount: 0,
      LinkAmount: 0,
      AsAmountOnGraph: 0,
      LinkAmountOnGraph: 0,
      continentMapping: {
        Other: 'Other',
        AF: 'Africa',
        AS: 'Asia',
        EU: 'Europe',
        NA: 'North America',
        OA: 'Oceania',
        SA: 'South America',
        AN: 'Antarctica',
      },
      zoom: 0,
      minZoom: 0.5,
      maxZoom: 2,
      topCone: [],
    }
  },
  props: {},
  mounted() {
    // Make Country/region options
    const options = {}
    Object.keys(code_country).forEach(i => {
      const o = {}
      const continentCode = continent2ccMap[i] || 'Other'
      if (!options[continentCode]) {
        options[continentCode] = {
          value: continentCode,
          label: this.continentMapping[continentCode],
          children: [],
        }
      }
      o['value'] = i
      o['label'] = code_country[i]
      options[continentCode]['children'].push(o)
    })
    this.options = Object.values(options)

    // init Data
    this.zoom = this.minZoom
    this.ImportDataFor(this.selectedCC).catch(e => console.error(e))
    this.showLoading = false
  },
  methods: {
    findPoint,
    calPointIndex,
    renderPointInSeries,
    addZoom() {
      this.setSeriesZoom(this.zoom + ZOOM_OFFSET)
    },
    reduceZoom() {
      this.setSeriesZoom(this.zoom - ZOOM_OFFSET)
    },
    setSeriesZoom(zoom) {
      zoom = zoom < this.minZoom ? this.minZoom : zoom
      zoom = zoom > this.maxZoom ? this.maxZoom : zoom
      this.zoom = zoom
      this.graphSerise = [
        {
          zoom,
          data: this.graphSerise[0].data,
          links: this.graphSerise[0].links,
        },
      ]
    },
    showNodeSortByCone() {
      const top100Data = Object.entries(this.graphDataCone)
        .sort((a, b) => b[1] - a[1])
        .slice(0, DEFAULT_AS_COUNT)
      this.updateSeries(top100Data.map(kv => kv[0]))
    },
    searchByCone() {
      const regex = /^(\[|\()(\d+|),(\d+|)(\]|\))/
      const regexResult = this.searchInput.match(regex)
      let points = Object.keys(this.graphDataCone)
      if (regexResult[2]) {
        if (regexResult[1] === '(') {
          points = points.filter(key => this.graphDataCone[key] > regexResult[2])
        } else if (regexResult[1] === '[') {
          points = points.filter(key => this.graphDataCone[key] >= regexResult[2])
        }
      }

      if (regexResult[3]) {
        if (regexResult[4] === ')') {
          points = points.filter(key => this.graphDataCone[key] < regexResult[3])
        } else if (regexResult[4] === ']') {
          points = points.filter(key => this.graphDataCone[key] <= regexResult[3])
        }
      }

      this.updateSeries(points)
    },
    searchByAsn() {
      const findIndex = this.graphLink.findIndex(
        links => links.target === this.searchASN || links.source === this.searchASN
      )
      if (findIndex === -1) {
        // console.log(this.graphDataCone[this.searchASN])
        if (!this.graphDataCone[this.searchASN]) {
          this.$message({
            message: `Not Found As ${this.searchASN}`,
            type: 'error',
            duration: 1 * 1000,
          })
          this.showLoading = false
          return
        }
        this.searchInput = this.searchASN
        if (this.graphSerise[0]) {
          this.updateSeries(this.graphSerise[0].data.map(item => item.name).concat([this.searchASN]), this.searchASN)
        } else {
          this.updateSeries([this.searchASN], this.searchASN)
        }
        return
      }
      const node = this.findPoint(
        2,
        this.searchASN,
        this.graphLink.sort((a, b) => {
          return (
            Math.min(a.source - this.searchASN, a.target - this.searchASN) -
            Math.min(b.source - this.searchASN, b.target - this.searchASN)
          )
        }),
        this.graphDataCone,
        this.maxCount
      ).concat([this.searchASN])
      this.searchInput = this.searchASN

      this.updateSeries(node, this.searchASN)
    },
    searchAsnInTOPO() {
      this.showLoading = true
      this.clickIndex = -1
      const regex = /^(\[|\()(\d+|),(\d+|)(\]|\))/
      const regexResult = this.searchInput.match(regex)
      const numberRegex = /\d+/
      const regexNUmberResult = this.searchInput.match(numberRegex)
      if (regexResult) {
        this.filterDataMethod = 'searchByCone'
      } else if (regexNUmberResult) {
        this.searchASN = this.searchInput
        this.filterDataMethod = 'searchByAsn'
      } else {
        this.$message({
          message: `Expression format Error`,
          type: 'error',
          duration: 1 * 1000,
        })
        this.showLoading = false
        return
      }
      setTimeout(() => {
        this[this.filterDataMethod]()
      }, TIMEOUT_DELAY)
    },

    initLinks() {
      const allLinks = this.graphSourceData.peer
        .map(relation => {
          return {
            source: relation[0],
            target: relation[1],
            type: 'P2P',
            lineStyle: {
              color: customerSoftColor,
            },
          }
        })
        .concat(
          this.graphSourceData.customer.map(relation => {
            return {
              source: relation[0],
              target: relation[1],
              type: 'P2C',
              symbol: ['', 'arrow'],
              lineStyle: {
                color: customerDeepColor,
              },
            }
          })
        )
      this.graphLink = allLinks
      this.LinkAmount = allLinks.length
    },
    initConeMap() {
      this.graphLink
        .map(link => {
          return [link.source, link.target]
        })
        .flat()
        .forEach(AS => {
          if (!this.graphDataCone[AS]) {
            this.graphDataCone[AS] = 1
          }
        })
    },
    initTopCone() {
      this.topCone = Object.entries(this.graphDataCone)
        .sort((a, b) => b[1] - a[1])
        .slice(0, this.topAsLenght)
    },

    updateSeries(data, targetPoint) {
      data = Array.from(new Set(data))
      if (data.length > 1000) {
        this.$alert(
          `There are too many points(${data.length} points)
        ,Please change search condition!(less 1000)`,
          {
            confirmButtonText: 'OK',
            type: 'warn',
          }
        )
        this.searchInput = ''
        return
      }
      const SeriesData = this.calPointIndex(data, this.graphDataCone, targetPoint)

      let matchCount = 0
      const finalData = SeriesData.map(item => {
        item.asName = this.asInfoMap[item.name] ? this.asInfoMap[item.name].name || 'Unknown' : 'Unknown'
        if (matchCount != this.topAsLenght) {
          const tcIndex = this.topCone.findIndex(tc => tc[0] === item.name)
          if (tcIndex !== -1) {
            matchCount += 1
            item.symbolSize = 12 + (this.topAsLenght - tcIndex) * 2
          }
        }
        return item
      })

      const showingPoint = finalData.map(point => point.name)
      const finalLinks = this.graphLink.filter(
        links => showingPoint.includes(links.source) && showingPoint.includes(links.target)
      )
      this.AsAmountOnGraph = finalData.length
      this.LinkAmountOnGraph = finalLinks.length
      const series = new ResilienceGraphOption('').getSeries()[0]
      this.graphSerise = [
        Object.assign(
          {
            data: finalData,
            links: finalLinks,
          },
          series
        ),
      ]
      this.showLoading = false
    },
    switchChart(cc) {
      this.selectedCC = cc
      this.ImportDataFor(this.selectedCC)
    },
    async ImportDataFor(cc) {
      this.showLoading = true
      const { cone, graph_data } = await getResilienceByccCode(cc)
      if (graph_data['customer'].length === 0 && graph_data['peer'].length === 0) {
        this.$alert(`${code_country[cc]}(${cc}) No Data!`)
        this.showLoading = false
        return
      }

      this.searchInput = ''
      this.graphLink = []
      this.clickIndex = -1

      const asInfoMap = await getAsInfoByList(Object.keys(cone))
      this.asInfoMap = asInfoMap
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      this.graphDataCone = cone
      this.graphSourceData = graph_data

      this.initLinks()
      this.initConeMap()
      this.initTopCone()

      this.AsAmount = Object.keys(this.graphDataCone).length

      this.switchMethodByClickIndex()

      setTimeout(() => {
        this[this.filterDataMethod]()
      }, TIMEOUT_DELAY)

      // if (this.initGraph) {
      //   this.initGraph = false
      // }
    },

    DoSelect() {
      if (this.selectedOption[1]) {
        this.showLoading = true
        this.switchChart(this.selectedOption[1])
      } else {
        this.$alert('Please choose country!')
        this.showLoading = false
      }
    },

    switchMethodByClickIndex() {
      if (this.clickIndex !== -1) {
        this.searchASN = this.topCone[this.clickIndex][0]
        this.filterDataMethod = 'searchByAsn'
      } else {
        this.filterDataMethod = 'showNodeSortByCone'
      }
    },
    pullOn(e) {
      this.showLoading = true
      this.searchInput = ''
      const index = parseInt(e.target.dataset.index)

      if (this.clickIndex !== index) {
        this.clickIndex = index
      } else {
        this.clickIndex = -1
      }

      this.switchMethodByClickIndex()

      setTimeout(() => {
        this[this.filterDataMethod]()
        this.showLoading = false
      }, TIMEOUT_DELAY)
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: var(--max-font-size);
  background-color: #fff;
  border-radius: 10px;
}

.dashboard-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
}

.cc_row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 10px;
  overflow: auto;
}

.cc_row2 {
  margin-left: 0 !important;
  margin-right: 0 !important;
  background-color: #fff;
  border-radius: 10px;

  overflow: auto;
}

.show-cc-row {
  animation-name: show-cc-fade-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  margin-bottom: 0px;
}

.hidden-cc-row {
  animation-name: hidden-cc-fade-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes show-cc-fade-in {
  0% {
    opacity: 0;
    height: 0px;
  }

  100% {
    opacity: 1;
    height: 50px;
    margin-bottom: 20px;
  }
}

@keyframes hidden-cc-fade-in {
  0% {
    height: 50px;
  }

  100% {
    height: 0px;
    margin: 0;
  }
}

.cc,
.cn {
  margin: 10px 0;
  color: #fff;
  font-weight: bold;
  background-image: linear-gradient(to right, #7f5ac3, #af86d8);
  // width: 80%;
  width: 50px;
  padding: 0 15px;
  margin: 0 10px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  box-shadow: 5px 4px 13px -7px #000;
  cursor: pointer;
}

.cn {
  width: 20000px;
}

.cc:hover,
.cn:hover {
  opacity: 0.8;
}
.cc:focus,
.cc:active,
.cn:focus,
.cn:active {
  box-shadow: -2px 4px 11px -7px #000 inset;
  // color:red
}
.line,
.graph {
  background-color: #fff;
  // border-radius: 10px;
}

.show-row {
  animation-name: fade-in;
  animation-duration: 0.5s;
}

.show-line-chart {
  animation-name: fade-in;
  animation-duration: 1s;
}

.switch-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cone {
  transition: all 0.5;
  text-align: left;
  z-index: 2;
  background-color: #fff;
  animation-name: fade-in;
  animation-duration: 1s;
  display: flex;
  justify-content: space-between;
}
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translate(0, 10px);
  }

  100% {
    opacity: 1;
  }
}

.as-statistic {
  position: absolute;
  margin-top: 20px;
  z-index: 2;
  font-size: var(--middle-font-size);
  text-align: left;
  font-weight: bold;
  padding: 5px;
}

.grid-box {
  display: grid;
  column-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding-top: 20px;
  background-color: #f0f0f0;
  height: 100vh;
}

.topo-graph {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
}

.top-cone-as {
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 4;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
}

.top-cone-as-title {
  font-size: var(--subTitle-font-size);
  font-weight: bold;
  padding-bottom: 20px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.top-cone-as-as-code {
  color: #fff;
  margin-bottom: 10px;
  width: 80%;
  font-size: var(--subTitle-font-size);
  font-weight: bold;
  border-radius: var(--border-radius-deg);

  line-height: 30px;
  box-shadow: 5px 4px 13px -7px #000;
}

.top-cone-as-as-code-click {
  background-image: linear-gradient(to right, #ee8b76, #e29a8b);
}

.top-cone-as-as-code-click:hover {
  background-image: linear-gradient(to right, #ee8b76e8, #e29a8be8);
  cursor: pointer;
}
.top-cone-as-as-code-unclick {
  background-image: linear-gradient(to right, #7f5ac3, #af86d8);
}

.top-cone-as-as-code-unclick:hover {
  background-image: linear-gradient(to right, #7f5ac3e8, #af86d8e8);
  cursor: pointer;
}

.top-cone-as-as-code:active {
  box-shadow: 5px 4px 13px -7px #000 inset;
  text-shadow: 2px 2px 0px #000000;
}
.top-cone-as-as-code2 {
  font-size: var(--min-font-size);
  font-weight: bold;
  height: 10px;
  line-height: 10px;
  padding-bottom: 5px;
}

.selector-box {
  display: flex;
}
.selector-box-suffix {
  width: 70px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-right: 0;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  color: #909399;
}
</style>

<style>
.selector .el-input__inner {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
