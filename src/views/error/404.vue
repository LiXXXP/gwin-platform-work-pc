<template>
  <div class="gwin-work-error flex flex-center flex-only-center">
    <div class="gwin-work-error__icon">
      <i></i>
      <p>404 NOT FOUND</p>
    </div>
    <div class="gwin-work-error__text">
      <p class="gwin-work-error__404">404</p>
      <p>抱歉，你访问的页面不存在</p>
      <el-button class="gwin-work-error__button" type="primary" @click="onBackHome">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
/**
 * 返回首页
 */
const onBackHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('error') {
  height: 100vh;
  color: #999;
  font-size: 16px;
  @include e('icon') {
    i {
      width: 350px;
      height: 230px;
      display: block;
      background: url('../../assets/imgs/404.png') no-repeat 0 0;
      background-size: 100%;
    }
    p {
      margin-top: 10px;
      text-align: center;
    }
  }
  @include e('text') {
    margin-left: 120px;
    @include e('404') {
      color: #1a2234;
      font-size: 56px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    @include e('button') {
      border: 0;
      margin-top: 24px;
      background: #3860f4;
      &:hover {
        background-color: #3c7dff;
      }
    }
  }
}
</style>
