<template>
  <div class="as-path-change">
    <div>
      <div v-if="Object.keys(result).length === 0" class="empty-data">No subscribed AS Path Change</div>
      <el-tabs tab-position="left" class="l" v-model="selectedAsn" @tab-click="clickAsn">
        <el-tab-pane
          style="border-left: solid #eaeaea 20px"
          v-for="(item, index) in Object.keys(result)"
          :key="index"
          :label="item"
          :name="item"
        >
          <el-tabs
            type="card"
            closable
            @tab-remove="removeTab"
            v-model="selectedPrefix"
            class="r"
            @tab-click="prefixClick"
          >
            <el-tab-pane
              v-for="(prefix, idx) in Object.keys(result[item])"
              :key="`${idx}-${index}`"
              :label="prefix"
              :name="prefix"
              v-loading="pathLoading"
            >
              <div v-if="result[item][prefix].length === 0">
                <el-empty description="Loading"></el-empty>
              </div>
              <div class="as-path" v-for="(info, i) in result[item][prefix]" :key="i">
                <div class="as-path-info">
                  <div class="as-path-date">
                    <div >Date:{{ info.date }}</div>
                    <div >Prefix:{{ info.prefix }}</div>
                  </div>
                  
                  <div class="as-path-diff">
                    <span v-for="(diff, it) in info.diff" :key="it"
                      ><el-tag :type="diff.includes('-') ? 'danger' : 'success'">{{ diff.split('|')[0] }}</el-tag></span
                    >
                  </div>
                </div>

                <div v-if="info['status']">
                  <chart
                    class="path-graph"
                    :chartId="`sub_graph${index}`"
                    :option="new ASPathGraphOption(`AS path`).getOption(['title', 'series'])"
                    :series="info['series']"
                  ></chart>
                </div>
                <div v-else class="as-path-msg">
                  {{ info['msg'] }}
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { searchAs2PrefixPathInfo, getAs2prefixPath, removeAs2prefixPath } from '@/api/SubscribeApi'
import { ASPathGraphOption } from '@/templates/chart/graphTemplate'
const X_INEDX_OFFSET = 100 // 7
export default {
  name: 'SubscribeAsPathChangeTab',
  created() {},
  data() {
    return {
      ASPathGraphOption,
      userInfo: localStorage.getItem('userInfo'),
      result: {},
      selectedPrefix: '',
      selectedAsn: '',
      pathList: [],
      pathLoading: false,
    }
  },
  props: {},
  mounted() {
    if (this.userInfo) {
      this.SearchASNInPath()
    }
  },
  methods: {
    removeTab(targetName) {
      this.$alert(`remove prefix ${this.selectedPrefix}`, 'tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            removeAs2prefixPath(this.selectedPrefix, this.selectedAsn)
            Vue.delete(this.result[this.selectedAsn], targetName)
            if (Object.keys(this.result[this.selectedAsn]).length == 0) {
              Vue.delete(this.result, this.selectedAsn)
              this.selectedAsn = Object.keys(this.result)[0]
            }
            this.selectedPrefix = Object.keys(this.result[this.selectedAsn])[0]
            this.getPath()
          }
        },
      })
    },
    clickAsn() {
      this.selectedPrefix = Object.keys(this.result[this.selectedAsn])[0]
      this.getPath()
    },
    async SearchASNInPath() {
      const result = await searchAs2PrefixPathInfo()
      this.result = result
      if (Object.keys(this.result).length === 0) {
        return
      }
      this.selectedAsn = Object.keys(this.result)[0]
      this.selectedPrefix = Object.keys(this.result[this.selectedAsn])[0]
      this.getPath()
    },
    prefixClick() {
      // console.log(this.selectedPrefix)
      this.getPath()
    },
    async getPath() {
      // console.log(Object.keys(this.result[this.selectedAsn][this.selectedPrefix]).length)
      const selectedAsn = this.selectedAsn
      const selectedPrefix = this.selectedPrefix
      if (Object.keys(this.result[selectedAsn][selectedPrefix]).length !== 0) {
        return
      }
      this.pathLoading = true
      const pathList = await getAs2prefixPath(selectedPrefix, selectedAsn)
      this.result[selectedAsn][selectedPrefix] = Object.entries(pathList).map(([k, item], index) => {
        item['date'] = k
        if (item['status']) {
          const links = item['path'].map((asn, index) => {
            // console.log(index)
            return { source: asn, target: item['path'].length - 1 === index ? selectedPrefix : item['path'][index + 1] }
          })
          const nodes = item['path'].map((asn, index) => {
            return {
              name: asn,
              y: 0,
              x: index * X_INEDX_OFFSET,
            }
          })
          nodes.push({
            name: selectedPrefix,
            y: 0,
            x: item['path'].length * X_INEDX_OFFSET,
            symbol: 'rect',
            symbolSize: [120, 50],
          })
          item['series'] = [
            Object.assign(
              {
                links,
                data: nodes,
              },
              this.ASPathGraphOption.getSeries()
            ),
          ]
          // console.log(item)
        }
        return item
      })
      this.pathLoading = false
      console.log(this.result[selectedAsn][selectedPrefix])
    },
    // async SearchASNInPath() {
    // const result = await searchAs2PrefixPathInfo(this.prefix, this.asn)
    //   Object.keys(result).forEach(asn => {
    //     Object.keys(result[asn]).forEach(prefix => {
    //     result[asn][prefix] = Object.entries(result[asn][prefix]).map(([k, item], index) => {
    //       item['date'] = k
    //       if (item['status']) {
    //         const links = item['path'].map((asn, index) => {
    //           // console.log(index)
    //           return { source: asn, target: item['path'].length - 1 === index ? prefix : item['path'][index + 1] }
    //         })
    //         const nodes = item['path'].map((asn, index) => {
    //           return {
    //             name: asn,
    //             y: 0,
    //             x: index * X_INEDX_OFFSET,
    //           }
    //         })
    //         nodes.push({
    //           name: prefix,
    //           y: 0,
    //           x: item['path'].length * X_INEDX_OFFSET,
    //           symbol: 'rect',
    //           symbolSize: [120, 50],
    //         })
    //         item['series'] = [
    //           Object.assign(
    //             {
    //               links,
    //               data: nodes,
    //             },
    //             this.ASPathGraphOption.getSeries()
    //           ),
    //         ]
    //         // console.log(item)
    //       }
    //       return item
    //     })
    //   })
    // })
    //   this.result = result
    //   this.selectedAsn = Object.keys(this.result)[0]
    //   this.selectedPrefix = Object.keys(this.result[this.selectedAsn])[0]
    //   console.log(this.result)
    // },
  },
}
</script>

<style lang="scss" scoped>
.as-path-change {
  padding: 0 10px 0 0;

  background-color: #fff;
  margin: 10px;
}
.search-bar {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
}

.as-path {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
}

.as-path-date {
  text-align: left;
  font-weight: bold;
  width: 200px;
}

.as-path-diff {
  text-align: left;
}
.as-path-info {
  display: flex;
}
.as-path-msg {
  font-size: var(--subTitle-font-size);
  font-weight: bold;
}
</style>

<style scope>
.l .el-tabs__item.is-active {
  background: #631fa9;
  color: #fff !important;
  font-weight: bold;
}

.l .el-tabs__nav.is-left {
  width: 200px;
}

.el-tabs--left .el-tabs__item.is-left {
  text-align: center;
}

.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-bottom: none !important;
}

.empty-data {
  width: 100%;
  height: 30vh;
  font-size: var(--max-font-size);
  font-weight: 900;
  animation-name: move-from-bottom;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  color: #000;
  line-height: 30vh;
  border-radius: 20px;
}
</style>
