<template>
  <div class="gwin-work-notice">
    <div class="gwin-work-back">
      <div class="gwin-work-back__link" @click="router.back(-1)">
        <i></i>
      </div>
    </div>
    <div class="gwin-work-content">
      <h2>{{ state.notice.title }}</h2>
      <div class="gwin-work-content__info">
        <span>编辑：灰鲸智航</span>
        <span class="gwin-work-content__sign"> | </span>
        <span>发布时间：{{ formatDate(state.notice.createAt) }}</span>
      </div>
      <div class="gwin-work-content__html" v-html="state.notice.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/index'
import { onMounted, reactive } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import WorkApi from '@/api/work'

interface noticeParam {
  title: string
  createAt: number
  content: string
}

const route = useRoute()
const router = useRouter()
const state = reactive({
  notice: <noticeParam>{}
})
onMounted(() => {
  // 公告
  getAdminAnnouncementInquiry()
})

const getAdminAnnouncementInquiry = async () => {
  const param = {
    id: <string>route.query?.id
  }
  const res = await WorkApi.AdminAnnouncementInquiry(param)
  state.notice = res.body
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('notice') {
  width: 100%;
  padding: 30px;
  overflow: hidden;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
  background-color: #fff;
}
@include b('back') {
  width: 100%;
  margin-bottom: 20px;
  padding: 16px 20px;
  box-sizing: border-box;
  background-color: #f6f7fb;
  @include e('link') {
    &:hover {
      i {
        background: url('../../assets/imgs/notice/back-hover.png') no-repeat 0 0;
        background-size: 100%;
      }
    }
    i {
      width: 20px;
      height: 17px;
      margin-right: 20px;
      display: inline-block;
      vertical-align: center;
      background: url('../../assets/imgs/notice/back.png') no-repeat 0 0;
      background-size: 100%;
    }
    span {
      color: #1a2234;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
@include b('content') {
  color: #606a78;
  padding: 0 160px;
  line-height: 24px;
  box-sizing: border-box;
  h2 {
    text-align: center;
  }
  @include e('info') {
    color: #606a78;
    font-size: 14px;
    text-align: center;
    margin: 10px 0 30px;
  }
  @include e('sign') {
    padding: 0 10px;
  }
  @include e('html') {
    overflow: hidden;
  }
}
</style>
