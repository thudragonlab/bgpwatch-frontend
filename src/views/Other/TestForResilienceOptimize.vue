<template>
  <div>
    <div class="options">
      <el-autocomplete v-model="input_asn" placeholder="请输入ASN" :fetch-suggestions="querySearch">
        <el-select
          v-model="cc_value"
          placeholder="请选择国家代码"
          slot="prepend"
          style="width: 100px"
          @change="changeCC"
        >
          <el-option v-for="item in cc_options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
      </el-autocomplete>
    </div>
    <div class="chart-box">
      <chart
        chartId="test"
        :option="new TestGraphOption('Unoptimize').getOption(['title', 'series', 'tooltip'])"
        :series="graphSeries"
      >
      </chart>
      <chart
        chartId="test2"
        :option="new TestGraphOption('Optimize').getOption(['title', 'series', 'tooltip'])"
        :series="graphSeriesOpt"
      >
      </chart>
    </div>
  </div>
</template>

<script>
// import Chart from '../components/Depracated/Chart.vue'
import { TestGraphOption } from '@/templates/chart/graphTemplate'
import { getResilienceTestDataInOptimize, getAsByCc } from '@/api/ResilienceApi'

export default {
  // components: { Chart },
  name: 'Test',
  created() {},
  data() {
    return {
      TestGraphOption,
      graphSeries: [],
      graphSeriesOpt: [],
      cc_value: 'KH',
      input_asn: '9902',
      asCount: 0,
      cc_list: [
        'AR',
        'AT',
        'AU',
        'BD',
        'BG',
        'BR',
        'CA',
        'CH',
        'CL',
        'CN',
        'CO',
        'CZ',
        'DE',
        'DK',
        'FI',
        'ES',
        'FR',
        'GB',
        'HK',
        'HU',
        'ID',
        'IE',
        'IN',
        'IR',
        'IT',
        'JP',
        'KH',
        'KR',
        'LU',
        'LV',
        'MX',
        'MY',
        'NG',
        'NO',
        'NL',
        'NZ',
        'PH',
        'PL',
        'RO',
        'PT',
        'RU',
        'SE',
        'SG',
        'TH',
        'SK',
        'TR',
        'TW',
        'UA',
        'US',
        'ZA',
      ],
      cc_options: [],
    }
  },
  props: {},
  methods: {
    async doSearch() {
      const res = await getResilienceTestDataInOptimize(this.cc_value, this.input_asn)
      const { name, links, name_opt, links_opt } = res
      this.graphSeries = [
        {
          data: name,
          links: links,
        },
      ]

      this.graphSeriesOpt = [
        {
          data: name_opt,
          links: links_opt,
        },
      ]
    },

    async changeCC(value) {
      // console.log(value)
      const asn_list = await getAsByCc(value)
      this.asn_list = asn_list
    },
    querySearch(queryString, cb) {
      // var restaurants = this.restaurants;
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(this.asn_list)
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.doSearch()
      this.changeCC(this.cc_value)
    })
    this.cc_options = this.cc_list.map(cc => {
      return {
        value: cc,
        label: cc,
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;
  height: 90vh;
  display: flex;
}
.options {
  display: flex;
}
.el-autocomplete {
  width: 100%;
}
</style>
