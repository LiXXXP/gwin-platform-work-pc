import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element-variables.scss'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import './styles/index.scss' // global css

import 'virtual:svg-icons-register'

// svg-icon
import SvgIcon from '@gwin/svg-icon'
import '@gwin/svg-icon/lib/theme-default/index.css'

// console-base
import ConsoleBase from '@gwin/platform-console-base-pc'
import './styles/console-base-variables.scss'

import { commonConfig } from '@gwin/networking'
import { Passport } from '@gwin/platform-passport-pc'
import config from '@/config'

commonConfig.loginCallback = () => {
  Passport.logout()
}

commonConfig.noPermissionCallback = () => {
  // 403
  router.push('/403')
}

commonConfig.businessNoPermissionCallback = () => {
  // 无权限
  window.location.href = config.GWIN_URL_NOPERMISSION
}

commonConfig.requestUserRoleResCallback = () => {
  // 请求刷新权限
  Passport.logout()
}

const app = createApp(App)

app.use(router).use(store).use(ElementPlus, { locale }).use(SvgIcon).use(ConsoleBase).mount('#app')
