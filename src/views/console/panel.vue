<template>
  <div class="panel">
    <div class="header">我的产品</div>
    <div class="serve">
      <div :class="['title', { 'title-expand': state.isOpenExpand }]" @click="onClickExpandMore">已开通</div>
      <div v-if="state.openProductList.length" class="flex flex-only-center flex-wrap">
        <div
          v-for="item in state.openProductList"
          :key="item.productNo"
          class="content flex flex-only-center"
          @click="handleClcikProduct(item.productNo, item.productName, '已开通')"
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
      <div :class="['title', { 'title-expand': state.isNotOpenExpand }]" @click="onClickNotExpandMore">未开通</div>
      <div v-if="state.recommendProductList.length">
        <div v-for="item in state.recommendProductList" :key="item.productNo">
          <p class="category">{{ item.categoryName }}</p>
          <div class="flex flex-only-center flex-wrap">
            <div
              v-for="key in item.children"
              :key="key.productId"
              class="content flex flex-only-center flex-between"
              @click="handleClcikProduct(key.productNo, key.productName, '未开通')"
            >
              <div class="flex flex-only-center">
                <img v-if="key.iconUri" class="serve-logo" :src="key.iconUri" />
                <div v-else class="serve-logo serve-logo-text">{{ key.productName.charAt(0) }}</div>
                <div class="name name-hover">{{ key.productName }}</div>
              </div>
              <div class="detail">立即获取</div>
              <span v-if="key.reviewStatus === 1" class="type status">审核中</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-serve">
        <i></i>
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue-demi'
import { ElMessageBox } from 'element-plus'
import WorkApi from '@/api/work'
import { getUserId, getEntityId } from '@/utils/auth'
import { formatDate } from '@/utils/index'
import router from '@/router'
import { StateOption, OpenProductListParam, RecommendProductListParam } from './interface'

const state: StateOption = reactive({
  openProductTotal: [],
  recommendProductTotal: [],
  openProductList: [] as Array<OpenProductListParam>, // 开通列表
  recommendProductList: [] as Array<RecommendProductListParam>, // 未开通列表
  isOpenExpand: false, // 已开通产品是否展开
  isNotOpenExpand: false // 未开通产品是否展开
})

onMounted(() => {
  // 我的产品
  getWorkbenchUserProductActivatedListInquiry()

  // 未开通
  getUserProductNotActivatedListInquiry()
})

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
    state.openProductList = res.body.dataList?.slice(0, 4)
    state.openProductTotal = res.body.dataList
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
    const obj: any = {}
    res.body.dataList.forEach((item: any) => {
      const { categoryName } = item
      if (!obj[categoryName]) {
        obj[categoryName] = {
          categoryName,
          children: []
        }
      }
      obj[categoryName].children.push(item)
    })
    state.recommendProductList = Object.values(obj)?.slice(0, 2)
    state.recommendProductTotal = Object.values(obj)
  }
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
    const param = {
      productNo: productNo
    }
    const res = await WorkApi.productInquiry(param)
    if (res.body.status === 2) {
      ElMessageBox.alert('产品过期不存在', {
        confirmButtonText: '我知道了',
        type: 'warning',
        center: true
      })
        .then(() => {
          // 我的产品
          getWorkbenchUserProductActivatedListInquiry()
          // 为您推荐
          getUserProductNotActivatedListInquiry()
        })
        .catch(() => {
          // 我的产品
          getWorkbenchUserProductActivatedListInquiry()
          // 为您推荐
          getUserProductNotActivatedListInquiry()
        })
    } else {
      addUserBrowseProduct(productNo)
      router.push(`/console/product?productNo=${productNo}`)
    }
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
 * 已开通产品 - 点击展开更多
 */
const onClickExpandMore = () => {
  state.isOpenExpand = !state.isOpenExpand
  if (state.isOpenExpand) {
    state.openProductList = state.openProductTotal
  } else {
    state.openProductList = state.openProductTotal?.slice(0, 4)
  }
}

/**
 * 未开通产品 - 点击展开更多
 */
const onClickNotExpandMore = () => {
  state.isNotOpenExpand = !state.isNotOpenExpand
  if (state.isNotOpenExpand) {
    state.recommendProductList = state.recommendProductTotal
  } else {
    state.recommendProductList = state.recommendProductTotal?.slice(0, 2)
  }
}
</script>

<style lang="scss" scoped>
.panel {
  padding: 20px;
  box-sizing: border-box;
  .header {
    color: #1a2234;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .title {
    cursor: pointer;
    color: #121212;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    &::before {
      content: '';
      width: 4px;
      height: 18px;
      margin-right: 6px;
      display: inline-block;
      vertical-align: text-bottom;
      background-color: #3860f4;
    }
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      margin-left: 10px;
      display: inline-block;
      vertical-align: 10%;
      border-left: 1px solid #1a2234;
      border-bottom: 1px solid #1a2234;
      border-right: 1px solid transparent;
      border-top: 1px solid transparent;
      transform: translate(1px, -1px) rotate(-45deg);
      -webkit-transform: translate(1px, -1px) rotate(-45deg);
      -moz-transform: translate(1px, -1px) rotate(-45deg);
      -ms-transform: translate(1px, -1px) rotate(-45deg);
      -o-transform: translate(1px, -1px) rotate(-45deg);
    }
    &.title-expand {
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        margin-left: 10px;
        display: inline-block;
        vertical-align: -15%;
        border-left: 1px solid #1a2234;
        border-bottom: 1px solid #1a2234;
        border-right: 1px solid transparent;
        border-top: 1px solid transparent;
        transform: translate(1px, -1px) rotate(135deg);
        -webkit-transform: translate(1px, -1px) rotate(135deg);
        -moz-transform: translate(1px, -1px) rotate(135deg);
        -ms-transform: translate(1px, -1px) rotate(135deg);
        -o-transform: translate(1px, -1px) rotate(135deg);
      }
    }
  }
  .serve {
    padding: 30px;
    color: #121212;
    margin-bottom: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
    .category {
      color: #1a2234;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        margin-bottom: 3px;
        margin-right: 10px;
        border-radius: 100%;
        display: inline-block;
        vertical-align: middle;
        background-color: #3860f4;
      }
    }
    .recently {
      width: 164px;
      cursor: pointer;
      padding: 10px 12px;
      margin-right: 20px;
      margin-bottom: 15px;
      box-sizing: border-box;
      background-color: #f9faff;
      &:hover {
        color: #3860f4;
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
      margin-right: 20px;
      margin-bottom: 20px;
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
        color: #fff;
        font-size: 24px;
        font-weight: 600;
        line-height: 44px;
        border-radius: 4px;
        text-align: center;
        margin-right: 10px;
      }
      .serve-logo-text {
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
</style>
