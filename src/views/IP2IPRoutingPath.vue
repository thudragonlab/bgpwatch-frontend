<template>
  <div class="ip-path-container">
    <div class="ip-path-header">
      <div class="input-box">
        <div class="ip-input">
          <div>
            <el-input type="text" class="input-class" style="width: 300px" v-model="left_ip">
              <template slot="prepend">Left IP</template>
            </el-input>
          </div>
          <div>
            <el-button class="search-btn" round @click="doSearch" :loading="loading"> Do search</el-button>
          </div>
          <div>
            <el-input type="text" class="input-class" style="width: 300px" v-model="right_ip">
              <template slot="append">Right IP</template>
            </el-input>
          </div>
        </div>
        <div class="example">
          <b>Example</b>: 2a0f:9340:10::/48 &lt;---&gt; 2001:7f8:e7::/48<br /><b>Example</b>: 2.22.238.0/23 &lt;---&gt;
          185.193.84.0/22
        </div>
      </div>
    </div>
    <div :class="['ip-path-graph', r2l ? '' : 'hidden2']">
      <div class="empty-tip" v-show="r2l_empty">{{ left_ip }} to {{ right_ip }} <br />No data found</div>
      <chart
        v-show="!r2l_empty"
        chartId="r2l"
        :option="
          new IPPathRouteGraphOption(`${left_ip} to ${right_ip}\n(${lastUpdateTimestamp})`).getOption([
            'title',
            'series',
            'tooltip',
          ])
        "
        :series="r2lSeries"
      ></chart>
    </div>
    <div :class="['ip-path-graph', l2r ? '' : 'hidden2']">
      <div class="empty-tip" v-show="l2r_empty">{{ right_ip }} to {{ left_ip }} <br />No data found</div>
      <chart
        v-show="!l2r_empty"
        chartId="l2r"
        :option="
          new IPPathRouteGraphOption(`${right_ip} to ${left_ip}\n(${lastUpdateTimestamp})`).getOption([
            'title',
            'series',
            'tooltip',
          ])
        "
        :series="l2rSeries"
      ></chart>
    </div>
  </div>
</template>

