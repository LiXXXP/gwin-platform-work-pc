<template>
  <div class="gwin-work-apply flex flex-start">
    <img v-if="state.productInquiry.iconUri" :src="state.productInquiry.iconUri" class="gwin-work-apply__iconuri" />
    <div v-else class="gwin-work-apply__logo">{{ state.productInquiry.productName?.charAt(0) }}</div>
    <div class="gwin-work-product">
      <p class="gwin-work-product__title">{{ state.productInquiry.productName }}</p>
      <p class="gwin-work-product__cont">{{ state.productInquiry.memo }}</p>
      <div v-if="route.query.type === 'try'" class="gwin-work-product__buy">
        <p>试用时长：{{ state.productInquiry.expiresIn || 0 }} 天</p>
      </div>
      <div v-if="route.query.type === 'buy'" class="gwin-work-product__buy">
        <p>购买时长：</p>
        <div>
          <el-select v-model="state.typeValue" filterable placeholder="按年计算" style="margin-right: 20px">
            <el-option label="按年计算" :value="1"> </el-option>
            <el-option label="按月计算" :value="2"> </el-option>
          </el-select>
          <el-select v-if="state.typeValue === 1" v-model="state.yearValue" filterable placeholder="请选择周期">
            <el-option v-for="item in state.yearOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="state.typeValue === 2" v-model="state.monthValue" filterable placeholder="请选择周期">
            <el-option v-for="item in state.monthOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
  <div class="gwin-work-footer">
    <el-button class="gwin-work-footer__btn" @click="onBuyProduct">{{
      route.query.type === 'try' ? '立即试用' : '立即开通'
    }}</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue-demi'
import { useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import WorkApi from '@/api/work'
import { formatDate } from '@/utils/index'
import { getUserId, getEntityId } from '@/utils/auth'
import router from '@/router'
import { ProductParam } from './interface'
import config from '@/config'

const route = useRoute()
const state = reactive({
  typeValue: 1, // 选择计算方式
  yearValue: 1, // 选择按年计算
  monthValue: 1, // 选择按月计算
  // 年
  yearOptions: [
    {
      label: '1年',
      value: 1
    },
    {
      label: '2年',
      value: 2
    },
    {
      label: '3年',
      value: 3
    }
  ],
  // 月
  monthOptions: [
    {
      label: '1个月',
      value: 1
    },
    {
      label: '3个月',
      value: 3
    },
    {
      label: '6个月',
      value: 6
    },
    {
      label: '9个月',
      value: 9
    }
  ],
  productInquiry: <ProductParam>{} // 产品信息
})

onMounted(() => {
  getProductInquiry()
})

/**
 * 获取产品详情
 */
const getProductInquiry = async () => {
  const param = {
    productNo: <string>route.query.productNo
  }
  const res = await WorkApi.productInquiry(param)
  state.productInquiry = res.body
}

/**
 * 申请试用，购买
 */
const onBuyProduct = async () => {
  try {
    // 友盟umeng统计
    if (route.query?.type === 'buy') {
      ;(window as any).setUmeng('产品详情页', '产品购买', state.productInquiry.productName + '产品立即购买btn')
    } else {
      ;(window as any).setUmeng('产品详情页', '产品试用', state.productInquiry.productName + '产品立即试用btn')
    }
    const param = {
      applyTime: state.typeValue === 1 ? state.yearValue : state.monthValue,
      productName: state.productInquiry.productName,
      productNo: <string>route.query?.productNo,
      productUsage: route.query?.type === 'try' ? 1 : 2,
      timeType: state.typeValue,
      subjectId: getEntityId(),
      userId: getUserId()
    }
    const res = await WorkApi.userProductApply(param)
    if (route.query.type === 'buy') {
      ElMessageBox.confirm('产品开通申请已提交成功，请等待工作人员审核预计完成时间1-3个工作日', {
        cancelButtonText: '关闭',
        confirmButtonText: '查看进度',
        cancelButtonClass: 'cancel-btn',
        confirmButtonClass: 'confirm-btn',
        type: 'success',
        center: true,
        customClass: 'apply-box'
      })
        .then(() => {
          window.location.href = `${config.GWIN_URL_TEAM_PRODUCT_RECORD}${res.body.id}`
        })
        .catch(() => {
          router.push('/')
        })
    } else if (route.query.type === 'try') {
      ElMessageBox.confirm(
        `<p style="color: #333;font-size: 16px;">恭喜您，试用LBS服务开通成功！</p><p style="color: #999;font-size: 14px;padding:10px 0 20px;">服务期限：${formatDate(
          res.body.beginTime
        )} - ${formatDate(res.body.endTime)}</p>`,
        {
          dangerouslyUseHTMLString: true,
          cancelButtonText: '关闭',
          confirmButtonText: '产品管理',
          cancelButtonClass: 'cancel-btn',
          confirmButtonClass: 'confirm-btn',
          type: 'success',
          center: true,
          customClass: 'apply-box'
        }
      )
        .then(() => {
          window.location.href = `${config.GWIN_URL_TEAM_PRODUCT_DETAIL}${route.query.productNo}`
        })
        .catch(() => {
          router.push('/')
        })
    }
  } catch (error) {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('apply') {
  width: 100%;
  min-height: calc(100vh - 100px);
  padding: 50px 100px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
  @include e('iconuri') {
    width: 140px;
    height: 140px;
    margin-right: 50px;
    border-radius: 13px;
  }
  @include e('logo') {
    width: 140px;
    height: 140px;
    color: #fff;
    font-size: 32px;
    line-height: 140px;
    text-align: center;
    margin-right: 50px;
    background: linear-gradient(90deg, #ff4d69 0%, #fa301f 100%);
    border-radius: 13px;
  }
  @include b('product') {
    color: #606a78;
    font-size: 14px;
    @include e('title') {
      color: #1a2234;
      font-size: 24px;
      font-weight: 600;
    }
    @include e('cont') {
      width: 500px;
      line-height: 20px;
      margin: 20px 0 40px;
    }
    @include e('buy') {
      p {
        margin-bottom: 10px;
      }
    }
  }
}
@include b('footer') {
  width: 100%;
  text-align: right;
  padding: 30px 100px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px -10px 30px 0px rgba(153, 153, 153, 0.1);
  position: fixed;
  left: 0;
  bottom: 0;
  @include e('btn') {
    width: 104px;
    color: #fff;
    font-size: 16px;
  }
}
</style>
