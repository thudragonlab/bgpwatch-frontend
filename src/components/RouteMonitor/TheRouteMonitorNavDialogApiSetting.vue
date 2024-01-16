<template>
  <div style="width: 90%">
    <div>
      <span class="your-api-key">Your API KEY :</span>
      <el-tag effect="plain" type="info" size="mini">{{ userInfo ? userInfo._id : 'Empty' }}</el-tag>
    </div>
    <div>
      <span class="your-api-key"><a href="myapi/doc" target="_blank">API Doc</a></span>
      <!-- <el-tag effect="plain" type="info" size="mini">{{ userInfo ? userInfo._id : 'Empty' }}</el-tag> -->
    </div>
    <div v-if="sourceList.length">
      <div class="your-source-ip">YOUR SOURCE IPs</div>
      <div class="source-ips">
        <el-tag
          v-for="(ip, index) in sourceList"
          :ref="`tag${index}`"
          :key="index"
          effect="plain"
          type="info"
          size="mini"
          closable
          @close="handleClose(ip, index)"
          >{{ ip }}</el-tag
        >
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-input placeholder="Source IP" v-model="input">
        <!-- <template slot="prepend">Source IP</template> -->
      </el-input>
      <el-button style="margin-top: 20px" @click="addSourceIP">add Source IP</el-button>
    </div>
  </div>
</template>

<script>
import { addSource, delSource, getSourceIP } from '@/api/UserApi'
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
export default {
  name: 'APISetting',
  created() {},
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      input: '',
      sourceList: [],
      oldIndex: -1,
    }
  },
  props: {
    model: {
      type: Object,
      default: () => {},
    },
    param: {
      type: Object,
      default: () => {},
    },
  },
  async mounted() {
    const result = await getSourceIP()
    this.sourceList = result['source-ips']
  },
  inject: ['reload'],
  methods: {
    async handleClose(ip, index) {
      if (this.oldIndex !== index) {
        // // 如果点过X
        if (this.oldIndex === -1) {
          // 如果没点过X
          if (this.$refs[`tag${index}`].length) {
            if (this.$refs[`tag${index}`][0].$el.getElementsByTagName('i').length) {
              this.$refs[`tag${index}`][0].$el.getElementsByTagName('i')[0].classList.remove('el-tag__close')
              this.$refs[`tag${index}`][0].$el
                .getElementsByTagName('i')[0]
                .setAttribute('style', 'background-color:red;color:#fff')
              this.oldIndex = index
            }
          }
        } else {
          // 如果两次点的X不是同一个
          console.log(this.oldIndex)
          if (this.$refs[`tag${this.oldIndex}`].length) {
            // 恢复之前的
            if (this.$refs[`tag${this.oldIndex}`][0].$el.getElementsByTagName('i').length) {
              this.$refs[`tag${this.oldIndex}`][0].$el.getElementsByTagName('i')[0].classList.add('el-tag__close')
              this.$refs[`tag${this.oldIndex}`][0].$el.getElementsByTagName('i')[0].removeAttribute('style')
            }
          }

          if (this.$refs[`tag${index}`].length) {
            // 改变现在的
            if (this.$refs[`tag${index}`][0].$el.getElementsByTagName('i').length) {
              this.$refs[`tag${index}`][0].$el.getElementsByTagName('i')[0].classList.remove('el-tag__close')
              this.$refs[`tag${index}`][0].$el
                .getElementsByTagName('i')[0]
                .setAttribute('style', 'background-color:red;color:#fff')
              this.oldIndex = index
            }
          }
        }
      } else {
        this.oldIndex = -1
        const result = await delSource(ip)
        this.$message({
          message:result['message'],
          type:'success'
        })
        if (result['status']) {
          this.sourceList = this.sourceList.filter(i => i !== ip)
        }
      }
    },
    async addSourceIP() {
      if (!IP_REGEX.test(this.input)) {
        this.$messageBox(`IP invalid`)
        return
      }
      const result = await addSource(this.input)
      this.sourceList = result['source-ips']
      this.input = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.your-api-key {
  color: red;
}

.your-source-ip {
  text-align: center;
  margin: 10px 0;
}
.source-ips {
  overflow-y: auto;
  max-height: 100px;
  font-size: var(--middle-font-size);
}
</style>
