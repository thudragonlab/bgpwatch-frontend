<template>
  <div class="subscribe-container">
    <el-row v-if="inputPrefix" class="input-with-add" type="flex" align="middle" >
      <el-col :span="6">
        <el-input placeholder="174" v-model="apASN">
          <template slot="prepend">
            <div>subscribe prefix</div>
            <el-switch
              v-model="inputPrefix"
              class="my-switch"
              :inactive-color="softColor"
              :active-color="deepColor"
            ></el-switch>

          </template>
          
        </el-input>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-input placeholder="5.150.158.0/24" v-model="apPrefix">
          <template slot="prepend">Prefix</template>
        </el-input>
      </el-col>
      <el-col :span="4" :offset="7">
        <el-button type="primary" size="medium" class="subsrcibe-prefix" @click="addPrefixSubscribe">Subscribe</el-button>
      </el-col>
    </el-row>
    <el-row v-else class="input-with-add" type="flex" align="middle">
      <el-col :span="6">
        <el-input placeholder="[4538,4630]" v-model="asnExpress">
          <template slot="prepend">
            <div>subscribe ASN</div>
            <el-switch
              v-model="inputPrefix"
              class="my-switch"
              :inactive-color="softColor"
              :active-color="deepColor"
            ></el-switch>
          </template>
          <!-- <el-button slot="append" icon="el-icon-plus" @click="SubsribeAs"></el-button> -->
        </el-input>
      </el-col>
      <el-col :span="14" class="tips">
        <div>You can input an ASN expression , one or more ASN. For example:</div>
        <div>[1,100]: will subscribe to ASes which ASN range from 1 to 100;</div>
        <div>4538: will subscribe to AS which ASN is 4538;</div>
        <div>4538,4134: will subscribe to ASes which ASN are 4538 and 4134</div>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="SubsribeAs" class="subsrcibe-prefix">Subscribe</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" type="card" class="super_tab" @tab-click="changeTab">
          <el-tab-pane label="Prefix Change" name="PrefixChange">
            <SubscribePrefixChangeTab :subscribedAsList="subscribedAsList" />
          </el-tab-pane>
          <el-tab-pane label="Hijack" name="Hijack">
            <SubscribeHijackTab></SubscribeHijackTab>
          </el-tab-pane>
          <el-tab-pane label="AS Peer Change" name="ASPeerChange">
            <SubscribePeerChangeTab></SubscribePeerChangeTab>
          </el-tab-pane>
          <el-tab-pane label="AS Path Change" name="ASPathChange" v-if="showAsPathTab">
            <SubscribeAsPathChangeTab></SubscribeAsPathChangeTab>
          </el-tab-pane>
          
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deepColor, softColor } from '@/templates/chart/barTemplate'
import { SubscribeTo, getSubscribedByToken, delAsInList,addPrefixSubscribe } from '@/api/SubscribeApi'
import SubscribePrefixChangeTab from '@/components/Subscribe/SubscribePrefixChangeTab'
import SubscribePeerChangeTab from '@/components/Subscribe/SubscribeASPeerChangeTab'
import SubscribeAsPathChangeTab from '@/components/Subscribe/SubscribeAsPathChangeTab'
import SubscribeHijackTab from '@/components/Subscribe/SubscribeHijackTab'

