<template>
  <div class="component-container content">
    <div class="row-div">
      <div class="panel-body" style="width: 100%">
        <el-row class="filter" :gutter="20" type="flex" justify="space-between">
          <el-col :span="4">
            <div class="type select_item">
              <span class="span">Select event type</span>
              <el-select @focus="setMinWidth" v-model="searchObj.event_type" style="width: 100%">
                <!-- @change="selectType()" -->
                <el-option v-for="item in TypeOptions" :key="item" :value="item" :style="{ width: minWidth + 'px' }">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="level select_item">
              <span class="span">Select harm level</span>
              <el-select @focus="setMinWidth" v-model="searchObj.level" style="width: 100%">
                <!-- @change="selectLevel()" -->
                <el-option v-for="item of LevelOptions" :key="item" :value="item" :style="{ width: minWidth + 'px' }">
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
              <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <!-- <el-button class="download-btn" @click="download" icon="el-icon-download" circle></el-button> -->
        <PaginationTable
          style="margin-top: 20px"
          :loading="loading"
          :origin-data="filterdata(originalData)"
          :show-rule="showRule"
          :table-param="{ DataZone, detailRoute: 'RouteMonitorDetail2' }"
          :paginationProp="{ background: true, layout: 'total, prev, pager, next' }"
          :defaultOrder="{ prop: 'start_time', order: 'descending' }"
          paginationProClass="anomaly-pagination"
          :indexCol="indexCol"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { deepColor, softColor } from '@/templates/chart/barTemplate'
import { getMoasEventlistByDate } from '@/api/AnomalyApi'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone'
import HtmlColumn from '@/components/Column/HtmlColumn'
import PrefixNumCol from '@/components/Column/PrefixNumCol'

import LevelColumn from '@/components/Column/LevelColumn'
import StartDateColumn from '@/components/Column/StartDateColumn'
import EndDateColumn from '@/components/Column/EndDateColumn'
import AnomalyDetailColumn from '@/components/Column/AnomalyDetailColumn'
export default {
  name: 'Anomaly',
  created() {
    if (Object.keys(this.$route.query).length !== 0) {
      const { st, et, event_type, searchContent } = this.$route.query
      if (st && et) {
        const std = new Date(Number(st))
        const etd = new Date(Number(et))
        // console.log('st', st, et, std, etd)
        this.defaultDateTime = [std, etd]
      }
      if (event_type) {
        this.searchObj.event_type = event_type
      }
      if (searchContent) {
        this.searchObj.search = searchContent
      }
    }else{
      console.log("?")
      const now = new Date()
      const last3Day = new Date()
      last3Day.setDate(now.getDate() - 1)
      this.defaultDateTime = [last3Day, now]
    }
  },
  components: {
    TimeZone,
  },

  data() {
    return {
      deepColor,
      softColor,
      minWidth: '', // 用于存放单选框的长度
      defaultDateTime: [],
      durationGt3: false,
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
          width: '350px',
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
      ],
      TypeOptions: ['All'],
      LevelOptions: ['All', 'High', 'Middle', 'Low'],
      DataZone: 0,
      originalData: [], // 按怀疑级别排序后的原始数据
      tableData: [],
      searchObj: {
        start_time: '',
        end_time: '',
        event_type: 'All',
        level: 'All',
        search: '',
      },
      loading: false,
    }
  },
  mounted() {},
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
            item.Description.toLowerCase().includes(this.searchObj.search.toLowerCase()) ||
            item.example_prefix.includes(this.searchObj.search)
          )
        })
    },
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    getMoasEventlistByDate(utcTimeStamp){
      getMoasEventlistByDate(...utcTimeStamp).then(res => {
        const {data,limit} = res
        if(limit){
          this.$messageBox(`Data exceeds maximum limit, returning 10000 records!`)
        }
        const typeObj = {}
        data.forEach(item => (typeObj[item.event_type] = item.event_type))
        this.TypeOptions = ['All'].concat(Object.keys(typeObj))
        this.originalData = data
        this.loading = false
      }).catch(e => {
        console.error(e)
      })
    },
    selectDateZone(newDateZone, utcTimeStamp) {
      this.DataZone = newDateZone
      this.searchObj.start_time = this.getDateString(new Date(utcTimeStamp[0]))
      this.searchObj.end_time = this.getDateString(new Date(utcTimeStamp[1]))
      this.getMoasEventlistByDate(utcTimeStamp)
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
    timeFilter(utcTimeStamp) {
      this.loading = true
      let _utcTimeStamp = []
      if (utcTimeStamp && utcTimeStamp.length === 2) {
        this.searchObj.start_time = this.getDateString(new Date(utcTimeStamp[0]))
        this.searchObj.end_time = this.getDateString(new Date(utcTimeStamp[1]))
        _utcTimeStamp = utcTimeStamp
      } else {
        _utcTimeStamp = [null, null]
        this.searchObj.start_time = null
        this.searchObj.end_time = null
      }
      this.getMoasEventlistByDate(_utcTimeStamp)
    },
    download() {
      const showingData = this.filterdata(this.originalData)
      // console.log(showingData.length)
      if (!showingData.length) {
        return
      }
      const headRow = ['Index'].concat(Object.keys(showingData[0]))
      const csv = [headRow.join(',')]
      showingData.forEach((d, index) => {
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
      link.download = `${Object.entries(this.searchObj)
        .map(item => {
          if (item[1]) {
            return `${item[0]}(${item[1]})`
          }
        })
        .filter(i => i)
        .join('-')}.csv`

      link.click()
    },
  },
}
</script>

<style scoped>
.select-in-all-switch {
  height: 40px !important;
}
</style>

<style lang="scss">
.content {
  .filter {
    margin: 10 auto;
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
  .anomaly-pagination {
    text-align: left;
    margin-top: 20px;
  }
}

.select-in-all-switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  text-align: center;
}
/*打开时文字位置设置*/
.select-in-all-switch .el-switch__label--right {
  font-weight: bold;
  z-index: 1;
  right: 6px;
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
  width: 75px !important; /*开关按钮的宽度大小*/
  height: 40px !important;
  line-height: 40px;
}

.select-in-all-switch .el-switch__core:after {
  height: 36px !important;
  border-radius: 10px !important;
  /* top: 0px !important;
  left: 0px !important; */
}
.download-btn {
  background-color: #af86d8;
  color: #fff;
}
</style>
