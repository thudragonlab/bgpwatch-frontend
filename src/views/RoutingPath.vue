<template>
  <div class="dashboard-container fade-in">
    <el-row class="row-cc">
      <el-col class="as-col show-col" v-for="(as, index) in asList" :key="index" :span="3">
        <div
          @click="switchAS"
          :data-cc="as.code"
          :class="[inputAsn === as.code ? 'unclickToClick' : 'clickToUnclick', 'as']"
          :style="{
            '--bgcolor': inputAsn === as.code ? '#ee8b76' : '#7f5ac3',
          }"
        >
          {{ as.label }}
        </div>
      </el-col>
    </el-row>
    <RoutingPathTab class="routing-path-tab" :inputAsn="inputAsn"></RoutingPathTab>
  </div>
</template>

<script>
import RoutingPathTab from '@/components/Dashboard/DashboardRoutingPathTab.vue'
export default {
  name: 'RoutingPath',
  components: {
    RoutingPathTab,
  },
  data() {
    return {      
      asList: [
        {
          label: 'APAN-JP',
          code: '7660',
        },
        {
          label: 'AARNET',
          code: '7575',
        },
        {
          label: 'BDREN',
          code: '63961',
        },
        {
          label: 'CERNET',
          code: '4538',
        },
        {
          label: 'FITI',
          code: '38272',
        },
        {
          label: 'HARNET',
          code: '3662',
        },
        {
          label: 'ITB',
          code: '4796',
        },
        {
          label: 'KREONET',
          code: '17579',
        },
        {
          label: 'LEARN',
          code: '38229',
        },
        {
          label: 'MYREN',
          code: '24514',
        },
        {
          label: 'NREN',
          code: '45170',
        },
        {
          label: 'PERN',
          code: '45773',
        },
        {
          label: 'REANNZ',
          code: '38022',
        },
        {
          label: 'SINGAREN',
          code: '23855',
        },
        {
          label: 'ThaiREN',
          code: '3836',
        },
        {
          label: 'TransPAC',
          code: '22388',
        },
        
        
      ],
      inputAsn: localStorage.getItem('inputAsn') || '4538',
    }
  },
  methods: {
    switchAS(e) {
      this.inputAsn = e.target.dataset.cc
      localStorage.setItem('inputAsn',e.target.dataset.cc)
    },
  },
}
</script>

<style lang="scss" scoped>
.routing-path-tab::-webkit-scrollbar {
  display: none;
}
.dashboard-container {
  padding: 22px;
  background-color: #f0f0f0;
  height: 100%;
}

.row-cc {
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  height: 60px;
}

.show-col {
  animation-name: fade-in;
  animation-duration: 0.5s;
}

.as-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

@property --startcolor {
  syntax: '<color>';
  inherits: false;
  initial-value: green;
}

@property --endcolor {
  syntax: '<color>';
  inherits: false;
  initial-value: green;
}
.as {
  color: #fff;
  font-weight: bold;
  // transition: all 0.5s linear;
  background: linear-gradient(to right, var(--startcolor), var(--endcolor));
  background-color: var(--bgcolor); // Fit Safari brower
  width: 80%;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  box-shadow: 5px 4px 13px -7px #000;
  animation: none;
  cursor: pointer;
}

.clickToUnclick {
  animation: clickToUnclick 0.1s linear forwards;
}

.unclickToClick {
  animation: unclickToClick 0.1s linear forwards;
}

@keyframes clickToUnclick {
  0% {
    --startcolor: var(--bg-linear-clicked-start-color);
    --endcolor: var(--bg-linear-clicked-end-color);
  }
  100% {
    --startcolor: var(--bg-linear-unclick-start-color);
    --endcolor: var(--bg-linear-unclick-end-color);
  }
}

@keyframes unclickToClick {
  0% {
    --startcolor: var(--bg-linear-unclick-start-color);
    --endcolor: var(--bg-linear-unclick-end-color);
  }
  100% {
    --startcolor: var(--bg-linear-clicked-start-color);
    --endcolor: var(--bg-linear-clicked-end-color);
  }
}

.as:hover {
  opacity: 0.9;
}
.as:focus,
.as:active {
  box-shadow: -2px 4px 11px -7px #000 inset;
}

.el-row {
  margin-bottom: 10px;
}
</style>
