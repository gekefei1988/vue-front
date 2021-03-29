import store from '@/store'
import { getToken, localSave, localRead } from '@/libs/util'
import { lazyLoadingCop } from '@/libs/tools'
import routers from '@/router/routers'
import { getMenuVOTrees } from '@/api/core/sys/menu/menu-api'
import Main from '@/components/main'
import parentView from '@/components/parent-view'
// import router from '@/router'
// const _import = require('@/router/_import_' + process.env.NODE_ENV)
var gotRouter
export const initRouter = async (vm) => {
  // gotRouter = [...routers]
  // if (getToken()) {
  //   let routerData = []

  //   getMenuDataList().then(res => {
  //     routerData = res.data
  //     // 存储路由到localStorage
  //     localSave('dynamicRouter', JSON.stringify(routerData))
  //     // 过滤路由,路由组件转换
  //     gotRouter.push(...filterAsyncRouter(routerData))
  //     store.commit('updateMenuList', gotRouter)
  //     dynamicRouterAdd()
  //   })
  // }
  // return gotRouter
  console.log('开始初始化路由')
  if (!getToken()) {
    console.log('没有获取到token')
    return
  }
  gotRouter = [...routers]
  await getMenuVOTrees().then(res => {
    let routerData = res.data // 后台拿到路由
    localSave('dynamicRouter', JSON.stringify(routerData)) // 存储路由到localStorage
    let routeError = [
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
    // 过滤路由,路由组件转换
    gotRouter.push(...filterAsyncRouter(routerData), ...routeError)
    store.commit('updateMenuList', gotRouter)
    store.commit('getAddRoutes', routerData)
  })
  return gotRouter
}
// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  let dynamicRouter = []
  let data = localRead('dynamicRouter')
  if (!data) {
    return dynamicRouter
  }
  dynamicRouter = filterAsyncRouter(JSON.parse(data))
  return dynamicRouter
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  if (!asyncRouterMap) {
    return null
  }
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Main') { // Main组件特殊处理
        route.component = Main
      } else if (route.component === 'parentView') { // parentView组件特殊处理
        route.component = parentView
      } else {
        try {
          route.component = lazyLoadingCop(route.component)
        } catch (e) {
          console.info(e)
          return false
        }
      }
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    } else {
      delete route.children
    }
    return true
  })
  return accessedRouters
}
