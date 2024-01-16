import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: () => import( /* webpackChunkName: "about" */ '../views/RouteMonitor.vue'),
    children: [{
        path: '/',
        name: 'Home',
        component: () => import( /* webpackChunkName: "about" */ '../views/Statistics.vue')
      },
      {
        path: '/overview',
        name: 'Overview',
        component: () => import( /* webpackChunkName: "about" */ '../views/Overview.vue')
      },
      {
        path: '/anomaly',
        name: 'Anomaly',
        component: () => import( /* webpackChunkName: "about" */ '../views/Anomaly2.vue')
      },
      {
        path: '/moas',
        name: 'Anomaly-moas',
        component: () => import( /* webpackChunkName: "about" */ '../views/Anomaly-moas.vue')
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Dashboard.vue')
      },
      {
        path: '/region',
        name: 'Resilience',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Resilience.vue')
      },
      {
        path: '/subscribe',
        name: 'Subscribe',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Subscribe.vue')
      },
      {
        path: '/overview',
        name: 'Overview',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Overview.vue')
      },
      {
        path: '/routing-path',
        name: 'RoutingPath',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/RoutingPath.vue')
      },
      {
        path: '/reverse-routing-path',
        name: 'ReverseRoutingPath',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/ReverseRoutingPathD3.vue')
      },
      {
        path: '/ip-routing-path',
        name: 'IPRoutingPath',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/IP2IPRoutingPath.vue')
      },
      {
        path: '/org',
        name: 'Organization',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Organization.vue')
      },

      {
        path: '/reverse-routing-path-topo',
        name: 'ReverseRoutingPathTopo',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/ReverseRoutingPathTopo.vue')
      },
      {
        path: '/routing-path-cluster',
        name: 'RoutingPathCluster',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/RoutingPathCluster.vue')
      },
      {
        path: '/document',
        name: 'Document',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/Document.vue')
      },
      {
        path: '/routeMonitorDetail2',
        name: 'RouteMonitorDetail2',
        component: () => import( /* webpackChunkName: "about" */ '../views/EventDetail.vue')
      },
      {
        path: '/jitter-route',
        name: 'JitterRoute',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/JitterRoute.vue')
      },

      {
        path: '/api-doc',
        name: 'API Doc',
        beforeEnter() {
          // window.location.href = '/myapi/doc';
          window.open('https://www.cgtf.net/wp-content/uploads/2023/10/BGPWatch-API.pdf', '_blank')
        }
      },
      {
        path: '/roa',
        name: 'ROA',
        // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
        component: () => import( /* webpackChunkName: "about" */ '../views/ROA.vue')
      },
    ],
  },
  {
    path: '/jitter-route-fiti',
    name: 'JitterRouteFITI',
    // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
    component: () => import( /* webpackChunkName: "about" */ '../views/JitterRouteFITI.vue')
  },
  {
    path: '/jitter-route-fiti2',
    name: 'JitterRouteFITI2',
    // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
    component: () => import( /* webpackChunkName: "about" */ '../views/JitterRouteFITI2.vue')
  },
  {
    path: '/updatePassword',
    name: 'UpdatePassword',
    component: () => import( /* webpackChunkName: "about" */ '../views/UpdatePassword.vue')
  },
  {
    path: '/verifyAccount',
    name: 'VerifyAccount',
    component: () => import( /* webpackChunkName: "about" */ '../views/VerifyAccount.vue')
  },
  {
    path: '/test',
    name: 'TestForResilience',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/TestForResilience.vue')
  },
  {
    path: '/heat-map',
    name: 'Heatmap',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/HeatMap.vue')
  },
  {
    path: '/peer-map',
    name: 'PeerMap',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/PeerMap.vue')
  },

  {
    path: '/test-opt',
    name: 'TestForResilienceOptimize',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/TestForResilienceOptimize.vue')
  },
  {
    path: '/fake-as-path',
    name: 'FakeAsPath',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/FakeAsPath.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import( /* webpackChunkName: "about" */ '../views/404.vue')
  },
  {
    path: '/fake-as-path-detail',
    name: 'FakeAsPathDetail',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/FakeAsPathDetail.vue')
  },

  {
    path: '/jitter-route-rrc00',
    name: 'JitterRouteRRC00',
    // component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
    component: () => import( /* webpackChunkName: "about" */ '../views/JitterRouteRRC00.vue')
  },

  {
    path: '/zcw',
    name: 'Zcw',
    component: () => import( /* webpackChunkName: "about" */ '../views/Other/Zcw.vue')
  },

]

// 创建router实例
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  localStorage.setItem('currentView', to.name)
  // localStorage.removeItem('lastUpdateTimestamp')
  next()
})
export default router