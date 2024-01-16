<template>
  <div class="reverse-chart-box">
    <div class="zoom-box">
      <el-button size="mini" v-if="zoom < 3" @click="addZoom"> + Zoom </el-button>
      <el-button size="mini" v-if="zoom > 0" @click="reduceZoom"> - Zoom </el-button>
    </div>

    <Chart
      chartId="graph"
      ref="topoGraph"
      :option="new ReverseRouteGrapOption(title).getOption(['title', 'tooltip', 'series', 'legend'])"
      :series="seriesData"
      :replaceMerge="myReplaceMerge"
      width="100%"
      :EventList="{
        click: clickPoint,
        legendselectchanged: legendselectchanged,
      }"
      :extraOption="extraOption"
    ></Chart>
  </div>
</template>
<script>
const ZOOM_OFFSET = 0.1
import { ReverseRouteGrapOption } from '@/templates/chart/graphTemplate'
// import Chart from '../Depracated/Chart.vue'
import Vue from 'vue'
export default {
  name: 'ReverseRoutingPathChart',
  created() {},
  data() {
    return {
      // inputPrefix: '1.0.128.0/17',
      myReplaceMerge: [],
      seriesTemplate: {
        type: 'graph',
        layout: 'force',
        roam: 'move',
        label: {
          show: true,
          position: 'top',
          distance: 0,
        },
        force: {
          repulsion: 100,
          friction: 0.1,
          edgeLength: [100, 300],
          layoutAnimation: false,
          initLayout: 'circular',
        },
        edgeSymbolSize: 6,
        // edgeSymbol: ['none', 'arrow'],
      },
      seriesData: [],
      layer01: [],
      ReverseRouteGrapOption,
      colorList: ['#FF5B1C', '#DE951F', '#F5D92E', '#98E02B', '#37FA5F', '#2ADEB8', '#3CA1F5', '#4736E0', '#D043FA'],
      // treeData: {},
      linksMap: {},
      categoriesColorMap: {},
      clickNodeList: [],
      links: [],
      data: [],
      extraOption: {
        legend: {
          selected: {},
        },
      },
      zoom: 1,
    }
  },
  // components: {
  //   MyChart: Chart,
  // },
  props: {
    title: {
      type: String,
      default: '',
    },
    chartCategories: {
      type: Array,
      default: () => {
        return []
      },
    },
    chartData: {
      type: Array,
      default: () => {
        return []
      },
    },
    chartlinks: {
      type: Array,
      default: () => {
        return []
      },
    },
    asPathDict: {
      type: Object,
      default: () => {
        return {}
      },
    },
    root: {
      type: String,
      default: '',
    },
  },
  watch: {
    chartCategories() {
      const categoriesColorMap = {}
      const extraOption = {
        legend: {
          selected: {},
        },
      }

      this.seriesTemplate['categories'] = this.chartCategories.map((category, index) => {
        categoriesColorMap[category] = { color: this.colorList[index], show: true }
        extraOption.legend.selected[category] = true
        return {
          name: category,
          itemStyle: {
            color: this.colorList[index],
          },
        }
      })
      this.extraOption = extraOption
      this.categoriesColorMap = categoriesColorMap
    },
    async chartData() {
      this.clickNodeList = []
      this.myReplaceMerge = ['series']
      this.layer01 = this.chartData.filter(i => i.categoryIndex === 0 || i.categoryIndex === 1).map(item => item.name)
      // console.log(this.layer01)
      const chartData = this.getGraphData()

      this.setSeries({
        data: this.getGraphData(),
        links: this.getGraphLink(),
      })
      // 第0、1层节点默认情况下高亮，保证在最上层
      this.$refs['topoGraph'].getChartIntance().dispatchAction({
        type: 'highlight',
        name: this.layer01,
      })
      this.myReplaceMerge = []

      // 解决二次渲染错位问题
      await Vue.nextTick()
      this.setSeriesZoom(this.zoom)
      
      
    },
    chartlinks() {
      const linksMap = {}
      this.chartlinks.forEach(l => {
        if (!linksMap[l['source']]) {
          linksMap[l['source']] = []
        }
        linksMap[l['source']].push(l['target'])
      })
      this.linksMap = linksMap
      // console.log(this.linksMap)
    },
  },
  mounted() {},
  methods: {
    addZoom() {
      const zoom = this.zoom + ZOOM_OFFSET
      this.setSeriesZoom(zoom)
    },
    reduceZoom() {
      const zoom = this.zoom - ZOOM_OFFSET
      this.setSeriesZoom(zoom)
    },
    setSeries(obj) {
      this.seriesData = [Object.assign(this.seriesTemplate, obj)]
      // this.seriesData = [
      //   {
      //     zoom:this.zoom,
      //   },
      // ]
    },
    setSeriesZoom(zoom) {
      zoom = zoom < 0 ? 0 : zoom
      zoom = zoom > 3 ? 3 : zoom
      this.zoom = zoom
      this.seriesData = [
        {
          zoom,
        },
      ]
    },
    legendselectchanged(e, echartObj) {
      this.categoriesColorMap[e.name].show = e.selected[e.name]
      if (!e.selected[e.name]) {
        Object.keys(e.selected)
          .filter(item => item > e.name)
          .forEach(k => {
            // zoom += ZOOM_OFFSET
            this.categoriesColorMap[k].show = false
            echartObj.dispatchAction({
              type: 'legendUnSelect',
              name: k,
            })
          })
      } else {
        Object.keys(e.selected)
          .filter(item => item < e.name)
          .forEach(k => {
            // zoom -= ZOOM_OFFSET
            this.categoriesColorMap[k].show = true
            echartObj.dispatchAction({
              type: 'legendSelect',
              name: k,
            })
          })
      }

      // console.log(this.categoriesColorMap)
      const dataNumberWithlegendOpen = this.chartData.filter(i => this.categoriesColorMap[i.category].show).length
      this.setSeries({
        data: this.getGraphData(),
        links: this.getGraphLink(),
        layout: dataNumberWithlegendOpen > 30 ? 'force' : 'circular',
      })
      let zoom = this.zoom
      if (!e.selected[e.name]) {
        const legendItems = Object.keys(e.selected)
          .filter(item => e.selected[item] && item >= e.name)
          .concat([e.name])
        // console.log(legendItems)
        zoom += legendItems.length * ZOOM_OFFSET
      } else {
        const legendItems = Object.keys(e.selected)
          .filter(item => !e.selected[item] && item <= e.name)
          .concat([e.name])
        // console.log(legendItems)
        zoom -= legendItems.length * ZOOM_OFFSET
      }
      // this.setSeriesZoom(zoom)
    },

    async searchPathByPoint(point, updateLegend = false) {
      this.clickNodeList = []

      await this.findTargetIs(point)

      const dataNumberWithlegendOpen = this.chartData.filter(i => this.categoriesColorMap[i.category].show).length
      this.setSeries({
        data: this.getGraphData(),
        links: this.getGraphLink(),
        layout: dataNumberWithlegendOpen > 30 ? 'force' : 'circular',
      })
    },
    switchHighlightStyle(point, chartInstance) {
      if (!this.asPathDict[point]) {
        // 如果点根结节点，回默认状态
        chartInstance.dispatchAction({
          type: 'downplay',
          name: this.chartData.map(i => i.name),
        })
        // 第0、1层节点默认情况下高亮，保证在最上层
        chartInstance.dispatchAction({
          type: 'highlight',
          name: this.layer01,
        })
      } else {
        chartInstance.dispatchAction({
          type: 'highlight',
          name: this.asPathDict[point],
        })
        chartInstance.dispatchAction({
          type: 'downplay',
          name: this.chartData.filter(item => !this.asPathDict[point].includes(item.name)).map(i => i.name),
        })
      }
    },
    clickPoint(e, chartInstance) {
      if (!e.data.name) {
        return
      }
      this.$emit('clickPoint', e)
      this.switchHighlightStyle(e.data.name, chartInstance)
      this.searchPathByPoint(e.data.name)
    },
    getGraphLink() {
      return this.chartlinks.map(i => {
        const k = `${i.target}_${i.source}`

        if (this.clickNodeList.includes(k)) {
          if (this.layer01.includes(i.target) && this.layer01.includes(i.source)) {
            if (i.target === this.root) {
              // 如果连着根结点
              return Object.assign(i, {
                lineStyle: {
                  color: 'red',
                  width: 10,
                },
              })
            } else {
              return Object.assign(i, {
                lineStyle: {
                  color: 'red',
                  width: 5,
                },
              })
            }
          } else {
            // 其他节点
            return Object.assign(i, {
              lineStyle: {
                color: 'red',
                width: 3,
              },
            })
          }
        } else {
          // 如果是layer0 or layer1的连接线
          if (this.layer01.includes(i.target) && this.layer01.includes(i.source)) {
            if (i.target === this.root) {
              // 如果连着根结点
              return Object.assign(i, {
                lineStyle: {
                  color: '#300000',
                  width: 10,
                },
              })
            } else {
              return Object.assign(i, {
                lineStyle: {
                  color: '#696969',
                  width: 5,
                },
              })
            }
          } else {
            // 其他节点
            return Object.assign(i, {
              lineStyle: {
                color: '#aaa',
              },
            })
          }
        }
      })
    },
    getGraphData() {
      return this.chartData.map(i => {
        // 默认渲染逻辑
        if (this.clickNodeList.length === 0) {
          if (i.name === this.root) {
            // 根结点
            return Object.assign(i, {
              x: 500,
              y: 1500,
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 'bold',
              },
              emphasis: {
                scale: false,
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 5,
                },
              },
            })
          } else if (this.layer01.includes(i.name)) {
            // layer0 or layer1
            return Object.assign(i, {
              x: 500,
              y: 1500,
              emphasis: {
                scale: false,
              },
            })
          } else {
            // 其他节点
            return Object.assign(i, {
              itemStyle: {
                color: this.categoriesColorMap[i.category].color,
              },
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'normal',
              },
              emphasis: {
                label: {
                  color: '#000',
                  show: true,
                  fontSize: 15,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
            })
          }
        } else {
          // 点击节点渲染逻辑
          if (i.name === this.root) {
            // 根结点
            return Object.assign(i, {
              emphasis: {
                label: {
                  color: '#000',
                  show: true,
                  fontSize: 15,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 5,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
            })
          }
          if (this.layer01.includes(i.name)) {
            return Object.assign(i, {
              emphasis: {
                label: {
                  color: '#000',
                  show: true,
                  fontSize: 15,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
            })
          } else if (this.clickNodeList.includes(i.name)) {
            // 路径上的节点
            return Object.assign(i, {
              emphasis: {
                label: {
                  color: '#000',
                  show: true,
                  fontSize: 15,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
            })
          } else {
            // 其他节点
            return Object.assign(i, {
              label: {
                color: '#00000059',
                show: true,
                fontSize: 12,
                fontWeight: 'normal',
              },
              itemStyle: {},
              emphasis: {
                label: {
                  color: '#000',
                  show: true,
                  fontSize: 15,
                  fontWeight: 'bold',
                },
                itemStyle: {
                  borderColor: '#000',
                  borderWidth: 2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
            })
          }
        }
      })
    },
    async findTargetIs(target) {
      if (target === this.root) {
        return
      }
      const extraOption = {
        legend: {
          selected: {},
        },
      }
      const dataObj = this.chartData.filter(i => i.name === target)[0]
      // console.log(dataObj)
      // console.log(JSON.stringify(this.categoriesColorMap))
      if (!this.categoriesColorMap[dataObj['category']].show) {
        this.chartCategories.forEach((layer, index) => {
          if (index < this.asPathDict[target].length - 1) {
            extraOption['legend']['selected'][layer] = true
            this.categoriesColorMap[layer].show = true
          }
        })
        this.extraOption = extraOption
      }
      this.clickNodeList = [...this.asPathDict[target]]
      for (let index = 0; index < this.asPathDict[target].length - 1; index++) {
        const element = this.asPathDict[target][index]
        const next_element = this.asPathDict[target][index + 1]
        this.clickNodeList.push(`${element}_${next_element}`)
      }
      // this.clickNodeList.push(target)
      // this.clickNodeList.push(`${this.linksMap[target][0]}_${target}`)
      // this.findTargetIs(this.linksMap[target][0])
    },
  },
}
</script>

<style lang="scss" scoped>
.reverse-route-path-container {
  // padding-top:20px;
  background-color: #f0f0f0;
  height: 100%;
}

.prefix-input {
  width: 100%;
  padding: 20px 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rtree-image {
  height: 60vh;
  overflow: hidden;
  overflow-x: auto;
}
.graph {
  background-color: #fff;
}
.inner-input {
  width: 300px;
  float: right;
  z-index: 1;
}
.reverse-chart-box {
  height: 100%;
}

.zoom-box {
  position: absolute;
  bottom: 5px;
  z-index: 1;
  right: 80px;
}
</style>
