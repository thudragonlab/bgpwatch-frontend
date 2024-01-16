<template>
  <div class="pie">
    <!-- {{this[type[0]][type[1]].data}} -->
    <chart
      :chartId="`dashboard_pie`"
      :option="new PieOption(this[type[0]][type[1]].title).getOption(['title', 'tooltip', 'legend', 'series'])"
      :sourceData="this[type[0]][type[1]].data"
    ></chart>
  </div>
</template>

<script>
import { DashBoardPieOption } from '@/templates/chart/pieTemplate'
export default {
  name: 'PeerType',
  created() {},
  data() {
    return {
      PieOption: DashBoardPieOption,
      typeMapping: {
        V6: {
          IE: {
            list: 'pieDataOfPrefixAndAddressListV6',
            data: 'pieDataOfPrefixAndAddressV6',
          },
          Prefix: {
            list: 'pieDataOfPeerTypeV6List',
            data: 'pieDataOfPeerTypeV6',
          },
          Other: {
            list: 'pieDataOfOtherList',
            data: 'pieDataOfOther',
          },
        },
        V4: {
          IE: {
            list: 'pieDataOfPrefixAndAddressListV4',
            data: 'pieDataOfPrefixAndAddressV4',
          },
          Prefix: {
            list: 'pieDataOfPeerTypeV4List',
            data: 'pieDataOfPeerTypeV4',
          },
          Other: {
            list: 'pieDataOfOtherList',
            data: 'pieDataOfOther',
          },
        },
      },
      pieDataOfPeerTypeV6: {
        'C-P': {
          title: 'IPv6 Customer\nranked by\nImport + Export',
          data: [],
          color: [
            '#5470c6',
            '#617bca',
            '#6d85ce',
            '#7a90d3',
            '#879bd7',
            '#94a5db',
            '#a0b0df',
            '#adbbe4',
            '#bac5e8',
            '#c7d0ec',
            '#d3dbf0',
            '#e0e5f5',
          ],
        },
        'P-C': {
          title: 'IPv6 Provider\nranked by\nImport + Export',
          data: [],
          color: [
            '#91cc75',
            '#9bd181',
            '#a5d58e',
            '#afda9a',
            '#b9dea7',
            '#c2e3b3',
            '#cce7bf',
            '#d6eccc',
            '#e0f1d8',
            '#eaf5e5',
            '#f4faf1',
            '#fefefd',
          ],
        },

        'P-P': {
          title: 'IPv6 Peer\nranked by\nImport + Export',
          data: [],
          color: [
            '#fac858',
            '#facd68',
            '#fbd379',
            '#fbd889',
            '#fcde9a',
            '#fce3aa',
            '#fde9bb',
            '#fdeecb',
            '#fef3dc',
            '#fef9ec',
            '#fef9ec',
            '#fef9ec',
          ],
        },
      },
      pieDataOfPeerTypeV6List: ['C-P', 'P-C', 'P-P'],
      pieDataOfPrefixAndAddressV6: {
        'ipv6-as-number': {
          title: 'Import/Export\nAS Number\nof IPv6',
          data: [],
        },
        'ipv6-perfix-number': {
          title: 'Import/Export\nIPv6\nPrefix Number',
          data: [],
        },
      },
      pieDataOfPrefixAndAddressV4: {
        'ipv4-as-number': {
          title: 'Import/Export\nAS Number\nof IPv4',
          data: [],
        },
        'ipv4-perfix-number': {
          title: 'Import/Export\nIPv4\nPrefix Number',
          data: [],
        },
      },
      pieDataOfPrefixAndAddressListV6: ['ipv6-as-number', 'ipv6-perfix-number'],
      pieDataOfPrefixAndAddressListV4: ['ipv4-as-number', 'ipv4-perfix-number'],
      pieDataOfOtherList: ['peer-type', 'country'],
      pieDataOfOther: {
        country: {
          title: 'Peer Country\nDistribution',
          data: [],
          color: [
            '#8355b3',
            '#8c61b8',
            '#956dbd',
            '#9d78c3',
            '#a684c8',
            '#ae90cd',
            '#b79cd2',
            '#bfa7d8',
            '#c8b3dd',
            '#d0bfe2',
            '#d9cae7',
            '#e1d6ed',
            '#eae2f2',
            '#f2eef7',
            '#fbf9fc',
          ],
        },
        'peer-type': {
          title: 'Peer Type\nDistribution\n(C-P/P-C/P-P)',
          data: [],
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'], //default
        },
      },
      pieDataOfPeerTypeV4: {
        'C-P': {
          title: 'IPv4 Customer\nranked by\nImport + Export',
          data: [],
          color: [
            '#5470c6',
            '#617bca',
            '#6d85ce',
            '#7a90d3',
            '#879bd7',
            '#94a5db',
            '#a0b0df',
            '#adbbe4',
            '#bac5e8',
            '#c7d0ec',
            '#d3dbf0',
            '#e0e5f5',
          ],
        },
        'P-C': {
          title: 'IPv4 Provider\nranked by\nImport + Export',
          data: [],
          color: [
            '#91cc75',
            '#9bd181',
            '#a5d58e',
            '#afda9a',
            '#b9dea7',
            '#c2e3b3',
            '#cce7bf',
            '#d6eccc',
            '#e0f1d8',
            '#eaf5e5',
            '#f4faf1',
            '#fefefd',
          ],
        },
        'P-P': {
          title: 'IPv4 Peer\nranked by\nImport + Export',
          data: [],
          color: [
            '#fac858',
            '#facd68',
            '#fbd379',
            '#fbd889',
            '#fcde9a',
            '#fce3aa',
            '#fde9bb',
            '#fdeecb',
            '#fef3dc',
            '#fef9ec',
            '#fef9ec',
            '#fef9ec',
          ],
        },
      },
      pieDataOfPeerTypeV4List: ['C-P', 'P-C', 'P-P'],
    }
  },
  props: {
    type: {
      type: Array,
    },
    dataList: {
      type: Array,
    },
  },
  mounted() {
    if (this.dataList) {
      this[this.type[0]][this.type[1]].data = this.dataList
    }
  },
  watch: {
    dataList(newV) {
      this[this.type[0]][this.type[1]].data = newV
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.pie {
  height: 22.5vh;
  width: 100%;
}

.tempoary-chart-style {
  opacity: 0;
}

.shadow-chart {
  // margin: 5%;
  background-color: #fff !important;
  border-radius: 20px;
  // box-shadow: 0px 0px 22px 0px #000;
  animation-name: fade-in-scale;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(1, 1.17, 0.17, 0.8);
}

@keyframes fade-in-scale {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.outside-box {
  widows: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}
</style>
