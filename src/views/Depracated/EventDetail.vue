<template>
  <div class="routeMonitorDetail">
    <header>
      <nav>
        <a href="/"><img src="../assets/images/logo-row.svg" alt="" height="40px" /></a>
      </nav>
    </header>
    <div class="content">
      <div class="basicblock">
        <div class="left">
          <!-- {{ event.replay }} -->
          <div v-if="event.level == 'low'" class="label low-level">{{ event.level }} level</div>
          <div v-else-if="event.level == 'middle'" class="label middle-level">{{ event.level }} level</div>
          <div v-else-if="event.level == 'high'" class="label high-level">{{ event.level }} level</div>
          <div class="info">
            <span>{{ type }} Events</span>
          </div>
        </div>
        <div class="right">
          <div style="font-weight: bold; font-size: 18px">{{ event.event_id }}&nbsp;{{ type }} Events</div>
          <div style="display: flex; margin-top: 7px">
            <div class="first_column">
              <div class="line">
                <span>Victim AS：</span>
                <span>{{ event.hasOwnProperty('victim_as') ? event.victim_as : 'no data' }}</span>
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
                <span>Victim Description：</span>
                <span>{{
                  event.hasOwnProperty('victim_as_description') ? event.victim_as_description : 'no data'
                }}</span>
              </div>
              <div class="line" v-if="event.eventType === 1">
                <span>Normal Prefix：</span>
                <span>{{ event.hasOwnProperty('replay') ? Object.keys(event.replay['-1'])[1] : 'no data' }}</span>
              </div>
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
                <span>Hijacker AS：</span>
                <span>{{ event.hasOwnProperty('hijacker_as') ? event.hijacker_as : 'no data' }}</span>
              </div>
              <div class="line">
                <span>Hijacker Country：</span>
                <span>{{
                  event.hasOwnProperty('hijacker_as_country')
                    ? event.hijacker_as_country + ' (' + codeCountry[event.hijacker_as_country] + ')'
                    : 'no data'
                }}</span>
              </div>
              <div class="line">
                <span>Hijacker Description：</span>
                <span>{{
                  event.hasOwnProperty('hijacker_as_description') ? event.hijacker_as_description : 'no data'
                }}</span>
              </div>
              <div class="line" v-if="event.eventType === 1">
                <span>Hijacked Subprefix：</span>
                <span>{{ event.hasOwnProperty('replay') ? Object.keys(event.replay['-1'])[0] : 'no data' }}</span>
              </div>
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
      <div class="second_basicblock">
        <div class="first_column second_row">
          <el-row v-if="event.hasOwnProperty('prefix_list')">
            <el-col :span="2"> <span>Prefix Info：</span> </el-col
            ><el-col :span="22">
              <el-tag v-for="(item, index) in event.prefix_list" :key="index">{{ item }}</el-tag></el-col
            >
          </el-row>
          <el-row v-if="event.hasOwnProperty('websites')">
            <el-col :span="2"> <span>Website：</span> </el-col
            ><el-col :span="22">
              <el-tag v-for="(item, index) in event.websites" :key="index">{{ item }}</el-tag></el-col
            >
          </el-row>
        </div>
      </div>
      <div class="block">
        <ul class="tabs">
          <li v-for="(value, key) in tabs_components" :key="key" @click="select(value)">
            <a href="javaScript:void(0)" :class="{ active: isSelectedComponent === value }">{{ key }}</a>
          </li>
        </ul>
        <div class="tab-content">
          <keep-alive>
            <component v-bind:is="isSelectedComponent" :subdata="event"></component>
          </keep-alive>
        </div>
      </div>
    </div>
    <information-footer :image-src="imageUrl" image-height="20px" image-width="auto" />
  </div>
</template>

<script>
import imageUrl from '@/assets/images/logo-row-white.svg'
import EventReplay from '@/components/RouteMonitor/EventDetailHijackEventReplay.vue'
import SubHijackEventReplay from '@/components/RouteMonitor/EventDetailSubHijackEventReplay.vue'
import code_country from '@/../public/static/code_country.json'
import { getEventDetail } from '@/api/routeMonitor'

