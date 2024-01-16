<template>
  <div class="navbar">
    <el-menu
      :default-active="this.$route.path"
      router
      mode="horizontal"
      background-color="#fff"
      text-color="#000000"
      active-text-color="#631fa9"
    >
      <el-menu-item style="height: 43px">
        <img src="../../assets/images/logo-row.svg" height="100%" />
      </el-menu-item>
      <template v-for="(item, i) in isVisible(navList)">
        <el-submenu v-if="item.submenu" :index="item.name" :key="i">
          <template slot="title">{{ item.title }}</template>

          <el-menu-item v-for="(subitem, si) in isVisible(item.submenu)" :key="si" :index="subitem.name">
            <template>{{ subitem.navItem }}</template>
          </el-menu-item>
        </el-submenu>

        <el-menu-item v-else :style="item.style" :index="item.name" :key="item.name">
          <span>{{ item.navItem }}</span>
        </el-menu-item>
      </template>

      <el-menu-item v-if="!userInfo" style="float: right">
        <span @click="updateUser">Register</span>
      </el-menu-item>
      <el-menu-item style="float: right">
        <Login v-if="!userInfo" :forgetFunc="forgetPwd" :loginFunc="login" />
        <el-popover v-else trigger="click">
          <div class="user-info">
            <div class="profile" style="margin-bottom: 20px">
              <img src="@/assets/images/user_profile.svg" width="30%" />
            </div>
            <div class="userRow userName margin-bottom">
              <span>Username:</span>
              <span>{{ userInfo.user_name }}</span>
            </div>
            <div class="userRow userName margin-bottom">
              <span>Email:</span>
              <span>{{ userInfo.email }}</span>
            </div>
            <div>
              <el-button class="exit user-info-buttom" @click="signOut">Sign out</el-button>
              <el-button class="user-info-buttom" @click="OpenAPIKEY">API-KEY Setting</el-button>
            </div>
          </div>
          <el-button slot="reference" class="user-info-buttom" icon="el-icon-user-solid">
            {{ userInfo.user_name }}</el-button
          >
        </el-popover>
      </el-menu-item>
    </el-menu>
    <Dialog
      title="Personal Information"
      :visible.sync="UpdaterVisible"
      :sub-component="Information"
      width="600px"
      :showFooter="false"
      @close_diolog="UpdaterVisible = false"
    >
    </Dialog>

    <Dialog
      title="API KEY Setting"
      :visible.sync="APIdialogVisible"
      :sub-component="APISetting"
      width="600px"
      :showFooter="false"
      @close_diolog="APIdialogVisible = false"
    >
    </Dialog>
    <!-- <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog> -->
  </div>
</template>

<script>
import Dialog from '@/components/RouteMonitor/TheRouteMonitorNavDialog'
import Information from '@/components/RouteMonitor/TheRouteMonitorNavDialogRegister'
import APISetting from '@/components/RouteMonitor/TheRouteMonitorNavDialogApiSetting.vue'

