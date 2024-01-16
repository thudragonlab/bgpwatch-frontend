<template>
  <div class="dashboard-container fade-in">
    <div :class="['sticky-div', showSticktyRow ? 'show-search-bar' : 'hidden-search-bar']">
      <el-input
        class="search-input"
        v-model="inputText"
        :placeholder="`You can search by AS number, AS name, organization name`"
      >
        <!-- <template slot="prepend">ASN</template> -->
        <el-button slot="append" icon="el-icon-search" @click="chickSearch"></el-button>
      </el-input>
    </div>

    <el-row class="row-cc" id="search-row">
      <el-col :span="9" v-if="DashboardActiveName !== 'Routing Path'" class="show-input" style="text-align: left">
        <el-input
          class="search-input"
          v-model="inputText"
          :placeholder="`You can search by AS number, AS name, organization name`"
        >
          <el-button slot="append" icon="el-icon-search" @click="chickSearch"></el-button>
        </el-input>
      </el-col>
      <el-col :span="15" class="last-update">
        <div style="text-align: left">You can search by AS number, AS name, or organization name.</div>
        <div>Last Update:{{ lastUpdateTimestamp }}</div>
      </el-col>
    </el-row>
    <el-row v-if="inputAsn === ''">
      <pagination-table
        v-loading="showLoading"
        hiddenIndex
        :originData="tabldata"
        :showRule="showRule"
        loadDataFadeIn
        @clickAsn="clickAsn"
      ></pagination-table>
    </el-row>
    <el-row v-show="inputAsn !== ''">
      <el-tabs stretch v-model="DashboardActiveName" type="border-card" class="tab-list">
        <el-tab-pane
          v-for="(tab, index) in Object.keys(DashboardTabs)"
          :lazy="DashboardTabs[tab].lazy"
          :key="index"
          :label="DashboardTabs[tab].label"
          :name="DashboardTabs[tab].label"
        >
          <component :is="DashboardTabs[tab].subComponent" :param="DashboardTabs[tab].param"></component>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import AsInfoTab from '@/components/Dashboard/DashboardAsInfoTab.vue'
import DashboardWhoisTab from '@/components/Dashboard/DashboardWhoisTab.vue'
import IpTab from '@/components/Dashboard/DashboardIPTab.vue'

import { getAsInfo } from '@/api/routeMonitor'
import { setDataInGraphData } from '@/templates/chart/graphTemplate'
import { getPeerTypeDistribute, getAsInfoByList } from '@/api/DashBoardApi'
import ToDashboardColumn from '@/components/Column/ToDashboardColumn.vue'
export default {
  name: 'Dashboard',
  data() {
    return {
      selectedType: 'inputAsn',
      DashboardActiveName: 'Basic',
      inputText: localStorage.getItem('DashboardASN') || '4538',
      showLoading: true,
      inputAsn: localStorage.getItem('DashboardASN') || '4538',
      searchAsName: '',
      searchOrg: '',
      tabldata: [],
      lastUpdateTimestamp: '',
      propList: ['inputAsn', 'searchAsName', 'searchOrg'],
      showRule: [
        {
          prop: 'asn',
          label: 'asn',
          subComponent: ToDashboardColumn,
          rowFormat: row => {
            return row.asn
          },
        },

        {
          prop: 'as_name',
          label: 'AS Name',
        },
        {
          prop: 'org_name',
          label: 'Organization',
        },
        {
          prop: 'cone',
          label: 'Cone',
          sortable: 'custom',
          compare: (a, b) => a.cone - b.cone,
        },
      ],

      options: [
        {
          value: 'inputAsn',
          label: 'ASN',
        },
        {
          value: 'searchAsName',
          label: 'AS Name',
        },
        {
          value: 'searchOrg',
          label: 'Org Name',
        },
      ],
      DashboardTabs: {
        Basic: {
          label: 'Basic',
          subComponent: AsInfoTab,
          param: {},
        },
        'IPv4 Peers': {
          label: 'IPv4 Peers',
          subComponent: IpTab,
          lazy: true,
          param: {},
        },
        'IPv6 Peers': {
          label: 'IPv6 Peers',
          subComponent: IpTab,
          lazy: true,
          param: {},
        },
        'Whois': {
          label: 'Whois',
          subComponent: DashboardWhoisTab,
          lazy: true,
          param: {},
        },
      },
      searchRowHeight: 0,
      showSticktyRow: false,
    }
  },
  props: {},
  created() {
    if (Object.keys(this.$route.query).includes('asn')) {
      this.inputAsn = this.$route.query.asn
      this.inputText = this.$route.query.asn
    }
  },
  mounted() {
    this.searchRowHeight = document.getElementById('search-row').clientHeight + 10
    window.addEventListener('scroll', this.handleFloatSearch, true)
    this.getAsInfoByASN(this.inputAsn)
  },
  methods: {
    setDataInGraphData,

    handleFloatSearch() {
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop >= this.searchRowHeight) {
        if (!this.showSticktyRow) {
          this.showSticktyRow = true
        }
      } else {
        if (this.showSticktyRow) {
          this.showSticktyRow = false
        }
      }
    },
    clickHandler(param) {
      const name = param.data.name.split('|')[0]
      if (name !== this.inputAsn) {
        this.getAsInfoByASN(name)
      }
    },

    async getAsInfoByList(asnList) {
      const data = await getAsInfoByList(asnList)
      return data
    },

    async getAsInfoByASN(inputAsn) {
      this.inputAsn = inputAsn
      const {
        peer_type,
        customer_prefixes,
        provider_prefixes,
        peer_prefixes,
        country_distribute,
      } = await getPeerTypeDistribute(this.inputAsn)
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      this.DashboardTabs['IPv4 Peers'].param = {
        inputAsn,
        clickHandler: this.clickHandler,
        distribution: {
          peer_type,
          customer_prefixes,
          provider_prefixes,
          peer_prefixes,
          country_distribute,
        },
        ipVersion: 4,
      }

      this.DashboardTabs['IPv6 Peers'].param = {
        inputAsn,
        clickHandler: this.clickHandler,
        distribution: {
          peer_type,
          customer_prefixes,
          provider_prefixes,
          peer_prefixes,
          country_distribute,
        },
        ipVersion: 6,
      }

      this.DashboardTabs['Basic'].param = {
        inputAsn: this.inputAsn,
      }

      this.DashboardTabs['Whois'].param = {
        inputAsn: this.inputAsn,
      }
      const asPeerTypeMap = {}
      customer_prefixes.forEach(item => {
        asPeerTypeMap[item.name] = 'C-P'
      })
      provider_prefixes.forEach(item => {
        asPeerTypeMap[item.name] = 'P-C'
      })
      peer_prefixes.forEach(item => {
        asPeerTypeMap[item.name] = 'P-P'
      })
    },
    async doSearch() {
      this.showLoading = true
      const result = await getAsInfo(this.inputAsn, this.searchAsName, this.searchOrg)
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      this.tabldata = result
      this.showLoading = false
    },
    clickAsn(asn) {
      this.inputText = asn
      this.chickSearch()
    },
    chickSearch() {
      const number_regex = /^\d+$/
      if (number_regex.test(this.inputText)) {
        this.inputAsn = this.inputText
        this.searchAsName = ''
        this.searchOrg = ''
      } else {
        this.searchAsName = this.inputText.toUpperCase()
        this.searchOrg = this.inputText.toUpperCase()
        this.inputAsn = ''
        this.tabldata = []
      }

      if (this.inputAsn === '') {
        this.doSearch()
      } else {
        this.getAsInfoByASN(this.inputAsn)
      }
      localStorage.setItem('DashboardASN',this.inputAsn)
    },
  },
}
</script>

