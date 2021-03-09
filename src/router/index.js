import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'
const LOGIN_PAGE_CONSOLE = 'console' // 管理端登录入口
const LOGIN_PAGE_SUPERVISE = 'supervise' // 监管端登录入口
const LOGIN_PAGE_COMPANY = 'company' // 监管端登录入口
const OTHER_PAGES = ['company', 'console', 'supervise']

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()

  // 如果没有登录, 并且token为空
  if (!token) {
    if (OTHER_PAGES.indexOf(to.name) >= 0) {
      next()
    } else {
      console.log("path:" + to.path + "::::name:" + to.name)
      next({
        name: LOGIN_PAGE_COMPANY, // 其他地址默认跳转企业端首页
      })
    }
  } else {
    if (to.name === LOGIN_PAGE_COMPANY || to.name === LOGIN_PAGE_CONSOLE || to.name === LOGIN_PAGE_SUPERVISE) {
      store.dispatch('removeAuthorities').then(res => {
        next()
      })
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next)
      }).catch(() => {
        setToken('')
        next({
          name: LOGIN_PAGE_COMPANY
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
