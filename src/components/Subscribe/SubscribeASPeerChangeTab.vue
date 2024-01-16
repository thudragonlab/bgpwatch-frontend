<template>
  <div>
    <el-row v-for="(asn, index) in Object.keys(result).slice(currentPage * pageSize,(currentPage + 1) * pageSize) " :key="index" class="peer-row">
      <el-col :span="24">
        <chart
        class="peer-line"

        :chartId="`dashboard_right_bar111${index}`"
        :option="
          new SubcribePeerDiffLineOption(`AS${asn}`).getOption(['tooltip', 'xAxis', 'yAxis', 'title', 'grid', 'series'])
        "
        :series="[Object.assign({ data: result[asn]['chart']['peer_num'] }, SubcribePeerDiffLineOption.getSeriesFirst())]"
        :extraOption="result[asn]['chart']['extraOption']"
      ></chart>
        <div class="peer-list">
        <span v-for="(_as, idx) in result[asn].peerList" :key="idx">
          <el-tag v-if="_as.type === '+'" type="success" size="small" style="min-width: 75px">+ {{ _as.asn }}</el-tag>
          <el-tag
            v-else-if="_as.type === '-'"
            type="danger"
            size="small"
            style="min-width: 75px; text-decoration: line-through"
            >- {{ _as.asn }}</el-tag
          >
          <el-tag v-else type="info" size="small" style="min-width: 75px">{{ _as.asn }}</el-tag>
        </span>
        
      </div>
      </el-col>
    </el-row>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="Object.keys(result).length"
        :page-size="pageSize"
        :current-page="currentPage + 1"
        @current-change="currentChange"
      >
      </el-pagination>
  </div>
</template>

<script>
import { getPeerDiff, getPeerStats } from '@/api/SubscribeApi'
import { SubcribePeerDiffLineOption } from '@/templates/chart/lineTemplate'
export default {
  name: 'SubscribeHijackTab',
  created() {},
  data() {
    return {
      result:{},
      SubcribePeerDiffLineOption,
      pageSize:10,
      userInfo : localStorage.getItem('userInfo'),
      currentPage:0,
    }
  },
  props: {},
  methods: {
    currentChange(newPage){
      this.currentPage = newPage - 1
    },
    async getPeerDiff() {
      
      const result = await getPeerDiff()
      this.processPeerSet(result)
      const chartResult = await getPeerStats()
      this.processChartPeerStats(chartResult)
    },
    processChartPeerStats(chartRes) {
      chartRes.forEach(item => {
        item['peer_num'] = item['peer_num'].map(d => {
          let date = d[0]
          date = date.split('')
          date.splice(6, 0, '-')
          date.splice(4, 0, '-')
          const nowTimeStamp = new Date(date.join('')).getTime()
          d[0] = nowTimeStamp
          return d
        })
        const min = Math.min(...item['peer_num'].map(d => d[1]))
        const max = Math.max(...item['peer_num'].map(d => d[1]))
        if (min !== max) {
        item['extraOption'] = {
          yAxis: Object.assign(this.SubcribePeerDiffLineOption.getYAxis(), {
            min: min - (max - min) / 2,
            max: max + (max - min) / 2,
          }),
        }
      } else {
        if (min === 0) {
          item['extraOption'] = {
            yAxis: Object.assign(this.SubcribePeerDiffLineOption.getYAxis(), {
              min: -1,
              max: 1,
            }),
          }
        } else {
          item['extraOption'] = {
            yAxis: Object.assign(this.SubcribePeerDiffLineOption.getYAxis(), {
              min: 0,
              max: max * 2,
            }),
          }
        }
      }
      this.result[item['_id']]['chart'] = item
      })
      this.result = {...this.result}
    },
    processPeerSet(res) {
      res.forEach(asn => {
        const showingPeerList = []
        if (asn.diff.status) {
          asn.diff['+'].forEach(as => {
            showingPeerList.push({ asn: as, type: '+' })
          })
          asn.diff['-'].forEach(as => {
            showingPeerList.push({ asn: as, type: '-' })
          })
        }
        asn.set.forEach(as => {
          if (!showingPeerList.includes(as)) {
            showingPeerList.push({ asn: as, type: '' })
          }
        })
        asn['peerList'] = showingPeerList
        
        this.result[asn['_id']] = asn
      })
      console.log(this.result)

    },
  },
  mounted() {
    if(this,this.userInfo){
      this.getPeerDiff().catch(e => console.error(e))
    }
  },
}
</script>

<style lang="scss" scoped>
.asn-class {
  /* padding: 10px; */
  margin-top: 6%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 10px;
  font-size: var(--subTitle-font-size);
}
.asn {
}
.peer-row {
  background-color: #fff;
  border-radius: var(--border-radius-deg);
  padding: 10px;
  margin-top: 10px;
  overflow: auto;
}

.peer-line{
  height: 30vh !important;
  width: 100vw !important;
}

.peer-list{
  border-top: solid #000 1px;
  padding-top: 20px;
  margin-top: 20px;
}
</style>
