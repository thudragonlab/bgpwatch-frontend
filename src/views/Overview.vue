<template>
  <div class="statistic-box">
    <div class="time-zone-selector">
      <div class="time-zone-box">
        <TimeZone
          @change="selectDate"
          @changeDateZone="selectDateZone"
          ref="tz"
          :defaultDateTime="defaultDateTime"
          hiddenDate
        >
          <div class="switch-box">
            <div>{{ useSelector ? 'Selector' : 'ASN' }}</div>
            <el-switch
              v-model="useSelector"
              class="my-switch"
              :inactive-color="softColor"
              :active-color="deepColor"
            ></el-switch>
          </div>
          <el-input v-show="!useSelector" class="right-input" v-model="asInput" placeholder="ASN">
            <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
          </el-input>
          <el-cascader
            v-show="useSelector"
            class="selector"
            placeholder="country/region"
            :options="options"
            filterable
            v-model="selectedOption"
            clearable
            @change="DoSelect"
            :show-all-levels="false"
          ></el-cascader>
          <el-button :class="['btn', timeFrame === 'Last 7 Days' ? 'click-btn' : '']" @click="setDateToLast7Days"
            >Last 7 days</el-button
          >
          <el-button :class="['btn', timeFrame === 'Last 30 Days' ? 'click-btn' : '']" @click="setDateToLast30Days"
            >Last 30 days</el-button
          >
          <el-button :class="['btn', timeFrame === 'Last Year' ? 'click-btn' : '']" @click="setDateToLastYear"
            >Last 12 months</el-button
          >
          <el-button :class="['btn', timeFrame === '2022' ? 'click-btn' : '']" @click="setDateTo2022">2022</el-button>
          <el-button :class="['btn', timeFrame === '2023' ? 'click-btn' : '']" @click="setDateTo2023">2023</el-button>
          <el-button :class="['btn', timeFrame === 'AllData' ? 'click-btn' : '']" @click="setDateToAllData"
            >All Data</el-button
          >
        </TimeZone>
      </div>
    </div>
    <div class="statistic-grid">
      <div class="line1 shadow">
        <div>
          <div class="left-btn">
            <el-button size="mini" class="click-btn" @click="downloadData">DOWNLOAD DATA(CSV)</el-button>
          </div>
          <div class="switch-btn">
            <el-button size="mini" :class="['mini-btn', byWhat === 'Daily' ? 'click-btn' : '']" @click="switchToDays"
              >Daily</el-button
            >
            <el-button
              v-if="timeFrame != 'Last 7 Days'"
              size="mini"
              :class="['mini-btn', byWhat === 'Weekly' ? 'click-btn' : '']"
              @click="switchToWeek"
              >Weekly</el-button
            >
            <el-button
              v-if="!['Last 7 Days', 'Last 30 Days'].includes(timeFrame)"
              size="mini"
              autofocus
              :class="['mini-btn', byWhat === 'Monthly' ? 'click-btn' : '']"
              @click="switchToMonth"
              >Monthly</el-button
            >
            <el-button
              v-if="!['Last 7 Days', 'Last 30 Days', 'Last Year'].includes(timeFrame)"
              size="mini"
              :class="['mini-btn', byWhat === 'Yearly' ? 'click-btn' : '']"
              @click="switchToYear"
              >Yearly</el-button
            >
          </div>
        </div>
        <Chart
          chartId="line1"
          :option="
            new BarOption(
              `Event Count ${asInput ? `for AS${asInput} ` : ''}${
                selectedOption.length === 2 ? `for ${code_country[this.selectedOption[1]]} ` : ''
              }${valueProp === 'victim_count' ? 'as victim ' : ''}${
                valueProp === 'attacker_count' ? 'as attacker ' : ''
              }${byWhat}`
            ).getOption(['title', 'tooltip', 'xAxis', 'yAxis', 'grid', 'legend'])
          "
          :series="lineData"
          :replaceMerge="['series']"
          :EventList="{
            click: clickPoint,
          }"
        ></Chart>
      </div>
    </div>
  </div>
</template>

