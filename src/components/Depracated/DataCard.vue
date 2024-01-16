<template>
  <div :class="`data-card ${checked ? 'checked' : ''}`" @click="clickCard">
    <div class="data-card-top">
      <div class="data-card-top-left">
        <div class="data-card-top-number">{{ lastData }}{{ yunit }}</div>
        <div class="data-card-top-desc">{{ subTitle }}</div>
      </div>
    </div>
    <div class="data-card-chart">
      <Chart
        :chartId="chartId"
        :option="new DashboardLineOption(chartHeight).getOption(['xAxis', 'yAxis', 'grid', 'series'])"
        :series="chartData"
        :sourceData="chartData[0] && chartData[0].data"
        :height="chartHeight"
        :extraOption="{
          grid: {
            width: `${dynamicWidth}%`,
          },
        }"
      ></Chart>
    </div>
  </div>
</template>

<script>
// import Chart from '@/components/RouteMonitor/Chart'
import { DashboardLineOption } from '@/templates/chart/lineTemplate'
export default {
  name: 'DataCard',
  components: {
    // Chart,
  },
  created() {},
  data() {
    return {
      DashboardLineOption,
      chartHeight: '50px',
      lastData: 0,
      yunit: '%',
      dynamicWidth: 1,
    }
  },
  watch: {
    chartData: {
      handler: function (newV) {
        if (newV) {
          this.dynamicWidth = this.dynamicWidth === 100 ? this.dynamicWidth : this.dynamicWidth + 1
          const data = newV[0].data
          this.lastData = (data[data.length - 1] && data[data.length - 1][1]) || 0
        }
      },
      deep: true,
    },
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    chartData: {
      type: Array,
      default: [],
    },
    chartId: {
      type: String,
      default: 'chart1',
    },
    subTitle: {
      type: String,
      default: 'subTitle1',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    clickCard() {
      this.$emit('click', this.index)
    },
  },
}
</script>

<style lang="scss" scoped>
.data-card {
  width: calc(25% - 20px);
  margin: 10px;
  background-color: #fff;
  box-shadow: 5px 5px 5px #631fa955;
  transition: box-shadow 0.5s ease;
  &:hover {
    box-shadow: 2px 2px 5px #631fa900;
    transition: box-shadow 0.5s ease;
  }
}

.data-card-top {
  display: flex;
  justify-content: space-between;
  padding: 10px 5px;
  .data-card-top-left {
    text-align: left;
    .data-card-top-number {
      font-size: var(--max-font-size);
      font-weight: bold;
      color: #73879c;
    }

    .data-card-top-desc {
      font-size: var(--subTitle-font-size);
      font-weight: bold;
      color: #bfbec2;
    }
  }
}
.checked {
  box-shadow: 2px 2px 5px #631fa900;
}
.connect {
  opacity: 1;
  transition: opacity 0.2s;
}

.disconnect {
  opacity: 0;
  transition: opacity 0.2s;
}

.data-card-chart {
  display: flex;
  justify-content: flex-end;
}
</style>