import { Login, forgetPwd } from '@/api/UserApi'
export default {
  name: 'TheRouteMonitorNav',
  created() {},
  components: {
    Dialog,
    // Login2,
  },
  inject: ['reload'],
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      // Login,
      Information,
      APISetting,
      APIdialogVisible: false,
      navList: [
        { name: '/', navItem: 'Home', needLogin: false },
        // { name: '/overview', navItem: 'Overview', needLogin: false },
        {
          title: 'Anomaly',
          name: 'Anomaly',
          submenu: [
            {
              name: '/overview',
              navItem: 'Overview',
              needLogin: false,
            },
            {
              name: '/anomaly',
              navItem: 'Anomaly',
              needLogin: false,
            },
          ],
        },
        { name: '/dashBoard', navItem: 'DashBoard', needLogin: false },
        {
          title: 'RoutingPath',
          name: 'routingPath',
          submenu: [
            {
              name: '/routing-path',
              navItem: 'Routing Path',
              needLogin: false,
            },
            {
              name: '/reverse-routing-path',
              navItem: 'Reverse Routing Path',
              needLogin: false,
            },
            {
              name: '/reverse-routing-path-topo',
              navItem: 'Reverse Routing Path(TOPO)',
              needLogin: false,
            },

            { name: '/ip-routing-path', navItem: 'Bi-Routing Path', needLogin: false },
            { name: '/jitter-route', navItem: 'JitterRoute', needLogin: false },
          ],
        },
        {
          name: 'tool',
          title: 'Tools',
          submenu: [
            {
              name: '/region',
              navItem: 'Country/Region',
              needLogin: false,
            },
            {
              name: '/moas',
              navItem: 'Anomaly-moas',
              needLogin: false,
            },
            // {
            //   name: '/roa',
            //   navItem: 'ROA',
            //   needLogin: false,
            // },
          ],
        },
        { name: '/subscribe', navItem: 'Subscribe', needLogin: false },
        {
          name: 'doc',
          title: 'Doc',
          submenu: [
            {
              name: '/document',
              navItem: 'Document',
              needLogin: false,
            },
            {
              name: '/api-doc',
              navItem: 'API Doc',
              needLogin: false,
            },
          ],
        },
      ],
      LoginVisible: false,
      UpdaterVisible: false,
    }
  },
  methods: {
    isVisible(navList) {
      return navList.filter(navItem => {
        let result = navItem.navItem
        if (navItem.needLogin) {
          if (this.userInfo) {
            result = true
          } else {
            result = false
          }
        } else {
          result = true
        }
        return result
      })
    },
    OpenAPIKEY() {
      this.APIdialogVisible = true
    },
    signOut() {
      localStorage.removeItem('userInfo')
      this.reload()
      this.$router.replace('/')
    },
    updateUser() {
      this.UpdaterVisible = true
    },

    async login(LoginForm) {
      const { status, data } = await Login(LoginForm.userName, LoginForm.password).catch(e => {
        console.error(e)
        this.reload()
      })
      if (status) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        this.reload()
      }
    },

    async forgetPwd(LoginForm) {
      const userName = LoginForm.userName
      if (userName) {
        const result = await forgetPwd(userName)
        this.$messageBox(result.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 72px;
  overflow: hidden;
  position: relative;
  .el-menu-item {
    height: 100%;
    line-height: 72px;
    font-weight: 500;
    font-size: var(--middle-font-size);
  }
  .svg-container img {
    margin-bottom: 30px;
  }
  .el-menu-item:hover {
    outline: 0 !important;
    color: #631fa9 !important;
    background: #00000000 !important;
  }
  .el-menu-item.is-active {
    border-bottom: 0px;
    color: #631fa9 !important;
    background: #00000000 !important;
  }
}

nav {
  height: 65px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 1248px;
  .title {
    margin-left: 4px;
    color: white;
    text-align: left;
    span {
      display: block;
    }
  }
  .right {
    margin-left: auto;
    display: flex;
    font-size: var(--middle-font-size);
    .nav_item {
      vertical-align: middle;
      //text-align: center;
    }
    .two {
      margin-left: 25px;
    }
    .two {
      width: 60px;
      padding: 3px 0;
    }
    .one {
      width: 30px;
      padding: 3px 0;
    }
    .one:hover,
    .two:hover {
      border-bottom: 1px solid white;
    }
    a:link,
    :visited {
      display: inline-block;
      text-decoration: none;
      color: white;
    }
    .basic {
      margin-left: 40px;
      button {
        height: 25px;
        width: 43px;
        font-size: var(--middle-font-size);
        color: white;
        //padding: 1px 1px;
        border: transparent;
        background: rgb(83, 224, 182);
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
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
}
.profile {
  text-align: center;
}

.margin-bottom {
  margin-bottom: 10px;
}

.userName {
  font-weight: bold;
}

.api-key {
  width: 90%;
  text-align: right;
}
.user-info-buttom,
.user-info-buttom i {
  background-color: #f0f0f0;
  color: #6718a9;
  border-color: #6718a9;
}

.user-info-buttom:focus,
.user-info-buttom:hover {
  color: #6718a9;
  border-color: #855da5;
  background-color: #fcf7ff;
}

.userRow {
  display: flex;
  justify-content: space-between;
  width: 90%;
}

.margin-bottom {
  margin-bottom: 30px;
}
</style>
