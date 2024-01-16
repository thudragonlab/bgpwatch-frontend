<template>
  <div class="reverse-route-path-container fade-in">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputPrefix">
          <template slot="prepend">Prefix</template>
          <el-button slot="append" icon="el-icon-search" @click="searchPrefix"></el-button>
        </el-input>
      </div>
      <div style="text-align: left; padding-right: 20px">
        <div>You can input an IP or prefix, such as 1.0.205.0, 1.0.205.0/24 or 2001:200::/32.</div>
        <div>The system will search the best matched prefix and return the reverse routing tree.</div>
      </div>
    </div>
    <div class="last-update">Last Update:{{ lastUpdateTimestamp }}</div>
    <div class="d3-box">
      <BaseD3Graph
        d3Id="myd3"
        :nodes="nodes"
        :links="links"
        :customerFunc="emptyFunc"
        :moreAction="moreAction"
        :options="{
          rankdir: 'TB',
          ranksep: 40, // 节点之间线距离
          nodesep: 10, // 节点之间距离
          marginx: 10,
        }"
      ></BaseD3Graph>
    </div>
  </div>
</template>

<script>
import { getRtreeByPrefixData } from '@/api/RoutePathApi.js'
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[0-9]|[1-9]|2[0-9]|3[0-2])$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
import BaseD3Graph from '@/components/RouteMonitor/BaseD3Graph.vue'

export default {
  name: 'ReverseRoutingPathD3',
  created() {},
  data() {
    return {
      nodes: [],
      links: [],
      lastUpdateTimestamp: '',
      inputPrefix: '1.0.128.0/17',
    }
  },
  components: {
    BaseD3Graph,
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      },
    },
    inputAsn: {
      type: String,
      default: '',
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getRtreeByPrefix().catch(e => console.error(e))
    })
  },
  methods: {
    async getRtreeByPrefix() {
      const rtreeData = await getRtreeByPrefixData(this.inputPrefix)
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      if (rtreeData) {
        const { nodes, links } = rtreeData
        this.nodes = nodes.map(item => item.name)
        this.links = links.map(item => {
          return { from: item[0], to: item[1] }
        })
      }
    },
    async searchPrefix() {
      if (!IP_REGEX.test(this.inputPrefix)) {
        this.$message({
          message: `IP invalid`,
          type: 'warning',
          duration: 2 * 1000,
        })
        return
      }
      await this.getRtreeByPrefix().catch(e => console.error(e))
    },
    emptyFunc() {},
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
      svg.attr('height', 400)
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

.not-found {
  height: 20vh;
  margin: 10px;
  width: calc(100% - 10px);
  line-height: 20vh;
  text-align: center;
  font-size: var(--max-font-size);
  font-weight: bold;
  background-color: #fff;
  border: 5px solid #000;
}

.d3-box {
  width: calc(100% - 10px);
  overflow-x: auto;
  background-color: #fff;
}

.last-update {
  padding-left: 10px;
  background-color: #fff;
  text-align: left;
  font-weight: bold;
}
</style>
suo yi
