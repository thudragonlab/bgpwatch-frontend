<template>
  <div class="routing-path-container">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputASN">
          <template slot="prepend">ASN</template>
          <el-button slot="append" icon="el-icon-search" @click="searchASN"></el-button>
        </el-input>
      </div>
      <div style="text-align: left; padding-right: 20px">
        <div>
          This page clusters the reverse routing paths of the AS based on the clustering algorithm, and analyzes which
          peers your own IP passes through to receive traffic.
        </div>
        <div>
          This function can help AS analyze the importance of the peers to itself, analyze whether the routing path is
          consistent with the policy.
        </div>
      </div>
    </div>
    <el-row class="cluster-row">
      <div class="super-box" :style="{ '--width': showPrefixList ? fullWidth : firstColWidth }">
        <div class="cluster-box" :style="{ '--width': firstColWidth }">
          <div :class="['prefixTab']" v-for="(prefixsItem, index) in clusterList" :key="index">
            <div class="prefix-box">
              <div
                :class="['prefix-item', index == chooseIndex ? 'clickPrefix' : '']"
                :style="{
                  '--bgcolor': `${index == chooseIndex ? prefixsItem.color : prefixsItem.color + '30'}`,
                }"
                @click="switchPrefixTab"
                :data-index="index"
              >
                {{ prefixsItem.name
                }}{{ `(${prefixsItem ? (prefixsItem.prefix_list ? prefixsItem.prefix_list.length : 0) : ''} prefix)` }}
              </div>
              <div
                v-if="index == chooseIndex && !showPrefixList"
                class="prefix-item-open"
                @click="OpenPrefixList"
              ></div>
              <div
                v-if="index == chooseIndex && showPrefixList"
                class="prefix-item-close"
                :style="{
                  '--bgcolor': `${index == chooseIndex ? prefixsItem.color : prefixsItem.color + '30'}`,
                }"
                @click="ClosePrefixList"
              ></div>
            </div>
          </div>
        </div>
        <div class="prefix-list-box" :style="{ '--width': showPrefixList ? secondColWidth : '0px' }">
          <div
            :class="['prefixTab', 'clickPrefix']"
            v-for="(prefix, idx) in clusterList[chooseIndex] ? clusterList[chooseIndex].prefix_list : []"
            :style="{
              '--bgcolor': `${clusterList[chooseIndex].color}`,
            }"
            :key="idx"
          >
            <div class="prefix-item">
              {{ prefix }}
            </div>
          </div>
        </div>
      </div>
      <div class="chart-box" :style="{ '--width': chartWidth }">
        <ReverseRoutingPathChart
          ref="rrpc"
          :title="root"
          :chartCategories="categories"
          :chartData="data"
          :chartlinks="links"
          :root="root"
          :asPathDict="path_dict"
        >
        </ReverseRoutingPathChart>
      </div>
    </el-row>
  </div>
</template>

<script>
// import TopoGraph from '@/components/Dashboard/DashboardRoutingPathTabTopoGraph.vue'
import { getAsInfoByList } from '@/api/DashBoardApi'
import { getRoutingPathCluster, getRtreeByHashes } from '@/api/RoutePathApi'
import ReverseRoutingPathChart from '../components/RouteMonitor/ReverseRoutingPathChart.vue'


