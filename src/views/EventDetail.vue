<template>
  <div class="routeMonitorDetail">
    <div class="content">
      <div class="basicblock">
        <div class="left">
          <div v-if="type.includes('Moas')">
            <div class="label moas-level">{{ event.level }} level</div>
            <div class="info">
              <span>{{ type }} Events</span>
            </div>
          </div>
          <div v-else>
            <div v-if="event.level == 'low'" class="label low-level">{{ event.level }} level</div>
            <div v-else-if="event.level == 'middle'" class="label middle-level">{{ event.level }} level</div>
            <div v-else-if="event.level == 'high'" class="label high-level">{{ event.level }} level</div>
            <div class="info">
              <span>{{ type }} Events</span>
            </div>
          </div>
          <!-- {{ event.replay }} -->
        </div>
        <div class="right">
          <div style="font-weight: bold; font-size: 18px">{{ event.event_id }}&nbsp;{{ type }} Events</div>
          <div style="display: flex; margin-top: 7px">
            <div class="first_column">
              <div class="line">
                <span>Victim AS：</span>
                <!-- <a :href="`/#/dashBoard?asn=${event.victim_as}`"></a> -->
                <span v-if="event.hasOwnProperty('victim_as')"
                  ><a :href="`/#/dashBoard?asn=${event.victim_as}`" target="_blank">{{ event.victim_as }}</a></span
                >
                <span v-else>no data</span>
              </div>
              <div class="line">
                <span>Victim Country：</span>
                <span>{{
                  event.hasOwnProperty('victim_as_country')
                    ? `${event.victim_as_country} ( ${codeCountry[event.victim_as_country]} )`
                    : 'no data'
                }}</span>
              </div>
              <div class="line">
                <span>Victim AS Name：</span>
                <span>{{
                  event.hasOwnProperty('victim_as_description') && event.victim_as_description ? event.victim_as_description : event.hasOwnProperty('affacted_as_dict') && event.affacted_as_dict[event.victim_as]?.name || 'no data'
                }}</span>
              </div>
              <!-- <div class="line" v-if="event.eventType === 1">
                <span>Normal Prefix：</span>
                <span>{{ event.hasOwnProperty('prefix') ? event.prefix : 'no data' }}</span>
              </div>
              <div class="line" v-else>
                <span>Normal Prefix：</span>
                <span>{{ event.hasOwnProperty('prefix') ? event.prefix : 'no data' }}</span>
              </div> -->
              <div class="line">
                <span>Start Time：</span>
                <span>{{ event.hasOwnProperty('start_time') ? event.start_time : 'no data' }}</span>
              </div>
              <div class="line">
                <span>During Time：</span>
                <span>{{ event.hasOwnProperty('duration') ? event.duration : 'no data' }}</span>
              </div>
            </div>

            <div class="second_column">
              <div class="line">
                <span v-if="type.includes('Moas')">Suspect AS：</span>
                <span v-else>Hijacker AS：</span>
                <span v-if="event.hasOwnProperty('hijacker_as')">
                  <a :href="`/#/dashBoard?asn=${event.hijacker_as}`" target="_blank">{{ event.hijacker_as }}</a></span
                >
                <span v-else>no data</span>
              </div>
              <div class="line">
                <span v-if="type.includes('Moas')">Suspect Country：</span>
                <span v-else>Hijacker Country：</span>
                <span>{{
                  event.hasOwnProperty('hijacker_as_country')
                    ? event.hijacker_as_country + ' (' + codeCountry[event.hijacker_as_country] + ')'
                    : 'no data'
                }}</span>
              </div>
              <div class="line">
                <span v-if="type.includes('Moas')">Suspect AS Name：</span>
                <span v-else>Hijacker AS Name：</span>
                <span>{{
                  event.hasOwnProperty('hijacker_as_description') && event.hijacker_as_description ? event.hijacker_as_description :  event.hasOwnProperty('affacted_as_dict') && event.affacted_as_dict[event.hijacker_as]?.name || 'no data'
                }}</span>
              </div>
              <!-- <div class="line" v-if="event.eventType === 1">
                <span>Hijacked Subprefix：</span>
                <span>{{ event.hasOwnProperty('subprefix') ? event.subprefix : 'no data' }}</span>
              </div> -->
              <div class="line">
                <span>End Time：</span>
                <span>{{ event.hasOwnProperty('end_time') ? event.end_time : 'no data' }}</span>
              </div>
              <div class="line">
                <span>Time Zone：</span>
                <span>UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 1111111111111111111111111111 -->
      <div class="second_basicblock">
        <div class="first_column second_row">
          <div class="el-icon-info sub-tip" v-if="event.eventType === 1">
            In the case of the submoas hijacking incident, the system only checks and assesses the possibility of
            hijacking based on subnet announcements.
          </div>
          <el-row v-if="event.hasOwnProperty('reason')" type="flex" align="top">
            <el-col :span="2" style="margin: 5px 0"> <span>Reason：</span> </el-col
            ><el-col :span="22">
              <div v-for="(i, index) in event.reason.split('|')" :key="index">
                <el-tag :type="i.split(':')[0] === 'W' ? 'warning' : 'success'" class="el-icon-info">
                  {{ i.split(':').length === 2 ? i.split(':', 2)[1] : i }}</el-tag
                >
              </div>
            </el-col>
          </el-row>
          <el-row v-if="event.hasOwnProperty('prefix_list')" type="flex" align="middle">
            <el-col :span="2"> <span>Prefix Info：</span> </el-col
            ><el-col :span="22" v-if="event.eventType === 1">
              <el-tag>{{ event.prefix_list }}</el-tag></el-col
            >
            <el-col :span="22" v-else>
              <el-tag v-for="(item, index) in event.prefix_list" :key="index">{{ item }}</el-tag></el-col
            >
          </el-row>
          <el-row v-if="event.hasOwnProperty('websites') && event.websites.length !== 0">
            <!-- <div class="line" v-if="event.hasOwnProperty('websites')"> -->
            <el-col :span="2" style="margin: 5px 0"> <span>Website：</span> </el-col
            ><el-col :span="22">
              <el-tag
                v-for="(item, index) in event.websites"
                :key="index"
                class="my-tag"
                @click="gotoWebsite"
                :data-url="item"
              >
                {{ item }}</el-tag
              ></el-col
            >
            <!-- </div> -->
          </el-row>
        </div>
      </div>
      <div v-if="!type.includes('Moas')">
        <el-tabs class="tabs" v-model="activeTabName">
          <el-tab-pane :key="k" v-for="k in Object.keys(tabs_components)" :label="k" :name="k">
            <keep-alive>
              <component v-bind:is="tabs_components[k]" :subdata="event"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <!-- <ul class="tabs">
          <li v-for="(value, key) in tabs_components" :key="key" @click="select(value)">
            <a href="javaScript:void(0)" :class="{ active: isSelectedComponent === value }">{{ key }}</a>
          </li>
        </ul>
        <div class="tab-content">
          <keep-alive>
            <component v-bind:is="isSelectedComponent" :subdata="event"></component>
          </keep-alive>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import Foot from '@/components/footer'
