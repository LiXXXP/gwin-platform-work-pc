<template>
  <div class="gwin-work-product">
    <div class="gwin-work-apply">
      <img v-if="state.productInquiry.coverUri" class="gwin-work-apply__logo" :src="state.productInquiry.coverUri" />
      <img v-else src="../../assets/imgs/product/product.png" />
      <div class="gwin-work-apply-intro">
        <p class="gwin-work-apply-intro__title">{{ state.productInquiry.productName }}</p>
        <p class="gwin-work-apply-intro__cont">{{ state.productInquiry.memo }}</p>
        <div class="flex flex-only-center">
          <el-button
            v-if="
              state.status.status === 'not_activated' ||
              state.status.status === 'trial' ||
              state.status.status === 'activated_apply'
            "
            class="gwin-work-apply-intro__btn"
            @click="onGoProductBuy('buy')"
            >申请购买</el-button
          >
          <el-button
            v-if="
              (state.status.status === 'not_activated' || state.status.status === 'trial_apply') &&
              state.productInquiry.productUsage !== 2
            "
            class="gwin-work-apply-intro__btn"
            @click="onGoProductBuy('try')"
            >申请试用</el-button
          >
          <el-button
            v-if="
              state.status.status === 'activated' ||
              state.status.status === 'trial' ||
              (state.status.status === 'activated_apply' && state.status.isTrialed)
            "
            class="gwin-work-apply-intro__btn"
            @click="onUseProduct"
            >立即使用</el-button
          >
        </div>
      </div>
    </div>
    <div class="gwin-work-introduce">
      <img v-for="(item, index) of state.productInquiry.defaultedUriList" :key="index" :src="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue-demi'
import { ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import WorkApi from '@/api/work'
import { getUserId, getEntityId } from '@/utils/auth'
import router from '@/router'
import { ProductInfoParam, StatusParam } from './interface'
import config from '@/config'

const route = useRoute()
const state = reactive({
  productInquiry: <ProductInfoParam>{}, // 产品信息
  status: <StatusParam>{} // 产品使用状态
})

onMounted(() => {
  getSubjectProductStatusInquiry()
})

/**
 * 获取产品详情 status 1:上架 2:一直未上架 4:上架后下架
 */
const getProductInquiry = async () => {
  const param = {
    productNo: <string>route.query?.productNo
  }
  const res = await WorkApi.productInquiry(param)
  state.productInquiry = res.body
  // 试用与使用中，产品下架 不展示下架弹窗
  // state.status.status 使用状态
  // res.body.status 上下架状态
  if (state.status.status !== 'activated' && state.status.status !== 'trial') {
    if (res.body.status === 2 || res.body.status === 4) {
      ElMessageBox.alert('产品过期不存在', {
        confirmButtonText: '我知道了',
        type: 'warning',
        center: true
      })
        .then(() => {
          router.push('/')
        })
        .catch(() => {
          router.push('/')
        })
    }
  }
}

/**
 * 获取产品使用状态
 */
const getSubjectProductStatusInquiry = async () => {
  const param = {
    productNo: <string>route.query.productNo,
    subjectId: getEntityId(),
    userId: getUserId()
  }
  const res = await WorkApi.subjectProductStatusInquiry(param)
  state.status = res.body
  getProductInquiry()
}

/**
 * 申请试用，购买
 */
const onGoProductBuy = async (type: string) => {
  // 友盟umeng统计
  if (type === 'buy') {
    ;(window as any).setUmeng('产品介绍', '产品购买', state.productInquiry.productName + '产品申请购买btn')
  } else {
    ;(window as any).setUmeng('产品介绍', '产品试用', state.productInquiry.productName + '产品申请试用btn')
  }
  // 产品下架
  await getProductInquiry()
  if (state.productInquiry.status === 2 || state.productInquiry.status === 4) {
    if (state.status.status === 'trial') {
      // 已经试用中的产品，点击购买，如果产品已下架，展示下架弹窗，并且关闭弹窗留在本页
      ElMessageBox.alert('产品过期不存在', {
        confirmButtonText: '我知道了',
        type: 'warning',
        center: true
      })
    }
  } else if (state.status.isSubjectOwner === 2) {
    // 不是管理员
    onErrorAlert('对不起，您没有开通服务的权限，请联系管理员去开通', false)
  } else if (state.status.certType === 2) {
    // 企业未认证
    onErrorAlert('对不起，您当前企业未认证，请先完成企业资质认证', true)
  } else if (type === 'buy' && state.status.status === 'activated_apply') {
    // 开通审核中
    onErrorAlert('当前正在申请开通审核中，请耐心等待', false)
  } else if (type === 'try' && state.status.status === 'trial_apply') {
    // 试用审核中
    onErrorAlert('当前正在申请试用审核中，请耐心等待', false)
  } else {
    router.push({
      path: '/console/apply',
      query: {
        productNo: route.query.productNo,
        type: type
      }
    })
  }
}

/**
 * 弹窗提示
 */
const onErrorAlert = (msg: string, show: boolean) => {
  ElMessageBox.alert(msg, {
    type: 'warning',
    center: true,
    showCancelButton: false,
    showConfirmButton: !!show,
    confirmButtonText: '完善企业资格信息',
    confirmButtonClass: 'confirm-btn',
    customClass: 'product-box'
  }).then(() => {
    window.location.href = config.GWIN_URL_TEAM_BASIC_USER
  })
}

/**
 * 立即使用
 */
const onUseProduct = () => {
  // 友盟umeng统计
  ;(window as any).setUmeng('产品介绍', '产品试用', state.productInquiry.productName + '产品立即使用btn')
  window.location.href = state.productInquiry.productUrl
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('product') {
  width: 100%;
}
@include b('apply') {
  position: relative;
  @include e('logo') {
    height: 380px;
  }
  img {
    width: 100%;
  }
  @include b('apply-intro') {
    width: 500px;
    color: #fff;
    position: absolute;
    left: 200px;
    top: 80px;
    @include e('title') {
      font-size: 24px;
      font-weight: 600;
    }
    @include e('cont') {
      height: 80px;
      font-size: 14px;
      line-height: 20px;
      margin: 30px 0 40px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }
    @include e('btn') {
      color: #fff;
      padding: 0;
      width: 104px;
      min-height: 38px;
      font-size: 16px;
      margin-right: 20px;
    }
  }
}
@include b('introduce') {
  img {
    width: 100%;
  }
}
@include b('speciality') {
  margin-top: 30px;
  img {
    width: 100%;
  }
}
@include b('problem') {
  margin-top: 30px;
  img {
    width: 100%;
  }
}
</style>
