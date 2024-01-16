<template>
  <div class="org-container">
    <el-row class="search-bar">
      <el-col :col="24">
        <el-input
          id="searchInput"
          :placeholder="`Please input ${placeholderMap[selectedType]}`"
          @input="inputContent"
          v-model="inputText"
        >
          <el-select v-model="selectedType" id="searchSelect" slot="prepend" style="width: 150px" @change="changeModel">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <div class="as-table-box">
      <div class="as-table">
        <pagination-table hiddenIndex :originData="tabldata" :showRule="showRule" loadDataFadeIn></pagination-table>
      </div>
    </div>
    <div class="update-time">LastUpdate:{{ lastUpdateTimestamp }}</div>
  </div>
</template>

<script>
import { getAsInfo } from '@/api/routeMonitor'
import ToDashboardColumn from '@/components/Column/ToDashboardColumn.vue'
export default {
  name: 'Organization',
  created() {},
  data() {
    return {
      tabldata: [],
      inputText: 'CERNET',
      lastUpdateTimestamp: '',
      options: [
        {
          value: 'searchASN',
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
      ],
      selectedType: 'searchAsName',
      searchASN: '',
      searchAsName: 'CERNET',
      searchOrg: '',
      propList: ['searchASN', 'searchAsName', 'searchOrg'],
      placeholderMap: {
        searchASN: 'asn',
        searchAsName: 'as name',
        searchOrg: 'as organization',
      },
    }
  },
  async mounted() {
    this.doSearch()
  },
  methods: {
    async doSearch() {
      const result = await getAsInfo(this.searchASN, this.searchAsName, this.searchOrg)
      this.lastUpdateTimestamp = new Date(parseInt(localStorage.getItem('lastUpdateTimestamp') * 1000))
        .toJSON()
        .split('T')[0]
      this.tabldata = result
    },
    changeModel(v) {
      this.inputText = ''
      this.propList.forEach(prop => {
        if (v !== prop) {
          this[prop] = ''
        }
      })
    },
    inputContent() {
      this[this.selectedType] = this.inputText
    },
  },
}
</script>

<style lang="scss" scoped>
.org-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
}

.as-table-box {
  border-radius: 20px;
  padding: 10px;
  background-color: #fff;
}

.as-table {
  // border-radius: 20px;
}

.search-bar {
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
}

.update-time {
  background-color: #fff;
  text-align: right;
  font-weight: bold;
  margin-top: 10px;
  padding-right: 10px;
  border-radius: var(--border-radius-deg);
}
</style>
