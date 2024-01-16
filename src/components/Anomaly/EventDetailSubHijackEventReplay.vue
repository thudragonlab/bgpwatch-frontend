<template>
  <div class="eventReplay">
    <div class="start" id="start0">
      <div class="select-date">
        <i class="el-icon-caret-right">
          {{ timeSelection[TimeSelectedIndex]?.label }}
        </i>
        <i :class="[play?'el-icon-video-pause':'el-icon-video-play','play']" @click="doPlay">{{ play ? 'Pause' : 'Play' }}</i>        
        <!-- <el-select @change="changeSelect" v-model="time" placeholder="选择事件发生时刻">
          <el-option v-for="(item, i) in timeSelection" :key="i" :label="item.label" :value="item.value"> </el-option>
        </el-select> -->
        <el-slider
          v-model="TimeSelectedIndex"
          :max="timeSelection && timeSelection.length - 1"
          :min="0"
          show-stops
          :marks="marks"
          :format-tooltip="formatTooltip"
        />

        <div v-for="(time, idx) in timeSelection" :key="idx" class="after">
          <div v-if="TimeSelectedIndex === idx">
            <div v-for="(i, index) in hijackData[time.value]" :key="index">
              <div class="prefix">{{ i.prefix }}</div>
              <div v-if="i.dataList.length">
                <div v-for="(d3Data, i) in i.dataList" :key="i" class="after">
                  <D3Graph
                    :options="{
                      rankdir: 'TB',
                      ranksep: 20, // 节点之间线距离
                      nodesep: 5, // 节点之间距离
                      marginx: 5,
                    }"
                    :links="d3Data.links"
                    :nodes="d3Data.nodes"
                    :d3Id="`aaa${index}-${i}-${idx}`"
                    :customerFunc="hijackEventCustomerFunc"
                    :moreAction="moreAction"
                  ></D3Graph>
                </div>
              </div>
              <div class="empty" v-else>No data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Graph from '@/components/RouteMonitor/BaseD3Graph.vue'
