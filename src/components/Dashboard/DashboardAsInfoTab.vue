<template>
  <div class="as-info-container">
    <el-row type="flex" justify="space-between">
      <el-col
        :span="6"
        v-for="(key, index) in Object.keys(asInfo)"
        :key="index"
        class="prop-col"
        :style="{ width: (asInfo[key].span * 100) / 24 - 1 + '%' }"
      >
        <div class="prop-box-value">
          {{ asInfo[key].value }}
        </div>
        <div class="prop-box-key">{{ asInfo[key].label }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6" v-for="(rule, index) in GaugeOptionProp" :key="index">
        <div class="line-box">
          <chart
            class="bar-chart"
            chartId="dashboard_right_bar6"
            :option="
              new DashboardRouteHistoryLineOption(`${rule.label}`).getOption([
                'tooltip',
                'xAxis',
                'yAxis',
                'title',
                'grid',
                'series',
              ])
            "
            :sourceData="rule.lineData"
            :extraOption="rule.extraOption"
          ></chart>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 0px" ref="prefixBar">
      <el-col :span="12" class="bar">
        <chart
          class="bar-chart"
          chartId="dashboard_right_bar4"
          :option="new BarOption(`IPv4 Prefix`).getOption(['title', 'tooltip', 'xAxis', 'yAxis', 'grid', 'series'])"
          :sourceData="barDataV4"
          :extraOption="barDataLabelV4"
          :EventList="{
            click: clickBarFuncV4,
          }"
        ></chart>
      </el-col>
      <el-col :span="12" class="bar">
        <chart
          class="bar-chart"
          chartId="dashboard_right_bar6"
          :option="new BarOption(`IPv6 Prefix`).getOption(['title', 'tooltip', 'xAxis', 'yAxis', 'grid', 'series'])"
          :sourceData="barDataV6"
          :extraOption="barDataLabelV6"
          :EventList="{
            click: clickBarFuncV6,
          }"
        ></chart>
      </el-col>
    </el-row>

    <el-row ref="prefixTable" :gutter="20" class="table-row" style="margin-bottom: 0px; margin-top: 20px">
      <el-col :span="24">
        <div class="table-tips">
          Click on the column above<br />the corresponding prefix will be displayed in the table
        </div>
        <el-input placeholder="Search for Prefix" v-model="prefixSearchKey" class="search-prefix-input">
          <template slot="prepend">
            <el-switch
              v-model="selectPrefixInAll"
              :active-color="deepColor"
              @change="switchAll"
              class="select-in-all-switch"
              :inactive-color="softColor"
              active-text="All"
              inactive-text="Selected"
            >
            </el-switch>
          </template>
          <el-button slot="append" icon="el-icon-search" @click="handlePrefixList"></el-button>
        </el-input>
        <PaginationTable
          v-loading="loading"
          :origin-data="prefixList"
          :show-rule="showRule"
          hiddenIndex
          :paginationProp="{ background: true, layout: 'prev, pager, next' }"
          paginationProClass="as-info-pagination"
          loadDataFadeIn
        />
        <span class="total-bar">Total {{ showingDataTotal }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { BarOption, deepColor, softColor } from '@/templates/chart/barTemplate'
import codeCountry from '@/../public/static/code_country.json'
import { peerColor } from '@/templates/chart/graphTemplate'
import { DashboardRouteHistoryLineOption } from '@/templates/chart/lineTemplate'
import { getRouteHistoryStats, getPrefixList, getAsInfoByList } from '@/api/DashBoardApi'
import ToReverseTOPOColumn from '@/components/Column/ToReverseTOPOColumn.vue'

export default {
  name: 'AsInfoTab',
  created() {},
  data() {
    return {
      deepColor,
      softColor,
      inputAsn: '',
      clickBar: '',
      clickBarVersion: '',
      BarOption,
      rawTableData: [],
      showingDataTotal: 0,
      DashboardRouteHistoryLineOption,
      barDataV4: [],
      barDataLabelV4: {},
      barDataV6: [],
      selectPrefixInAll: false,
      barDataLabelV6: {},
      routingHistoryData: [],
      prefixListOrigin: [],
      prefixList: [],
      prefixSearchKey: '',
      barIndexclicked: -1,
      activeIpVersion: 4,
      loading: true,
      barColorStyle: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: softColor, // 0% 处的颜色
          },
          {
            offset: 1,
            color: deepColor, // 100% 处的颜色
          },
        ],
      },
      showRule: [
        {
          prop: 'prefix1',
          label: '',
          subComponent: ToReverseTOPOColumn,
          rowFormat: row => {
            return row.prefix1
          },
        },
        {
          prop: 'prefix2',
          label: 'Prefix',
          subComponent: ToReverseTOPOColumn,
          rowFormat: row => {
            return row.prefix2
          },
        },
        {
          prop: 'prefix3',
          label: '',
          subComponent: ToReverseTOPOColumn,
          rowFormat: row => {
            return row.prefix3
          },
        },
      ],
      asInfo: {
        asn: {
          label: 'AS NUM',
          value: '',
          span: 4,
        },
        as_country: {
          label: 'Country/Region',
          value: '',
          span: 4,
        },
        as_name: {
          label: 'AS Name',
          value: '',
          span: 6,
        },

        as_org: {
          label: 'AS Organization',
          value: '',
          span: 10,
        },
      },
      GaugeOptionProp: [
        {
          prop: 'ipv4_count',
          label: 'IPv4 Prefix Count',
          lineData: [],
          extraOption: {},
        },
        {
          prop: 'ipv4_count_24',
          label: 'IPv4 Address Size(/24)',
          lineData: [],
          extraOption: {},
        },
        {
          prop: 'ipv6_count',
          label: 'IPv6 Prefix Count',
          lineData: [],
          extraOption: {},
        },
        {
          prop: 'ipv6_count_48',
          label: 'IPv6 Address Size(/48)',
          lineData: [],
          extraOption: {},
        },
      ],
    }
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
      this.handleAsInfo()
    },
    activeIpVersion(newV, oldV) {
      const otherBarListName = `barDataV${oldV}`
      const anontherTemporaryList = [...this[otherBarListName]]
      this[otherBarListName] = []
      if (anontherTemporaryList[this.barIndexclicked]) {
        anontherTemporaryList[this.barIndexclicked].itemStyle.color = this.barColorStyle
      }
      this[otherBarListName] = anontherTemporaryList
      this.barIndexclicked = this[`barDataV${newV}`].findIndex(item => item.name === `${this.clickBar}`)
    },
    barIndexclicked(newV, oldV) {
      // console.log('this.barIndexclicked', this.barIndexclicked, newV, oldV)
      const temporaryList = [...this[`barDataV${this.activeIpVersion}`]]
      this[`barDataV${this.activeIpVersion}`] = []
      if (oldV !== -1 && newV !== -1) {
        if (temporaryList[oldV]) {
          temporaryList[oldV].itemStyle.color = this.barColorStyle
        }
      }
      if (oldV !== -1 && newV === -1) {
        if (temporaryList[oldV]) {
          temporaryList[oldV].itemStyle.color = this.barColorStyle
        }
      }
      if (oldV === -1 && newV !== -1) {
        //  Init
        temporaryList[newV].itemStyle.color = peerColor
      } else if (newV !== -1) {
        if (temporaryList[newV]) {
          temporaryList[newV].itemStyle.color = peerColor
        }
      }

      this[`barDataV${this.activeIpVersion}`] = temporaryList
    },
  },

  methods: {
    switchAll(value) {
      this.prefixSearchKey = ''
      if (value) {
        this.useAll()
      } else {
        this.useSelected()
      }
    },
    useAll() {
      const tempL = Object.values(this.prefixListOrigin).reduce(
        (a, b) => a.concat(Object.values(b).reduce((aa, bb) => aa.concat(bb), [])),
        []
      )
      this.refrushData(tempL)
      this.rawTableData = tempL
    },
    useSelected() {
      this.refrushData(this.prefixListOrigin[this.clickBarVersion][this.clickBar])
      this.rawTableData = this.prefixListOrigin[this.clickBarVersion][this.clickBar]
    },
    clickBarFuncV4(series) {
      this.moveScrollBar()
      this.clickBar = series.name
      this.processBarStyle(4)
    },
    clickBarFuncV6(series) {
      this.moveScrollBar()
      this.clickBar = series.name
      this.processBarStyle(6)
    },
    moveScrollBar() {
      const { top } = this.$refs['prefixTable'].$el.getBoundingClientRect()
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (top > clientHeight) {
        this.$refs['prefixBar'].$el.scrollIntoView({
          behavior: 'smooth',
        })
      }
    },
    processBarStyle(ipVersion) {
      this.prefixSearchKey = ''
      this.selectPrefixInAll = false

      if (this.activeIpVersion == ipVersion) {
        const index = this[`barDataV${this.activeIpVersion}`].findIndex(item => item.name === `${this.clickBar}`)
        this.barIndexclicked = index
      } else {
        this.activeIpVersion = ipVersion
      }
      this.clickBarVersion = `ipv${this.activeIpVersion}`
      this.refrushData(this.prefixListOrigin[this.clickBarVersion][this.clickBar])
      this.rawTableData = this.prefixListOrigin[this.clickBarVersion][this.clickBar]
    },
    async handleSingleBar(ip_distribution, version) {
      const barData = {
        xLabel: {
          xAxis: {
            data: [],
          },
        },

        data: [],
      }
      Object.keys(ip_distribution).forEach(key => {
        barData.data.push({
          name: key,
          value: ip_distribution[key],
          itemStyle: {
            color: this.barColorStyle,
          },
        })
        barData.xLabel.xAxis.data.push(key)
      })
      this[`barData${version}`] = barData.data
      this[`barDataLabel${version}`] = barData.xLabel
    },
    handleAsInfo() {
      const { inputAsn } = this.param

      this.inputAsn = inputAsn
      this.getPrefixList(this.inputAsn)
      this.processHistoryData({ inputAsn })
      this.processPeersData({ inputAsn })

      // this.handleBar(prefixes)
    },
    async getPrefixList(inputAsn) {
      this.barIndexclicked = -1
      const result = await getPrefixList(inputAsn)
      this.prefixListOrigin = result
      if (typeof this.prefixListOrigin === 'string') {
        return
      }
      Object.keys(this.prefixListOrigin).forEach(key => {
        const prefixes = {}
        if (Object.keys(this.prefixListOrigin[key]).length) {
          Object.keys(this.prefixListOrigin[key]).forEach(prefix => {
            prefixes[prefix] = this.prefixListOrigin[key][prefix].length
            this.handleSingleBar(prefixes, key === 'ipv4' ? 'V4' : 'V6')
          })
        } else {
          if (key === 'ipv4') {
            this.barDataV4 = []
          } else {
            this.barDataV6 = []
          }
        }
      })
      if (Object.keys(this.prefixListOrigin[Object.keys(this.prefixListOrigin)[0]]).length) {
        // v4
        this.clickBarVersion = Object.keys(this.prefixListOrigin)[0]
      } else {
        // v6
        this.clickBarVersion = Object.keys(this.prefixListOrigin)[1]
      }
      let maxLength = -1
      Object.keys(this.prefixListOrigin[this.clickBarVersion]).forEach(key => {
        if (maxLength < this.prefixListOrigin[this.clickBarVersion][key].length) {
          maxLength = this.prefixListOrigin[this.clickBarVersion][key].length
          this.clickBar = key
        }
      })
      this.processBarStyle(this.clickBarVersion === 'ipv4' ? 4 : 6)
    },

    handlePrefixList() {
      this.loading = true
      let tempL = [...this.rawTableData]
      if (this.prefixSearchKey) {
        if (this.prefixSearchKey.includes('/')) {
          this.selectPrefixInAll = true
          this.useAll()
          this.barIndexclicked = -1
          tempL = [...this.rawTableData]
          // 58.192.0.0/12
          const [searchIpAddress, searchPrefix] = this.prefixSearchKey.split('/')
          const searchBinaryIP = this.ipToBinary(searchIpAddress)
          const searchBinarySuffix = searchBinaryIP.substring(0, searchPrefix)
          tempL = tempL.filter(ipPrefix => {
            if (ipPrefix === '::/0') {
              return false
            }
            const [ipAddress, prefix] = ipPrefix.split('/')
            const binarySubSuffix = searchBinaryIP.substring(0, prefix)
            // 103.28.121.0/24
            const binaryIP = this.ipToBinary(ipAddress)
            const binarySuffix = binaryIP.substring(0, searchPrefix)
            const binarySuperSuffix = binaryIP.substring(0, prefix)
            // console.log(searchIpAddress,binarySubSuffix,binarySuperSuffix,ipPrefix)
            if (binarySubSuffix === binarySuperSuffix) {
              return true
            }
            return binarySuffix === searchBinarySuffix
          })
        } else {
          tempL = tempL.filter(prefix => prefix.includes(this.prefixSearchKey))
        }
      }
      this.refrushData(tempL)
    },
    ipToBinary(ipAddress) {
      if (ipAddress.includes('.')) {
        return this.ipv4ToBinary(ipAddress)
      } else {
        return this.ipv6ToBinary(this.ipv6Full(ipAddress))
      }
    },
    ipv4ToBinary(ipAddress) {
      const ipParts = ipAddress.split('.')
      let binaryIp = ''
      for (let i = 0; i < ipParts.length; i++) {
        const binaryPart = parseInt(ipParts[i]).toString(2).padStart(8, '0')
        binaryIp += binaryPart
      }
      return binaryIp
    },
    ipv6ToBinary(ipAddress) {
      // 2001:da8::/32
      const ipParts = ipAddress.split(':')
      let binaryIp = ''
      for (let i = 0; i < ipParts.length; i++) {
        const binaryPart = parseInt(ipParts[i], 16).toString(2).padStart(16, '0')
        binaryIp += binaryPart
      }
      return binaryIp
    },
    ipv6Full(ipAddress) {
      // 240a:afce::/32
      // 将IPv6地址按照":"进行分割
      let ipParts = ipAddress.split(':')
      // 如果IPv6地址中含有"::"，则需要添加省略的0
      if (ipAddress.includes('::')) {
        const emptyCount = 8 - ipParts.length + 1
        let emptyPart = ':'
        for (let i = 0; i < emptyCount; i++) {
          emptyPart += '0000:'
        }
        ipAddress = ipAddress.replace('::', emptyPart)
        ipParts = ipAddress.split(':')
      }
      // 对于每一个IPv6地址的分段，将其转换为四位的十六进制数
      for (let i = 0; i < ipParts.length; i++) {
        const hexPart = ipParts[i].padStart(4, '0')
        ipParts[i] = hexPart
      }
      // 将分段后的IPv6地址拼接起来，返回全写形式的IPv6地址
      return ipParts.join(':')
    },
    refrushData(willProcessdata) {
      willProcessdata = willProcessdata.sort()
      const temporaryPrefixList = []
      if (willProcessdata) {
        this.showingDataTotal = willProcessdata.length
        const length = willProcessdata.length
        for (let index = 0; index < length; index += 3) {
          const subPrefixList = {}
          subPrefixList['prefix1'] = willProcessdata[index]
          if (index + 1 < length) {
            subPrefixList['prefix2'] = willProcessdata[index + 1]
          }
          if (index + 2 < length) {
            subPrefixList['prefix3'] = willProcessdata[index + 2]
          }
          temporaryPrefixList.push(subPrefixList)
        }
      } else {
        this.rawTableData = []
      }
      this.prefixList = temporaryPrefixList
      this.loading = false
    },
    async processHistoryData({ inputAsn }) {
      const historyData = await getRouteHistoryStats([inputAsn])
      if (historyData[0]) {
        this.routingHistoryData = historyData[0]
        this.packingToLineData('origin_ipv4_prefix_count', 0)
        this.packingToLineData('origin_ipv4_prefix_sum_24', 1)
        this.packingToLineData('origin_ipv6_prefix_count', 2)
        this.packingToLineData('origin_ipv6_prefix_sum_48', 3)
      }
    },

    packingToLineData(key, GaugeOptionPropIndex) {
      const lineData = []

      if (this.routingHistoryData[key]) {
        // let nowTimeStamp = new Date().getTime()
        // nowTimeStamp =
        //   nowTimeStamp - (nowTimeStamp % 86400000) + new Date().getTimezoneOffset() * 60000
        const lData = this.routingHistoryData[key].map(item => item.split('|')[1])
        const min = Math.min(...lData)
        const max = Math.max(...lData)
        if (min !== max) {
          this.GaugeOptionProp[GaugeOptionPropIndex].extraOption = {
            yAxis: {
              min: min - (max - min) / 2,
              max: max + (max - min) / 2,
            },
          }
        } else {
          this.GaugeOptionProp[GaugeOptionPropIndex].extraOption = {
            yAxis: {
              min: 0,
              max: max * 2,
            },
          }
        }
        this.routingHistoryData[key].forEach(item => {
          let [ldate, element] = item.split('|')
          ldate = ldate.split('')
          ldate.splice(6, 0, '-')
          ldate.splice(4, 0, '-')
          const nowTimeStamp = new Date(ldate.join('')).getTime()
          lineData.unshift([nowTimeStamp, element])
        })
      }

      this.GaugeOptionProp[GaugeOptionPropIndex].lineData = lineData
    },

    processPeersData({ inputAsn }) {
      this.asInfo['asn'].value = inputAsn
      getAsInfoByList([inputAsn]).then(res => {
        const asNameInfo = res[inputAsn]
        this.asInfo['as_name'].value = asNameInfo && asNameInfo['name']? asNameInfo['name'] : 'Unknown'
        this.asInfo['as_org'].value = asNameInfo && asNameInfo['org']? asNameInfo['org'] : 'Unknown'
        this.asInfo['as_country'].value = asNameInfo && asNameInfo['country']
          ? codeCountry[asNameInfo['country']] || asNameInfo['country']
          : 'Unknown'
      })
    },
  },
}
</script>

