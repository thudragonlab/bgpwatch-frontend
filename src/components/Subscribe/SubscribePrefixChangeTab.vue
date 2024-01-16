<template>
  <div>
    <div v-if="subscribedAsDetail.length !== 0">
      <div
        v-for="(item, index) in subscribedAsDetail.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        :key="index"
        class="as-row"
      >
        <div
          class="title-info"
          :style="{
            '--font-color': `#936ec3`,
          }"
        >
          <div class="as-prop">
            <div class="as-prop-key">ASN</div>
            <div class="as-prop-value">{{ item.asn }}</div>
          </div>
          <div class="as-prop">
            <div class="as-prop-key">Country/Region</div>
            <div class="as-prop-value">{{ item.country }}</div>
          </div>
          <div class="as-prop">
            <div class="as-prop-key">Name</div>
            <div class="as-prop-value">{{ item.name }}</div>
          </div>
          <div
            class="as-prop"
            :style="{
              gridColumnStart: `span ${item.to_origin_increase || item.to_origin_decrease ? 1 : 2}`,
            }"
          >
            <div class="as-prop-key">Organization</div>
            <div class="as-prop-value">{{ item.org }}</div>
          </div>

          <el-button
            class="prefix-change"
            v-if="item.to_origin_increase || item.to_origin_decrease"
            type="danger"
            size="medium"
            @click="showPreifxChangeDialog"
            :data-index="index"
          >
            <div class="as-prop-key" :data-index="index">Prefixes Changed</div>
            <div class="as-prop-value" :data-index="index">
              + {{ item.to_origin_increase }} - {{ item.to_origin_decrease }}
            </div>
          </el-button>
          <span class="as-prop-delete el-icon-close" @click="unsubscribe" :data-index="index"></span>
        </div>

        <div class="history-chart" v-if="item.historyRouteData.length">
          <chart
            v-for="(line, idx) in item.historyRouteData"
            :key="idx"
            chartId="dashboard_right_bar6"
            :option="
              new SubcribeRouteHistoryLineOption(`${line.label}`).getOption([
                'tooltip',
                'xAxis',
                'yAxis',
                'title',
                'grid',
                'series',
              ])
            "
            :series="line.lineData"
            :extraOption="line.extraOption"
          ></chart>
        </div>
        <div class="empty-data" v-else>Empty</div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="subscribedAsDetail.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="24">
          <div class="empty">No Subscribed As</div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="Prefix Change" :visible.sync="showPrefixChangeDialog" width="30%">
      <div v-if="clickIndex !== -1" class="prefix-box">
        <div v-for="(prefix, index) in subscribedAsList[clickIndex]['to_origin']" :key="index">
          <span class="prefix-symbol">{{ prefix.split('|')[0] }}</span>
          <span>
            <a :href="`#/reverse-routing-path-topo?prefix=${prefix.split('|')[1]}`">{{ prefix.split('|')[1] }}</a>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delAsInList } from '@/api/SubscribeApi'