<script>
import { OverviewBarOption } from '@/templates/chart/barTemplate'
import { deepColor, softColor } from '@/templates/chart/barTemplate'
import { getOverviewData } from '@/api/OverviewApi'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone.vue'
import continent2ccMap from '@/../public/static/continent2ccMap.json'
import code_country from '@/../public/static/code_country.json'
export default {
  name: 'Statistics',
  components: {
    TimeZone,
  },
  data() {
    return {
      code_country,
      deepColor,
      softColor,
      BarOption: OverviewBarOption,
      staticLineSeries: {
        type: 'bar',
        data: [],
        universalTransition: {
          enabled: true,
          divideShape: 'clone',
        },
      },
      OriginLineData: {},
      lineData: [],
      nowDate: [],
      selectedOption: [],
      options: [],
      asInput: '',
      showVAA: false,
      byWhat: '',
      timeFrame: '',
      useSelector: true,
      defaultHandleFunc: 'makeMonthLineData',
      HandleFuncTitleMapping: {
        makeYearLineData: 'Yearly',
        makeMonthLineData: 'Monthly',
        makeWeekLineData: 'Weekly',
        makeDaysLineData: 'Daily',
      },
      ccList: [
        'AR',
        'AT',
        'AU',
        'BD',
        'BG',
        'BR',
        'CA',
        'CH',
        'CL',
        'CN',
        'CO',
        'CZ',
        'DE',
        'DK',
        'FI',
        'ES',
        'FR',
        'GB',
        'HK',
        'HU',
        'ID',
        'IE',
        'IN',
        'IR',
        'IT',
        'JP',
        'KH',
        'KR',
        'LK',
        'LU',
        'LV',
        'MX',
        'MY',
        'NG',
        'NL',
        'NO',
        'NP',
        'NZ',
        'PH',
        'PL',
        'RO',
        'PK',
        'PT',
        'RU',
        'SE',
        'SG',
        'TH',
        'SK',
        'TR',
        'TW',
        'UA',
        'US',
        'ZA',
        'GS',
        'AQ',
        'BV',
        'TF',
        'HM',
      ],
      lastLaunchLineFunc: undefined,
      valueProp: 'amount',
      defaultDateTime: [],
      colorMap: {
        'Possible Hijack': ['#529ADE', '#5470c6'],
        'Possible SubHijack': ['#91cc75', '#BFE376'],
        All: ['#fac858', '#E3A144'],
      },
      VAMappling: {
        Victim: 'victim_count',
        Attacker: 'attacker_count',
      },
    }
  },
  async mounted() {
    // Make Country/region options
    const options = {}
    const continentMapping = {
      AF: 'Africa',
      AS: 'Asia',
      EU: 'Europe',
      NA: 'North America',
      OA: 'Oceania',
      SA: 'South America',
      AN: 'Antarctica',
    }
    this.ccList.forEach(i => {
      const o = {}
      const continentCode = continent2ccMap[i]
      if (!options[continentCode]) {
        options[continentCode] = {
          value: continentCode,
          label: continentMapping[continentCode],
          children: [],
        }
      }
      o['value'] = i
      o['label'] = code_country[i]
      options[continentCode]['children'].push(o)
    })
    this.options = Object.values(options)
  },
  created() {
    const st = new Date()
    const et = new Date()
    st.setFullYear(st.getFullYear() - 1)
    this.defaultDateTime = [st, et]
    this.timeFrame = 'Last Year'
  },

  methods: {
    _yearSortFunc(a, b) {
      return a.name - b.name
    },
    async getOverviewData(st, et) {
      this.lineData = []
      // console.log('this.selectedOption', this.selectedOption, this.asInput)
      if (this.selectedOption.length == 2 || this.asInput) {
        this.showVAA = true
      } else {
        this.showVAA = false
      }
      this.nowDate = [st, et]
      const result = await getOverviewData(st, et, this.selectedOption[1], this.asInput)
      this.OriginLineData = result.stat_series
      this[this.defaultHandleFunc]()
      this.byWhat = this.HandleFuncTitleMapping[this.defaultHandleFunc]
      this.lastLaunchLineFunc = this.defaultHandleFunc
    },
    makeLineData(dataObj, lineData, valueProp, aggregate = false) {
      if (aggregate) {
        Object.keys(dataObj).forEach(k => {
          const v = dataObj[k]
          const st = parseInt(v['min_ts'])
          const et = parseInt(v['max_ts'])
          if (!lineData[k]) {
            lineData[k] = { value: 0, st, et }
          }
          lineData[k]['value'] += v[valueProp]
          lineData[k]['st'] = Math.min(lineData[k]['st'], st)
          lineData[k]['et'] = Math.max(lineData[k]['et'], et)
          lineData[k]['condition'] = this.useSelector ? this.selectedOption[0] && this.selectedOption[1] : this.asInput
        })
      } else {
        Object.keys(dataObj).forEach(k => {
          const v = dataObj[k]
          // console.log(v)
          const st = parseInt(v['min_ts'])
          const et = parseInt(v['max_ts'])
          lineData.push({
            name: k,
            value: [k, v[valueProp]],
            condition: this.useSelector ? this.selectedOption[1] : this.asInput,
            st,
            et,
          })
        })
      }
    },
    makeLineDataFormObj(DatObj) {
      const data = []
      Object.keys(DatObj).forEach(k => {
        data.push({
          name: k,
          value: [k, DatObj[k]['value']],
          groupId: k,
          st: DatObj[k]['st'],
          et: DatObj[k]['et'],
          condition: DatObj[k]['condition'],
        })
      })
      return data
    },
    makeNewSeriesVAT(series, VAT, index) {
      const newSeries = Object.assign(
        {
          name: `${series.name}-${VAT}`,
          stack: series.name,
          itemStyle: {
            color: this.colorMap[series.name][index],
          },
        },
        this.staticLineSeries
      )
      newSeries.data = []
      return newSeries
    },
    processDataWithCond(sortFuncName, layer, super_layer, x_index) {
      const lineData = []
      this.OriginLineData.forEach(series => {
        Object.keys(this.VAMappling).forEach((VAT, index) => {
          const newSeries = this.makeNewSeriesVAT(series, VAT, index)
          newSeries.data = []
          if (x_index) {
            this.recursiveData(series.data, super_layer, newSeries.data, this.VAMappling[VAT], x_index)
            newSeries.dataGroupId = x_index
          } else {
            const o = {}
            this.recursiveData(series.data, layer, o, this.VAMappling[VAT])
            newSeries.data = this.makeLineDataFormObj(o)
          }
          newSeries.data.sort(this[sortFuncName])
          lineData.push(newSeries)
        })
      })
      return lineData
    },
    processDataWithNoCond(sortFuncName, layer, super_layer, x_index) {
      const lineData = this.OriginLineData.map(series => {
        const newSeries = this.makeNewSeriesObj(series)
        if (x_index) {
          this.recursiveData(series.data, super_layer, newSeries.data, this.valueProp, x_index)
          newSeries.dataGroupId = x_index
        } else {
          const o = {}
          this.recursiveData(series.data, layer, o, this.valueProp)
          newSeries.data = this.makeLineDataFormObj(o)
        }
        newSeries.data.sort(this[sortFuncName])
        return newSeries
      })
      return lineData
    },
    makeYearLineData() {
      if (this.selectedOption.length == 2 || this.asInput) {
        this.lineData = this.processDataWithCond('_yearSortFunc', 'year', 'none', undefined)
      } else {
        this.lineData = this.processDataWithNoCond('_yearSortFunc', 'year', 'none', undefined)
      }
    },
    _monthSortFunc(a, b) {
      const [aM, aY] = a.value[0].split(',')
      const [bM, bY] = b.value[0].split(',')
      if (aY !== bY) {
        return aY - bY
      } else {
        return aM - bM
      }
    },
    makeMonthLineData(iyk = undefined) {
      if (this.selectedOption.length == 2 || this.asInput) {
        this.lineData = this.processDataWithCond('_monthSortFunc', 'month', 'year', iyk)
      } else {
        this.lineData = this.processDataWithNoCond('_monthSortFunc', 'month', 'year', iyk)
      }
    },
    _weekSortFunc(a, b) {
      const [aW, aY] = a.value[0].split(',')
      const [bW, bY] = b.value[0].split(',')
      if (aY !== bY) {
        return aY - bY
      } else {
        const aw = aW.split(' ')[1]
        const bw = bW.split(' ')[1]
        return aw - bw
      }
    },
    makeWeekLineData(imk = undefined) {
      if (this.selectedOption.length == 2 || this.asInput) {
        this.lineData = this.processDataWithCond('_weekSortFunc', 'weeks', 'month', imk)
      } else {
        this.lineData = this.processDataWithNoCond('_weekSortFunc', 'weeks', 'month', imk)
      }
    },
    _daySortFunc(a, b) {
      const [aY, aM, aD] = a.value[0].split('-')
      const [bY, bM, bD] = b.value[0].split('-')
      if (aY !== bY) {
        return aY - bY
      } else if (aM !== bM) {
        return aM - bM
      } else {
        return aD - bD
      }
    },
    makeDaysLineData(iwk = undefined) {
      if (this.selectedOption.length == 2 || this.asInput) {
        this.lineData = this.processDataWithCond('_daySortFunc', 'days', 'weeks', iwk)
      } else {
        this.lineData = this.processDataWithNoCond('_daySortFunc', 'days', 'weeks', iwk)
      }
    },
    makeNewSeriesObj(series) {
      const newSeries = Object.assign(
        {
          name: series.name,
        },
        this.staticLineSeries
      )
      newSeries.data = []
      return newSeries
    },
    recursiveData(source, stopProp, targetLO, valueProp, i = undefined) {
      // console.log(targetLO)
      const currentDataList = []
      if (stopProp === 'year') {
        if (i) {
          currentDataList.push(source[i]['month'])
        } else {
          currentDataList.push(source)
        }
      } else {
        for (let index = 0; index < Object.keys(source).length; index++) {
          const yk = Object.keys(source)[index]
          if (stopProp === 'month') {
            if (i) {
              if (Object.keys(source[yk]['month']).includes(i)) {
                currentDataList.push(source[yk]['month'][i]['weeks'])
              }
              continue
            }
            currentDataList.push(source[yk]['month'])
            continue
          }

          for (let index = 0; index < Object.keys(source[yk]['month']).length; index++) {
            const mk = Object.keys(source[yk]['month'])[index]
            if (stopProp === 'weeks') {
              if (i) {
                if (Object.keys(source[yk]['month'][mk]['weeks']).includes(i)) {
                  currentDataList.push(source[yk]['month'][mk]['weeks'][i]['days'])
                }
                continue
              }
              currentDataList.push(source[yk]['month'][mk]['weeks'])
              continue
            }
            for (let index = 0; index < Object.keys(source[yk]['month'][mk]['weeks']).length; index++) {
              const wk = Object.keys(source[yk]['month'][mk]['weeks'])[index]
              if (stopProp === 'days') {
                currentDataList.push(source[yk]['month'][mk]['weeks'][wk]['days'])
                continue
              }
            }
          }
        }
      }
      let doaggregate = false

      // if (i === undefined && (stopProp === 'month' || stopProp === 'weeks')) {
      if (i === undefined) {
        doaggregate = true
      }

      currentDataList.forEach(dl => {
        if (doaggregate) {
          this.makeLineData(dl, targetLO, valueProp, true)
        } else {
          this.makeLineData(dl, targetLO, valueProp)
        }
      })
    },
    switchToDays() {
      this.makeDaysLineData()
      this.lastLaunchLineFunc = 'makeDaysLineData'
      this.byWhat = 'Daily'
    },
    switchToWeek() {
      this.makeWeekLineData()
      this.lastLaunchLineFunc = 'makeWeekLineData'
      this.byWhat = 'Weekly'
    },
    switchToMonth() {
      this.makeMonthLineData()
      this.lastLaunchLineFunc = 'makeMonthLineData'
      this.byWhat = 'Monthly'
    },
    switchToYear() {
      this.makeYearLineData()
      this.lastLaunchLineFunc = 'makeYearLineData'
      this.byWhat = 'Yearly'
    },
    clickPoint(e) {
      const value = e.data.value
      if (value[0].includes('-')) {
        return
      } else if (value[0].includes('Week')) {
        const wk = e.name
        this.byWhat = 'Daily'
        this.makeDaysLineData(wk)
      } else if (value[0].includes(',')) {
        const mk = e.name
        // console.log(e)
        this.byWhat = 'Weekly'
        this.makeWeekLineData(mk)
      } else {
        const yk = e.name
        this.byWhat = 'Monthly'
        this.makeMonthLineData(yk)
      }
    },
    selectDate(utcDateArray) {
      this.updateDataByTime(utcDateArray)
    },
    selectDateZone(nowDateZone, utcDateArray) {
      this.dataZone = nowDateZone
      this.updateDataByTime(utcDateArray)
    },
    updateDataByTime(utcTimeStamp) {
      const startdate = utcTimeStamp[0]
      const enddate = utcTimeStamp[1]
      this.getOverviewData(startdate, enddate)
    },
    setDateTo2022() {
      this.timeFrame = '2022'
      this.defaultHandleFunc = 'makeMonthLineData'
      this.$refs['tz'].setTime(new Date('2022-01-01'), new Date('2022-12-31'))
    },
    setDateTo2023() {
      this.timeFrame = '2023'
      this.defaultHandleFunc = 'makeMonthLineData'
      this.$refs['tz'].setTime(new Date('2023-01-01'), new Date('2023-12-31'))
    },
    setDateToAllData() {
      this.timeFrame = 'AllData'
      this.defaultHandleFunc = 'makeYearLineData'
      this.getOverviewData(-1, new Date().getTime())
    },
    setDateToLastYear() {
      this.timeFrame = 'Last Year'
      this.defaultHandleFunc = 'makeMonthLineData'
      const st = new Date()
      const et = new Date()
      st.setFullYear(st.getFullYear() - 1)
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLast30Days() {
      this.timeFrame = 'Last 30 Days'
      this.defaultHandleFunc = 'makeWeekLineData'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 30)
      this.$refs['tz'].setTime(st, et)
    },
    setDateToLast7Days() {
      this.timeFrame = 'Last 7 Days'
      this.defaultHandleFunc = 'makeDaysLineData'
      const st = new Date()
      const et = new Date()
      st.setDate(st.getDate() - 7)
      this.$refs['tz'].setTime(st, et)
    },
    switchToVictim() {
      // this.valueProp = 'victim_count'
      this[this.lastLaunchLineFunc]()
    },
    switchToAttcker() {
      this[this.lastLaunchLineFunc]()
    },
    switchToAmount() {
      this[this.lastLaunchLineFunc]()
    },
    async downloadData() {
      let str = ''
      const data = []
      const title = [,]
      const dO = {}
      this.lineData.forEach(ld => {
        title.push(ld.name)
        // console.log(ld.data)
        ld.data.forEach(i => {
          const k = i.name.replace(',', ' ')

          if (!dO[k]) {
            dO[k] = []
          }
          dO[k].push(i.value[1])
        })
      })
      Object.keys(dO).forEach(k => {
        data.push([k].concat(dO[k]))
      })
      // console.log(data)
      const a = [title].concat(data)
      a.forEach(item => {
        str += `${item.join(',')}\n`
      })
      const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
      const link = document.createElement('a')
      link.href = uri
      // 对下载的文件命名
      link.download = `${new Date(this.nowDate[0]).toLocaleString()}-${new Date(this.nowDate[1]).toLocaleString()}.csv`
      link.click()
    },
    async DoSelect() {
      this.asInput = ''
      this.getOverviewData(...this.nowDate)
    },
    async doSearch() {
      this.selectedOption = []
      this.getOverviewData(...this.nowDate)
    },
  },
}
</script>

