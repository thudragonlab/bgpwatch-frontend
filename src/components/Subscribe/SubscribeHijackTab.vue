<template>
  <div>
    <el-row class="filter" :gutter="20" type="flex" justify="space-between">
          <el-col :span="4">
            <div class="type select_item">
              <span class="span">Select event type</span>
              <el-select v-model="searchObj.event_type" style="width: 100%">
                <!-- @change="selectType()" -->
                <el-option v-for="item in TypeOptions" :key="item" :value="item" >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="level select_item">
              <span class="span">Select harm level</span>
              <el-select v-model="searchObj.level" style="width: 100%">
                <!-- @change="selectLevel()" -->
                <el-option v-for="item of LevelOptions" :key="item" :value="item">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="12">
            <TimeZone
              showLable
              @change="timeFilter"
              @changeDateZone="selectDateZone"
              :defaultDateTime="defaultDateTime"
            />
          </el-col>
          <el-col :span="3">
            <div class="keywords select_item">
              <span class="span">Duration </span>
              <el-switch
                v-model="durationGt3"
                :active-color="deepColor"
                class="select-in-all-switch"
                :inactive-color="softColor"
                active-text=">=3min"
                inactive-text="All"
              >
              </el-switch>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="keywords select_item">
              <span class="span">Select for event by keywords</span>
              <el-input
                placeholder="Please enter search key"
                prefix-icon="el-icon-search"
                v-model="searchObj.search"
                clearable
              >
              </el-input>
            </div>
          </el-col>
        </el-row>
    <PaginationTable
      ref="satable"
      :loading="loading"
      :origin-data="filterdata(originalData)"
      :show-rule="showRule"
      :table-param="{ DataZone, detailRoute: 'RouteMonitorDetail2' }"
      :paginationProp="{ background: true, layout: 'total, prev, pager, next' }"
      :defaultOrder="{ prop: 'start_time', order: 'descending' }"
      paginationProClass="anomaly-pagination"
      :indexCol="indexCol"
      @clickReject="clickReject"
    />
    <el-dialog :visible.sync="dialogVisible" title="Reject Reason">
      <el-input type="textarea" :rows="10" placeholder="Please input reason" v-model="reason"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              submitFunc(reason)
              dialogVisible = false
            }
          "
          >Submit</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHijackEvent } from '@/api/SubscribeApi'
import { deepColor, softColor } from '@/templates/chart/barTemplate'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone'
import HtmlColumn from '@/components/Column/HtmlColumn'
import PrefixNumCol from '@/components/Column/PrefixNumCol'
import LevelColumn from '@/components/Column/LevelColumn'
import StartDateColumn from '@/components/Column/StartDateColumn'
import EndDateColumn from '@/components/Column/EndDateColumn'
import AnomalyDetailColumn from '@/components/Column/AnomalyDetailColumn'
import AnomalyOptionColumn from '@/components/Column/AnomalyOptionColumn'