<style>
.as-info-pagination {
  text-align: left;
  margin-top: 20px;
  padding-top: 5px;
  border-top: #000 solid 2px;
}
.select-in-all-switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.select-in-all-switch .el-switch__label--right {
  font-weight: bold;
  z-index: 1;
  right: 6px; /*不同场景下可能不同，自行调整*/
}
/*关闭时文字位置设置*/
.select-in-all-switch .el-switch__label--left {
  font-weight: bold;
  z-index: 1;
  left: 6px; /*不同场景下可能不同，自行调整*/
}
/*显示文字*/
.select-in-all-switch .el-switch__label.is-active {
  display: block;
}
.select-in-all-switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 90px !important; /*开关按钮的宽度大小*/
  height: 30px !important;
  line-height: 30px;
}

.select-in-all-switch .el-switch__core:after {
  height: 26px !important;
  border-radius: 10px !important;
  /* top: 0px !important;
  left: 0px !important; */
}
</style>

<style lang="scss" scoped>
.as-info-container {
  padding-top: 20px;
  background-color: #f0f0f0;
  height: 100%;
}

.table-box {
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
}

.prop-col {
  height: 20vh;
  padding: 10px;
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
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

.prop-box-key {
  font-size: var(--middle-font-size);
  color: #ccbeea;
  font-weight: bold;
  border-bottom: 1px #fff solid;
  text-align: right;
}

.prop-box-value {
  color: #861caf;
  text-align: left;
  font-weight: 900;
  font-size: var(--max-font-size);
}

.gauge {
  height: 30vh;
  // padding: 0 15px;
}
.gauge:first-child {
  padding-left: 0px;
}

.gauge:last-child {
  padding-right: 0px;
}

.gauge-chart {
  // padding: 0 5px;
  border-radius: 20px;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.line-box {
  height: 40vh;
  padding: 10px;
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.bar-chart {
  border-radius: 20px;
}

.bar {
  height: 50vh;
}

.chart {
  background-color: #fff;
}

.gauge {
  height: 30vh;
  // padding: 0 15px;
  width: 16%;
}
.gauge:first-child {
  padding-left: 0px;
}

.gauge:last-child {
  padding-right: 0px;
}

.table-row {
  background-color: #fff;
  text-align: center;
  // font-size: var(--max-font-size);
  font-weight: bold;
  // color: #861caf;
}

.gauge-chart {
  // padding: 0 5px;
  border-radius: 20px;
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
.search-prefix-input {
  width: 400px;
  position: absolute;
  left: 0;
  z-index: 2;
  padding-left: 10px;
}

.table-tips {
  position: absolute;
  z-index: 1;
  right: 0;
  padding-right: 15px;
  padding-top: 5px;
}

.total-bar {
  position: absolute;
  bottom: 28px;
  font-size: 15px;
  right: 30px;
}
</style>