<script>
import { getRouteByIP } from '@/api/RoutePathApi.js'
import { getAsInfoByList } from '@/api/DashBoardApi'
import { IPPathRouteGraphOption } from '@/templates/chart/graphTemplate'
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[0-9]|[1-9]|2[0-4])$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
const IP_X_INDEX_OFFSET = 50
const Y_INDEX_OFFSET = 10
const X_INDEX_OFFSET = 50
export default {
  name: 'IP2IPRoutingPath',
  data() {
    return {
      IPPathRouteGraphOption,
      l2r: true,
      r2l: true,
      l2r_empty: false,
      r2l_empty: false,
      left_ip: '203.185.101.0/24',
      right_ip: '192.248.0.0/17',
      lastUpdateTimestamp: '',
      chartData: {},
      l2rSeries: [],
      asInfoMap: {},
      r2lSeries: [],
      windowWidth: document.documentElement.clientWidth,
      loading: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.make_chart().catch(err => {
        console.error(err)
      })
    })
  },
  methods: {
    clickBtn(e) {
      this[e.currentTarget.dataset.d] = !this[e.currentTarget.dataset.d]
    },
    async make_chart() {
      if (
        (this.left_ip.includes(':') && this.right_ip.includes('.')) ||
        (this.left_ip.includes('.') && this.right_ip.includes(':'))
      ) {
        this.$messageBox(`Not support`)
        return
      }
      if (!IP_REGEX.test(this.left_ip)) {
        this.$messageBox(`IP left invalid`)
        return
      }
      if (!IP_REGEX.test(this.right_ip)) {
        this.$messageBox(`IP right invalid`)
        return
      }
      this.loading = true
      const result = await getRouteByIP(
        ...(this.l2r ? [this.left_ip, this.right_ip] : [this.right_ip, this.left_ip])
      ).catch(e => {
        console.error(e)
        this.loading = false
      })
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      this.chartData = result
      const node_list = this.chartData['l2r'].nodes.flat().concat(this.chartData['r2l'].nodes.flat())
      const asInfoMap = await getAsInfoByList(Array.from(new Set(node_list)))
      this.asInfoMap = asInfoMap
      // console.log(asInfoMap)
      this.make_chart_data('l2r')
      this.make_chart_data('r2l')
      this.loading = false
    },

    doSearch() {
      this.make_chart()
    },
    make_chart_data(chartType) {
      
      if (!this.chartData || JSON.stringify(this.chartData) === '{}') {
        return false
      }
      
      // this.$assert.ok(this.chartData[chartType], 'this.chartData is undefined')
      const chartData = {
        links: [...this.chartData[chartType].links],
        nodes: [...this.chartData[chartType].nodes],
      }
      if (chartData.links.length === 0) {
        this.$messageBox(
          `Not found ${chartType[0] === 'l' ? 'left' : 'right'} to ${chartType[0] === 'l' ? 'right' : 'left'} path`
        )
        this[`${chartType}Series`] = []
        this[`${chartType}_empty`] = true
        return
      }
      if (this[`${chartType}_empty`]) {
        this[`${chartType}_empty`] = false
      }
      const nodes = chartData.nodes.reduce((nodes, nodeList, idx) => {
        nodeList.forEach((item, index) => {
          nodes.push({
            name: item,
            asName: this.asInfoMap[item] ? this.asInfoMap[item].name : 'Unknown',
            org: this.asInfoMap[item] ? this.asInfoMap[item].org : 'Unknown',
            country: this.asInfoMap[item] ? this.asInfoMap[item].country : 'Unknown',
            y: (index % 2 == 0 ? -1 : 1) * Math.ceil(index / 2) * Y_INDEX_OFFSET,
            x: idx * X_INDEX_OFFSET,
          })
        })
        return nodes
      }, [])

      if (chartType[0] === 'l') {
        chartData.links.push({
          target: this.left_ip,
          source: nodes[0].name,
        })
      } else {
        chartData.nodes[0].forEach(firstNode => {
          chartData.links.push({
            target: firstNode,
            source: this.left_ip,
          })
        })
      }

      nodes.unshift({
        name: this.left_ip,
        y: nodes[0].y,
        x: nodes[0].x - IP_X_INDEX_OFFSET,
        symbol: 'rect',
        symbolSize: [120, 50],
        symbolOffset: [-20, 0],
      })

      // 结尾多个root
      if (chartType[0] === 'r') {
        chartData.links.push({
          target: this.right_ip,
          source: nodes[nodes.length - 1].name,
        })
      } else {
        chartData.nodes[chartData.nodes.length - 1].forEach(lastNode => {
          chartData.links.push({
            source: this.right_ip,
            target: lastNode,
          })
        })
      }

      nodes.push({
        name: this.right_ip,
        y: 0,
        x: nodes[nodes.length - 1].x + IP_X_INDEX_OFFSET,
        symbol: 'rect',
        symbolSize: [120, 50],
        symbolOffset: [20, 0],
      })

      this[`${chartType}Series`] = [
        {
          type: 'graph',
          links: chartData.links,
          data: nodes,
          width: 1.06 * this.windowWidth - 500,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.ip-path-container {
  padding-bottom: 20px;
  background-color: #f0f0f0;
  height: 100%;
}

@keyframes turn {
  0% {
    background-position: 0%;
  }

  100% {
    background-position: 200%;
  }
}

.ip-path-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .input-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    flex-direction: column;
    background-image: linear-gradient(90deg, #e9ddff, #f9f6ff, #f9f6ff, #e9ddff);
    background-size: 200%;
    border: 1px solid #7f5ac3;
    box-shadow: #7f5ac3 1px 1px 1px 1px;
    width: 90%;
    border-radius: 10px;
    margin: 20px 0px;
    animation: turn 5s linear;
    animation-iteration-count: infinite;
    animation-play-state: paused;

    .ip-input {
      border-radius: 10px;
      width: 85%;
      padding: 10px;
      display: inherit;
      justify-content: space-between;
      align-items: inherit;
    }
  }
}

.input-box:hover {
  animation-play-state: running;
}

@property --startcolor {
  syntax: '<color>';
  inherits: false;
  initial-value: green;
}

.button-box {
  display: flex;
  justify-content: center;
}

.button {
  background-color: var(--startcolor);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-deg);
  padding: 2px;
  width: 50px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.unclick-button {
  --startcolor: var(--bg-linear-unclick-start-color);
}

.button:hover {
  opacity: 0.9;
}

.clicked-button {
  width: 70px;
  --startcolor: var(--bg-linear-clicked-start-color);
}

.ip-path-graph {
  height: 35vh;
  border-radius: 20px;
  background-color: #fff;
  margin: 20px 20px 0 20px;
  padding: 20px 0;
  animation: fadeInAnimation ease 1s;
  transition: all 0.5s;
}

.hidden2 {
  height: 0px;
  opacity: 0;
  z-index: -1;
  padding: 0;
  margin: 0 20px;
}

.search-btn {
  background-color: #7f5ac3;
  color: #fff;
  font-size: var(--middle-font-size);
  font-weight: bold;
  border: none;
  width: 170px;
}

.search-btn:hover {
  opacity: 0.9;
}

.empty-tip {
  font-size: var(--max-font-size);
  font-weight: bold;
  line-height: calc(35vh / 2);
}
.example {
  background-color: #f0f0f0;
  text-align: center;
  padding: 5px 0;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: #000 1px 1px 1px 1px inset;
  width: 85%;
}
</style>
