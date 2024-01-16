<template>
  <div class="reverse-route-path-container fade-in">
    <div class="prefix-input">
      <div>
        <el-input placeholder="1.0.0.0" v-model="inputPrefix">
          <template slot="prepend">Prefix</template>
          <el-button slot="append" icon="el-icon-search" @click="searchPrefix"></el-button>
        </el-input>
      </div>
      <div style="text-align: left; padding-right: 20px">
        <div>You can input an IP or prefix, such as 1.0.205.0, 1.0.205.0/24 or 2001:200::/32.</div>
        <div>The system will search the best matched prefix and return the reverse routing tree.</div>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <div v-if="rtree_images.length && rtreeBase64Code != 'Error'" class="rtree-image" v-viewer="{ movable: false }">
        <!-- <div class="title show-row">intra-region routing tree {{ rtree_condition }}</div> -->
        <img
          class="show-row"
          v-for="(src, index) in rtree_images"
          :src="src"
          :key="index"
          style="width: auto; height: 100%"
        />
      </div>
      <div v-if="rtreeBase64Code == 'Error'" class="not-found">NOT FOUND</div>
    </el-row>
  </div>
</template>

<script>
import { getRtreeByPrefix } from '@/api/RoutePathApi.js'
const IP_REGEX = /(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$)|(^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/(1[0-9]|[1-9]|2[0-4])$)|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)/
// import BaseD3Graph from '@/components/RoutMonitor/BaseD3Graph.vue'
export default {
  name: 'ReverseRoutingPath',
  created() {},
  data() {
    return {
      rtree_images: [],
      rtreeBase64Code: '',
      inputPrefix: '1.0.128.0/17',
    }
  },
  components: {},
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      },
    },
    inputAsn: {
      type: String,
      default: '',
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getRtreeByPrefix().catch(e => console.error(e))
    })
  },
  methods: {
    async getRtreeByPrefix() {
      const rtreeData = await getRtreeByPrefix(this.inputPrefix)
      if (!rtreeData) {
        this.rtreeBase64Code = ''
        this.rtree_images = []
        return
      }
      const { base64_code } = rtreeData
      if (base64_code === 'Error') {
        this.$messageBox({
          message: rtreeData.msg,
          type: 'error',
          duration: 2 * 1000,
        })
        this.rtreeBase64Code = 'Error'
        this.rtree_images = []
      } else {
        this.rtreeBase64Code = base64_code
        this.rtree_images = [base64_code]
      }
    },
    async searchPrefix() {
      if (!IP_REGEX.test(this.inputPrefix)) {
        this.$messageBox({
          message: `IP invalid`,
          type: 'warning',
          duration: 2 * 1000,
        })
        return
      }
      await this.getRtreeByPrefix().catch(e => console.error(e))
    },
  },
}
</script>

<style lang="scss" scoped>
.reverse-route-path-container {
  // padding-top:20px;
  background-color: #f0f0f0;
  height: 100%;
}

.prefix-input {
  width: 100%;
  padding: 20px 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rtree-image {
  height: 60vh;
  overflow: hidden;
  overflow-x: auto;
}

.not-found {
  height: 20vh;
  margin: 10px;
  width: calc(100% - 10px);
  line-height: 20vh;
  text-align: center;
  font-size: var(--max-font-size);
  font-weight: bold;
  background-color: #fff;
  border: 5px solid #000;
}
</style>