import { getAsInfoByList, getRouteHistoryStats } from '@/api/DashBoardApi'
import { SubcribeRouteHistoryLineOption } from '@/templates/chart/lineTemplate'
export default {
  name: 'SubscribePrefixChangeTab',
  created() {},
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      clickIndex: -1,
      showPrefixChangeDialog: false,
      SubcribeRouteHistoryLineOption,
      subscribedAsDetail: [],
      asesDetail: [],
      asns: [],
      showPrefixChangeDialog: false,
      historyRouteMap: {
        origin_ipv4_prefix_count: 'IPv4 Prefix Count',
        origin_ipv6_prefix_count: 'IPv6 Prefix Count',
      },
      routingHistoryData: [],
    }
  },
  props: {
    subscribedAsList: {
      type: Array,
    },
  },
  watch: {
    subscribedAsList() {
      this.getAsInfoByList().catch(e => console.error(e))
    },
  },
  methods: {
    showPreifxChangeDialog(e) {
      this.clickIndex = e.target.dataset.index
      if (this.clickIndex !== -1) {
        this.showPrefixChangeDialog = true
      }
    },

    async unsubscribe(e) {
      const realIndex = (this.currentPage - 1) * this.pageSize + Number(e.target.dataset.index)
      this.subscribedAsDetail.splice(realIndex, 1)
      delAsInList([this.subscribedAsList[realIndex]['_id']]).then(result => {
        this.$messageBox({
          message: result['message'],
          type: result['status'],
          duration: 2 * 1000,
        })
        this.subscribedAsList.splice(realIndex, 1)
      })
    },
    async getAsInfoByList() {
      // console.log(this.subscribedAsList)
      const asInfo = await getAsInfoByList(this.subscribedAsList.map(item => item['_id'])).catch(e => console.error(e))
      this.asesDetail = asInfo
      this.packetAsDetail()
    },
    currentChange(current) {
      this.currentPage = current
      this.processHistoryData(
        this.asns.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize),
        (this.currentPage - 1) * this.pageSize
      )
    },
    processHistoryData(asns, startIndex) {
      getRouteHistoryStats(asns)
        .then(historyData => {
          historyData.forEach((data, index) => {
            if (!data['origin_ipv4_prefix_count']) {
              return
            }
            // console.log(data)
            const historyRouteData = []
            historyRouteData.push(this.packingToLineData('origin_ipv4_prefix_count', data, index + startIndex))
            historyRouteData.push(this.packingToLineData('origin_ipv6_prefix_count', data, index + startIndex))
            this.subscribedAsDetail[index + startIndex].historyRouteData = historyRouteData
          })
        })
        .catch(e => console.error(e))
    },
    packetAsDetail() {
      this.subscribedAsDetail = this.subscribedAsList.map(item => {
        const id = item['_id']
        if (this.asesDetail[id]) {
          return {
            asn: id,
            country: this.asesDetail[id].country || 'Unknown',
            org: this.asesDetail[id].org || 'Unknown',
            name: this.asesDetail[id].name || 'Unknown',
            historyRouteData: [],
            ...item,
          }
        } else {
          return {
            asn: id,
            country: 'Unknown',
            org: 'Unknown',
            name: 'Unknown',
            historyRouteData: [],
            ...item,
          }
        }
      })

      this.asns = this.subscribedAsDetail.map(item => item.asn)
      this.processHistoryData(
        this.asns.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize),
        (this.currentPage - 1) * this.pageSize
      )
    },
    packingToLineData(key, historyData, index) {
      const lData = historyData[key].map(item => item.split('|')[1])
      const lineData = []
      const min = Math.min(...lData)
      const max = Math.max(...lData)
      const lineDataObject = {
        label: this.historyRouteMap[key],
        extraOption: {},
        lineData: {},
      }
      if (min !== max) {
        lineDataObject.extraOption = {
          yAxis: Object.assign(this.SubcribeRouteHistoryLineOption.getYAxis(), {
            min: min - (max - min) / 2,
            max: max + (max - min) / 2,
          }),
        }
      } else {
        if (min === 0) {
          lineDataObject.extraOption = {
            yAxis: Object.assign(this.SubcribeRouteHistoryLineOption.getYAxis(), {
              min: -1,
              max: 1,
            }),
          }
        } else {
          lineDataObject.extraOption = {
            yAxis: Object.assign(this.SubcribeRouteHistoryLineOption.getYAxis(), {
              min: 0,
              max: max * 2,
            }),
          }
        }
      }

      historyData[key].forEach(item => {
        let [ldate, element] = item.split('|')
        ldate = ldate.split('')
        ldate.splice(6, 0, '-')
        ldate.splice(4, 0, '-')
        const nowTimeStamp = new Date(ldate.join('')).getTime()
        lineData.unshift([nowTimeStamp, element])
      })

      const lineObj = this.SubcribeRouteHistoryLineOption.getSeriesFirst()
      const lineSeries = Object.assign({ data: lineData }, lineObj)

      lineDataObject.lineData = [lineSeries]
      return lineDataObject
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
}

.as-row {
  padding: 10px;
  border-radius: 20px;
  background-color: #fff;
  margin-top: 20px;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes move-from-bottom {
  0% {
    transform: translate(0, 50px);
    opacity: 0;
  }

  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.as-prop {
  color: var(--font-color);
  font-size: var(--subTitle-font-size);
  // background: #c39ad8;
  padding: 5px 10px;
  min-width: 100px;
  border-radius: 20px;
  border: var(--font-color) 1px solid;
  box-shadow: var(--font-color) 1px 1px 1px 1px;
  text-align: left;
}

.as-prop-key {
  font-size: var(--subTitle-font-size);
}
.as-prop-value {
  font-size: var(--subTitle-font-size);
  font-weight: 900;
}

.as-prop-delete {
  color: #fff;
  font-size: var(--subTitle-font-size);
  background: #cf0909;
  padding: 10px 10px;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  align-self: center;
  cursor: pointer;
}

.prefix-change {
  border: #cf0909 1px solid;
  box-shadow: #cf0909 1px 1px 1px 1px;
}

.as-prop-delete:hover {
  background: #cf0909be;
}

.el-icon-close {
  font-size: var(--max-font-size);
  font-weight: 900;
}
.empty {
  background-color: #fff;
  padding: 20px 0;
  font-size: var(--max-font-size);
  font-weight: 900;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
.input-with-add {
  background-color: #fff;
  padding: 10px;
}

.tips {
  padding-left: 20px;
  text-align: left;
}
.title-info {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 5%;
  grid-template-rows: 100%;
  grid-column-gap: 20px;
  place-items: center start;
  margin-bottom: 20px;
}

.diff-info {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 100%;
  place-items: center center;
  margin-bottom: 20px;
}

.history-chart {
  display: grid;
  padding: 2vh 0;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;
  place-items: center center;
  grid-column-gap: 20px;
  height: 30vh;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.delete-all {
  font-size: var(--subTitle-font-size);
  font-weight: bold;
}
.empty-data {
  width: 100%;
  height: 30vh;
  font-size: var(--max-font-size);
  font-weight: 900;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  color: #000;
  line-height: 30vh;
  border-radius: 20px;
}

.prefix-box {
  text-align: start;
  line-height: 30px;
  font-size: var(--middle-font-size);
}

.prefix-symbol {
  font-weight: bold;
}
</style>

<style>
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7f5ac3;
  color: #fff !important;
}
</style>
