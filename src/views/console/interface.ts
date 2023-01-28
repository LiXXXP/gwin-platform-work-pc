export interface BrowseProductListParam {
  // 浏览记录
  productHref: string
  productName: string
  productNo: string
}

export interface HomeOpenProductListParam {
  // 首页开通列表
  beginTime: string
  endTime: string
  iconUri: string
  id: string
  productName: string
  productNo: string
  productUsage: number
}

export interface HomeRecommendProductListParam {
  // 首页推荐列表
  iconUri: string
  productId: string
  productName: string
  productNo: string
  reviewStatus: number
}

export interface AnnouncementListParam {
  // 公告列表
  id: number
  releaseTime: number
  title: string
}

export interface OpenProductListParam {
  // 已开通产品
  beginTime: string
  endTime: string
  iconUri: string
  id: string
  productName: string
  productNo: string
  productUsage: number
}

export interface RecommendProductListParam {
  // 未开通产品
  iconUri: string
  productId: string
  productName: string
  productNo: string
  reviewStatus: number
  categoryName: string
}

export interface StateOption {
  openProductTotal: []
  recommendProductTotal: any[]
  openProductList: OpenProductListParam[]
  recommendProductList: any[]
  isOpenExpand: boolean
  isNotOpenExpand: boolean
}

export interface ProductParam {
  // 产品开通
  content: string
  iconUri: string
  expiresIn: number
  memo: string
  productId: number
  productName: string
  productNo: string
}
export interface ProductInfoParam {
  // 产品信息
  content: string
  coverUri: string
  expiresIn: number
  memo: string
  productId: number
  productName: string
  productNo: string
  productUrl: string
  productUsage: number // 产品属性 1 试用 2 购买 3支持试用与购买
  status: number // 上下架状态
  defaultedUri: string
}

export interface StatusParam {
  // 产品试用状态
  certType: number // 当前企业认证状态，1 已认证，2 未认证
  isSubjectOwner: number // 是否为企业管理员 1.是，2.否
  isTrialed: boolean // 是否试用过产品，true试用过，false未试用过
  status: string // 使用状态 未开通:not_activated,已开通:activated,试用trial
}
