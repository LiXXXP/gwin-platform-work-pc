<template>
  <div class="index flex flex-between">
    <div class="left-serve">
      <div class="serve">
        <div class="title">最近访问</div>
        <div v-if="state.browseProductList?.length" class="flex flex-only-center flex-wrap">
          <div
            v-for="item in state.browseProductList"
            :key="item.productNo"
            class="recently"
            @click="handleClcikProduct(item.productNo, item.productName, '最近访问')"
          >
            <p class="name">{{ item.productName }}</p>
          </div>
        </div>
        <div v-else class="no-serve">
          <i></i>
          <p>暂无内容</p>
        </div>
      </div>
      <div class="serve">
        <div class="flex flex-between">
          <div class="title">我的产品</div>
          <div class="more" @click="onGoToPanelPage">查看更多</div>
        </div>
        <div v-if="state.openProductList?.length" class="flex flex-only-center flex-wrap">
          <div
            v-for="item in state.openProductList"
            :key="item.productNo"
            class="content flex flex-only-center"
            @click="handleClcikProduct(item.productNo, item.productName, '我的产品')"
          >
            <img v-if="item.iconUri" class="serve-logo" :src="item.iconUri" />
            <div v-else class="serve-logo serve-logo-text">{{ item.productName.charAt(0) }}</div>
            <div class="flex flex-between flex-column">
              <p class="name">{{ item.productName }}</p>
              <p class="time">服务期限：{{ formatDate(item.beginTime) }} 至 {{ formatDate(item.endTime) }}</p>
            </div>
            <span v-if="item.productUsage === 1 || item.productUsage === 4" class="type">试用</span>
          </div>
        </div>
        <div v-else class="no-serve">
          <i></i>
          <p>暂无内容</p>
        </div>
      </div>
      <div class="serve">
        <div class="title">为您推荐</div>
        <div v-if="state.recommendProductList?.length" class="flex flex-only-center flex-wrap">
          <div
            v-for="item in state.recommendProductList"
            :key="item.productNo"
            class="content flex flex-only-center flex-between"
            @click="handleClcikProduct(item.productNo, item.productName, '为您推荐')"
          >
            <div class="flex flex-only-center">
              <img v-if="item.iconUri" class="serve-logo" :src="item.iconUri" />
              <div v-else class="serve-logo serve-logo-text">{{ item.productName.charAt(0) }}</div>
              <div class="name name-hover">{{ item.productName }}</div>
            </div>
            <div class="detail">立即获取</div>
            <span v-if="item.reviewStatus === 1" class="type status">审核中</span>
          </div>
        </div>
        <div v-else class="no-serve">
          <i></i>
          <p>暂无内容</p>
        </div>
      </div>
    </div>
    <div class="right-notice">
      <div class="notice">
        <div class="user">
          <!-- <svg class="svg-icon icon name" aria-hidden="true">
            <use xlink:href="#icon-gwin-default-portrait" />
          </svg> -->
          <div>
            ID：<span>{{ state.userData.accountId }}</span>
          </div>
        </div>
        <div class="userName">
          <p>
            登录时间：<span>{{ formatDate(state.userData.lastLoginTime, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </p>
          <p>
            归属企业：<span>{{ state.userData.subjectName }}</span>
          </p>
          <p>
            角色权限：<span>{{ state.userData.roleNameList?.join(' | ') }}</span>
          </p>
        </div>
      </div>
      <div class="notice">
        <div class="flex flex-between">
          <div class="title">最新公告</div>
          <div class="more" @click="onNotice">查看更多</div>
        </div>
        <div v-if="state.announcementList?.length" class="content">
          <div
            v-for="item in state.announcementList"
            :key="item.id"
            class="list flex flex-only-center"
            @click="onGoToNoticePage(item.id)"
          >
            <div class="date">
              <p class="day">{{ formatDate(item.releaseTime).split('-')[2] }}</p>
              <p class="year">
                {{ formatDate(item.releaseTime).split('-')[0] + '-' + formatDate(item.releaseTime).split('-')[1] }}
              </p>
            </div>
            <div class="text">{{ item.title }}</div>
          </div>
        </div>
        <div v-else class="no-serve flex flex-column flex-center flex-only-center">
          <i></i>
          <p>暂无内容</p>
        </div>
      </div>
      <div class="advertising">
        <img src="../../assets/imgs/advertising.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue-demi'
import WorkApi from '@/api/work'
import { getUserId, getEntityId } from '@/utils/auth'
import { formatDate } from '@/utils/index'
import router from '@/router'
import {
  BrowseProductListParam,
  HomeOpenProductListParam,
  HomeRecommendProductListParam,
  AnnouncementListParam
} from './interface'

interface StateOption {
  browseProductList: BrowseProductListParam[]
  openProductList: HomeOpenProductListParam[]
  recommendProductList: HomeRecommendProductListParam[]
  announcementList: AnnouncementListParam[]
}

const state: StateOption = reactive({
  browseProductList: [] as Array<BrowseProductListParam>, // 浏览记录
  openProductList: [] as Array<HomeOpenProductListParam>, // 开通列表
  recommendProductList: [] as Array<HomeRecommendProductListParam>, // 推荐列表
  announcementList: [] as Array<AnnouncementListParam>, // 公告列表
  userData: ''
})

onMounted(() => {
  Promise.all([
    // 浏览列表
    getUserBrowseProductListInquiry(),
    // 我的产品
    getWorkbenchUserProductActivatedListInquiry(),
    // 为您推荐
    getUserProductNotActivatedListInquiry(),
    // 最新公告
    getAnnouncementListInquiry(),
    // 个人资料
    getUserInfoInquiry()
  ])
})

/**
 * 获取个人信息
 */
const getUserInfoInquiry = async () => {
  const res = await WorkApi.PersonalInformationInquiry({
    userId: getUserId(),
    subjectId: getEntityId()
  })
  if (res.status.success) {
    state.userData = res.body
  }
}

/**
 * 用户产品浏览列表
 */
const getUserBrowseProductListInquiry = async () => {
  const param = {
    userId: getUserId(),
    subjectId: getEntityId()
  }
  const res = await WorkApi.UserBrowseProductListInquiry(param)
  if (res.status.success) {
    state.browseProductList = res.body.dataList?.slice(0, 10)
  }
}

/**
 * 用户产品已开通列表查询
 */
const getWorkbenchUserProductActivatedListInquiry = async () => {
  const param = {
    userId: getUserId(),
    subjectId: getEntityId()
  }
  const res = await WorkApi.WorkbenchUserProductActivatedListInquiry(param)
  if (res.status.success) {
    state.openProductList = res.body.dataList?.slice(0, 6)
  }
}

/**
 * 用户产品未开通列表查询
 */
const getUserProductNotActivatedListInquiry = async () => {
  const param = {
    subjectId: getEntityId()
  }
  const res = await WorkApi.UserProductNotActivatedListInquiry(param)
  if (res.status.success) {
    state.recommendProductList = res.body.dataList?.slice(0, 6)
  }
}

/**
 * 最新公告
 */
const getAnnouncementListInquiry = async () => {
  const param = {
    page: {
      pageSize: 5
    },
    title: ''
  }
  const res = await WorkApi.AnnouncementListInquiry(param)
  state.announcementList = res.body.dataList
}

/**
 * 点击列表中的产品
 * @param  {int} productNo 产品编号
 * @param  {int} type 开通类型 1: 已开通，2: 未开通
 */
const handleClcikProduct = async (productNo: string, productName: string, title: string) => {
  // 友盟umeng统计
  ;(window as any).setUmeng('工作台', title, productName + 'btn')
  if (productNo) {
    addUserBrowseProduct(productNo)
    router.push(`/console/product?productNo=${productNo}`)
  }
}

/**
 * 添加浏览记录
 */
const addUserBrowseProduct = async (productNo: string) => {
  try {
    const param = {
      action: 'A',
      userId: getUserId(),
      productNo: productNo
    }
    await WorkApi.UserBrowseProductMaintenance(param)
  } catch (error) {}
}

/**
 * 跳转公告
 */
const onNotice = () => {
  router.push('/console/noticeList')
}

/**
 * 我的产品 - 查看更多
 * 跳转产品面板页面
 */
const onGoToPanelPage = () => {
  router.push('/console/panel')
}

/**
 * 点击公告，跳转公告页
 */
const onGoToNoticePage = (id: number) => {
  router.push({
    path: '/console/notice',
    query: {
      id: id
    }
  })
}
</script>

<style lang="scss" scoped>
.index {
  padding: 20px;
  box-sizing: border-box;
  .title {
    color: #121212;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 20px 20px;
    &::before {
      content: '';
      width: 4px;
      height: 18px;
      margin-right: 6px;
      display: inline-block;
      vertical-align: text-bottom;
      background-color: #3860f4;
    }
  }
  .more {
    color: #3860f4;
    font-size: 14px;
    cursor: pointer;
  }
  .left-serve {
    width: 70%;
    min-width: 350px;
    .serve {
      color: #121212;
      margin-bottom: 20px;
      box-sizing: border-box;
      background-color: #fff;
      padding: 30px 30px 30px 10px;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
      .recently {
        width: 164px;
        cursor: pointer;
        padding: 10px 12px;
        margin-left: 20px;
        margin-bottom: 15px;
        box-sizing: border-box;
        background-color: #f9faff;
        &:hover {
          color: #3860f4;
          background-color: #f3f5fb;
        }
        .name {
          width: 144px;
          font-size: 14px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .content {
        width: 286px;
        padding: 10px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        margin-left: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #e1e5f5;
        transition: all 0.3s;
        -ms-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -webkit-transition: all 0.3s;
        -o-transition: all 0.3s;
        transform: translateY(0px);
        -moz-transform: translateY(0px);
        -o-transform: translateY(0px);
        -webkit-transform: translateY(0px);
        &:hover {
          border-color: #3860f4;
          transform: translateY(-2px);
          -moz-transform: translateY(-2px);
          -o-transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          position: relative;
          .name-hover {
            color: #3860f4;
          }
          .detail {
            opacity: 1;
          }
          .status {
            display: none;
            transition: all 0.3s;
            -ms-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -webkit-transition: all 0.3s;
            -o-transition: all 0.3s;
          }
        }
        .serve-logo {
          width: 44px;
          height: 44px;
          border-radius: 4px;
          margin-right: 10px;
        }
        .serve-logo-text {
          color: #fff;
          font-size: 24px;
          font-weight: 600;
          line-height: 40px;
          text-align: center;
          background-color: #3860f4;
        }
        .name {
          width: 115px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          font-size: 12px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
        }
        .detail {
          width: 72px;
          height: 28px;
          cursor: pointer;
          font-size: 12px;
          color: #fff;
          line-height: 28px;
          text-align: center;
          background-color: #3860f4;
          transition: all 0.3s;
          -ms-transition: all 0.3s;
          -moz-transition: all 0.3s;
          -webkit-transition: all 0.3s;
          -o-transition: all 0.3s;
          background-color: #3860f4;
          opacity: 0;
        }
        .type {
          color: #fff;
          font-size: 10px;
          padding: 4px 10px;
          background-color: #3860f4;
          position: absolute;
          right: -1px;
          top: -1px;
        }
      }
      .no-serve {
        color: #999;
        font-size: 16px;
        text-align: center;
        i {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          display: block;
          background: url('../../assets/imgs/no-team.png') no-repeat 0 0;
          background-size: 100%;
        }
        p {
          margin-top: -20px;
        }
      }
    }
  }
  .right-notice {
    width: 28%;
    min-width: 165px;
    .user {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #606a78;
      svg {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-right: 20px;
      }
      span {
        font-weight: 600;
        color: #606a78;
        word-break: break-all;
      }
    }
    .userName {
      margin-top: 20px;
      p {
        font-size: 14px;
        font-weight: 500;
        color: #606a78;
        margin-top: 10px;
        span {
          color: #1a2234;
          font-weight: 500;
        }
      }
    }
    .notice {
      height: auto;
      max-height: 510px;
      padding: 30px;
      margin-bottom: 20px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
      .title {
        margin: 0 !important;
      }
      .content {
        .list {
          margin-top: 25px;
          .date {
            min-width: 50px;
            height: 58px;
            color: #3860f4;
            text-align: center;
            margin-right: 10px;
            box-sizing: border-box;
            background-color: #f6f7fb;
            .day {
              font-size: 24px;
              font-weight: 900;
              margin-top: 5px;
            }
            .year {
              font-size: 11px;
              padding-top: 2px;
              transform: scale(0.8);
              border-top: 1px solid #3860f4;
            }
          }
          .text {
            font-size: 16px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.85);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            &:hover {
              color: #3860f4;
            }
          }
        }
      }
      .no-serve {
        height: 80%;
        color: #999;
        font-size: 16px;
        text-align: center;
        i {
          width: 100px;
          height: 100px;
          display: block;
          background: url('../../assets/imgs/no-team.png') no-repeat 0 0;
          background-size: 100%;
        }
        p {
          margin-top: -20px;
        }
      }
    }
    .advertising {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
