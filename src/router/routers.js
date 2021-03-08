import Main from '@/components/main'
import jquery from 'jquery'
import parentView from '@/components/parent-view'
import { filterAsyncRouter } from '@/libs/router-util'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export const otherRouter = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     title: 'Login - 登录',
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/login/login.vue')
  // },
  {
    path: '/console',
    name: 'console',
    meta: {
      title: '管理端登录',
      hideInMenu: true,
    },
    component: _import('eip/core/login/login.vue'),
  },
  {
    path: '/supervise',
    name: 'supervise',
    meta: {
      title: '监管端登录',
      hideInMenu: true,
    },
    component: _import('fts/core/supervise/login/login.vue'),
  },
  {
    path: '/company',
    name: 'company',
    meta: {
      title: '企业端登录',
      hideInMenu: true,
    },
    component: _import('fts/core/company/login/login.vue'),
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // {
  //   name: 'sys_settings',
  //   path: '/sys_settings',
  //   meta: {
  //     hideInMenu: false,
  //     notCache: false,
  //     showAlways: true,
  //     title: '系统设置',
  //     icon: 'md-settings',
  //   },
  //   component: Main,
  //   children: [{
  //     name: 'sys_menu',
  //     path: 'sys_menu',
  //     meta: {
  //       hideInMenu: false,
  //       notCache: false,
  //       title: '菜单管理',
  //       icon: 'md-menu',
  //     },
  //     component: () => import('@/view/sys-manage/menu/index.vue')
  //   }]
  // },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
let menuDatas = jquery.ajax({
  url: baseUrl + '/core/sys/menu/getMenuVOTrees',
  type: 'post',
  async: false,
  dataType: 'json'
}).responseJSON

let menuDatasApi = filterAsyncRouter(menuDatas)

//作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const routes = [...menuDatasApi, ...otherRouter]

export default routes