<style lang="scss" scope>
.dashboard-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
  .chart {
    background-color: #fff;
  }

  // .pie {
  //   width: 24%;
  // }
  // .pie,
  .bar {
    height: 50vh;
  }
  .line {
    height: 20vh;
  }
  .graph {
    height: calc(80vh - 44px);
  }
  .i-e-graph {
    height: 90vh;
  }
}
.data-card-box {
  display: flex;
  flex-wrap: wrap;
}

.sticky-div {
  position: fixed;
  text-align: left;
  padding: 10px;
  z-index: 10;
  background-color: #fff;
  width: 500px;
  border-radius: 40px;
  box-shadow: 0px 10px 16px -10px #000;
}

.search-input {
  width: 500px;
}

.sticky-div .el-input-group__append,
.sticky-div .el-input-group__prepend {
  border-radius: 40px !important;
}
.sticky-div .el-input-group__prepend {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.sticky-div .el-input-group__append {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.show-search-bar {
  animation-name: fade-in;
  animation-duration: 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.hidden-search-bar {
  animation-name: fade-out;
  animation-duration: 0.5s;
  z-index: -100;
  animation-fill-mode: forwards;
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.dashboard-table .el-row {
  margin-bottom: 0px !important;
}
.as-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.as {
  color: #fff;
  font-weight: bold;
  background-image: linear-gradient(to right, #7f5ac3, #af86d8);
  width: 80%;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  box-shadow: 5px 4px 13px -7px #000;
  cursor: pointer;
}

.as:hover {
  background-image: linear-gradient(to right, #936ec3, #c39ad8);
}
.as:focus,
.as:active {
  box-shadow: -2px 4px 11px -7px #000 inset;
}

.clickedAs {
  color: #fff;
  font-weight: bold;
  background-image: linear-gradient(to right, #ee8b76, #e29a8b);
  width: 80%;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  box-shadow: 5px 4px 13px -7px #000;
  cursor: pointer;
}

.row-cc {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  // height: 60px;
}
.last-update {
  display: flex;
  justify-content: space-between;
  text-align: right;
  font-size: var(--middle-font-size);
  font-weight: bold;
}

.show-col {
  animation-name: fade-in;
  animation-duration: 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translate(0, 10px);
  }

  100% {
    opacity: 1;
  }
}

.show-input {
  animation-name: fade-in-from-left;
  animation-duration: 0.5s;
}

@keyframes fade-in-from-left {
  0% {
    opacity: 0;
    transform: translate(-10px, 0px);
  }

  100% {
    opacity: 1;
  }
}
</style>
