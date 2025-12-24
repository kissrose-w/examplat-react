import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
} from '@/services/type'
import request from './request'


export const getCaptchaApi = () => {
  return request.get<BaseResponse<CaptchaResponse>>('/login/captcha')
}

export const toLoginApi = (params: LoginParams) => {
  return request.post<BaseResponse<LoginResponse>>('/login', params)
}

export const getUserInfoApi = () => {
  return request.get<BaseResponse<UserInfo>>('/user/info')
}

export const getUserMenuApi = () => {
  return request.get<BaseResponse<{list: MenuListItem[]}>>('/user/menulist')
}

// 基础类型
export type Base<T = never> = {
  code: number
  msg: string
  data: {
    total?: number 
    list: T
  }
}

// 用户列表参数
export type UsersListParams = {
  page: number
  pagesize: number
}

// 用户列表返回
export type UsersListResponse = {
  '_id': string
  'username': string
  'password': string
  'status': number
  '__v': number
}
// 获取用户列表
export const usersListApi = (params: UsersListParams) => {
  return request.get<Base<UserInfo>>('/user/list', {
    params
  })}

// 删除用户
export const userSDelApi = (id: string) => {
  return request.post<Omit<Base,'data'>>('/user/remove', {id})
}

// 编辑用户
export const userEditApi = (id: string, password: string) => {
  return request.post<Omit<Base,'data'>>('/user/update', {id, password})
}