export default {
  name: 'SubscribeHijackTab',
  components: {
    TimeZone,
  },

  data() {
    return {deepColor,softColor,
      userInfo : localStorage.getItem('userInfo'),
      durationGt3: false,
      dialogVisible: false,
      clickedRowIndex: -1,
      defaultDateTime: [],
      reason: '',
      DataZone: 0,
      TypeOptions: ['All'],
      LevelOptions: ['All', 'High', 'Middle', 'Low'],
      submitFunc: () => {},
      originalData: [],
      loading: true,
      searchObj: {
        start_time: '',
        end_time: '',
        event_type: 'All',
        level: 'All',
        search: '',
      },
      sortObj: { column: 'start_time', order: 'descending' },
      indexCol: {
        width: '60px',
        renderHeader: h => {
          // <el-button class="download-btn" @click="download" icon="el-icon-download" circle></el-button>
          return h('el-button', {
            class: 'download-btn',
            props: {
              icon: 'el-icon-download',
              circle: true,
            },
            on: {
              click: this.download,
            },
          })
        },
      },
      showRule: [
        {
          prop: 'event_type',
          label: 'Event Type',
        },
        {
          prop: 'level',
          label: 'Level',
          subComponent: LevelColumn,
          width: '70px',
        },
        {
          prop: 'Description',
          label: 'Event Info',
          width: '300px',
          subComponent: HtmlColumn,
          rowFormat: row => {
            return row.Description
          },
        },
        {
          prop: 'prefix_num',
          label: 'Prefix Num',
          width: '120px',
          sortable: 'custom',
          compare: (a, b) => a.prefix_num - b.prefix_num,
          subComponent: PrefixNumCol,
          rowFormat: row => {
            return row.prefix_num
          },
        },
        {
          prop: 'example_prefix',
          label: 'Prefix Example',
          subComponent: HtmlColumn,
          rowFormat: row => {
            return row.example_prefix
          },
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
        {
          label: 'Comment',
          width: '170px',
          subComponent: AnomalyOptionColumn,
        },
      ],
    }
  },
  props: {},
  methods: {
    filterdata(originalData) {
      return originalData
        .filter(item => {
          if (this.durationGt3) {
            const dl = item.duration.split(':')
            if (dl.length == 1) {
              return false
            } else {
              return dl[1] >= 3
            }
          } else {
            return true
          }
        })
        .filter(item => {
          if (this.searchObj.event_type === 'All') {
            return true
          }
          return item.event_type === this.searchObj.event_type
        })
        .filter(item => {
          if (this.searchObj.level === 'All') {
            return true
          }
          return item.level.includes(this.searchObj.level.toLowerCase())
        })
        .filter(item => {
          const sss = this.searchObj.search.toLowerCase().split(',')
          if (sss.length === 2) {
            return item[sss[0]] === sss[1]
          }
          return (
            item.event_type.toLowerCase().includes(this.searchObj.search.toLowerCase()) ||
            item.Description.toLowerCase().includes(this.searchObj.search.toLowerCase())
          )
        })
    },

    clickReject(rowIndex) {
      this.clickedRowIndex = rowIndex
      this.dialogVisible = true
      this.submitFunc = this.$refs['satable']?.$refs['subComponent9'][rowIndex].reject
    },
    async getHijackEvent(st,et) {
      if(!this.userInfo){
        return
      }
      const result = await getHijackEvent(st,et)
      const typeObj = {}
      if(result.forEach){
      result.forEach(item => {
        typeObj[item.event_type] = item.event_type
        delete item['reject']
        delete item['confirm']
      })
      this.TypeOptions = ['All'].concat(Object.keys(typeObj))
      this.originalData = result
      this.loading = false
    }
    },
    selectDateZone(newDateZone, utcTimeStamp) {
      this.DataZone = newDateZone
      this.searchObj.start_time = this.getDateString(new Date(utcTimeStamp[0]))
      this.searchObj.end_time = this.getDateString(new Date(utcTimeStamp[1]))
      this.getHijackEvent(...utcTimeStamp)

    },
    timeFilter(utcTimeStamp) {
      this.loading = true
      let _utcTimeStamp = []
      // console.log(utcTimeStamp)
      if (utcTimeStamp && utcTimeStamp.length === 2) {
        this.searchObj.start_time = this.getDateString(new Date(utcTimeStamp[0]))
        this.searchObj.end_time = this.getDateString(new Date(utcTimeStamp[1]))
        _utcTimeStamp = utcTimeStamp
      } else {
        _utcTimeStamp = [null, null]
        this.searchObj.start_time = null
        this.searchObj.end_time = null
      }
      this.getHijackEvent(...utcTimeStamp)
    },
    getDateString(date) {
      // console.log(date)
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
    download() {
      const showingData = this.filterdata(this.originalData)
      if (!showingData.length) {
        return
      }
      const headRow = ['Index'].concat(Object.keys(showingData[0]))
      const csv = [headRow.join(',')]
      showingData.forEach((d, index) => {
        // console.log(d)
        const row = [index]
        Object.keys(d).forEach(dk => {
          if (d[dk] instanceof Array) {
            d[dk] = d[dk].flat(2).join(';')
          }
          d[dk] = String(d[dk])
          d[dk].replace(',', ';')
          row.push(d[dk])
        })
        csv.push(row.join(','))
      })
      const finalStr = csv.join('\n')
      const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(finalStr)
      const link = document.createElement('a')
      link.id = 'csv-a'
      link.href = uri
      // 对下载的文件命名
      link.download = `subscribe-hijack-event.csv`

      link.click()
    },
  },
  mounted() {
    // this.getHijackEvent()
  },
}
</script>

<style lang="scss" scoped>
  .filter {
    margin: 0;
    background-color: #fff;
    padding: 10px;
    color: rgb(102, 102, 102);
    .type,
    .level,
    .time,
    .dateZone,
    .keywords {
      text-align: left;
      .span {
        display: block;
        margin-bottom: 8px;
        font-size: var(--middle-font-size);
      }
    }
  }
  
  </style>
  <style>
.anomaly-pagination{
    background-color: #fff;
    padding-bottom: 10px;
  }
  </style>
