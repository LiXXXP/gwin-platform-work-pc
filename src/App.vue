<template>
  <ElConfigProvider :locale="zhCn">
    <router-view />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { defineComponent } from 'vue-demi'
import config from './config'

defineComponent({
  zhCn
})

/**
 * @description:  友盟uMeng统计    使用：;(window as any).setUmeng('登录页面', '用户登录', '立即注册btn')
 * @param {*} type  类型 如_trackEvent
 * @param {*} category  分类
 * @param {*} action  行为动作
 * @param {*} label  描述
 * @param {*} value  打分值
 * @param {*} id  id
 */
const script = document.createElement('script')
script.src = config.GWIN_URL_UMENG
document.body.appendChild(script)
;(window as any).setUmeng = (
  category: string,
  action: string,
  label = '',
  value = 1,
  id: string,
  type = '_trackEvent'
) => {
  const system = '云平台'
  if ((window as any)._czc) {
    ;(window as any)._czc.push([type, system + '-' + category, action, label, value, id])
  }
}
</script>
