<template>
  <div class="reverse-route-path-container fade-in">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputPrefix" ref="prefix-input">
          <template slot="prepend">Prefix</template>
          <el-button slot="append" icon="el-icon-search" @click="searchPrefix"></el-button>
        </el-input>
      </div>
      <div style="text-align: left; padding-right: 20px">
        <div>You can input an IP or prefix, such as 1.0.205.0, 1.0.205.0/24 or 2001:200::/32.</div>
        <div>The system will search the best matched prefix and return the reverse routing tree.</div>
      </div>
    </div>
    <div class="graph">
      <el-autocomplete
        ref="asn-input"
        :placeholder="data.length ? data[0].name : 'asn'"
        v-model="inputASN"
        class="inner-input"
        :fetch-suggestions="nodeSearch"
        trigger-on-focus
        value-key="name"
        clearable
        @clear="clearable"
      >
        <template slot="prepend">ASN</template>
        <el-button slot="append" icon="el-icon-search" @click="searchASN"></el-button>
      </el-autocomplete>
      <ReverseRoutingPathChart
        ref="rrpc"
        :chartCategories="treeData ? treeData.categories : []"
        :title="`${treeData ? treeData.prefix : ''}\n${dateOfData}`"
        :chartData="data"
        :chartlinks="links"
        :root="treeData ? treeData.prefix : ''"
        :asPathDict="asPath"
        @clickPoint="clickPoint"
      >
      </ReverseRoutingPathChart>
    </div>
  </div>
</template>

<script>
import { getRtreeByPrefixData } from '@/api/RoutePathApi.js'
import { getAsInfoByList } from '@/api/DashBoardApi'
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[0-9]|[1-9]|2[0-4])$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
import ReverseRoutingPathChart from '../components/RouteMonitor/ReverseRoutingPathChart.vue'
export default {
  name: 'ReverseRoutingPathTopo',
  created() {
    if (Object.keys(this.$route.query).includes('prefix')) {
      this.inputPrefix = this.$route.query.prefix
    }
  },
  data() {
    return {
      inputPrefix: '166.111.0.0/16',
      treeData: {},
      links: [],
      data: [],
      inputASN: '',
      asPath: {},
      dateOfData: '',
    }
  },
  components: {
    ReverseRoutingPathChart,
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getRtreeByPrefix().catch(e => console.error(e))
    })
  },
  methods: {
    async clearable(e) {
      await this.$refs['prefix-input'].focus()
      this.$refs['asn-input'].focus()
    },
    nodeSearch(str, cb) {
      cb(this.data.filter(i => i.name.indexOf(str) === 0))
    },

    async getRtreeByPrefix() {
      const treeData = await getRtreeByPrefixData(this.inputPrefix)
      // console.log(treeData)
      this.treeData = treeData
      if (this.treeData) {
        this.asPath = treeData.path_dict
        this.dateOfData =  new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
        const links = []
        treeData.links.forEach(i => {
          links.push({ source: i[0], target: i[1] })
        })
        this.links = links
        const asList = []
        treeData.nodes.forEach(item => {
          if (item.name.indexOf('/') === -1) {
            asList.push(item.name)
          }
        })
        const asInfoList = await getAsInfoByList(asList)
        const data = treeData.nodes.map(i => {
          return {
            name: i.name,
            category: treeData.categories ? treeData.categories[i.category] : '',
            categoryIndex: i.category,
            country: asInfoList[i.name] ? asInfoList[i.name].country : '',
            org: asInfoList[i.name] ? asInfoList[i.name].org : '',
            asName: asInfoList[i.name] ? asInfoList[i.name].name : '',

            symbolSize:
              Math.pow(treeData.categories.length === 2 ? 10 : 8 - treeData.categories.length, 2) -
              treeData.categories.length * 2 +
              (treeData.categories ? treeData.categories.length * 5 - i.category * 5 : 10),
          }
        })
        this.data = data
      } else {
        console.warn('API is failure')
      }
    },

    async searchASN() {
      // console.log(this.inputASN, JSON.stringify(this.data[10]))
      if (this.data.filter(i => i.name === this.inputASN).length !== 0) {
        const chartInstance = this.$refs['rrpc'].$refs['topoGraph'].getChartIntance()
        await this.$refs['rrpc'].searchPathByPoint(this.inputASN)
        this.$refs['rrpc'].switchHighlightStyle(this.inputASN, chartInstance)

        // this.inputASN = ''
      } else {
        this.$messageBox({
          message: `Not found AS${this.inputASN}`,
          duration: 5 * 1000,
        })
      }
    },
    searchPrefix() {
      if (!IP_REGEX.test(this.inputPrefix)) {
        this.$messageBox({
          message: `IP invalid`,
          type: 'warning',
          duration: 2 * 1000,
        })
        return
      }

      this.getRtreeByPrefix()
    },
    clickPoint(e) {
      this.inputASN = e.data.name
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
  padding: 10px 0 10px 0;
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
  height: 85vh;
}
.inner-input {
  width: 300px;
  float: right;
  z-index: 1;
}
</style>
