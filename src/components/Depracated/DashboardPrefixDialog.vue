<template>
  <div class="my-cell">
    <div :class="[showButtom ? 'show-button-div' : 'hidden-button-div', 'basic-style']">
      <el-button
        @click="requestPreix"
        size="mini"
        :class="[showButtom ? 'show-button' : 'hidden-button', 'button-style']"
        >Detail</el-button
      >
    </div>
    <div :class="showButtom ? 'hidden-text' : 'show-text'">{{ row.count }}</div>

    <el-dialog :title="`Prefix ${tableParam.ipVerison}`" :visible.sync="prefixDialogVisible" append-to-body width="30%">
      <div class="prefix-box">
        <div class="prefix" v-if="prefixInfo[tableParam.ipVerison] && prefixInfo[tableParam.ipVerison].length !== 0">
          <div class="statistic">
            <div class="item">
              <div class="title">Count({{ tableParam.ipVerison === 'ipv4' ? '/24' : '/48' }}):</div>
              <div>{{ ipCount_standard }}</div>
            </div>
            <div class="item">
              <div class="title">Count:</div>
              <div>{{ ipCount }}</div>
            </div>
            <div class="item">
              <div class="title">Aggregate Count:</div>
              <div>{{ AggregateCountIp }}</div>
            </div>
          </div>
          <div class="tree-title">
            <div>Perfix:</div>
            <div>
              <el-button size="mini" @click="expand">Expand</el-button>
              <el-button size="mini" @click="collapse">Collapse</el-button>
            </div>
          </div>

          <el-tree v-if="treeReload" :data="prefixObj" :props="defaultProps" :default-expand-all="isExpand"></el-tree>
          <!-- <el-tag
            v-for="item in prefixInfo[tableParam.ipVerison]"
            :key="item"
            effect="light"
          >
            {{ item }}
          </el-tag> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPeerPrefix } from '@/api/DashBoardApi'
import { aggregateIp, aggregateIpV6 } from '@/utils'

export default {
  name: 'PrefixDialog',
  created() {},
  data() {
    return {
      isExpand: false,
      treeReload: true,
      prefixDialogVisible: false,
      prefixInfo: {},
      prefixObj: {},
      showButtom: false,
      ipCount: 0,
      ipCount_standard: 0,
      AggregateCountIp: 0,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
    tableParam: {
      type: Object,
      default: () => {},
    },
    rowFormat: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {},
  methods: {
    handleHover() {
      // console.log('!!')
      this.showButtom = true
    },
    nohandleHover() {
      this.showButtom = false
    },

    handleNumByDot(num) {
      const str = new String(num).toString()
      const numberArray = str.split('.')
      const floatNum = numberArray[1] ? '.' + numberArray[1] : ''
      var LongNum = numberArray[0]
      for (var i = 3; i < LongNum.length; i += 4) {
        LongNum = LongNum.slice(0, LongNum.length - i) + ',' + LongNum.slice(LongNum.length - i)
      }
      return LongNum + floatNum
    },
    collapse() {
      this.isExpand = false
      this.treeReload = false
      this.$nextTick(function () {
        this.treeReload = true
      })
    },
    expand() {
      this.isExpand = true
      this.treeReload = false
      this.$nextTick(function () {
        this.treeReload = true
      })
    },
    format(data) {
      const array = []
      Object.keys(data).forEach(key => {
        array.push({ label: key, children: this.format(data[key]) })
      })
      return array
    },
    async requestPreix() {
      const ipMap = {
        ipv4: aggregateIp,
        ipv6: aggregateIpV6,
      }
      this.prefixDialogVisible = true
      this.prefixInfo = await getPeerPrefix(this.tableParam.asn, {
        type: `${this.tableParam.from.replace('-', '_')}_asn`,
        detailAsn: this.row.asn,
      })
      // console.log(this.prefixInfo, this.tableParam)
      this.ipCount = this.handleNumByDot(this.prefixInfo[this.tableParam.ipVerison].length)
      const { prefixObj: prefixObjV4 } = ipMap[this.tableParam.ipVerison](this.prefixInfo[this.tableParam.ipVerison])
      let sumV4_24 = 0
      let sumV4 = 0

      if (this.tableParam.ipVerison === 'ipv4') {
        Object.keys(prefixObjV4).forEach(prefix => {
          if (prefix <= 24) {
            sumV4_24 += Object.keys(prefixObjV4[prefix]).length * Math.pow(2, 24 - prefix)
            sumV4 += Object.keys(prefixObjV4[prefix]).length
          }
        })
      } else {
        Object.keys(prefixObjV4).forEach(prefix => {
          if (prefix <= 48) {
            sumV4_24 += Object.keys(prefixObjV4[prefix]).length * Math.pow(2, 48 - prefix)
            sumV4 += Object.keys(prefixObjV4[prefix]).length
          }
        })
      }
      this.prefixObj = this.format(prefixObjV4)
      this.ipCount_standard = this.handleNumByDot(sumV4_24)
      this.AggregateCountIp = this.handleNumByDot(sumV4)
    },
  },
}
</script>

<style lang="scss" scoped>
.button-style {
  position: absolute;
  background: #00000000;
  border: none;
  color: #7f5ac3;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: 14px;
}
.basic-style {
  position: absolute;
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to left, #fdfaff, #e3d5f1, #fdfaff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30px;
  height: 100%;
  width: 100%;
}

// .show-button-div {
//   // position: absolute;
//   animation-name: show-button-div;
//   animation-duration: 0.5s;
//   animation-fill-mode: forwards;
// }

.show-button {
  animation-name: move-up-to-show;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.hidden-button {
  animation-name: move-down-to-hidden;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.show-button-div {
  animation-name: fade-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.hidden-button-div {
  animation-name: fade-out;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.hidden-text {
  position: absolute;
  animation-name: scale-to-hidden;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  // opacity: 0;
}

.show-text {
  position: absolute;
  animation-name: scale-to-show;
  animation-duration: 1s;
  animation-fill-mode: forwards;

  // display: none;
}

@keyframes move-down-to-hidden {
  /* 0%表示动画开始的关键帧 */
  from {
    opacity: 1;
    transform: translate(0, 0);
  }

  to {
    opacity: 0;
    transform: translate(0, 10px);
  }
}

@keyframes move-up-to-show {
  /* 0%表示动画开始的关键帧 */
  0% {
    opacity: 0;
    transform: translate(0, 10px);
  }

  30% {
    opacity: 0;
    transform: translate(0, 10px);
  }

  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes show-button-div {
  /* 0%表示动画开始的关键帧 */
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  /* 0%表示动画开始的关键帧 */
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scale-to-hidden {
  from {
    opacity: 1;
  }

  to {
    transform: scale(0.5);
    opacity: 0;
    z-index: -2;
  }
}

@keyframes scale-to-show {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  50% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.prefix-box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.tree-title {
  // margin-bottom: 20px;
  // text-align: left;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  margin-right: 30px;
  width: 130px;
  text-align: left;
  font-weight: bold;
}
.prefix {
  height: 300px;
  width: 100%;
  overflow: auto;
}
.statistic {
  justify-content: space-between;
}
.item {
  display: flex;
}
</style>