export default {
  name: 'RouteMonitorDetail',
  components: {
    EventReplay,
    SubHijackEventReplay,
  },
  data() {
    return {
      imageUrl,
      event: '',
      type: '',
      tabs_components: { 'Event review': 'EventReplay' },
      allinfo: '',
      isSelectedComponent: 'EventReplay',
      codeCountry: '',
      eventMap: {
        hijack: {
          code: 0,
          component: 'EventReplay',
        },
        sub: {
          code: 1,
          component: 'SubHijackEventReplay',
        },
      },
    }
  },
  created() {
    this.codeCountry = code_country
    this.type = this.$route.query.type
    const matchEventTypeRegex = /.*?-(?<type>.*?)\d+/
    // matchEventTypeRegex
    const eventType = matchEventTypeRegex.exec(this.$route.query.detail_url)
    getEventDetail(this.$route.query.detail_url).then(data => {
      this.event = data
      const event_websites = []
      const reg = new RegExp(/'(.*?)'/gm)
      Object.values(this.event.websites).forEach(item => {
        if (item.length !== 0) {
          let matches
          while ((matches = reg.exec(item))) {
            // console.log(matches)
            event_websites.push(matches[1])
          }
        }
      })
      this.event.prefix_list.sort()
      event_websites.sort()
      this.event.websites = event_websites
      const eventTypeObj = this.eventMap[eventType.groups.type]
      this.event.eventType = eventTypeObj.code
      this.isSelectedComponent = eventTypeObj.component
      this.tabs_components['Event review'] = eventTypeObj.component
    })
  },
  methods: {
    select(value) {
      this.isSelectedComponent = value
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
  background: rgb(246, 246, 246);
}
header {
  height: 65px;
  background: white;
  nav {
    height: 100%;
    margin: 0 auto;
    width: 1248px;
    display: flex;
    align-items: center;
    .logo {
      background: url('../assets/images/logo.png') no-repeat;
      border-right: 32px solid transparent; // 解决下面的平移问题
      filter: drop-shadow(32px 0 0 rgb(12, 146, 224)); // 改变底色透明，主色白色的图片
      background-size: 100%;
      height: 36px;
      width: 36px;
      color: rgb(123, 201, 247);
    }
    .title {
      margin-left: 4px;
      text-align: left;
      span {
        display: block;
        text-align: left;
      }
    }
    .search {
      margin-left: 30px;
      display: flex;
      align-items: center;
      input {
        height: 28px;
        width: 400px;
        text-indent: 10px;
        outline: none;
        border: 1px solid rgb(197, 197, 197);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      input:focus {
        box-shadow: 0 0 6px rgb(226, 226, 226);
      }
      button {
        padding-top: 2px;
        height: 32px;
        width: 50px;
        background-color: rgb(12, 146, 224);
        color: white;
        font-size: var(--middle-font-size); //即可改变图标大小
        border: none;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    .right {
      margin-left: auto;
      display: flex;
      //align-items: center;
      font-size: var(--middle-font-size);
      .two {
        margin-left: 20px;
      }
      .one,
      .two {
        width: 60px;
        padding: 3px 0;
      }
      .one:hover,
      .two:hover {
        border-bottom: 1px solid rgb(12, 146, 224);
      }
      a:link,
      :visited {
        display: inline-block;
        text-decoration: none;
        color: rgb(12, 146, 224);
      }
      .router-link-active:after {
        content: '';
        display: block;
        margin: auto;
        margin-top: 5px;
        width: 30px;
        height: 0px;
        background: rgb(12, 146, 224);
        border: 1px solid rgb(12, 146, 224);
      }
      .basic {
        margin-left: 30px;
        button {
          height: 25px;
          width: 43px;
          font-size: var(--middle-font-size);
          color: white;
          padding: 0 5px 1px 5px;
          border: transparent;
          background: rgb(124, 205, 252);
          vertical-align: middle;
        }
        button:first-of-type {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        button:last-of-type {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
}
.content {
  margin: 20px auto;
  width: 1248px;
  //background: rgb(246, 246, 246);
}
.basicblock,
.second_basicblock {
  padding: 30px 30px 30px 30px;
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
      overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
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
.block {
  // margin-top: 35px;
  .tabs {
    display: flex;
    margin: 0 auto;
    justify-content: left;
    border-bottom: rgb(230, 230, 230) solid 0.5px;
    //background: rgb(245, 248, 255);
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
}
// footer {
//   height: 60px;
//   position: absolute;
//   bottom: 0px;
// }

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
