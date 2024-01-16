<template>
  <div>
    <el-button class="download-video" @click="downloadVideo">Video for BGPWatch</el-button>
    <iframe :src="filepath" style="height: 90vh; width: 100%" />
  </div>
</template>

<script>
export default {
  name: 'Test',
  created() {},
  data() {
    return {
      filepath: 'https://www.cgtf.net/wp-content/uploads/2023/07/User-Manual-for-BGPWatch.pdf',
      // filepath: 'https://www.bgper.net/wp-content/uploads/2023/03/User-Manual-for-BGPWatch-202303version.pdf',
      
    }
  },
  props: {},
  methods: {
    downloadVideo() {
      window.open('https://www.cgtf.net/wp-content/uploads/2023/07/BGP-Watch-Video-V4.mp4', '_blank')
      // window.open('https://drive.google.com/file/d/1RW-HofbbFKU4LM_xET-uC82r9b83bt34/view', '_blank')
      
    },
  },
}
</script>

<style lang="scss" scoped>
.download-video {
  width: 100%;
  background-color: var(--bg-linear-unclick-start-color);
  color: #fff;
  border-width: 0px;
  font-weight: bold;
  border-radius: 0px;
}
</style>
