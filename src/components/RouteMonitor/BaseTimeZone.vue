<template>
  <div class="time-zone">
    <div v-show="!hiddenDate" class="dateZone select_item">
      <span v-if="showLable">Time zone</span>
      <el-select @focus="setMinWidth" @change="selectDateZone" v-model="DataZone" style="width: 100%">
        <el-option v-for="item of DataZoneOptions" :key="item.value" :value="item.value" :label="item.label">
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
    <div v-show="!hiddenDate" class="time select_item">
      <span v-if="showLable">Select time period (by Start Time)</span>
      <el-date-picker
        v-model="show_time_filter"
        type="datetimerange"
        range-separator="-"
        start-placeholder="start-time"
        end-placeholder="end-time"
        value-format="yyyy/MM/dd HH:mm:ss"
        :default-time="['00:00:00', '00:00:00']"
        prefix-icon="el-icon-date"
        unlink-panels
        @change="timeFilter"
      >
      </el-date-picker>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TimeZone',
  created() {
    if (this.defaultDateTime.length === 2) {
      this.show_time_filter = this.defaultDateTime
    } else {
      const now = new Date()
      const last3Day = new Date()
      last3Day.setDate(now.getDate() - 10)
      this.show_time_filter = [last3Day, now]
    }
  },

  data() {
    return {
      minWidth: '', // 用于存放单选框的长度
      show_time_filter: [],
      utc_time: [],
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
    }
  },
  props: {
    showLable: {
      type: Boolean,
      default: false,
    },
    hiddenDate: { type: Boolean, default: false },
    defaultDateTime: {
      type: Array,
      default: () => {
        const now = new Date()
        const last3Day = new Date()
        last3Day.setDate(now.getDate() - 10)
        return [last3Day, now]
      },
    },
  },
  mounted() {
    this.DataZoneOptions.forEach(item => {
      item.value -= this.DataZone
    })

    this.DataZone = 0
    this.timeFilter()
  },

  methods: {
    setTime(sdo, edo) {
      this.show_time_filter = [sdo, edo]
      this.timeFilter()
    },
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    selectDateZone() {
      // 返回所选时区 以及UTC时间
      const utcTimeArray = []

      utcTimeArray[0] = new Date(this.TransformDate(this.show_time_filter[0], this.DataZone)).getTime()
      utcTimeArray[1] = new Date(this.TransformDate(this.show_time_filter[1], this.DataZone)).getTime()
      // console.log(utcTimeArray, this.DataZone)
      this.$emit('changeDateZone', this.DataZone, utcTimeArray)
    },
    TransformDate(timeStr, DataZone) {
      // console.log(timeStr, DataZone)
      const originDate = new Date(timeStr)
      // console.log('originDate', originDate, originDate.getTime())
      const date = new Date(originDate.getTime() + DataZone * 60 * 60000)
      // console.log('date', date, date.getTime())
      const month = date.getMonth() + 1
      // console.log(
      //   `${date.getFullYear()}/${date.getMonth() < 9 ? '0' + month : month}/${
      //     date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      //   } ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
      //     date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      //   }:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
      // )
      return `${date.getFullYear()}/${date.getMonth() < 9 ? '0' + month : month}/${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      } ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
    },

    timeFilter() {
      // 入参是当前时区的时间
      // 返回UTC的时间戳
      // console.log(this.show_time_filter)
      if (this.show_time_filter != null) {
        // 转成本地的时间 比如8:00 本地是+8的时区，现在我换成+9时区的8:00，则下面的值应为7:00
        const LOCAL_start_time = new Date(this.TransformDate(this.show_time_filter[0], this.DataZone))
        const LOCAL_end_time = new Date(this.TransformDate(this.show_time_filter[1], this.DataZone))

        this.utc_time = [LOCAL_start_time, LOCAL_end_time]
        this.$emit('change', [LOCAL_start_time.getTime(), LOCAL_end_time.getTime()])
      } else {
        this.$emit('change', [])
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.time-zone {
  display: flex;
  background-color: #fff;
  .time,
  .dateZone {
    text-align: left;
    margin-left: 10px;
    span {
      display: block;
      margin-bottom: 8px;
      font-size: var(--middle-font-size);
    }
  }
}
</style>
