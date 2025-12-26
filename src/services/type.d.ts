import type {API_STATUS_CODE} from '@/constants'
import type { IconKeys } from '@/constants/icons'


// 公共响应类型
export type BaseResponse<T = never> = {
  code: API_STATUS_CODE,
  msg: string,
  data: T
}

// 验证码图片参数
export type CaptchaResponse = {
  code: string,
  text: string
}

// 登录参数
export type LoginParams = Record<'username' | 'password' | 'code', string>

// 登录响应
export type LoginResponse = {
  token: string
}

// 权限
export type PermissionItem = {
  name: string
  path: string
}

// 用户信息
export type UserInfo = {
  _id: string
  username: string
  sex: string
  avator: string
  email: string
  age: number
  role: string[]
  permission: PermissionItem[]
  status?: string
}

// 菜单
export type MenuListItem = {
  component: string
  createTime: number
  createdAt: string
  creator: string
  disabled: string
  icon: IconKeys
  isBtn: boolean
  name: string
  path: string
  pid: string
  updatedAt: string
  _id: string
  children?: MenuListItem[]
}

// 试卷列表
interface Ques {
  order: number
  question: string
  score: number
  _id: string
}
export type TestListItem = {
  classify: string
  createdAt: string
  creator: string
  description: string
  duration: number
  name: string
  question: Ques[]
  status: number
  totalScore: number
  updatedAt: string
  __V: number
  _id: string
}
export type TestList = {
  list: TestListItem[]
  tottal: number
  totalPage: number
}
// 试卷参数
export type TestParams = {
  page: number
  pagesize: number
}
