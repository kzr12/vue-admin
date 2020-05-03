import Vue from "vue";
import VueRouter from "vue-router";

//引入布局组件
import Layout from "@/views/Layout/index.vue";

Vue.use(VueRouter);




/**
 * 默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: 'login',
    hidden: true,
    meta: {
      name: '主页'
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: '登录'
    },
    component: () => import("../views/Login/index.vue")
  },
  /**
   * 控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: 'index',
    meta: {
      name: '控制台',
      icon: 'el-icon-star-off'
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: '首页'
        },
        component: () => import("../views/Console/index.vue"),
      },
    ],
  },
  /**
   * 404
   */
  {
    path: "/page404",
    name: "404",
    hidden: true,
    meta: {
      name: '404',
      icon: '404',
    },
    component: Layout,
    children: [
      {
        path: "/404",
        meta: {
          name: '404'
        },
        component: () => import("../views/404.vue"),
      },
    ],
  }
]





const router = new VueRouter({
  routes: defaultRouterMap,
});

export default router;




/**
 * 动态路由
 */
export const asnycRouterMap = [
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    meta: {
      role: ['sale'],
      system: 'infoSystem',
      name: '信息管理',
      icon: 'el-icon-s-order'
    },
    component: Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: '信息列表'
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          role: ['sale', 'technician'],
          name: '信息分类'
        },
        component: () => import("../views/Info/category.vue"),
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: '信息详情'
        },
        component: () => import("../views/Info/detailed.vue"),
      },
    ],
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      role: ['sale'],
      system: 'userSystem',
      name: '用户管理',
      icon: 'el-icon-s-check'
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          role: ['sale'],
          name: '用户列表'
        },
        component: () => import("../views/User/index.vue"),
      },
    ],
  },
  {
    path: "*",
    redirect: '/404',
    hidden: true,
  },
]