import imageUrl from '@/assets/images/logo-row-white.svg'
import EventReplay from '@/components/Anomaly/EventDetailHijackEventReplay.vue'
import SubHijackEventReplay from '@/components/Anomaly/EventDetailSubHijackEventReplay.vue'
import EventDetailOperationLog from '@/components/Anomaly/EventDetailOperationLog.vue'
import code_country from '@/../public/static/code_country.json'
import { getEventDetail } from '@/api/AnomalyApi'

export default {
  name: 'RouteMonitorDetail',
  components: {
    // Foot,
    EventReplay,
    SubHijackEventReplay,
    EventDetailOperationLog,
  },
  data() {
    return {
      imageUrl,
      event: '',
      type: '',
      activeTabName: 'Event review',
      tabs_components: { 'Event review': 'EventReplay', Comments: 'EventDetailOperationLog' },
      allinfo: '',
      isSelectedComponent: 'EventReplay',
      codeCountry: '',
      eventMap: {
        'Possible Hijack': {
          code: 0,
          component: 'EventReplay',
        },
        'Possible SubHijack': {
          code: 1,
          component: 'SubHijackEventReplay',
        },
        'Ongoing Possible SubHijack': {
          code: 1,
          component: 'SubHijackEventReplay',
        },
        'Ongoing Possible Hijack': {
          code: 0,
          component: 'EventReplay',
        },
        SubMoas: {
          code: 1,
          component: 'EventReplay',
        },
        Moas: {
          code: 0,
          component: 'EventReplay',
        },
        'Ongoing SubMoas': {
          code: 1,
          component: 'EventReplay',
        },
        'Ongoing Moas': {
          code: 0,
          component: 'EventReplay',
        },
      },
    }
  },
  created() {
    this.codeCountry = code_country
    this.type = this.$route.query.type
    // matchEventTypeRegex
  },
  async mounted() {
    const tab = this.$route.query.tab
    if (tab === 'comments') {
      this.activeTabName = 'Comments'
    }
    const data = await getEventDetail(this.$route.query.detail_url)
    this.event = data
    const event_websites = Object.values(this.event.websites).filter(
      x => JSON.stringify(x) !== '[]' && JSON.stringify(x) !== '{}'
    )
    if (this.event.prefix_list) {
      if (typeof this.event.prefix_list[0] === 'object') {
        this.event.prefix_list.map(item => {
          return item.sort((a, b) => {
            return Number(a.split('/')[1]) - Number(b.split('/')[1])
          })
        })
      } else {
        this.event.prefix_list.sort((a, b) => {
          return Number(a.split('/')[1]) - Number(b.split('/')[1])
        })
      }
    }

    this.event.websites = event_websites
    this.type = this.event['event_type']
    const eventTypeObj = this.eventMap[this.type]
    this.event.eventType = eventTypeObj.code
    this.isSelectedComponent = eventTypeObj.component
    this.tabs_components['Event review'] = eventTypeObj.component
  },
  methods: {
    select(value) {
      this.isSelectedComponent = value
    },
    gotoWebsite(e) {
      const href = e.target.dataset.url
      window.open(`https://${href}`, '_blank')
    },
  },
}
</script>

