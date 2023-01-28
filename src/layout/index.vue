<template>
  <div style="height: 100%">
    <Header class="app-header" />
    <div class="app-main">
      <Content class="app-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './header.vue'
import Content from './content.vue'
import { defineComponent } from 'vue-demi'

defineComponent({
  Header,
  Content
})
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  background-color: #f8fbff;
  position: relative;
  top: 50px;
  left: 0px;
  right: 0px;
}
.app-content {
  flex: 1;
  min-width: 520px;
}
</style>
