<template>
  <div class="component-container content">
    <div class="row-div">
      <div class="panel-body" style="width: 100%">
        <el-row class="filter" :gutter="20">
          <el-col :span="4">
            <div class="type select_item">
              <span>Select event type</span>
              <el-select @focus="setMinWidth" v-model="searchObj.event_type" style="width: 100%">
                <!-- @change="selectType()" -->
                <el-option v-for="item in TypeOptions" :key="item" :value="item" :style="{ width: minWidth + 'px' }">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="level select_item">
              <span>Select harm level</span>
              <el-select @focus="setMinWidth" v-model="searchObj.level" style="width: 100%">
                <!-- @change="selectLevel()" -->
                <el-option v-for="item of LevelOptions" :key="item" :value="item" :style="{ width: minWidth + 'px' }">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="10">
            <TimeZone showLable @change="timeFilter" @changeDateZone="selectDateZone" />
          </el-col>
          <el-col :span="6">
            <div class="keywords select_item">
              <span style="">Select for event by keywords</span>
              <el-input placeholder="Please enter search key" prefix-icon="el-icon-search" v-model="searchObj.search">
              </el-input>
            </div>
          </el-col>
        </el-row>
        <PaginationTable
          style="margin-top: 20px"
          :loading="loading"
          :origin-data="
            originalData
              .filter(item => {
                if (searchObj.event_type === 'All') {
                  return true
                }
                return item.event_type === searchObj.event_type
              })
              .filter(item => {
                if (searchObj.level === 'All') {
                  return true
                }
                return item.level.includes(searchObj.level.toLowerCase())
              })
              .filter(
                item =>
                  item.event_type.toLowerCase().includes(searchObj.search.toLowerCase()) ||
                  item.Description.toLowerCase().includes(searchObj.search.toLowerCase()) ||
                  item.level.toLowerCase().includes(searchObj.search.toLowerCase())
              )
          "
          :show-rule="showRule"
          :table-param="{ DataZone, detailRoute: 'RouteMonitorDetail' }"
          :paginationProp="{ background: true, layout: 'total, prev, pager, next' }"
          :defaultOrder="{ prop: 'start_time', order: 'descending' }"
          paginationProClass="anomaly-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getEventlist, getEventlistByDate, getEventlistLatest } from '@/api/routeMonitor'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone'
