<template>
  <el-row>
      <el-col :span="24" class="chart graph">
        <div v-if="type==='simple'" class="test-box">
          <span class="recursion-title">recursion</span>
          <span class="recursion-title">5</span>
          <span class="recursion-title">times</span>
        </div>
        <chart
          chartId="sub_graph"
          :option="
            new GraphTopoOption('AS TOPO  through Customer-Provider Link within 5 Hops').getOption(['title', 'series'])
          "
          :series="graphRouteSeries"
          :EventList="{
            click: highlightTest,
            mouseout: mouseoutTest,
          }"
        ></chart>
      </el-col>
    </el-row>
</template>

<script>

import {
  // GraphOption,
  GraphTopoOption,
  // setDataInGraphData,
  // exportColor,
  // importColor,
  // centerColor,
  topoStartColor,
  topoAcrossColor,
  topoEndColor,
  // EXPROT_IMPORT_ROW_NUMBER,
  highlightTest,
  mouseoutTest,
} from '@/templates/chart/graphTemplate'
const UP = -1
const DOWN = 1
export default {
  name: "TopoGraph",
  created() {},
  data() {
    return {
      GraphTopoOption,
      graphRouteSeries: [],
      graphData: {},
      typeMappling:{
        simple:{
          extraFunction:this.simplePathTopoExtraFunction
        },
        full:{
          extraFunction:this.fullPathTopoExtraFunction
        },
      }
    };
  },
  props: {
    links: {
      type: Array,
      default: () => {},
    },
    tier1List: {
      type: Array,
      default: () => [],
    },
    inputAsn:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:''
    },
    result:{
      type:Object,
      default:() => {}
    },
    
  },
  watch:{
    links(newV,oldV){
      this.handleInitData(UP,this.typeMappling[this.type].extraFunction)
  }
  },
  methods: {
    highlightTest,
    mouseoutTest,
    simplePathTopoExtraFunction(links,data){
        const minY = Math.min(...data.map(item => item.y))
        const tier1YIndex = minY - 50
        let tier1DataOnTop = []
        const result12 = Object.values(data).map(item => {
          if (this.tier1List.includes(item.name)) {
            tier1DataOnTop.push(Object.assign({}, item))
            item.itemStyle = {
              color: '#9a60b400',
            }
            item.symbolSize = 1
            item.label = {
              show: false,
            }
          } else {
            item.itemStyle = Object.assign(
              {
                color: topoAcrossColor,
              },
              item.itemStyle
            )
          }
          return item
        })

        tier1DataOnTop = tier1DataOnTop.map(item => {
          item.name = item.name + '|tier1'
          const originLinks = links.filter(l => l.target === item.name.split('|')[0])
          originLinks.forEach(originLink => {
            originLink.symbol = ['none', 'none']
          })
          links.push({
            source: item.name.split('|')[0],
            target: item.name,
            lineStyle: {
              curveness: 0,
            },
          })
          item.itemStyle = {
            color: topoEndColor,
          }
          item.y = tier1YIndex
          return item
        })

        return [links, result12.concat(tier1DataOnTop)]
        
    
    },
    fullPathTopoExtraFunction(links,data){
        const minY = Math.min(...data.map(item => item.y))
        const tier1YIndex = minY - 50

        // topoAcrossColor,

        const result12 = Object.values(data).map(item => {
          if (this.tier1List.includes(item.name)) {
            item.itemStyle = {
              color: topoEndColor,
            }
          } else {
            item.itemStyle = Object.assign(
              {
                color: topoAcrossColor,
              },
              item.itemStyle
            )
          }
          return item
        })
        return [links, result12]
    
    },
    recursionResultForDataPosition(asn,result,times, orient) {
      const keys = Object.keys(result)
      keys.forEach((key, index) => {
        if (key === 'width') {
          return
        }
        if (index == 0) {
          this.graphData[key] = {
            name: key,
            x: this.graphData[asn].x - result.width / 2 + result[key].width / 2,
            y: times * orient,
          }
        } else {
          this.graphData[key] = {
            name: key,
            x: this.graphData[keys[index - 1]].x + result[keys[index - 1]].width / 2 + result[key].width / 2,
            y: times * orient,
          }
        }
        this.recursionResultForDataPosition(key, result[key], times + 1, orient)
      })
    },
    handleInitData(
      orient,
      extraFunction
    ) {
      const firstObj = {}
      firstObj[this.inputAsn] = { name: this.inputAsn, x: 0, y: 0 }
      this.graphData = firstObj
      this.recursionResultForDataPosition(this.inputAsn, this.result, 1, orient)

      const data = Object.values(this.graphData).map(item => {
        item.x *= 50
        item.y *= 50

        if (item.name === this.inputAsn) {
          item.itemStyle = {
            color: topoStartColor,
          }
        }
        return item
      })

      const nowLink = this.links.map(subLink => {
        const { source, target } = subLink
        let curveness = 0.2 * orient
        if (this.graphData[source].x > this.graphData[target].x) {
          curveness = -0.2 * orient
        } else if (this.graphData[source].x === this.graphData[target].x) {
          curveness = 0
        }
        subLink.lineStyle = {
          opacity: 1,
          width: 1,
          curveness,
        }
        return subLink
      })
      
      const [finalLink, finalData] = extraFunction([...nowLink],data)
      this.graphRouteSeries = [
        {
          name: 'Test',
          data: finalData,
          links: finalLink,
          zoom: (1 / this.result.width) * 8.0,
          width: this.result.width * 150,
        },
      ]
    },
  },
};
</script>

<style lang="scss" scoped>
 .chart,
  .part {
    background-color: #fff;
  }

.graph {
    height: calc(80vh - 44px);
  }

  .test-box {
  // width: 100px;
  // height: 100px;
  // background: #000;
  padding: 20px;
  position: absolute;
  z-index: 1;
}

.recursion-title {
  font-size: var(--subTitle-font-size);
  padding: 10px;
}

</style>