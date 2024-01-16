<template>
  <div class="routeMonitor">
    <RouteMonitorNav :class="['fade-in', 'sticky', showShadow ? 'show-shadow' : 'hide-shadow']"></RouteMonitorNav>
    <div :class="`router-box ${$route.path === '/anomaly' ? 'autoHeight' : 'autoHeight'}`">
      <router-view />
    </div>
    <information-footer :image-src="imageUrl" image-height="20px" image-width="auto" email="sec@cgtf.net" />
  </div>
</template>

<script>
import imageUrl from '@/assets/images/logo-row-white.svg'
import RouteMonitorNav from '@/components/RouteMonitor/TheRouteMonitorNav.vue'

export default {
  name: 'RouteMonitor',
  components: {
    RouteMonitorNav,
  },
  data() {
    return {
      imageUrl,
      showStickyMenu: false,
      navbarHeight: 1000,
      showShadow: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.navbarHeight = document.getElementsByClassName('navbar')[0].clientHeight - 50
    })
    // console.log(this.$route.path)
    window.onscroll = () => {
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop > this.navbarHeight) {
        this.showShadow = true
      } else {
        this.showShadow = false
      }
    }
  },
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.show-shadow {
  box-shadow: 0px 1px 10px 0px #333333;
  // transition-duration: 1s;
}

.hide-shadow {
  box-shadow: none;
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  transition-duration: 1s;
}

.routeMonitor {
  height: 100%;
  // min-width: 1248px;
}

.autoHeight {
  min-height: calc(100vh - 72px);
}
</style>