export default {
  name: 'RoutingPathCluster',
  created() {},
  data() {
    return {
      inputASN: '4538',
      fullWidth: '550px',
      firstColWidth: '200px',
      secondColWidth: '350px',
      chartWidth: '200px',
      prefixMap: {},
      clusterList: [],
      choosePrefixIndex: 0,
      chooseIndex: 0,
      links: [],
      data: [],
      categories: [],
      path_dict: {},
      root: '',
      showPrefixList: false,
    }
  },
  components: {
    // TopoGraph,
    ReverseRoutingPathChart,
  },
  mounted() {
    this.$nextTick(() => {
      this.searchASN()
      // console.log()
    })
  },
  watch: {
    chooseIndex(newV, oldV) {
      if (this.clusterList.length === 0 || newV === oldV) {
        return
      } else {
        this.drawChartByHash(
          this.clusterList[this.chooseIndex].rtree_list.map(item => {
            return item.hash
          })
        )
      }
    },
  },
  methods: {
    switchPrefixTab(e) {
      if (parseInt(e.target.dataset.index) !== parseInt(this.chooseIndex)) {
        this.chooseIndex = e.target.dataset.index
      }
    },

    getRandomColorCode() {
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
    OpenPrefixList() {
      if (!this.showPrefixList) {
        this.showPrefixList = true
        this.chartWidth = this.fullWidth
        setTimeout(() => {
          this.$refs['rrpc'].$refs['topoGraph'].chart.resize()
        }, 500)
      }
    },
    ClosePrefixList() {
      if (this.showPrefixList) {
        this.showPrefixList = false
        this.chartWidth = this.firstColWidth
        setTimeout(() => {
          this.$refs['rrpc'].$refs['topoGraph'].chart.resize()
        }, 500)
      }
    },
    async searchASN() {
      const resultData = await getRoutingPathCluster(this.inputASN)
      const { result } = resultData
      // console.log(result)
      this.clusterList = result.map(item => {
        const color = this.getRandomColorCode()
        const prefix_list = item.rtree_list.map(item => item.prefix_list).flat()
        const obj = {
          name: item.name,
          rtree_list: item.rtree_list,
          prefix_list: prefix_list,
          color: color,
        }
        // console.log(obj)
        this.prefixMap[item.name] = obj
        return obj
      })
      if (this.clusterList.length === 0) {
        this.$messageBox({
          message: `Not found data for AS${this.inputASN}`,
          type: 'warning',
          duration: 2 * 1000,
        })
        return
      }
      this.chooseIndex = 0
      this.drawChartByHash(
        this.clusterList[this.chooseIndex].rtree_list.map(item => {
          return item.hash
        })
      )

      // this.prefixData = result
    },
    async drawChartByHash(hash) {
      const result = await getRtreeByHashes(hash, this.inputASN)
      const { links, nodes, asn, categories, path_dict } = result
      this.categories = categories
      this.path_dict = path_dict
      this.root = String(asn)
      const chartLinks = []
      links.forEach(i => {
        chartLinks.push({ source: i[0], target: i[1] })
      })
      this.links = chartLinks

      const asList = []
      nodes.forEach(item => {
        if (item.name.indexOf('/') === -1) {
          asList.push(item.name)
        }
      })
      const asInfoList = await getAsInfoByList(asList)

      const chartData = nodes.map(i => {
        return {
          name: i.name,
          category: categories[i.category],
          categoryIndex: i.category,
          country: asInfoList[i.name] ? asInfoList[i.name].country : '',
          org: asInfoList[i.name] ? asInfoList[i.name].org : '',
          asName: asInfoList[i.name] ? asInfoList[i.name].name : '',
          symbolSize: categories ? categories.length * 5 - i.category * 5 : 10,
        }
      })
      this.data = chartData
      // console.log(e.currentTarget.dataset.hash)
    },
  },
}
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  display: none;
}
.el-row {
  margin-bottom: 0px !important;
}
.routing-path-container {
  // padding-top:20px;
  background-color: #f0f0f0;
  height: 100%;
}

.prefix-input {
  width: 100%;
  padding: 10px 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prefixTab {
  font-weight: bold;
  // padding: 10px 0;
  // width: 100%;
  transition: all 0.2s linear;

  cursor: pointer;
}

.prefixTab:hover {
  opacity: 0.8;
}
.prefix-list-box {
  height: calc(100vh - 132px);
  background: #fff;
  transition: all 0.5s linear;
  overflow: auto;
  width: var(--width);
}
.cluster-box {
  height: calc(100vh - 132px);
  background: #fff;
  overflow: auto;
  width: var(--width);
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
  height: 50px;
  line-height: 50px;
  text-align: center;
  width: 100%;
  background-color: var(--bgcolor);
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
  background-color: #fff;
  height: calc(100vh - 132px);

  width: calc(100% - var(--width));
  z-index: 0;
}
.cluster-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.prefix-item-open {
  float: right;
  background-color: #fff;
  border-left: 25px solid #aaa;
  border-right: 0px solid #00000000;
  border-top: 25px solid #00000000;
  border-bottom: 25px solid #00000000;
}

.prefix-item-close {
  float: right;
  background-color: var(--bgcolor);
  border-right: 25px solid #fff;
  border-left: 0px solid #00000000;
  border-top: 25px solid #00000000;
  border-bottom: 25px solid #00000000;
}

.prefix-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.super-box {
  display: flex;
  transition: all 0.5s linear;
  width: var(--width);
}
</style>
