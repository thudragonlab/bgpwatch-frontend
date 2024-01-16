<template>
  <div class="jitter-router">
    <div class="selector">
      <TimeZone
        @change="selectDate"
        @changeDateZone="selectDateZone"
        ref="tz"
        :defaultDateTime="defaultDateTime"
        hiddenDate
        ><div class="switch-box">
          <div>ASN</div>
        </div>
        <el-select v-model="ASItem" filterable placeholder="Please choose" @change="selectASN">
          <el-option v-for="item in ASOptions" :key="item.label" :label="item.label" :value="item">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>

        <div v-if="showSecondOptions" class="switch-box"  style="width:200px">
          <div>Peer Address</div>
        </div>
        <el-select
          v-if="showSecondOptions"
          style="width: 300px"
          v-model="prefixValue"
          filterable
          placeholder="Please choose"
          @change="selectPrefix"
        >
          <el-option v-for="pfx in ASItem.prefixList" :key="pfx" :label="pfx" :value="pfx">
            <span style="float: left">{{ pfx }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
          </el-option>
        </el-select>

        <el-button :class="['btn', timeFrame === 'Last 1 Day' ? 'click-btn' : '']" @click="setDateToLastDay"
          >Last 1 day</el-button
        >
        <!-- <el-button :class="['btn', timeFrame === 'Last 7 Days' ? 'click-btn' : '']" @click="setDateToLast7Days"
          >Last 7 days</el-button
        > -->
        <!-- <el-button :class="['btn', timeFrame === 'Last 30 Days' ? 'click-btn' : '']" @click="setDateToLast30Days"
          >Last 30 days</el-button
        > -->
        <div class="by-box">
          <el-button
            :class="['btn', by === 'peer' ? 'click-btn' : '']"
            :disabled="listLoading || chartLoading || pathLoading"
            @click="byPeer"
            >Top Peer</el-button
          >
          <el-button
            :class="['btn', by === 'prefix' ? 'click-btn' : '']"
            :disabled="listLoading || chartLoading || pathLoading"
            @click="byPrefix"
            >Top Prefix</el-button
          >
        </div>
      </TimeZone>
    </div>
    <div class="jitter-grid">
      <div class="prefix-list" v-loading="listLoading">
        <div
          v-for="(flipItem, index) in itemList"
          :key="index"
          :class="[currentItem === flipItem['K'] ? 'click-prefix-item' : 'unclick-prefix-item', 'prefix-item']"
          @click="clickK($event)"
          :data-k="flipItem['K']"
          :data-idx="index"
        >
          <span>
            {{ flipItem['K'] }}
          </span>
          <span>
            {{ flipItem['V'] }}
          </span>
        </div>
      </div>
      <div class="jitter-chart">
        <span class="tip">Click on the timeline to display the corresponding A and W</span>
        <chart
          v-loading="chartLoading"
          ref="jitter-line"
          :chartId="`sub_grap`"
          :option="
            new JitterLineOption('Router jitter').getOption([
              'xAxis',
              'yAxis',
              'title',
              'grid',
              'series',
              'color',
              'dataZoom',
              'tooltip',
            ])
          "
          :series="line_data"
        ></chart>
      </div>
      <div class="jitter-as-path-chart" v-loading="pathLoading">
        <el-empty v-if="currentAsPathList.length === 0"></el-empty>
        <div v-if="currentAsPathList.length !== 0" style="text-align: left">{{ clickedDate }}</div>
        <div v-if="by === 'prefix'" class="by-prefix-path-list">
          <div
            v-for="(asPath, idx) in currentAsPathList"
            :key="idx"
            :style="{ color: asPath.includes('A') ? JitterLineOption.getColor()[0] : JitterLineOption.getColor()[1] }"
            :reversed="true"
          >
            {{ asPath }}
          </div>
        </div>
        <div
          v-else-if="by === 'peer'"
          v-infinite-scroll="loadMoreAsPathList"
          infinite-scroll-distance="100px"
          class="by-peer-path-list"
        >
          <div v-for="(prefixItem, idx) in currentAsPathList" :key="idx" class="peer-as-path">
            <div class="peer-as-path-prefix">{{ prefixItem['prefix'] }}</div>
            <div class="peer-as-path-content">
              <div v-for="(asPath, i) in prefixItem['as_path']" :key="i">
                <div
                  :style="{
                    color: asPath.includes('A') ? JitterLineOption.getColor()[0] : JitterLineOption.getColor()[1],
                  }"
                >
                  {{ asPath }}
                </div>
              </div>
            </div>
            <div class="peer-as-path-third-content">
              <div :style="{ color: JitterLineOption.getColor()[0] }">A:{{ prefixItem['A'] }}</div>
              <div :style="{ color: JitterLineOption.getColor()[1] }">W:{{ prefixItem['W'] }}</div>
              <div :style="{ color: JitterLineOption.getColor()[2] }">Filp:{{ prefixItem['F'] }}</div>
            </div>
          </div>
          <p v-if="noMore">No more data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JitterLineOption } from '@/templates/chart/lineTemplate'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone.vue'
