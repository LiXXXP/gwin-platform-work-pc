<template>
  <div class="gwin-work-notice">
    <div class="gwin-work-back">
      <router-link class="gwin-work-back__link" to="/">
        <i></i>
      </router-link>
    </div>
    <div class="gwin-work-content">
      <el-table
        :data="state.tableData"
        :header-cell-style="{ background: '#FAFBFD', color: '#1A2234' }"
        @cell-click="cellBtn"
      >
        <el-table-column label="公告标题" prop="title" />
        <el-table-column label="公告时间" width="200px">
          <template #default="scope">
            <span v-if="scope.row.releaseTime">{{ formatDate(scope.row.releaseTime, 'YYYY-mm-dd') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :current-page="state.pageParam.pageNum"
        :page-size="state.pageParam.pageSize"
        :total="state.pageParam.total"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue-demi'
import { useRouter } from 'vue-router'
import http from '@/api/work'
import Pagination from '@/components/Pagination/index.vue'
import { formatDate } from '@/utils/index'

const router = useRouter()

const state = reactive({
  tableData: [],
  // 分页参数
  pageParam: {
    count: 0,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    returnCount: true
  }
})
onMounted(() => {
  // 公告
  getProductList()
})

// 获取产品列表
const getProductList = async () => {
  const res = await http.AnnouncementListInquiry({
    page: state.pageParam
  })
  if (res.status.success) {
    // tableData
    state.tableData = res.body.dataList

    // pageData
    state.pageParam.total = res.body.page.count
    state.pageParam.pageSize = res.body.page.pageSize
    state.pageParam.pageNum = res.body.page.pageNum
  }
}

// 跳转详情
const cellBtn = (row: any) => {
  router.push({
    name: 'notice',
    query: {
      id: row.id
    }
  })
}

/**
 * 分页
 */
const sizeChange = (val: number) => {
  state.pageParam.pageSize = val
  getProductList()
}

/**
 * 分页 当前页
 */
const currentChange = (val: number) => {
  state.pageParam.pageNum = val
  getProductList()
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
  padding: 0 20px;
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
