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

//页数
export type Pages = {
  page: number,
  pagesize: number
}

//科目查询list
export type SearchSubjectList = {
  id: string,
  name: string,
  value: string,
  creator: string,
  createTime: number,
  __v: number
}

//科目查询
export type SearchSubject = {
  total: number,
  list: SearchSubjectList[],
  page: number,
  pagesize: number,
  totalPage: number
}