import {
  getJitterTopNPrefixByAs,
  getJitterDataByPeer,
  getJitterDataByPrefix,
  getJitterTopNPrefixByPeer,
  getJitterPeerASPathByTimeStamp,
  getJitterTopNPrefixByAsAndPfx,
  getJitterDataByASNAndPfx,
  getJitterTopNPeerByPfx,
  getJitterDataByPeerAndPfx,
} from '@/api/RoutePathApi'
export default {
  name: 'JitterRoute',
  components: {
    TimeZone,
  },
  data() {
    return {
      JitterLineOption,
      ASValue:
        (sessionStorage.getItem('JitterASItem') && JSON.parse(sessionStorage.getItem('JitterASItem')).value) || '4538',
      prefixValue: sessionStorage.getItem('JitterPrefixValue') || '',
      ASItem: (sessionStorage.getItem('JitterASItem') && JSON.parse(sessionStorage.getItem('JitterASItem'))) || {
        label: 'CERNET',
        value: '4538',
      },
      defaultDateTime: [],
      asPathList: [],
      currentAsPathList: [],
      timeFrame: '',
      nowDate: [],
      currentItem: '',
      currentPage: 0,
      currentTs: 0,
      byPeerTotal: 0,
      itemList: [],
      line_data: [],
      source: 'Tsinghua',
      defaultPfxIndex:sessionStorage.getItem('JitterDefalutPfxIndex') || 0,
      chartLoading: false,
      pathLoading: false,
      listLoading: false,
      listAPIName: sessionStorage.getItem('JitterListAPIName') || 'getJitterTopNPrefixByAs',
      getJitterDataFuncName: sessionStorage.getItem('JitterDataFuncName') || 'getJitterData',
      by: sessionStorage.getItem('JitterBy') || 'prefix',
      aaa: false,
      clickedLineDataIndex: -1,
      lineChart: undefined,
      showSecondOptions: JSON.parse(sessionStorage.getItem('JitterShowSecondOptions')),

      ASOptions: [
        {
          label: 'APAN-JP',
          value: '7660',
        },
        {
          label: 'AARNET',
          value: '7575',
        },
        {
          label: 'BDREN',
          value: '63961',
        },
        {
          label: 'CERNET',
          value: '4538',
        },
        // {
        //   label: 'FITI',
        //   value: '38272',
        // },
        {
          label: 'FITI-FIX',
          value: '38255',
        },
        {
          label: 'HARNET',
          value: '3662',
          prefixList: [
            '203.188.118.253',
            '203.188.118.254',
            '2001:ce0:1::1',
            '2001:ce0:1:ffff::1',
            '2001:ce0:1:ffff::5',
          ],
        },
        {
          label: 'ITB',
          value: '4796',
        },
        {
          label: 'KREONET',
          value: '17579',
        },
        {
          label: 'LEARN',
          value: '38229',
        },
        {
          label: 'MYREN',
          value: '24514',
        },
        {
          label: 'NREN',
          value: '45170',
        },
        {
          label: 'PERN',
          value: '45773',
        },
        {
          label: 'REANNZ',
          value: '38022',
        },
        {
          label: 'SINGAREN',
          value: '23855',
        },
        {
          label: 'ThaiREN',
          value: '3836',
        },
        {
          label: 'TransPAC',
          value: '22388',
        },
      ],
    }
  },
  created() {
    const st = new Date()
    const et = new Date()
    st.setDate(st.getDate() - 1)
    this.defaultDateTime = [st, et]
    this.timeFrame = 'Last 1 Day'
  },
  computed: {
    clickedDate() {
      // 这里的 computedValue 是一个计算属性，它的值依赖于 this.value
      if (!this.line_data[0] || this.clickedLineDataIndex === -1) {
        return ''
      }
      const date = new Date(this.line_data[0]['data'][this.clickedLineDataIndex]['value'][0])
      function deepFormat(num) {
        return num < 10 ? '0' + num : num
      }
      return `${date.getFullYear()}-${deepFormat(date.getMonth() + 1)}-${deepFormat(date.getDate())}\n${deepFormat(
        date.getHours()
      )}:${deepFormat(date.getMinutes())}:${deepFormat(date.getSeconds())} (UTC)`
    },
    noMore() {
      return this.currentPage * 1024 > this.byPeerTotal
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.lineChart = this.$refs['jitter-line'].chart
      this.lineChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (this.lineChart.containPixel('grid', pointInPixel)) {
          let xIndex = this.lineChart.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY,
          ])[0] /*事件处理代码书写位置*/
          const absList = this.line_data[0]['data'].map(i => Math.abs(i['value'][0] - xIndex))
          xIndex = absList.indexOf(Math.min(...absList))
          this.clickLinePoint(xIndex)
        }
      })
    })
  },
  methods: {
    addMarkLine(xAxis) {
      this.lineChart.setOption({
        series: [{ name: 'A', markLine: this.JitterLineOption.getMarkLineOption(xAxis) }],
      })
    },
    delMarkLine() {
      this.lineChart.setOption({
        series: [
          {
            name: 'A',
            markLine: {
              data: [],
            },
          },
        ],
      })
    },
    highlight(index) {
      this.lineChart.dispatchAction({
        type: 'highlight',
        seriesIndex: [0, 1, 2],
        dataIndex: index,
      })
    },
    downplay(index) {
      this.lineChart.dispatchAction({
        type: 'downplay',
        seriesIndex: [0, 1, 2],
        dataIndex: index,
      })
    },

    showTip(e) {
      const prefixIdx = e.target.dataset.idx
      this.currentAsPathList[prefixIdx]['showTips'] = true
      const ts = new Date(this.currentAsPathList[prefixIdx]['as_path'][0][1].split('|')[2] * 1000)
      function deepFormat(num) {
        return num < 10 ? '0' + num : num
      }
      const date = `${ts.getFullYear()}-${deepFormat(ts.getMonth() + 1)}-${deepFormat(ts.getDate())} ${deepFormat(
        ts.getHours()
      )}:${deepFormat(ts.getMinutes())}:00`
      this.addMarkLine(date)
      this.highlight(this.clickedLineDataIndex)
    },
    hideTip(e) {
      const prefixIdx = e.target.dataset.idx
      this.currentAsPathList[prefixIdx]['showTips'] = false
      this.delMarkLine()
      this.highlight(this.clickedLineDataIndex)
    },
    async byPeer() {
      if (this.showSecondOptions) {
        this.listAPIName = 'getJitterTopNPeerByPfx'
        sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPeerByPfx')
        this.getJitterDataFuncName = 'getJitterDataByPeerAndPfx'
        sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByPeerAndPfx')
      } else {
        this.listAPIName = 'getJitterTopNPrefixByPeer'
        sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByPeer')
        this.getJitterDataFuncName = 'getJitterDataByPeer'
        sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByPeer')
      }

      this.by = 'peer'
      sessionStorage.setItem('JitterBy', 'peer')
      this.asPathList = []
      this.currentAsPathList = []
      await this[this.listAPIName](...this.nowDate)
    },
    async byPrefix() {
      if (this.showSecondOptions) {
        this.listAPIName = 'getJitterTopNPrefixByAsAndPfx'
        sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByAsAndPfx')
        this.getJitterDataFuncName = 'getJitterDataByASNAndPfx'
        sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByASNAndPfx')
      } else {
        this.listAPIName = 'getJitterTopNPrefixByAs'
        sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByAs')
        this.getJitterDataFuncName = 'getJitterData'
        sessionStorage.setItem('JitterDataFuncName', 'getJitterData')
      }

      this.by = 'prefix'
      sessionStorage.setItem('JitterBy', 'prefix')
      this.asPathList = []
      this.currentAsPathList = []
      this.currentPage = 0
      this.currentTs = 0
      this.byPeerTotal = 0
      await this[this.listAPIName](...this.nowDate)
    },

    async getJitterTopNPeerByPfx(st, et) {
      this.listLoading = true
      const result = await getJitterTopNPeerByPfx(this.ASValue, this.prefixValue, st, et, this.source).catch(e => {
        this.listLoading = false
        return
      })
      if (result.length === 0) {
        this.listLoading = false
        this.itemList = []
        this.line_data = []
        this.currentAsPathList = []
        return
      }
      this.nowDate = [st, et]
      if(result.length - 1 < this.defaultPfxIndex){
        this.defaultPfxIndex = result.length - 1
      }
      this.currentItem = result[this.defaultPfxIndex]['K']
      this.itemList = result
      this.listLoading = false
      this.getJitterDataByPeerAndPfx()
    },

    async getJitterTopNPrefixByPeer(st, et) {
      this.listLoading = true
      const result = await getJitterTopNPrefixByPeer(this.ASValue, st, et, this.source)
      if (result.length === 0) {
        this.listLoading = false
        this.itemList = []
        this.line_data = []
        this.currentAsPathList = []
        return
      }
      this.nowDate = [st, et]
      if(result.length - 1 < this.defaultPfxIndex){
        this.defaultPfxIndex = result.length - 1
      }
      this.currentItem = result[this.defaultPfxIndex]['K']
      this.itemList = result
      this.listLoading = false
      this.getJitterDataByPeer()
    },
    async getJitterTopNPrefixByAs(st, et) {
      this.listLoading = true
      const result = await getJitterTopNPrefixByAs(this.ASValue, st, et, this.source).catch(e => {
        this.listLoading = false
        return
      })
      if (result.length === 0) {
        this.listLoading = false
        this.itemList = []
        this.line_data = []
        this.currentAsPathList = []
        return
      }
      this.nowDate = [st, et]
      if(result.length - 1 < this.defaultPfxIndex){
        this.defaultPfxIndex = result.length - 1
      }
      this.currentItem = result[this.defaultPfxIndex]['K']
      this.itemList = result
      this.listLoading = false
      this.getJitterData()
    },

    async getJitterTopNPrefixByAsAndPfx(st, et) {
      this.listLoading = true
      const result = await getJitterTopNPrefixByAsAndPfx(this.ASValue, this.prefixValue, st, et, this.source)
      if (result.length === 0) {
        this.listLoading = false
        this.itemList = []
        this.line_data = []
        this.currentAsPathList = []
        return
      }
      this.nowDate = [st, et]
      if(result.length - 1 < this.defaultPfxIndex){
        this.defaultPfxIndex = result.length - 1
      }
      this.currentItem = result[this.defaultPfxIndex]['K']
      this.itemList = result
      this.listLoading = false
      this.getJitterDataByASNAndPfx()
    },

    updateDataByTime(utcTimeStamp) {
      const startdate = utcTimeStamp[0]
      const enddate = utcTimeStamp[1]
      this.nowDate = [startdate, enddate]
      this[this.listAPIName](startdate, enddate)
    },

    selectDate(utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectDateZone(nowDateZone, utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectASN(item) {
      this.ASValue = item.value
      sessionStorage.setItem('JitterASItem', JSON.stringify(item))
      this.defaultPfxIndex = 0
      sessionStorage.removeItem('JitterDefalutPfxIndex')
      if (item.prefixList) {
        this.showSecondOptions = true
        sessionStorage.setItem('JitterShowSecondOptions', true)
        this.prefixValue = item.prefixList[0]
        sessionStorage.setItem('JitterPrefixValue', this.prefixValue)
        if (this.by === 'prefix') {
          this.listAPIName = 'getJitterTopNPrefixByAsAndPfx'
          sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByAsAndPfx')
          this.getJitterDataFuncName = 'getJitterDataByASNAndPfx'
          sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByASNAndPfx')
        }
        if (this.by === 'peer') {
          this.listAPIName = 'getJitterTopNPeerByPfx'
          sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPeerByPfx')
          this.getJitterDataFuncName = 'getJitterDataByPeerAndPfx'
          sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByPeerAndPfx')
        }
      } else {
        this.showSecondOptions = false
        sessionStorage.setItem('JitterShowSecondOptions', false)
        this.prefixValue = ''
        sessionStorage.removeItem('JitterPrefixValue')
        if (this.by === 'prefix') {
          this.listAPIName = 'getJitterTopNPrefixByAs'
          sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByAs')
          this.getJitterDataFuncName = 'getJitterData'
          sessionStorage.setItem('JitterDataFuncName', 'getJitterData')
        }
        if (this.by === 'peer') {
          this.listAPIName = 'getJitterTopNPrefixByPeer'
          sessionStorage.setItem('JitterListAPIName', 'getJitterTopNPrefixByPeer')
          this.getJitterDataFuncName = 'getJitterDataByPeer'
          sessionStorage.setItem('JitterDataFuncName', 'getJitterDataByPeer')
        }
      }
      this[this.listAPIName](...this.nowDate)
    },
    selectPrefix() {
      sessionStorage.setItem('JitterPrefixValue', this.prefixValue)
      this[this.listAPIName](...this.nowDate)
    },
    clickK(e) {
      if (this.chartLoading) {
        return
      }
      this.clickedLineDataIndex = -1
      if (e.target.parentNode.className.includes('prefix-item')) {
        this.currentItem = e.target.parentNode.dataset.k
        this.defaultPfxIndex = e.target.parentNode.dataset.idx
        sessionStorage.setItem('JitterDefalutPfxIndex',this.defaultPfxIndex)
      } else {
        this.currentItem = e.target.dataset.k
        this.defaultPfxIndex = e.target.dataset.idx
        sessionStorage.setItem('JitterDefalutPfxIndex',this.defaultPfxIndex)
      }
      this[this.getJitterDataFuncName]()
    },
    async getJitterPeerASPathByTimeStamp(ts) {
      this.pathLoading = true
      this.currentPage = 0
      this.currentTs = ts

      const { result_as_path, total } = await getJitterPeerASPathByTimeStamp(
        this.ASValue,
        this.currentItem,
        this.currentTs,
        this.currentPage,
        this.timeFrame,
        this.source
      ).catch(e => {
        this.pathLoading = false
      })
      this.byPeerTotal = total
      this.currentAsPathList = result_as_path.map(item => {
        item['showTips'] = false
        return item
      })
      this.pathLoading = false
    },
    async loadMoreAsPathList() {
      this.currentPage += 1
      const { result_as_path, total } = await getJitterPeerASPathByTimeStamp(
        this.ASValue,
        this.currentItem,
        this.currentTs,
        this.currentPage,
        this.timeFrame,
        this.source
      )
      result_as_path.forEach(item => {
        item['showTips'] = false
        this.currentAsPathList.push(item)
      })
    },
    clickLinePoint(index) {
      const useAPI = this.asPathList.length === 0
      if (useAPI) {
        this.getJitterPeerASPathByTimeStamp(this.line_data[0]['data'][index]['value'][0])
      } else {
        this.currentAsPathList = this.asPathList[index]
      }

      const clickedLineDataIndex = this.clickedLineDataIndex
      if (clickedLineDataIndex !== -1) {
        this.downplay(clickedLineDataIndex)
      }
      this.highlight(index)
      this.clickedLineDataIndex = index
    },
    async getJitterDataByPeerAndPfx() {
      this.chartLoading = true
      const result = await getJitterDataByPeerAndPfx(
        this.ASValue,
        this.prefixValue,
        this.currentItem,
        ...this.nowDate,
        this.source
      )
      const A_list = result['A_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const W_list = result['W_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const F_list = result['F_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const line_data = [
        {
          // name:'A',
          data: A_list,
          // type:'line'
        },
        {
          // name:'W',
          data: W_list,
          // type:'line'
        },
        {
          // name:'W',
          data: F_list,
          // type:'line'
        },
      ]
      this.line_data = line_data
      this.chartLoading = false
      this.clickLinePoint(result['A_list'].length - 1)
    },
    async getJitterDataByPeer() {
      this.chartLoading = true
      const result = await getJitterDataByPeer(this.ASValue, this.currentItem, ...this.nowDate, this.source)
      const A_list = result['A_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const W_list = result['W_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const F_list = result['F_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const line_data = [
        {
          // name:'A',
          data: A_list,
          // type:'line'
        },
        {
          // name:'W',
          data: W_list,
          // type:'line'
        },
        {
          // name:'W',
          data: F_list,
          // type:'line'
        },
      ]
      this.line_data = line_data
      this.chartLoading = false
      this.clickLinePoint(result['A_list'].length - 1)
    },
    async getJitterDataByASNAndPfx() {
      this.chartLoading = true
      const result = await getJitterDataByASNAndPfx(
        this.ASValue,
        this.prefixValue,
        this.currentItem,
        ...this.nowDate,
        this.source
      )
      const A_list = result['A_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const W_list = result['W_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const F_list = result['F_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const as_path_list = result['as_path_list']
      this.asPathList = as_path_list
      const line_data = [
        {
          // name:'A',
          data: A_list,
          // type:'line'
        },
        {
          // name:'W',
          data: W_list,
          // type:'line'
        },
        {
          // name:'W',
          data: F_list,
          // type:'line'
        },
      ]

      this.line_data = line_data
      this.chartLoading = false
      this.clickLinePoint(result['A_list'].length - 1)
    },
    async getJitterData() {
      this.chartLoading = true
      const result = await getJitterDataByPrefix(this.ASValue, this.currentItem, ...this.nowDate, this.source).catch(
        e => {
          console.error(e)
          this.chartLoading = false
          return
        }
      )
      const A_list = result['A_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const W_list = result['W_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const F_list = result['F_list']
        .sort((a, b) => a[0] - b[0])
        .map((item, index) => {
          return { name: index, value: item }
        })
      const as_path_list = result['as_path_list']
      this.asPathList = as_path_list
      const line_data = [
        {
          // name:'A',
          data: A_list,
          // type:'line'
        },
        {
          // name:'W',
          data: W_list,
          // type:'line'
        },
        {
          // name:'W',
          data: F_list,
          // type:'line'
        },
      ]

      this.line_data = line_data
      this.chartLoading = false
      this.clickLinePoint(result['A_list'].length - 1)
    },
    setDateToLast7Days() {
      this.timeFrame = 'Last 7 Days'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 7)
      this.nowDate = [st, et]
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLastDay() {
      this.timeFrame = 'Last 1 Day'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 1)
      this.nowDate = [st, et]
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLast30Days() {
      this.timeFrame = 'Last 30 Days'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 30)
      this.nowDate = [st, et]
      this.$refs['tz'].setTime(st, et)
    },
  },
}
</script>

<style lang="scss" scoped>
.jitter-router {
  padding: 10px;
  background-color: #f0f0f0;
  /* height: calc(100vh - 72px); */
}

.switch-box {
  margin-left: 10px;
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

.selector {
  width: calc(100% - 20px);
  background-color: #fff;
  padding: 10px 0;
  margin: 10px;
}

.tip {
  position: absolute;
  right: 30px;
  /* line-height: 38px; */
  margin-left: 20px;
}

.jitter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  height: calc(100vh - 72px);
  /* grid-auto-flow: column; */
}

.prefix-list {
  grid-row: 1/6;
  grid-column: 1/2;
  overflow-y: auto;
  height: calc(100vh - 72px);
}

.jitter-chart {
  grid-row: 1/3;
  grid-column: 2/5;
  background-color: #fff;
  /* height: calc(50vh - 36px); */
  padding: 10px;
  margin: 10px 10px 9px 10px;
  z-index: 0;
}

.jitter-as-path-chart {
  grid-row: 3/6;
  grid-column: 2/5;
  /* height: calc(50vh - 36px); */
  background-color: #fff;
  padding: 10px 10px 30px 10px;
  margin: 2px 10px 20px 10px;
  overflow: auto;
}

.by-peer-path-list,
.by-prefix-path-list {
  text-align: left;
  overflow: auto;
  white-space: nowrap;
  height: 100%;
}
.click-btn {
  color: #fff;
  border-color: #af86d8;
  background-color: #af86d8;
}
.btn {
  margin-left: 10px;
}

.prefix-item {
  display: flex;
  font-size: var(--middle-font-size);
  justify-content: space-between;
  padding: 20px;
  margin: 10px;
}

.click-prefix-item {
  background-color: #af86d8;
  color: #fff;
}

.unclick-prefix-item {
  background-color: #fff;
  color: #000;
}
/*  */
.peer-as-path {
  border: 1px #000 solid;
  padding: 10px 0 20px 0;
  display: flex;
  align-items: center;
}

.peer-as-path-content {
  padding: 10px;
  width: 100%;
  overflow-x: auto;
  display: block;
  flex-grow: 10;
}
.peer-as-path-prefix {
  width: 20%;
  text-align: center;
  font-size: var(--subTitle-font-size);
}

.peer-as-path-third-content {
  text-align: center;
  width: 20%;
  font-size: var(--subTitle-font-size);
}

.peer-as-path-third-content div {
  padding: 5px;
}

.by-box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
/* .last-as-path-icon{
  border: 1px solid #000;
  border-radius: 100%;
} */
</style>
<style>
.selector .el-input__inner,
.right-input .el-input__inner {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* html {
  overflow: hidden;
} */
</style>
