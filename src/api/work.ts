import { Request, Response } from '@gwin/networking'

interface UserBrowseListParam {
  // 查询用户产品浏览列表-参数
  userId: string | undefined
  subjectId: string | undefined
}

interface UserBrowseMaintenanceParam {
  // 用户浏览产品维护-参数
  action: string
  userId: string | undefined
  productNo: string | undefined
}

interface UserProductNotParam {
  // 用户未开通产品列表查询-参数
  subjectId: string | undefined
}

interface AnnouncementListParam {
  // 公告列表查询-参数
  page: {
    pageSize: number
  }
  title: string
}

interface AnnouncementParam {
  // 公告内容查询-参数
  id: string | undefined
}

interface ProductInquiryParam {
  // 产品详情查询-参数
  productNo: string | undefined
}

interface SubjectProductParam {
  // 产品使用状态查询-参数
  productNo: string | undefined
  subjectId: string | undefined
  userId: string | undefined
}

interface UserProductApplyParam {
  // 用户产品申请-参数
  applyTime: number
  productName: string
  productNo: string | undefined
  productUsage: number
  timeType: number
  subjectId: string | undefined
  userId: string | undefined
}

export class WorkApi {
  // 查询用户产品浏览列表
  async UserBrowseProductListInquiry(params: UserBrowseListParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/UserBrowseProductListInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 用户浏览产品维护
  async UserBrowseProductMaintenance(params: UserBrowseMaintenanceParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/UserBrowseProductMaintenance',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 用户产品已开通列表查询
  async WorkbenchUserProductActivatedListInquiry(params: UserBrowseListParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/WorkbenchUserProductActivatedListInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 用户未开通产品列表查询
  async UserProductNotActivatedListInquiry(params: UserProductNotParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/UserProductNotActivatedListInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 公告列表查询
  async AnnouncementListInquiry(params: AnnouncementListParam): Promise<Response> {
    const request = new Request({
      url: '/saas/v1/AnnouncementListInquiry',
      params: params,
      isLoading: true,
      isMessage: true,
      isError: true
    })
    return await request.start()
  }

  // 公告内容查询
  async AdminAnnouncementInquiry(params: AnnouncementParam): Promise<Response> {
    const request = new Request({
      url: '/saas/v1/AdminAnnouncementInquiry',
      params: params,
      isLoading: true,
      isMessage: true,
      isError: true
    })
    return await request.start()
  }

  // 产品详情查询
  async productInquiry(params: ProductInquiryParam): Promise<Response> {
    const request = new Request({
      url: '/saas/v1/ProductInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 产品使用状态查询
  async subjectProductStatusInquiry(params: SubjectProductParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/SubjectProductStatusInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 用户产品申请
  async userProductApply(params: UserProductApplyParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/UserProductApply',
      params: params,
      isLoading: true,
      isMessage: true,
      isError: true
    })
    return await request.start()
  }

  // 中台个人信息
  async PersonalInformationInquiry(params: UserProductApplyParam): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/PersonalInformationInquiry',
      params: params,
      isLoading: true,
      isMessage: true,
      isError: true
    })
    return await request.start()
  }
}

export default new WorkApi()
