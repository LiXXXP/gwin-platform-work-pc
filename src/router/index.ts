import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import appRoutes from './app.router'
import { getEntityId, getUserId } from '@/utils/auth'
import { setTitle } from '@/utils/index'
import { getPageTitle } from '@/utils/get-page-title'
import config from '@/config'

const routes: Array<RouteRecordRaw> = [...appRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to: any, from, next) => {
  /* 设置title */
  if (to.meta.title) {
    const title = getPageTitle(to.meta.title)
    setTitle(title)
  }

  if (getUserId()) {
    if (to.path === '/console/index' && !getEntityId()) {
      window.location.href = config.GWIN_URL_TENANT
    } else {
      next()
    }
  } else {
    window.location.href = config.GWIN_URL_LOGIN
  }
})

export default router
