<template>
  <div class="as-info-container">
    <el-tabs tab-position="left">

    <el-tab-pane v-for="(source,index) in Object.keys(whoisData)"  :key="index" :label="source">
      <div v-for="(item,i) in whoisData[source]" :key="i">
        <div v-for="(o,idx) in item" :key="idx" class="attr-box">
          <div v-for="(k,ii) in Object.keys(o)" :key="ii" class="attr">
            <pre>{{ k }}:</pre>
            <div v-if="typeof o[k] === 'object'" class="attr-v">
              <pre v-for="(line,lindx) in o[k]" :key="lindx">{{ line }}</pre>
            </div>
            <pre v-else class="attr-v">{{ o[k] }}</pre>
          </div>
          <br/>
          <br/>
        </div>
      </div>
      
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { getWhoisInfoByASN } from '@/api/DashBoardApi'

export default {
  name: 'DashboardWhoisTab',
  created() {},
  data() {
    return {
      whoisData:{},
      activeNames:1,
    }
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  mounted(){
    this.handleParam()
  },
  watch: {
    param() {
      this.handleParam()
    },
  },

  methods: {
    handleParam(){
      console.log(this.param)
      const {inputAsn} = this.param
      this.getWhoisInfoByASN(inputAsn)
    },
    async getWhoisInfoByASN(inputAsn){
      const result = await getWhoisInfoByASN(inputAsn)
      
      Object.keys(result).forEach(k => {
        result[k] = result[k].map(objs => {
          return objs.map(o => {
            const new_obj = {}
            Object.entries(o).sort((a,b) => {
              if(['as-block','role','irt','aut-num','organisation'].includes(a[0])){
                return -1
              }
              if(a[0] === 'source'){
                return 1
              }
              if(b[0] === 'source'){
                return -1
              }
              if(['as-block','role','irt','aut-num','organisation'].includes(b[0])){
                return 1
              }
              return a[0] - b[0]
            }).forEach(([k,v],index) => {
              new_obj[k] = v
            })
            return new_obj
          })
        })
      })
      
      this.whoisData = result
    }
  },
}
</script>


<style lang="scss" scoped>
.as-info-container{
  min-height: 70vh;
}
.attr-v{
  white-space: nowrap; // 规定段落中的文本不进行换行
  overflow-x: auto;
  max-height: 45vh;
  width: 50vw;
  text-align: left;
}

.attr{
  display: flex;
  justify-content: space-between;
}

.attr-box{
  width: 80%;
  margin-left: 20%;
  margin-top: 20px;
}

pre{
  margin: 5px 0;
}
</style>
