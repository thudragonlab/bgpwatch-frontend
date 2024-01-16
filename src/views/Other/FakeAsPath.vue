<template>
  <div class="component-container2">
    <TimeZone @change="selectDate" @changeDateZone="selectDateZone">
      <el-input placeholder="SEARCH BY  'suspicious AS-PATH','prefix'" v-model="searchText"></el-input>
    </TimeZone>
    <PaginationTable
      title="Type1"
      :titleStyle="{
        backgroundColor: '#fff',
        marginTop: '10px',
        height: '50px',
        lineHeight: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
      }"
      :originData="
        originType1Data.filter(item => {
          const l = ['suspicious AS-PATH', 'prefix']
          return !l.every(i => !item[i].includes(searchText))
        })
      "
      :showRule="type1showRule"
    ></PaginationTable>
    <div class="type2-title">
      Type2
      <span class="range"
        >range form <input style="width: 30px" v-model="minPredictValue" /> to
        <input style="width: 30px" v-model="maxPredictValue"
      /></span>
    </div>
    <PaginationTable
      :originData="
        originType2Data.filter(item => {
          return item['suspicious_link'][2] > minPredictValue && item['suspicious_link'][2] < maxPredictValue
        })
      "
      :showRule="type2showRule"
    ></PaginationTable>
  </div>
</template>

<script>
import TimeZone from '@/components/RouteMonitor/BaseTimeZone.vue'
import { getFakeAsPath } from '@/api/FakeAsPathApi'
import HtmlColumn from '@/components/Column/HtmlColumn'
import FakePathDetailColumn from '@/components/Column/FakePathDetailColumn'
export default {
  name: 'FakeAsPath',
  components: {
    TimeZone,
  },
  data() {
    return {
      dataZone: parseInt(new Date().getTimezoneOffset() / 60),
      originType1Data: [],
      originType2Data: [],
      st: '',
      et: '',
      minPredictValue: 0,
      maxPredictValue: 1,
      searchText: '',
      type1showRule: [
        {
          prop: 'suspicious AS',
          label: 'Suspicious AS',
          sortable: 'custom',
        },
        {
          prop: 'suspicious AS-PATH',
          label: 'As path',
        },
        {
          prop: 'reason',
          label: 'Reason',
        },
        {
          prop: 'prefix',
          label: 'Prefix',
        },
        {
          prop: 'datetime',
          label: 'Datetime',
        },
      ],
      type2showRule: [
        {
          prop: 'suspicious_link',
          label: 'suspicious links',
          subComponent: HtmlColumn,
          sortable: 'custom',
          compare: (a, b) => a['suspicious_link'][2] - b['suspicious_link'][2],
          rowFormat: row => {
            let str = `<div>${row['suspicious_link'][0]} -> ${row['suspicious_link'][1]} (${row['suspicious_link'][2]})</div>`
            return str
          },
        },
        // {
        //   prop: 'suspicious AS-PATH',
        //   label: 'as path',
        // },
        {
          prop: 'reasons',
          label: 'Reasons',
          subComponent: HtmlColumn,
          rowFormat: row => {
            let str = ''
            row.reasons.forEach(reason => {
              str += `<div>${reason}</div>`
            })
            return str === '' ? '-' : str
          },
        },
        {
          prop: 'max_score',
          label: 'Score',
          sortable: 'custom',
          compare: (a, b) => a.max_score - b.max_score,
        },
        {
          prop: 'datetime',
          label: 'datetime',
        },
        {
          prop: '',
          label: 'Detail',
          subComponent: FakePathDetailColumn,
        },
      ],
    }
  },
  methods: {
    async getFakeAsPath() {
      const result = await getFakeAsPath(this.st, this.et)
      const { type1_event, type2_aggregated_event } = result
      this.originType1Data = type1_event
      this.originType2Data = type2_aggregated_event
    },
    selectDate(utcDateArray) {
      this.updateDataByTime(utcDateArray)
      this.getFakeAsPath()
    },
    selectDateZone(nowDateZone, utcDateArray) {
      this.dataZone = nowDateZone
      this.updateDataByTime(utcDateArray)
      this.getFakeAsPath()
    },
    updateDataByTime(utcTimeStamp) {
      const startdate = utcTimeStamp[0] / 1000
      const enddate = utcTimeStamp[1] / 1000
      this.st = startdate
      this.et = enddate
    },
  },
}
</script>

<style lang="scss" scoped>
.component-container2 {
  padding: 10px;
  background-color: #f0f0f0;
  min-height: 100vh;
}

.type2-title {
  background-color: #fff;
  margin-top: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.range {
  position: absolute;
  right: 10px;
  padding-right: 10px;
}
</style>