<style scoped src="../assets/css/reset.css"></style>
<style lang="scss" scoped>
.routeMonitorDetail {
  height: 100%;
  min-width: 1248px;
  position: relative;
  background: #f0f0f0;
}
.content {
  margin: auto;
  padding-top: 20px;
  width: 1248px;
  padding-bottom: 100px;
}
.my-tag {
  cursor: pointer;
}
.basicblock,
.second_basicblock {
  padding: 15px 30px 30px 30px;
  display: flex;
  background: white;
  box-shadow: 0 0 6px rgb(230, 230, 230);
  margin-bottom: 35px;
  .left {
    width: 20%;
    margin-right: 5%;
    display: inherit;
    flex-direction: column;
    justify-content: center;
    .label {
      font-size: var(--max-font-size);
      color: #fff;
      font-weight: 500;
      padding: 4px 6px;
      border-radius: 4px;
    }
    .low-level {
      background: #e9e513;
    }

    .moas-level{
      background: #a8de60;
    }
    .middle-level {
      background: #faa647;
    }
    .high-level {
      background: #fd3f3f;
    }
    .info {
      margin-top: 5px;
      font-size: var(--subtitle-font-size);
      padding: 4px 0 4px 7px;
      span {
        display: inline-block;
        //width: 100%;
        line-height: 25px;
        white-space: nowrap; // 规定段落中的文本不进行换行
        text-overflow: ellipsis; // 显示省略号
        overflow: hidden;
      }

      span:first-child {
        margin-right: 10px;
      }
    }
  }
  .reason {
    line-height: 25px;
    white-space: wrap !important; // 规定段落中的文本不进行换行
    overflow: scroll;
  }
  .right {
    width: 100%;
    text-align: left;
    // 后续表示级别的颜色改为css变量形式
    .line {
      display: flex;
      align-items: center;
      height: 30px;
    }
    span {
      display: inline-block;
      //width: 100%;
      white-space: nowrap; // 规定段落中的文本不进行换行
      text-overflow: ellipsis; // 显示省略号
    }
    .first_column {
      width: 50%;
      margin-right: 5%;
    }
    .second_column {
      width: 35%;
    }
  }
}
.tabs {
  background-color: #fff;
  box-shadow: 0 -6px 6px -6px rgb(230, 230, 230), -6px 0 6px -6px rgb(230, 230, 230);
  padding: 10px;
}
/* .block {
  // margin-top: 35px;
  .tabs {
    display: flex;
    margin: 0 auto;
    justify-content: left;
    border-bottom: rgb(230, 230, 230) solid 0.5px;
    // background: rgb(245, 248, 255);
    a {
      // 内联元素设置上下内边距/外边距无效
      display: inline-block;
      padding: 10px 20px;
      font-size: var(--middle-font-size);
      line-height: 21px;
    }
    .active {
      background: white;
      color: rgb(0, 0, 0);
      border: rgb(230, 230, 230) solid 0.5px;
      box-shadow: 0 -6px 6px -6px rgb(230, 230, 230), -6px 0 6px -6px rgb(230, 230, 230),
        6px 0 6px -6px rgb(230, 230, 230);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      margin-bottom: -1px; // 导致父元素高度由底部缩减1像素,那么底边框位置向上抬升1px,正好与子元素的底边框重合,或者说进入了子元素的范围内,并且是被子元素压住了.
      background: #fff;
      border-bottom-color: transparent;
    }
  }
  .tab-content {
    background-color: #fff;
    border: rgb(230, 230, 230) solid 0.5px;
    border-top: transparent;
    // x轴平移 y轴偏移 模糊程度 扩展  Y为负为向上偏移
    //box-shadow: 6px 0 6px -6px rgb(230, 230, 230);
    box-shadow: 0 0 6px rgb(230, 230, 230);
    margin: 0 auto;
    min-height: 1000px;
  }
} */
// footer {
//   height: 60px;
//   position: absolute;
//   bottom: 0px;
// }

.sub-tip {
  color: #a0a0a0;
}
.second_basicblock {
  // width: 100%;
  .second_row {
    text-align: left;
    width: 100%;
    .el-row {
      margin-top: 20px;
      &:first-child {
        margin-top: 0px;
      }
    }
  }
}
</style>
<style>
* {
  --slider-color: #008fff;
  --slider-color-bg: #008fff37;
}
.el-slider__stop {
  background-color: var(--slider-color) !important;
}

.el-slider__bar {
  background-color: var(--slider-color-bg) !important;
}
.el-slider__button-wrapper,
.el-tooltip__popper {
  z-index: 2 !important;
}
</style>