export default {
  name: 'SubHijackEventReplay',
  props: ['subdata'], // 次数subdata为整个event事件
  data() {
    return {
      time: '',
      timeSelection: [],
      affacted_as_dict: {},
      beforeHijackData: [],
      hijackData: {},
      TimeSelectedIndex: 0,
      marks: {},
      play:false,
      interval:undefined
    }
  },
  components: {
    D3Graph,
  },
  watch: {
    subdata(val) {
      // 通过判断是否有某字段来判断如何进行绘画
      this.affacted_as_dict = val.affacted_as_dict
      this.TimeSelect(val)
      const marks = {}

      this.timeSelection.forEach((time, index) => {
        this.drawGraph2_hijack(this.subdata, time)
        marks[index] = {
          style: {
            color: '#1989FA',
          },
        }
      })
      this.marks = marks

      // this.drawGraph1_hijack(val)
    },
  },
  mounted() {
    if (this.subdata) {
      this.affacted_as_dict = this.subdata.affacted_as_dict
      this.TimeSelect(this.subdata)
      const marks = {}
      console.log(this.timeSelection)
      this.timeSelection.forEach((time, index) => {
        this.drawGraph2_hijack(this.subdata, time)
        marks[index] = {
          style: {
            color: '#1989FA',
          },
        }
      })
      this.marks = marks
      // this.drawGraph1_hijack(this.subdata)
    }
  },
  methods: {
    formatTooltip(value) {
      if (this.timeSelection[value]) {
        return this.timeSelection[value].label
      } else {
        return ''
      }
    },
    moreAction(g, inner, svg, svgId) {
      this.setTooltip(g, inner, svg, svgId)
    },

    beforeEventCustomerFunc(g, linkArray, nodes) {
      if (g.node(this.subdata.victim_as)) {
        g.node(this.subdata.victim_as).style = 'fill: LightBlue'
      }
    },
    hijackEventCustomerFunc(g, linkArray, nodes) {
      if (nodes[nodes.length - 1] === this.subdata.hijacker_as) {
        // 攻击者
        g.setNode(this.subdata.hijacker_as, {
          label: this.subdata.hijacker_as + '\n(Hijacker)',
          shape: 'circle',
          style: 'stroke: darkgray; fill: LightPink',
        })
      } else {
        // 受害者
        g.node(nodes[nodes.length - 1]).style = 'fill: LightBlue'
      }
    },

    drawGraph1_hijack(val) {
      const keys = Object.keys(val['replay']['-1'])
      const beforeHijackData = []
      const [hijackLinkArray, hijackNodes] = this.handleVal(val['replay']['-1'][this.subdata['prefix']])
      beforeHijackData[0] = {
        prefix: this.subdata['prefix'],
        links: hijackLinkArray,
        nodes: hijackNodes,
      }
      const [victimLinkArray, victimNodes] = this.handleVal(val['replay']['-1'][this.subdata['subprefix']])

      beforeHijackData[1] = {
        prefix: this.subdata['subprefix'],
        links: victimLinkArray,
        nodes: victimNodes,
      }

      this.beforeHijackData = beforeHijackData
    },
    drawGraph2_hijack(val, time) {
      // const keys = Object.keys(val['replay'][time.value])
      const hijackData = []
      const values1 = this.splitPathListByLastItem(
        val['replay'][time.value][this.subdata['prefix']] ||
          val['replay'][time.value][this.subdata['prefix'].replaceAll('.', '_')]
      )
      hijackData[0] = {
        prefix: this.subdata['prefix'],
        dataList: values1
          .map(value => {
            const [linkArray, nodes] = this.handleVal(value)
            return {
              links: linkArray,
              nodes: nodes,
            }
          })
          .reverse(),
      }

      const values0 = this.splitPathListByLastItem(
        val['replay'][time.value][this.subdata['subprefix']] ||
          val['replay'][time.value][this.subdata['subprefix'].replaceAll('.', '_')]
      )
      hijackData[1] = {
        prefix: this.subdata['subprefix'],
        dataList: values0
          .map(value => {
            const [linkArray, nodes] = this.handleVal(value)
            return {
              links: linkArray,
              nodes: nodes,
            }
          })
          .reverse(),
      }

      this.hijackData[time.value] = hijackData
    },
    TimeSelect(val) {
      if (val) {
        Object.keys(val.replay).forEach(item => {
          if (item != '-1') {
            this.timeSelection.push({
              value: item,
              label: new Date(item * 1000).toUTCString(),
            })
          } else {
            this.timeSelection.unshift({
              value: item,
              label: 'Before event',
            })
          }
        })

        this.time = Object.values(this.timeSelection[0])[0]
      }
    },
    handleVal(valData) {
      let nodes = []
      valData.forEach(path => {
        let nodes_ = path.split(' ')
        nodes = [...nodes, ...nodes_]
      })

      // 获取所有长度为1的节点间线段
      const linkArray = []
      for (let i = 0; i < valData.length; i++) {
        let path = valData[i].split(' ')
        let len = path.length
        for (let j = 0; j < len - 1; j++) {
          linkArray.push({ from: path[j], to: path[j + 1] })
        }
      }
      // console.log([linkArray, nodes])
      return [linkArray, nodes]
    },
    splitPathListByLastItem(list) {
      console.log(list)
      const obj = {}
      list.forEach((item, index) => {
        const array = item.split(' ')
        if (!obj[array[array.length - 1]]) {
          obj[array[array.length - 1]] = []
          obj[array[array.length - 1]].push(item)
        } else {
          obj[array[array.length - 1]].push(item)
        }
      })
      return Object.values(obj)
    },
    setTooltip(g, inner, svg, className) {
      let that = this
      var g_width = parseInt(g.graph().width, 10)
      var g_height = parseInt(g.graph().height, 10)
      let ZOOM_OFFSET_WIDTH = 0
      const ZOOM_OFFSET_HEIGHT = 10
      if (g._nodeCount > 4) {
        ZOOM_OFFSET_WIDTH = 0
      } else {
        ZOOM_OFFSET_WIDTH = g_width / g._nodeCount
      }
      var viewBox_str = `-${ZOOM_OFFSET_WIDTH} -${ZOOM_OFFSET_HEIGHT} ${(
        g_width +
        2 * ZOOM_OFFSET_WIDTH
      ).toString()} ${(g_height + 2 * ZOOM_OFFSET_HEIGHT).toString()}`

      svg.attr('viewBox', viewBox_str)
      svg.attr('height', g_height)
      const my_div = document.getElementById(className)
      const tooltip = document.createElement('div')
      tooltip.setAttribute('class', 'tooltip')
      tooltip.style.opacity = 0
      tooltip.style.position = 'absolute'
      tooltip.style.backgroundColor = 'white'
      tooltip.style.border = 'solid'
      tooltip.style.borderWidth = '1px'
      tooltip.style.borderRadius = '5px'
      tooltip.style.padding = '10px'
      my_div.appendChild(tooltip)

      inner
        .selectAll('g.node')
        .on('mouseover', function (event, d) {
          tooltip.style.opacity = 1
          console.log(tooltip.style['opacity'])
        })
        .on('mousemove', function (event, d) {
          var tooltip_x = event.layerX
          var tooltip_y = event.layerY

          let asn = parseInt(g.node(d).label.split('\n')[0])
          tooltip.innerHTML = `AS:${asn}<br/>
                              Country:${that.affacted_as_dict ? that.affacted_as_dict[asn].country : ''}<br/>
                              Name:${that.affacted_as_dict ? that.affacted_as_dict[asn].name : ''}<br/>
                              Org:${that.affacted_as_dict ? that.affacted_as_dict[asn].org : ''}`
          tooltip.style.left = tooltip_x + 10 + 'px'
          tooltip.style.top = tooltip_y - 50 + 'px'
        })
        .on('mouseleave', function (event, d) {
          tooltip.style.opacity = 0
        })
        .on('click', function (e, d) {
          const asn = g.node(d).label.split('\n')[0]
          // window.open(`https://bgp.he.net/AS${asn}`)
          window.open(`/#/dashBoard?asn=${asn}`)
        })
    },
    doPlay(){
      this.play = !this.play
      if(this.play){
        this.TimeSelectedIndex = 0
        const interval = setInterval(() => {
        if (this.TimeSelectedIndex <= this.timeSelection.length){
          this.TimeSelectedIndex += 1
        }
      }, 1000);
      this.interval = interval
      }else{
        clearInterval(this.interval)
        this.interval = undefined
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.eventReplay {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  .after,
  .d3-before-box {
    .D3_graph-box {
      display: flex;
      justify-content: center;
    }
  }

  .before {
    height: 100px;
    width: 95%;
    span {
      padding-top: 35px;
      float: left;
      padding-left: 6px;
      font-size: var(--subtitle-font-size);
      margin-bottom: 30px;
    }
  }
  .start {
    margin-top: 0px;
    //height: 500px;
    width: 95%;
    span {
      padding-top: 35px;
      float: left;
      padding-left: 6px;
      font-size: var(--subtitle-font-size);
      margin-bottom: 30px;
    }
    .el-select {
      width: 260px;
      margin-left: 10px;
      margin-bottom: 50px;
      & /deep/ .is-focus .el-input__inner {
        border: 1px solid rgb(167, 167, 167);
      }
      & /deep/ .el-input__inner:focus {
        border: 1px solid rgb(167, 167, 167);
      }
    }
  }
  .el-divider {
    width: 97%;
  }
  .select-date {
    text-align: left;
  }
}

.empty {
  text-align: center;
  font-weight: bold;
  font-size: var(--subtitle-font-size);
  padding: 20px 10px;
  color: #000;
  height: 100px;
  line-height: 100px;
}

.prefix {
  font-weight: bold;
  font-size: var(--max-font-size);
  text-align: center;
}

.d3-before-box {
  margin-bottom: 50px;
}
.play{
  margin-left: 20px;
  cursor: pointer;
}
.play:hover{
  color:var(--slider-color)
}
</style>
