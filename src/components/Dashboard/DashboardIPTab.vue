<template>
  <div class="ip-container">
    <div class="IE-box">
      <IEGraph
        :title="`TOP32 Import/Export IPv${ipVersion}`"
        :inputAsn="inputAsn"
        :clickHandler="clickHandler"
        :peers="peers"
        :asNameInfoMap="asNameInfoMap"
        :version="`ipv${ipVersion}`"
        style="margin-bottom: 0px"
      ></IEGraph>
    </div>

    <div>
      <PeerPie :dataList="P_C" :type="[`pieDataOfPeerTypeV${ipVersion}`, 'P-C']"></PeerPie>
    </div>

    <div>
      <PeerPie :dataList="P_P" :type="[`pieDataOfPeerTypeV${ipVersion}`, 'P-P']"></PeerPie>
    </div>
    <div>
      <PeerPie :dataList="C_P" :type="[`pieDataOfPeerTypeV${ipVersion}`, 'C-P']"></PeerPie>
    </div>

    <div>
      <PeerPie :dataList="countryList" :type="['pieDataOfOther', 'country']"></PeerPie>
    </div>

    <div class="search-bar">
      <div class="checkbox">
        <el-checkbox v-model="showProvider" label="Provider"></el-checkbox>
        <el-checkbox v-model="showPeer" label="Peer"></el-checkbox>
        <el-checkbox v-model="showCustomer" label="Customer"></el-checkbox>
        <el-checkbox v-model="showUnknown" label="Unknown"></el-checkbox>
      </div>
      <div>
        <el-input
          placeholder="Search for ASN, Organization name or country"
          v-model="searchKey"
          class="search-as-info-input"
          clearable
        >
        </el-input>
      </div>
    </div>
    <div class="as-table">
      <el-row style="padding: 20px; background-color: #fff; border-radius: 20px">
        <pagination-table
          :originData="
            tableData
              .filter(item => {
                const peerCondition = item.PeerType === 'peer'
                const customerCondition = item.PeerType === 'customer'
                const providerCondition = item.PeerType === 'provider'
                const unknownCondition = item.PeerType === 'unknown'
                let finalCondition = false
                if (showPeer) {
                  finalCondition = finalCondition || peerCondition
                }
                if (showProvider) {
                  finalCondition = finalCondition || providerCondition
                }
                if (showCustomer) {
                  finalCondition = finalCondition || customerCondition
                }
                if (showUnknown) {
                  finalCondition = finalCondition || unknownCondition
                }

                return finalCondition
              })
              .filter(item => {
                if (searchKey) {
                  return (
                    item.org_name.toLowerCase().includes(searchKey.toLowerCase()) ||
                    item.country.toLowerCase().includes(searchKey.toLowerCase()) ||
                    item.asn.includes(searchKey)
                  )
                }
                return true
              })
          "
          :title="`All IPv${ipVersion} Neighbors`"
          :titleStyle="titleStyle"
          :showRule="showRule"
          :cellClassName="generateCellStyle"
          :paginationProp="{ background: true, layout: 'total, prev, pager, next' }"
          paginationProClass="anomaly-pagination"
          loadDataFadeIn
        ></pagination-table>
      </el-row>
    </div>
  </div>
</template>