export default {
  name: 'Subscribe',
  components: {
    SubscribePrefixChangeTab,
    SubscribeHijackTab,
    SubscribePeerChangeTab,
    SubscribeAsPathChangeTab,
  },
  data() {
    return {
      userInfo : localStorage.getItem('userInfo'),
      deepColor,
      softColor,
      inputPrefix: false,
      activeName: localStorage.getItem('subscribeTab') || 'PrefixChange',
      apASN:'',
      apPrefix:'',
      asnExpress: '',
      showTab:true,
      subscribedAsList: [],
      showAsPathTab :true
      
    }
  },
  mounted() {
    if(this.userInfo){
      this.getSubscribedByToken()
    }else{
      this.$messageBox('please login first!')
      this.showTab = false
    }
    
  },
  methods: {
    changeTab({name}){
      localStorage.setItem('subscribeTab',name)

    },
    deleteAll() {
      this.$alert('Are you sure unsubscribe ALL AS?', 'Delete All', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: action => {
          if (action === 'confirm') {
            delAsInList(this.subscribedAsList.map(item => item['_id'])).then(result => {
              this.$messageBox({
                message: result['message'],
                type: result['status'],
                duration: 1 * 1000,
              })
              this.subscribedAsList = []
            })
          }
        },
      })
    },
    parseAsnExpressToParam() {
      let willReturnResult = []
      const matchTwoNumRegex = /(?<leftSymbol>\[|\()(?<content>\d+,\d+)(?<rightSymbol>\]|\))/
      if (matchTwoNumRegex.test(this.asnExpress)) {
        const { leftSymbol, rightSymbol, content } = matchTwoNumRegex.exec(this.asnExpress).groups
        let min, max
        const numbers = content.split(',')
        if (leftSymbol === '[') {
          min = numbers[0]
        } else {
          min = parseInt(numbers[0]) + 1
        }

        if (rightSymbol === ']') {
          max = numbers[1]
        } else {
          max = parseInt(numbers[1]) - 1
        }
        willReturnResult = new Array(max - min + 1).fill(min).map((item, index) => parseInt(item) + index)
      } else if (this.asnExpress.includes(',')) {
        willReturnResult = this.asnExpress.split(',')
      } else {
        willReturnResult = [this.asnExpress]
      }
      return willReturnResult
    },
    async getSubscribedByToken() {
      const subscribeResult = await getSubscribedByToken()
      this.subscribedAsList = subscribeResult['as_list']
    },

    async SubsribeAs() {
      if(!this.userInfo){
        this.$messageBox('Please login first!')
        return
      }
      const realParam = this.parseAsnExpressToParam().map(item => parseInt(item))
      const result = await SubscribeTo(realParam)
      // console.log(result['status'])
      if (result['status'] === 'success') {
        this.getSubscribedByToken()
      }
      this.$messageBox({
        message: result['message'],
        type: result['status'],
        duration: 1 * 1000,
      })
    },
    async addPrefixSubscribe(){
      if(!this.userInfo){
        this.$messageBox('Please login first!')
        return
      }
      if(isNaN(parseInt(this.apASN))){
        this.$messageBox('ASN must be a number')
        return
      }

      if (this.apPrefix.length === 0){
        this.$messageBox('Please input prefix')
        return
      }

      this.showAsPathTab = false
      const result = await addPrefixSubscribe(this.apPrefix,this.apASN)
      if (result['status']) {
        this.$messageBox({
        message: result['msg'],
        type: result['status'],
      })
      }
      
      this.showAsPathTab = true
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
}

.input-with-add {
  background-color: #fff;
  padding: 10px;
  height: 100px;
}

.tips {
  padding-left: 20px;
  text-align: left;
}

.delete-all {
  font-size: var(--subTitle-font-size);
  font-weight: bold;
}

.subsrcibe-prefix{
  font-size: var(--subTitle-font-size);
  font-weight: bold;
}
</style>

<style>
.my-switch {
  height: 15px !important;
}

.my-switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  text-align: center;
}
/*打开时文字位置设置*/
.my-switch .el-switch__label--right {
  font-weight: bold;
  z-index: 1;
  right: 6px;
}
/*关闭时文字位置设置*/
.my-switch .el-switch__label--left {
  font-weight: bold;
  z-index: 1;
  left: 6px; /*不同场景下可能不同，自行调整*/
}
/*显示文字*/
.my-switch .el-switch__label.is-active {
  display: block;
}
.my-switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  /* width: 75px !important; 开关按钮的宽度大小 */
  height: 15px !important;
  line-height: 20px;
}

.my-switch .el-switch__core:after {
  height: 11px !important;
  border-radius: 10px !important;
  /* top: 0px !important;
  left: 0px !important; */
}
</style>