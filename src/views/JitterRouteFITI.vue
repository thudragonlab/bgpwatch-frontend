<template>
  <div class="jitter-router">
    <div class="selector">
      <TimeZone
        @change="selectDate"
        @changeDateZone="selectDateZone"
        ref="tz"
        :defaultDateTime="defaultDateTime"
        hiddenDate
      >
        <div>FITI （38272）</div>
        <div class="switch-box">
          <div>站点</div>
        </div>
        <el-select v-model="ASValue" filterable placeholder="请选择" @change="selectASN">
          <el-option v-for="item in ASOptions" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
        <el-button :class="['btn', timeFrame === 'Last 1 Day' ? 'click-btn' : '']" @click="setDateToLastDay"
          >Last 1 day</el-button
        >
        <el-button :class="['btn', timeFrame === 'Last 7 Days' ? 'click-btn' : '']" @click="setDateToLast7Days"
          >Last 7 days</el-button
        >
        <div class="by-box">
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
                  v-if="asPath.length === 2"
                  :style="{
                    color: asPath[0].includes('A') ? JitterLineOption.getColor()[0] : JitterLineOption.getColor()[1],
                  }"
                >
                  {{ asPath[0] }}
                  <el-tooltip
                    v-model="prefixItem['showTips']"
                    :manual="true"
                    class="item"
                    effect="dark"
                    :content="asPath[1]"
                    placement="top"
                  >
                    <i class="el-icon-top last-as-path-icon" @mouseover="showTip" @mouseout="hideTip" :data-idx="idx" />
                  </el-tooltip>
                </div>
                <div
                  v-else
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
  getFITIJitterTopNPrefixByPrefix,
  getFITIJitterDataByPrefix,
  getJitterPeerASPathByTimeStamp,
} from '@/api/RoutePathApi'
export default {
  name: 'JitterRouteFITI',
  components: {
    TimeZone,
  },
  data() {
    return {
      JitterLineOption,
      ASValue: '2001:253:1::a01',
      defaultDateTime: [],
      asPathList: [],
      currentAsPathList: [],
      timeFrame: '',
      source: 'Tsinghua',
      nowDate: [],
      currentItem: '',
      currentPage: 0,
      currentTs: 0,
      byPeerTotal: 0,
      itemList: [],
      line_data: [],
      chartLoading: false,
      pathLoading: false,
      listLoading: false,
      listAPIName: 'getJitterTopNPrefixByAs',
      getJitterDataFuncName: 'getJitterData',
      by: 'prefix',
      aaa: false,
      clickedLineDataIndex: -1,
      lineChart: undefined,

      ASOptions: [
        {
          label: '北京',
          value: '2001:253:1::a01',
        },
        {
          label: '上海',
          value: '2001:253:1::a02',
        },
        {
          label: '西安',
          value: '2001:253:1::a03',
        },
        {
          label: '南京',
          value: '2001:253:1::a04',
        },
        {
          label: '广州',
          value: '2001:253:1::a05',
        },
        {
          label: '沈阳',
          value: '2001:253:1::a06',
        },
        {
          label: '武汉',
          value: '2001:253:1::a07',
        },
        {
          label: '成都',
          value: '2001:253:1::a08',
        },
        {
          label: '北大',
          value: '2001:253:1::a09',
        },
        {
          label: '北邮',
          value: '2001:253:1::a10',
        },
        {
          label: '北航',
          value: '2001:253:1::a11',
        },
        {
          label: '复旦',
          value: '2001:253:1::a12',
        },
        {
          label: '同济',
          value: '2001:253:1::a13',
        },
        {
          label: '天津',
          value: '2001:253:1::a14',
        },
        {
          label: '合肥',
          value: '2001:253:1::a15',
        },
        {
          label: '厦门',
          value: '2001:253:1::a16',
        },
        {
          label: '重庆',
          value: '2001:253:1::a17',
        },
        {
          label: '兰州',
          value: '2001:253:1::a18',
        },
        {
          label: '哈尔滨',
          value: '2001:253:1::a19',
        },
        {
          label: '杭州',
          value: '2001:253:1::a20',
        },
        {
          label: '长春',
          value: '2001:253:1::a21',
        },
        {
          label: '大连',
          value: '2001:253:1::a22',
        },
        {
          label: '济南',
          value: '2001:253:1::a23',
        },
        {
          label: '长沙',
          value: '2001:253:1::a24',
        },
        {
          label: '郑州',
          value: '2001:253:1::a25',
        },
        {
          label: '深圳',
          value: '2001:253:1::a26',
        },

        {
          label: '石家庄',
          value: '2001:253:1::a27',
        },
        {
          label: '太原',
          value: '2001:253:1::a28',
        },
        {
          label: '呼和浩特',
          value: '2001:253:1::a29',
        },
        {
          label: '福州',
          value: '2001:253:1::a30',
        },
        {
          label: '南昌',
          value: '2001:253:1::a31',
        },
        {
          label: '青岛',
          value: '2001:253:1::a32',
        },
        {
          label: '南宁',
          value: '2001:253:1::a33',
        },
        {
          label: '海口',
          value: '2001:253:1::a34',
        },
        {
          label: '贵阳',
          value: '2001:253:1::a35',
        },
        {
          label: '昆明',
          value: '2001:253:1::a36',
        },
        {
          label: '拉萨',
          value: '2001:253:1::a37',
        },
        {
          label: '西宁',
          value: '2001:253:1::a38',
        },
        {
          label: '银川',
          value: '2001:253:1::a39',
        },
        {
          label: '乌鲁木齐',
          value: '2001:253:1::a40',
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
    if (!this.$route.query || this.$route.query.user !== 'fiti') {
      this.$router.replace('/')
    }
    this.$nextTick(() => {
      this.lineChart = this.$refs['jitter-line'].chart
      this.lineChart.getZr().on('click', params => {
        console.log(params)
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

    async byPrefix() {
      this.listAPIName = 'getJitterTopNPrefixByAs'
      this.getJitterDataFuncName = 'getJitterData'
      this.by = 'prefix'
      this.asPathList = []
      this.currentAsPathList = []
      this.currentPage = 0
      this.currentTs = 0
      this.byPeerTotal = 0
      await this[this.listAPIName](...this.nowDate)
    },

    async getJitterTopNPrefixByAs(st, et) {
      this.listLoading = true
      const result = await getFITIJitterTopNPrefixByPrefix(this.ASValue, st, et, this.source)
      if (result.length === 0) {
        this.listLoading = false
        return
      }
      this.nowDate = [st, et]
      this.currentItem = result[0]['K']
      this.itemList = result
      this.listLoading = false
      this.getJitterData()
    },

    updateDataByTime(utcTimeStamp) {
      const startdate = utcTimeStamp[0]
      const enddate = utcTimeStamp[1]
      this[this.listAPIName](startdate, enddate)
    },

    selectDate(utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectDateZone(nowDateZone, utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectASN() {
      this[this.listAPIName](...this.nowDate)
    },
    clickK(e) {
      if (this.chartLoading) {
        return
      }
      this.clickedLineDataIndex = -1
      if (e.target.parentNode.className.includes('prefix-item')) {
        this.currentItem = e.target.parentNode.dataset.k
      } else {
        this.currentItem = e.target.dataset.k
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
      )
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

    async getJitterData() {
      this.chartLoading = true
      const result = await getFITIJitterDataByPrefix(this.ASValue, this.currentItem, ...this.nowDate, this.source)
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
    },
    setDateToLast7Days() {
      this.timeFrame = 'Last 7 Days'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 7)
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLastDay() {
      this.timeFrame = 'Last 1 Day'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 1)
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLast30Days() {
      this.timeFrame = 'Last 30 Days'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 30)
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
