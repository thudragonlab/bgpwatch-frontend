<template>
  <div class="real-time-container">
    <RealTimeData
      :realTimeData="announcedV4Line"
      :propAnnouncedAvgNum="announcedAvgNumV4"
      title="Announced IPv4 Prefix Number"
    ></RealTimeData>
    <RealTimeData
      :realTimeData="announcedV6Line"
      :propAnnouncedAvgNum="announcedAvgNumV6"
      title="Announced IPv6 Prefix Number"
      style="margin-bottom: 0px"
    ></RealTimeData>
  </div>
</template>

<script>
import RealTimeData from '@/components/Dashboard/DashboardRealTimeDataTabData.vue'
import { getRealTimeData, getRealTimeDataInAWhile } from '@/api/DashBoardApi'
export default {
  name: 'RealTimeDataTab',
  created() {},
  components: {
    RealTimeData,
  },
  destroyed() {
    clearInterval(this.realTimeInterval)
  },
  data() {
    return {
      announcedV4Line: [],
      announcedV6Line: [],
      announcedAvgNumV6: 0,
      announcedAvgNumV4: 0,
      realTimeInterval: {},
    }
  },
  props: {},
  mounted() {
    this.$nextTick(() => {
      this.handleLine()
    })
  },
  methods: {
    async handleLine() {
      await this.getLineDataLast24Hour()
      this.realTimeInterval = setInterval(this.getLineDataIntervalOneSecond, 1000)
    },

    async getLineDataIntervalOneSecond() {
      const { announced_v4_line, announced_v6_line } = await this.getRealTimeData()
      this.announcedV4Line = announced_v4_line
      this.announcedV6Line = announced_v6_line
    },

    async getLineDataLast24Hour() {
      const { announced_v4_line, announced_v6_line, avg_v4, avg_v6 } = await this.getRealTimeDataInAWhile()
      this.announcedAvgNumV4 = Number(avg_v4.toFixed(3))
      this.announcedAvgNumV6 = Number(avg_v6.toFixed(3))
      this.announcedV4Line = announced_v4_line
      this.announcedV6Line = announced_v6_line
    },
    async getRealTimeData() {
      const data = await getRealTimeData()
      return data
    },

    async getRealTimeDataInAWhile() {
      const data = await getRealTimeDataInAWhile()
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
.real-time-container {
  padding-top: 20px;
  background-color: #f0f0f0;
  height: 100%;
}
</style>
