<template>
  <div class="component-container2">
    <el-descriptions :column="3" border>
      <el-descriptions-item label="suspicous_link">
        {{ record.suspicous_link }}
      </el-descriptions-item>
      <el-descriptions-item label="datetime">{{ record.datetime }}</el-descriptions-item>
      <el-descriptions-item label="max_score">{{ record.max_score }}</el-descriptions-item>
      <el-descriptions-item label="Reasons">{{ record.reasons && record.reasons[0] }}</el-descriptions-item>
      <el-descriptions-item label="timestamp">{{ record.timestamp }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="2" border>
      <el-descriptions-item :label="k" v-for="(k, index) in Object.keys(prefixMap)" :key="index">
        <BaseD3Graph
          :d3Id="`myd3${index}`"
          :nodes="prefixMap[k].nodes"
          :links="prefixMap[k].links"
          :customerFunc="customerFunc"
          :moreAction="moreAction"
          :options="{
            rankdir: 'LR',
            ranksep: 40, // 节点之间线距离
            nodesep: 10, // 节点之间距离
            marginx: 10,
          }"
        ></BaseD3Graph>
      </el-descriptions-item>
    </el-descriptions>
    <!-- {{ record }} -->
  </div>
</template>

<script>
import { getFakeAsPathRecordById } from '@/api/FakeAsPathApi'
import BaseD3Graph from '@/components/RouteMonitor/BaseD3Graph.vue'
export default {
  name: 'FakeAsPathDetail',
  components: {
    BaseD3Graph,
  },
  created() {
    if (this.$route.query.id) {
      this.recordId = this.$route.query.id
    }
  },
  data() {
    return {
      recordId: '',
      record: {},
      prefixMap: {},
    }
  },
  mounted() {
    if (this.recordId) {
      this.getFakeAsPathRecordById()
    }
  },

  methods: {
    async getFakeAsPathRecordById() {
      const record = await getFakeAsPathRecordById(this.recordId)
      this.record = record
      Object.keys(this.record).forEach(k => {
        const staticProp = ['datetime', 'max_score', 'reasons', 'suspicous_link', 'timestamp']
        if (!staticProp.includes(k)) {
          this.prefixMap[k] = {
            origin: this.record[k],
            nodes: this.makeNodes(this.record[k]),
            links: this.makeLinks(this.record[k]),
          }
        }
      })
    },

    makeNodes(s) {
      return Array.from(new Set(s.map(i => i.split(' ')).flat()))
    },

    makeLinks(s) {
      const link = []
      s.forEach(l => {
        const ls = l.split(' ')
        for (let i = 0; i < ls.length - 1; i++) {
          const from = ls[i]
          const to = ls[i + 1]
          link.push({ from, to })
        }
      })
      return link
    },
    customerFunc(g, linkArray, nodes) {
      g.setEdge(this.record.suspicious_link[0], this.record.suspicious_link[1], {
        weight: 111,
        style: 'stroke: red;stroke-width: 2px; fill: none;',

        arrowheadStyle: 'fill: rgb(20, 20, 20); stroke: rgb(20, 20, 20);',
        arrowhead: 'vee',
      })
    },
    moreAction(g, inner, svg, svgId) {
      let that = this
      var g_width = parseInt(g.graph().width, 10)
      var g_height = parseInt(g.graph().height, 10)
      // console.log(g_width, g_height)
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
      svg.attr('width', 400)
    },
  },
}
</script>

<style lang="scss" scoped>
.component-container2 {
  padding: 10px;
  background-color: #f0f0f0;
  min-height: 100vh;
}
</style>