import HtmlColumn from '@/components/Column/HtmlColumn'
import LevelColumn from '@/components/Column/LevelColumn'
import StartDateColumn from '@/components/Column/StartDateColumn'
import EndDateColumn from '@/components/Column/EndDateColumn'
import AnomalyDetailColumn from '@/components/Column/AnomalyDetailColumn'
export default {
  name: 'Anomaly',
  created() {},
  components: {
    // PaginationTable,
    TimeZone,
  },
  data() {
    return {
      minWidth: '', // 用于存放单选框的长度
      sortObj: { column: 'start_time', order: 'descending' },
      showRule: [
        {
          prop: 'event_type',
          label: 'Event Type',
        },
        {
          prop: 'Description',
          label: 'Event Info',
          width: '350px',
          subComponent: HtmlColumn,
          rowFormat: row => {
            return row.Description
          },
        },
        {
          prop: 'prefix_num',
          label: 'Prefix Num',
          width: '100px',
        },
        {
          prop: 'example_prefix',
          label: 'Prefix',
          subComponent: HtmlColumn,
          rowFormat: row => {
            return row.example_prefix
          },
        },
        {
          prop: 'level',
          label: 'Level',
          subComponent: LevelColumn,
        },
        {
          prop: 'start_time',
          label: 'Start Time',
          sortable: 'custom',
          compare: (a, b) => new Date(a.start_time) - new Date(b.start_time),
          subComponent: StartDateColumn,
          rowFormat: row => {
            return row.start_time
          },
        },
        {
          prop: 'end_time',
          label: 'End Time',
          sortable: 'custom',
          compare: (a, b) => new Date(a.end_time) - new Date(b.end_time),
          subComponent: EndDateColumn,
          rowFormat: row => {
            return row.end_time
          },
        },
        {
          prop: 'duration',
          label: 'Duration',
          sortable: 'custom',
          compare: (a, b) => {
            const a_first = a.duration.indexOf(':')
            const a_last = a.duration.lastIndexOf(':')
            const b_first = b.duration.indexOf(':')
            const b_last = b.duration.lastIndexOf(':')

            return (
              parseInt(a.duration.substring(0, a_first)) * 3600 +
              parseInt(a.duration.substring(a_first + 1, a_last)) * 60 +
              parseInt(a.duration.substring(a_last + 1)) -
              (parseInt(b.duration.substring(0, b_first)) * 3600 +
                parseInt(b.duration.substring(b_first + 1, b_last)) * 60 +
                parseInt(b.duration.substring(b_first + 1)))
            )
          },
        },
        {
          label: 'Detail',
          width: '60px',
          subComponent: AnomalyDetailColumn,
        },
      ],
      // TypeOptions: ['All', 'Possible Hijack', 'Route Leak', 'Outage', 'Benign MOAS'],
      TypeOptions: ['All'],
      LevelOptions: ['All', 'High', 'Middle', 'Low'],
      DataZoneOptions: [
        { label: 'GMT+12', value: -12 },
        { label: 'GMT+11', value: -11 },
        { label: 'GMT+10', value: -10 },
        { label: 'GMT+9', value: -9 },
        { label: 'GMT+8', value: -8 },
        { label: 'GMT+7', value: -7 },
        { label: 'GMT+6', value: -6 },
        { label: 'GMT+5', value: -5 },
        { label: 'GMT+4', value: -4 },
        { label: 'GMT+3', value: -3 },
        { label: 'GMT+2', value: -2 },
        { label: 'GMT+1', value: -1 },
        { label: 'GMT', value: 0 },
        { label: 'GMT-1', value: 1 },
        { label: 'GMT-2', value: 2 },
        { label: 'GMT-3', value: 3 },
        { label: 'GMT-4', value: 4 },
        { label: 'GMT-5', value: 5 },
        { label: 'GMT-6', value: 6 },
        { label: 'GMT-7', value: 7 },
        { label: 'GMT-8', value: 8 },
        { label: 'GMT-9', value: 9 },
        { label: 'GMT-10', value: 10 },
        { label: 'GMT-11', value: 11 },
      ],
      DataZone: parseInt(new Date().getTimezoneOffset() / 60),
      originalData: [], // 按怀疑级别排序后的原始数据
      tableData: [],
      searchObj: {
        start_time: '',
        end_time: '',
        event_type: 'Possible Hijack',
        level: 'All',
        search: '',
      },
      loading: false,
    }
  },
  mounted() {
    // this.loading = true
  },
  methods: {
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    selectDateZone(newDateZone, utcTimeStamp) {
      this.DataZone = newDateZone
      this.searchObj.start_time = utcTimeStamp[0]
      this.searchObj.end_time = utcTimeStamp[1]
    },
    getDateString(date) {
      const year = date.getFullYear()
      const month = this.addZeroBefore(date.getMonth() + 1)
      const day = this.addZeroBefore(date.getDate())
      const hour = this.addZeroBefore(date.getHours())
      const minute = this.addZeroBefore(date.getMinutes())
      const second = this.addZeroBefore(date.getSeconds())

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    addZeroBefore(num) {
      return num < 10 ? `0${num}` : num
    },
    timeFilter(utcTimeStamp) {
      this.loading = true
      if (utcTimeStamp || utcTimeStamp.length === 2) {
        this.searchObj.start_time = this.getDateString(new Date(utcTimeStamp[0]))
        this.searchObj.end_time = this.getDateString(new Date(utcTimeStamp[1]))
      } else {
        this.searchObj.start_time = null
        this.searchObj.end_time = null
      }
      getEventlistByDate(this.searchObj.start_time, this.searchObj.end_time).then(res => {
        const typeObj = {}
        res.forEach(item => (typeObj[item.event_type] = item.event_type))
        this.TypeOptions = ['All'].concat(Object.keys(typeObj))
        this.originalData = res
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss">
.content {
  .filter {
    display: flex;
    margin: 0 auto;
    color: rgb(102, 102, 102);
    .type,
    .level,
    .time,
    .dateZone,
    .keywords {
      text-align: left;
      span {
        display: block;
        margin-bottom: 8px;
        font-size: var(--middle-font-size);
      }
    }
  }
  .anomaly-pagination {
    text-align: left;
    margin-top: 20px;
  }
}

.row-div {
}
</style>
