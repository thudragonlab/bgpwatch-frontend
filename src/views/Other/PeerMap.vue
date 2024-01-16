<template>
  <div class="statistic-box">
    <div class="statistic-grid">
      <div :class="['map1', clickPieClassName == 'map1' ? 'enlarge-map1' : '', 'shadow']">
        <Chart
          chartId="top_map"
          ref="top_map"
          :option="
            new PeerMapOption('', 'aliMap').getOption([
              'title',
              'geo',
              'series',
              'toolbox',
            ])
          "
          :series="s"
        ></Chart>
      </div>
    </div>
  </div>
</template>

<script>
import { PeerMapOption } from '@/templates/chart/mapTemplate'
// import worldJson from '@/../public/static/ali.json'
import TimeZone from '@/components/RouteMonitor/BaseTimeZone.vue'
const ZOOM_OFFSET = 0.1
const MAX_ZOOM = 3
const MIN_ZOOM = 1
export default {
  name: 'Statistics',
  components: {
    // Chart,
    TimeZone,
    // PaginationTable,
  },
  data() {
    return {
      selectedTimeStamp: [],
      mapName: 'aliMap',
      mapSeries: [],
      eventTypeData: {},
      eventLevelData: {},
      chartData: {},
      OrgChartData: {},
      loading: true,
      dataZone: parseInt(new Date().getTimezoneOffset() / 60),
      v4_bar: [],
      v6_bar: [],
      PeerMapOption,
      mapExtraOption: {},
      pieExtraOption: {},
      barExtraOption: {},
      extraOptionName: '',
      clickPieClassName: '',
      coordsLines: [],
      s: [],
    }
  },
  async mounted() {
    this.$refs.top_map.registerMapByGeo(this.mapName, worldJson)
    this.$nextTick(() => {
      this.s = [
        {
          data: [
            { name: 'APAN-JP', value: [137.48658122302, 35.2158937120498] ,label:{position:'right'}},
            { name: 'AARNET', value: [144.066594081537, -34.1892861181236] },
            { name: 'BDREN', value: [90.2008186716192, 23.6020734610436] },
            { name: 'CERNET', value: [115.666114810654, 35.4701071045294] },
            { name: 'Collector', value: [116.39, 39.91],itemStyle:{color:'red'} },
            { name: 'HARNET', value: [114.17, 22.28] },
            { name: 'ITB', value: [107.604375614007, -6.89843770003159] },
            { name: 'KREONET', value: [127.149529956643, 37.355490970728] ,label:{position:'right'}},
            { name: 'LEARN', value: [78.7974106975948, 7.08804313431567] },
            { name: 'MYREN', value: [102.591807580961, 3.12459591159056] },
            { name: 'NREN', value: [85.32, 27.7] },
            { name: 'PERN', value: [71.928153129141, 31.3582487665393] },
            { name: 'REANNZ', value: [174.807289396456, -41.1416386199366] },
            { name: 'SINGAREN', value: [103.85, 1.28] },
            { name: 'ThaiREN', value: [100.5, 13.73] },
            { name: 'TransPAC', value: [-86.46, 39.22] },
          ],
        },
        {
          data: [
            {
              fromCountry: 'CERNET',
              toCountry: 'Collector',
              coords: [
                [137.48658122302, 35.2158937120498],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'APAN-JP',
              toCountry: 'Collector',
              coords: [
                [137.48658122302, 35.2158937120498],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'AARNET',
              toCountry: 'Collector',
              coords: [
                [144.066594081537, -34.1892861181236],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'BDREN',
              toCountry: 'Collector',
              coords: [
                [90.2008186716192, 23.6020734610436],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'HARNET',
              toCountry: 'Collector',
              coords: [
                [114.17, 22.28],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'ITB',
              toCountry: 'Collector',
              coords: [
                [107.604375614007, -6.89843770003159],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'KREONET',
              toCountry: 'Collector',
              coords: [
                [127.149529956643, 37.355490970728],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'LEARN',
              toCountry: 'Collector',
              coords: [
                [78.7974106975948, 7.08804313431567],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'MYREN',
              toCountry: 'Collector',
              coords: [
                [102.591807580961, 3.12459591159056],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'NREN',
              toCountry: 'Collector',
              coords: [
                [85.32, 27.7],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'PERN',
              toCountry: 'Collector',
              coords: [
                [71.928153129141, 31.3582487665393],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'REANNZ',
              toCountry: 'Collector',
              coords: [
                [174.807289396456, -41.1416386199366],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'SINGAREN',
              toCountry: 'Collector',
              coords: [
                [103.85, 1.28],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'ThaiREN',
              toCountry: 'Collector',
              coords: [
                [100.5, 13.73],
                [116.39, 39.91],
              ],
            },
            {
              fromCountry: 'TransPAC',
              toCountry: 'Collector',
              coords: [
                [-86.46, 39.22],
                [116.39, 39.91],
              ],
            },
          ],
        },
      ]
    })
  },
  created() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.statistic-box {
  // background-color: #f0f0f0;
  background-image: linear-gradient(45deg, #efbdfa, #cbe3fd, #f9d9d9);
  .time-zone-selector {
    padding: 20px 10px;
    height: 100%;
    animation-name: fade_in_line;
    animation-duration: var(--animation-during);
    animation-fill-mode: forwards;

    .time-zone-box {
      // padding: 0 0 6px 0;
      background-image: linear-gradient(45deg, #f69494, #e1ff7d, #8cff7d, #8cc0f8, #cb94ff, #f69494);
      background-size: 200%;
      transition: background-position 5s;
      box-shadow: var(--shadow-args);
      border-radius: var(--border-radius-deg);
      animation: move_background;
      animation-timing-function: cubic-bezier(0.62, 0.61, 1, 1);
      animation-duration: 5s;
      animation-iteration-count: infinite;
      animation-play-state: paused;
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

  @keyframes move_background {
    0% {
      background-position: 0%;
    }
    100% {
      background-position: 200%;
    }
  }

  .statistic {
    padding: 20px 20px 0 20px;
    display: flex;
    min-height: calc(100vh - 72px);

    .left-box {
      width: 20%;
      .left-top-box {
        width: 100%;
        height: calc(100% / 3);
      }
      .left-middle-box {
        @extend .left-top-box;
      }
      .left-bottom-box {
        @extend .left-top-box;
      }
    }
    .right-box {
      width: 80%;
      .top-box {
        width: 100%;
        height: calc((100% / 3) * 2);
        display: flex;
        .top-left-map {
          height: 100%;
          width: 70%;
        }
        .top-right-box {
          height: 100%;
          width: 30%;

          .top-right-top-table,
          .top-right-bottom-table {
            width: 100%;
            height: 50%;
            overflow: auto;
            &::-webkit-scrollbar {
              width: 0 !important ;
            }
          }
          .top-right-bottom-table {
            @extend .top-right-top-table;
          }
        }
      }
      .bottom-box {
        width: 100%;
        height: calc(100% / 3);
      }
    }
  }
}
.table-title {
  font-size: var(--max-font-size);
  margin: 20px;
}

.table {
  padding: 20px;
}
.table-box {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  &:first-child {
    margin-bottom: 20px;
  }
}

.statistic-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 30vh);
  grid-auto-flow: column;
  // padding-top:20px;
  // background-color: #f0f0f0;
}

/* .pie2 {
  position: absolute;
  width: 33.3vh;
  height: 33.3vh;
  z-index: 5;
} */

.enlarge-bar1 {
  z-index: 3 !important;
  transform: translate(-200%, 50%) scale(2);
}

.enlarge-bar2 {
  z-index: 3 !important;
  transform: translate(-200%, calc(-50% - 20px)) scale(2);
}

.enlarge-pie2 {
  z-index: 3 !important;
  transform: translate(200%, 50%) scale(2);
}

.enlarge-pie3 {
  z-index: 3 !important;
  transform: translate(200%, calc(-50% - 20px)) scale(2);
}

.enlarge-pie1 {
  z-index: 3 !important;
  transform: translate(200%, calc(-150% - 40px)) scale(2);
}

.enlarge-map1 {
  z-index: 3 !important;
  transform: translate(0px, 40px) scale(1.2);
}

.pie1,
.pie2,
.pie3,
.map1,
.line1,
.bar1,
.bar2 {
  background-color: #fff;
  margin: 10px;
  transition: all ease 0.5s;
}

.map1 {
  grid-column: 1/6;
  grid-row: 1/4;
  animation-name: fade_in_map;
  animation-duration: var(--animation-during);
  animation-fill-mode: backwards;
  z-index: 0;
}

@keyframes fade_in_map {
  0% {
    opacity: 0;
    transform: translate(0, var(--animation-offset));
  }

  100% {
    opacity: 1;
  }
}

.pie1,
.pie2,
.pie3 {
  animation-name: fade_in_pie;
  animation-duration: var(--animation-during);
  animation-delay: 1s;
  animation-fill-mode: backwards;
  z-index: 1;
}

@keyframes fade_in_pie {
  0% {
    opacity: 0;
    transform: translate(-var(--animation-offset), 0);
  }

  100% {
    opacity: 1;
  }
}

.bar1,
.bar2 {
  animation-name: fade_in_bar;
  animation-duration: var(--animation-during);
  animation-delay: 1s;
  animation-fill-mode: backwards;
}

@keyframes fade_in_bar {
  0% {
    opacity: 0;
    transform: translate(var(--animation-offset), 0);
  }

  100% {
    opacity: 1;
  }
}

.line1 {
  grid-column: 2/6;
  animation-name: fade_in_line;
  animation-duration: var(--animation-during);
  animation-delay: 2s;
  animation-fill-mode: backwards;
}

@keyframes fade_in_line {
  0% {
    opacity: 0;
    transform: translate(0, -var(--animation-offset));
  }

  100% {
    opacity: 1;
  }
}

.document-route {
  position: absolute;
  right: 20px;
}

.mask {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #0000005e;
  z-index: 1;
  animation-name: fade_in;
  animation-duration: var(--animation-during);
  animation-fill-mode: backwards;
}

@keyframes fade_in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