<style lang="scss" scoped>
.statistic-box {
  background-image: linear-gradient(45deg, #efbdfa, #cbe3fd, #f9d9d9);
  height: calc(100vh - 72px);
  .statistic-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
    height: calc(100% - 92px);
  }
}
.time-zone-selector {
  padding: 20px 10px;
  animation-name: fade_in_line;
  animation-duration: var(--animation-during);
  animation-fill-mode: forwards;

  .time-zone-box {
    // padding: 0 0 6px 0;
    background-size: 200%;
    transition: background-position 5s;
    box-shadow: var(--shadow-args);
    border-radius: var(--border-radius-deg);
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
.line1 {
  grid-column: 1/6;
  grid-row: 1/4;
  background-color: #fff;
  margin: 10px;
  .switch-btn {
    margin-top: 10px;
    position: absolute;
    right: 10px;
    z-index: 1;
    height: 50px;
    width: 300px;
    border-radius: var(--border-radius-deg);
    display: flex;
    align-items: flex-start;
    margin-right: 10px;
    justify-content: flex-end;
    flex-wrap: wrap;
    .mini-btn {
      margin-bottom: 10px;
    }
  }
  .left-btn {
    position: absolute;
    // left: 10px;
    z-index: 1;
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    align-items: flex-start;
    // justify-content: flex-end;
    height: 50px;
    width: 250px;
  }
}

.btn {
  margin-left: 10px;
}

// .right-btn {
//   justify-self: flex-end;
// }
.right-input {
  width: 192.5px;
  // position: absolute;
  // right: 10px;
  // margin-right: 10px;
  // margin-left: 10px;
  // align-self: flex-end;
  // float: right;
}

// .mini-btn:active,
// .mini-btn:focus,
// .btn:active,
// .btn:focus {
//   color: #fff;
//   border-color: #af86d8;
//   background-color: #af86d8;
// }

.click-btn {
  color: #fff;
  border-color: #af86d8;
  background-color: #af86d8;
}
.switch-box {
  margin-left: 10px;
  width: 70px;
  height: 38px;
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
.my-switch {
  height: 15px !important;
}

.my-switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  text-align: center;
}
/*打开时文字位置设置*/
.my-switch .el-switch__label--right {
  font-weight: bold;
  z-index: 1;
  right: 6px;
}
/*关闭时文字位置设置*/
.my-switch .el-switch__label--left {
  font-weight: bold;
  z-index: 1;
  left: 6px; /*不同场景下可能不同，自行调整*/
}
/*显示文字*/
.my-switch .el-switch__label.is-active {
  display: block;
}
.my-switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  /* width: 75px !important; 开关按钮的宽度大小 */
  height: 15px !important;
  line-height: 20px;
}

.my-switch .el-switch__core:after {
  height: 11px !important;
  border-radius: 10px !important;
  /* top: 0px !important;
  left: 0px !important; */
}
.selector .el-input__inner,
.right-input .el-input__inner {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
