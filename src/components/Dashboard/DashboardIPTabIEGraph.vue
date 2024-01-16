<template>
  <el-row>
    <el-col :span="24" class="chart i-e-graph">
      <chart
        ref="myChart"
        chartId="dashboard_right_graph2"
        :option="new GraphOption(title).getOption(['title', 'legend', 'series', 'tooltip'])"
        :series="graphSeries"
        :EventList="{
          click: clickHandler,
        }"
      ></chart>
    </el-col>
  </el-row>
</template>

<script>
import { GraphOption, setDataInGraphData, centerColor, EXPROT_IMPORT_ROW_NUMBER } from '@/templates/chart/graphTemplate'
import { getASList } from '@/api/DashBoardApi'
const MAX_POINT_NUMBER_STANDARD = 15
const PIE_CHART_TOP = 10
export default {
  name: 'IEGraph',
  created() {},
  data() {
    return {
      GraphOption,
      graphSeries: [],
      providerAses: [],
      peerAses: [],
      customerAses: [],
      windowWidth: document.documentElement.clientWidth,
      // asNameInfoMap: [],
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    inputAsn: {
      type: String,
    },
    clickHandler: {
      type: Function,
    },
    asNameInfoMap: {
      type: Object,
      default: () => {
        return {}
      },
    },
    peers: {
      type: Object,
    },
    version: {
      type: String,
      default: '',
    },
  },
  watch: {
    async asNameInfoMap(newV) {
      if (this.inputAsn) {
        const { providerAses, peerAses, customerAses } = await getASList(this.inputAsn)
        this.providerAses = providerAses
        this.peerAses = peerAses
        this.customerAses = customerAses
        this.handleGraph(this.version).catch(e => console.error(e))
      }
    },
  },
  methods: {
    setDataInGraphData,
    // async getAsInfoByList(asList) {
    //   const data = await getAsInfoByList(asList)
    //   return data
    // },
    async handleGraph(version) {
      const inputAsn = `${this.inputAsn}`
      const length = 8
      if (!this.peers['export_peers']) {
        return
      }

      let exportAs = this.peers['export_peers'][version]
      let importAs = this.peers['import_peers'][version]

      if (!exportAs) {
        exportAs = {}
      }
      if (!importAs) {
        importAs = {}
      }
      const unknownAS = {}
      const providerAS = {}
      const peerAS = {}
      const customerAS = {}

      const displayAs = {}

      const allAs = {}
      Object.keys(exportAs).forEach(key => {
        if (this.providerAses.includes(key)) {
          providerAS[key] = exportAs[key]
        } else if (this.customerAses.includes(key)) {
          customerAS[key] = exportAs[key]
        } else if (this.peerAses.includes(key)) {
          peerAS[key] = exportAs[key]
        } else {
          unknownAS[key] = exportAs[key]
        }
      })
      const bothAs = []

      Object.keys(importAs).forEach(key => {
        if (
          Object.keys(providerAS).includes(key) ||
          Object.keys(customerAS).includes(key) ||
          Object.keys(peerAS).includes(key) ||
          Object.keys(unknownAS).includes(key)
        ) {
          if (Object.keys(providerAS).includes(key)) {
            providerAS[key] += parseInt(importAs[key])
          } else if (Object.keys(customerAS).includes(key)) {
            customerAS[key] += parseInt(importAs[key])
          } else if (Object.keys(peerAS).includes(key)) {
            peerAS[key] += parseInt(importAs[key])
          } else {
            unknownAS[key] += parseInt(importAs[key])
          }
          bothAs.push(key)
        } else {
          if (this.providerAses.includes(key)) {
            providerAS[key] = importAs[key]
          } else if (this.customerAses.includes(key)) {
            customerAS[key] = importAs[key]
          } else if (this.peerAses.includes(key)) {
            peerAS[key] = importAs[key]
          } else {
            unknownAS[key] = importAs[key]
          }
        }
      })
      const providerSorted = Object.entries(providerAS).sort((a, b) => b[1] - a[1])
      const customerSorted = Object.entries(customerAS).sort((a, b) => b[1] - a[1])
      const peerSorted = Object.entries(peerAS).sort((a, b) => b[1] - a[1])
      const unknownSorted = Object.entries(unknownAS).sort((a, b) => b[1] - a[1])
      const top30As = []
        .concat(providerSorted)
        .concat(peerSorted)
        .concat(customerSorted)
        .concat(unknownSorted)
        .slice(0, length * 4)
      // console.log('unknownAS', unknownAS)
      // console.log('top30As', top30As)
      top30As.forEach(As => {
        const isBoth = bothAs.includes(As[0])
        if (this.providerAses.includes(As[0])) {
          displayAs[As[0]] = {
            org: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].org : 'Unknown',
            name: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].name : 'Unknown',
            country: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].country : 'Unknown',
            value: As[1],
            type: 'Provider',
            isBoth: isBoth,
            IE: [Object.keys(exportAs).includes(As[0]) && 'Export', Object.keys(importAs).includes(As[0]) && 'Import'],
            valueArray: [exportAs[As[0]], importAs[As[0]]],
          }
        } else if (this.peerAses.includes(As[0])) {
          displayAs[As[0]] = {
            org: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].org : 'Unknown',
            name: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].name : 'Unknown',
            country: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].country : 'Unknown',
            value: As[1],
            type: 'Peer',
            isBoth: isBoth,
            IE: [Object.keys(exportAs).includes(As[0]) && 'Export', Object.keys(importAs).includes(As[0]) && 'Import'],
            valueArray: [exportAs[As[0]], importAs[As[0]]],
          }
        } else if (this.customerAses.includes(As[0])) {
          displayAs[As[0]] = {
            org: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].org : 'Unknown',
            name: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].name : 'Unknown',
            country: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].country : 'Unknown',
            value: As[1],
            type: 'Customer',
            isBoth: isBoth,
            IE: [Object.keys(exportAs).includes(As[0]) && 'Export', Object.keys(importAs).includes(As[0]) && 'Import'],
            valueArray: [exportAs[As[0]], importAs[As[0]]],
          }
        } else {
          displayAs[As[0]] = {
            org: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].org : 'Unknown',
            name: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].name : 'Unknown',
            country: this.asNameInfoMap[As[0]] ? this.asNameInfoMap[As[0]].country : 'Unknown',
            value: As[1],
            type: 'Unknown',
            isBoth: isBoth,
            IE: [Object.keys(exportAs).includes(As[0]) && 'Export', Object.keys(importAs).includes(As[0]) && 'Import'],
            valueArray: [exportAs[As[0]], importAs[As[0]]],
          }
        }
      })
      // exportAs = displayAs
      // importAs = importAs2

      let maxPointNumber = MAX_POINT_NUMBER_STANDARD
      // let ExportName =
      // let ImportName = Object.keys(importAs)

      const firstPoint = {
        name: inputAsn,
        y: -50 * EXPROT_IMPORT_ROW_NUMBER,
        x: 0,
        org: this.asNameInfoMap[inputAsn] ? this.asNameInfoMap[inputAsn].org : 'Unknown',
        asName: this.asNameInfoMap[inputAsn] ? this.asNameInfoMap[inputAsn].name : 'Unknown',
        country: this.asNameInfoMap[inputAsn] ? this.asNameInfoMap[inputAsn].country : 'Unknown',
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: centerColor,
              },
              {
                offset: 0.81,
                color: centerColor,
              },
              {
                offset: 0.82,
                color: '#fff',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ],
            global: false, // 缺省为 false
          },
          borderColor: '#ffffff',
        },
        symbol: 'circle',
        symbolOffset: [0, 0],
        symbolSize: 70,
      }

      const graphDataObj = {
        // type:'graph',
        data: [firstPoint],
        links: [],
        name: 'ASN Relation',
      }
      // const allAs2 = Object.assign(exportAs, importAs)
      const allName = Object.keys(displayAs)
      // console.log(allName)
      const providers = []
      const customers = []
      const peers = []
      const unknowns = []
      allName.forEach(key => {
        if (this.peerAses.includes(key)) {
          peers.push(key)
        } else if (this.providerAses.includes(key)) {
          providers.push(key)
        } else if (this.customerAses.includes(key)) {
          customers.push(key)
        } else {
          unknowns.push(key)
        }
      })
      // console.log('peers', peers)
      providers.sort((a, b) => parseInt(providerAS[b]) - parseInt(providerAS[a]))
      customers.sort((a, b) => parseInt(customerAS[b]) - parseInt(customerAS[a]))
      peers.sort((a, b) => parseInt(peerAS[b]) - parseInt(peerAS[a]))
      unknowns.sort((a, b) => parseInt(unknownAS[b]) - parseInt(unknownAS[a]))

      let newAllName = []
      newAllName = newAllName.concat(providers)
      newAllName = newAllName.concat(peers)
      newAllName = newAllName.concat(customers)
      newAllName = newAllName.concat(unknowns)

      // // console.log('allName', newAllName)
      // const firstList = newAllName.slice(length * 0, length * 1)
      // // console.log('firstList', firstList)
      // const secondList = newAllName.slice(length * 1, length * 2)
      // const thirdList = newAllName.slice(length * 2, length * 3)
      // const fourthList = newAllName.slice(length * 3, length * 4)
      // const newAsName = firstList.concat(secondList).concat(thirdList).concat(fourthList)
      // console.log('newAsName', newAsName)
      // 1,2,3,4
      // 2  (reverse)4
      // 1  (reverse)3
      //
      // (reverse)1   4
      // 2            (reverse)3
      //
      // 2 1 3 4
      // newAllName = newAllName.slice(0,8)

      this.setDataInGraphData(displayAs, newAllName, length, graphDataObj)
      let width = (this.windowWidth / 1280) * 1010

      if (newAllName.length <= length) {
        width = width / 2.1
      } else if (newAllName.length === (length / 2) * 3) {
        width = width / 1.15
      } else if (newAllName.length > length && newAllName.length < (length / 2) * 3) {
        width = width / (1.1 + 0.2 * (4 - (newAllName.length - length)))
        // width = width / 1.7
      }
      // 16 1
      // 15 1
      // 14 1
      // 13 1
      // 12 1.1
      // 11 1.3
      // 10 1.5
      // 9 1.7
      // console.log(this.windowWidth)
      // if (newAllName.length <= length) {
      //   width = width / 2
      // }else if (newAllName.length <= length * 2) {
      //   width = width / 1.3
      // }
      graphDataObj.width = width

      this.graphSeries = [graphDataObj]
      graphDataObj.zoom = 0.7
    },
  },
}
</script>

<style lang="scss" scoped>
// a{
//   color:#6b6b6b
// }
</style>
