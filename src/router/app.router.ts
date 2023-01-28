/*
 * @Author: Jin Biao
 * @Date: 2021-12-27 18:26:45
 * @LastEditTime: 2022-02-23 10:44:20
 * @Description:
 */
import Layout from '@/layout/index.vue'
import { RouteConfig } from '#/global'

const appRoutes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/console/index'
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/console',
    component: Layout,
    name: 'Console',
    redirect: '/console/index',
    children: [
      {
        path: 'index',
        name: 'ConsoleIndex',
        component: () => import('@/views/console/index.vue'),
        meta: {
          title: '工作台',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'panel',
        name: 'ConsolePanel',
        component: () => import('@/views/console/panel.vue'),
        meta: {
          title: '产品面板',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/console/product.vue'),
        meta: {
          title: '产品介绍',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'apply',
        name: 'Apply',
        component: () => import('@/views/console/apply.vue'),
        meta: {
          title: '产品开通',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('@/views/console/notice.vue'),
        meta: {
          title: '公告页',
          requireAuth: true // 需要登录
        }
      },
      {
        path: 'noticeList',
        name: 'noticeList',
        component: () => import('@/views/console/noticeList.vue'),
        meta: {
          title: '公告列表',
          requireAuth: true // 需要登录
        }
      }
    ]
  }
]

export default appRoutes