<script>
const PIE_CHART_TOP = 10
import LeftColumn from '@/components/Column/LeftColumn.vue'
// import RightColumn from '@/components/Column/RightColumn.vue'
import PeerPie from '@/components/Dashboard/DashboardIPTabPeerPie.vue'
import IEGraph from '@/components/Dashboard/DashboardIPTabIEGraph.vue'
import { BarOption } from '@/templates/chart/barTemplate'
import { getAsInfoByList, getPeerList } from '@/api/DashBoardApi'
import codeCountry from '@/../public/static/code_country.json'
import ToDashboardColumn from '@/components/Column/ToDashboardColumn.vue'
import { middleFontSize } from '@/styles/font.scss'
export default {
  name: 'IpTab',
  created() {},
  components: {
    IEGraph,
    PeerPie,
    LeftColumn,
  },
  data() {
    return {
      titleStyle: {
        fontWeight: 'bold',
        fontSize: middleFontSize,
      },
      BarOption,
      inputAsn: '',
      ipVersion: 4,
      clickHandler: () => {},
      peers: {},
      searchKey: '',
      ShowingExportImportAsTabs: [],
      DataListPrefix: [],
      activeName: 'Export IPv4',
      P_C: [],
      C_P: [],
      P_P: [],
      DataListOther: [],
      countryList: [],
      barData: [],
      barDataLabel: {},
      distribution: {},
      asNameInfoMap: {},
      tableData: [],
      tableDataMap: {},
      selectTypes: [],
      showProvider: true,
      showPeer: true,
      showCustomer: true,
      showUnknown: true,
      searchKey_h: '',
      ExportImportAsTabs: [],
      showRule: [
        {
          prop: 'asn',
          label: 'AS neighbors',
          subComponent: ToDashboardColumn,
          sortable: 'custom',
          width: '150px',
          compare: (a, b) => a.asn - b.asn,
          rowFormat: row => {
            return row.asn
          },
        },
        {
          prop: 'org_name',
          label: 'Organization',
          subComponent: LeftColumn,
          rowFormat: row => {
            return row.org_name
          },
        },
        {
          prop: 'country',
          label: 'Country/Region',
          compare: (a, b) => {
            return (
              a.country.split('', a.country.length).reduce((s, item) => {
                return item.charCodeAt() + s
              }, 0) -
              b.country.split('', b.country.length).reduce((s, item) => {
                return item.charCodeAt() + s
              }, 0)
            )
          },
          sortable: 'custom',
        },
        {
          prop: 'cone',
          label: 'AS customer cone',
          width: '170px',
          sortable: 'custom',
          compare: (a, b) => a.cone - b.cone,
        },
        {
          prop: 'PeerType',
          label: 'Relationship',
        },

        {
          prop: 'export',
          label: 'Export',
        },
        {
          prop: 'import',
          label: 'Import',
        },
      ],
    }
  },
  props: {
    param: {
      type: Object,
    },
  },
  watch: {
    param() {
      this.getPeer().catch(e => console.error(e))
    },
  },
  mounted() {
    this.getPeer().catch(e => console.error(e))
  },
  methods: {
    async getPeer() {
      this.getParam()
      this.peers = await this.getPeerList()
      if (this.peers['export_peers']) {
        let exportAs = this.peers['export_peers'][`ipv${this.ipVersion}`]
        let importAs = this.peers['import_peers'][`ipv${this.ipVersion}`]
        if (!exportAs) {
          exportAs = {}
        }
        if (!importAs) {
          importAs = {}
        }
        let concatList = [exportAs, importAs].reduce(
          (concatList, list) => {
            return concatList.concat(Object.keys(list))
          },
          [this.inputAsn]
        )

        this.tableDataMap = {}
        this.asNameInfoMap = await this.getAsInfoByList(concatList)
        this.handlePie()
        this.handleTable()
      }
    },
    doSearch() {
      if (this.searchKey_h) {
        this.searchKey = this.searchKey_h
      }
    },
    async getPeerList() {
      const peer = await getPeerList(this.inputAsn, this.ipVersion)
      return peer
    },
    async getAsInfoByList(asList) {
      const data = await getAsInfoByList(asList)
      return data
    },
    getParam() {
      const { inputAsn, clickHandler, ipVersion, distribution } = this.param
      this.inputAsn = inputAsn
      this.clickHandler = clickHandler
      this.ipVersion = ipVersion
      this.distribution = distribution
    },

    handleTable() {
      const { customer_prefixes, provider_prefixes, peer_prefixes } = this.distribution
      const asPeerTypeMap = {}
      const export_import = ['export', 'import']
      // this.countryList
      const countryMap = {}
      const setIpData = (sourceData, asPeerTypeMap, _type) => {
        if (!sourceData) {
          return
        }

        Object.keys(sourceData).forEach((key, index) => {
          let name = 'Unknown'
          let country = ''
          if (this.asNameInfoMap[key]) {
            name = this.asNameInfoMap[key].org
            country = codeCountry[this.asNameInfoMap[key].country] || this.asNameInfoMap[key].country
          }
          if (!country) {
            country = 'Unknown'
          }

          countryMap[key] = country

          if (!Object.keys(this.tableDataMap).includes(key)) {
            this.tableDataMap[key] = {
              asn: key,
              cone: this.asNameInfoMap[key] ? this.asNameInfoMap[key].cone : 'Unknown',
              org_name: name,
              country,
              PeerType: asPeerTypeMap[key] || 'unknown',
              [export_import[0]]: 0,
              [export_import[1]]: 0,
            }
          }

          this.tableDataMap[key][_type] = sourceData[key]
        })
      }

      if (customer_prefixes) {
        customer_prefixes.forEach(item => {
          asPeerTypeMap[item.name] = 'customer'
        })
      }
      if (provider_prefixes) {
        provider_prefixes.forEach(item => {
          asPeerTypeMap[item.name] = 'provider'
        })
      }
      if (peer_prefixes) {
        peer_prefixes.forEach(item => {
          asPeerTypeMap[item.name] = 'peer'
        })
      }
      setIpData(this.peers['export_peers'][`ipv${this.ipVersion}`], asPeerTypeMap, export_import[0])
      setIpData(this.peers['import_peers'][`ipv${this.ipVersion}`], asPeerTypeMap, export_import[1])
      // console.log('this.tableDataMap', countryMap)

      const countryMap2 = {}
      Object.entries(countryMap).forEach(item => {
        if (!countryMap2[item[1]]) {
          countryMap2[item[1]] = 0
        }
        countryMap2[item[1]] += 1
      })
      const countryList = Object.entries(countryMap2)
      // console.log('countryList', countryList)
      countryList.sort((a, b) => b[1] - a[1])
      this.countryList = countryList.map(item => {
        return { name: item[0], value: item[1] }
      })
      this.tableData = Object.values(this.tableDataMap)
    },

    handlePie() {
      this.processPieDataOfPeerType()
    },

    async processPieDataOfPeerType() {
      if (!this.distribution) {
        return
      }
      const { customer_prefixes, provider_prefixes, peer_prefixes } = this.distribution
      this.processPrefixDataAndSetInChart(provider_prefixes, 'P-C', 'P_C')
      this.processPrefixDataAndSetInChart(customer_prefixes, 'C-P', 'C_P')
      this.processPrefixDataAndSetInChart(peer_prefixes, 'P-P', 'P_P')
    },
    processPrefixDataAndSetInChart(as_prefixes, keyWord, dataName) {
      const processedPieData = this.processPrefixDatafrom(as_prefixes)
      this[dataName] = this.setPrefixDataInPieChart(processedPieData)
    },

    setPrefixDataInPieChart(processedPieData) {
      const willReturnList = []

      let Rest = {}

      for (let index = 0; index < processedPieData.length; index++) {
        const asn = processedPieData[index]
        if (asn.name === 'Rest') {
          Rest = {
            name: asn.name,
            value: asn.value,
          }
          continue
        }
        willReturnList.push({
          name: asn.name,
          value: asn.value,
        })
      }

      willReturnList.sort((a, b) => b.value - a.value)
      if (processedPieData.length > PIE_CHART_TOP) {
        willReturnList.push(Rest)
      }
      return willReturnList
    },
    processPrefixDatafrom(peerTypeList) {
      const peerTypeListWillReturn = []
      peerTypeList = this.sortPrefixData(peerTypeList)
      this.simplifyPerfixData(peerTypeList, `prefiexCountForV${this.ipVersion}`, peerTypeListWillReturn)
      return peerTypeListWillReturn
    },
    simplifyPerfixData(peerTypeList, sortAttr, peerTypeListWillReturn) {
      if (!peerTypeList) {
        return
      }
      const top = PIE_CHART_TOP
      peerTypeList.sort((a, b) => b[sortAttr] - a[sortAttr])
      peerTypeList.forEach((asn, index) => {
        if (index <= top) {
          peerTypeListWillReturn.push({
            name: asn.name,
            value: asn[sortAttr],
          })
        } else {
          peerTypeListWillReturn[top] = {
            name: 'Rest',
            value: peerTypeListWillReturn[top].value + asn[sortAttr],
          }
        }
      })
      // console.log('peerTypeList', peerTypeList)
    },
    sortPrefixData(peerTypeList) {
      const returnList = []
      if (!peerTypeList) {
        return returnList
      }
      peerTypeList.forEach(asn => {
        asn[`prefiexCountForV${this.ipVersion}`] = 0
        if (this.peers['import_peers'][`ipv${this.ipVersion}`][asn.name]) {
          asn[`prefiexCountForV${this.ipVersion}`] += this.peers['import_peers'][`ipv${this.ipVersion}`][asn.name]
        }
        if (this.peers['export_peers'][`ipv${this.ipVersion}`][asn.name]) {
          asn[`prefiexCountForV${this.ipVersion}`] += this.peers['export_peers'][`ipv${this.ipVersion}`][asn.name]
        }
        if (asn[`prefiexCountForV${this.ipVersion}`]) {
          returnList.push(asn)
        }
      })
      return returnList
    },
    generateCellStyle({ row, column, columnIndex, rowIndex }) {
      if (columnIndex === 4) {
        return 'full-cell'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ip-container {
  display: grid;
  grid-template-columns: 80% 20%;
  grid-template-rows: repeat(4, 1fr) auto;
  grid-template-areas:
    'topo pie'
    'topo pie'
    'topo pie'
    'topo pie'
    'search-bar search-bar'
    'table table';

  padding-top: 20px;
  background-color: #f0f0f0;
  // height: 100%;
}
.IE-box {
  grid-column-start: topo-start;
  grid-column-end: topo-end;
  grid-row-start: topo-start;
  grid-row-end: topo-end;
}
.as-table {
  grid-column-start: table-start;
  grid-column-end: table-end;
  grid-row-start: table-start;
  grid-row-end: table-end;
}
.search-bar {
  padding-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  grid-column-start: search-bar-start;
  grid-column-end: search-bar-end;
  grid-row-start: search-bar-start;
  grid-row-end: search-bar-end;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.full-cell {
  padding: 0 !important;
}
.full-cell .cell {
  padding: 0 !important;
  height: 100%;
}
.search-as-info-input {
  width: 400px;
}
.anomaly-pagination {
  text-align: left;
  margin-top: 20px;
}
</style>
