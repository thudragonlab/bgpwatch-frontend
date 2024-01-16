<template>
  <div id="BottomBar">

    <div class="dragon-lab">

      <!-- <img src="../assets/images/logo-col-white.svg" alt="" height="40px"> -->
      <img src="../assets/images/logo-row-white.svg" alt="" height="20px">

      <div class="horizon-text">
        <div class="text-box">
          <!-- <div class="item" @click="hrefClick('https://www.tsinghua.edu.cn/')">Tsinghua University</div> -->
          <div class="item" @click="hrefClick('https://www.cgtf.net/#/')">CGTF</div>
          <div class="item" @click="hrefClick('http://gperf.cgtf.net/')">Gperf</div>
          <div class="item " @click="hrefClick('http://lg.cgtf.net')">Looking Glass</div>
          <div class="item" @click="hrefClick('https://bgp.cgtf.net/')">BGP Share</div>
          <div class="item" @click="hrefClick('http://6rank.cgtf.net/')">CyberBank</div>
          <!-- <div class="item" @click="hrefClick('https://telescope.cgtf.net/')">THU Network Telescope</div> -->
          <!-- <div class="item">Privacy Statemnet</div>
          <div class="item">Legal Cookies</div>
          <div class="item">Copyright Statement</div>
          <div class="item">Terms of Service</div> -->
        </div>
      </div>

    </div>
    <div class="icp">
      <div> Copyright : DragonLab, Contact: dev@dragonlab.org</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BottomBar',
  props: {},
  data() {
    return {}
  },
  created() {},
  methods: {
    hrefClick(url) {
      //  window.location.href="https://www.baidu.com/";//当前标签页
      window.open(url)// 打开一个新的标签页
    }
  }
}
</script>

<style scoped>

/**
app flex布局 between实现
*/

#BottomBar{
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
}

.item:first-child{
  border-left: 0px;
}

.item{
    margin-right: 10px;
    border-left: 1px solid #fff;
    padding-left: 10px;
    cursor: pointer;
    font-size: var(--min-font-size);
}
.dragon-lab img{
  position: absolute;
  left: 20px;
}

.dragon-lab{
  display: inherit;
  background-color: #4b127d;
  padding: 10px;
  justify-content: center;
  height: 75px;
  align-items: center;
}

.horizon-text{
  color: #fff;
  display: inherit;
  justify-content: center;
  align-items: center;
  width: 80%;
}

.text-box{
  display: inherit;
  justify-content: space-around;
  align-items: center;
}

.checked{
  color:#fff;
}
.icp{
  padding: 10px 0px;
  width: 100%;
  height: 75px;
  display: inherit;
  flex-direction: inherit;
  justify-content: space-around;
  align-items: center;
  color: #888885;
  background-color: #393a34;
  font-size: var(--min-font-size);
}
</style>
