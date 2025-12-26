import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  QueryParams,
  ExaminationList
} from '@/services/type'
import request from './request'


// 获取验证码图片
export const getCaptchaApi = () => {
  return request.get<BaseResponse<CaptchaResponse>>('/login/captcha')
}

// 登录接口
export const toLoginApi = (params: LoginParams) => {
  return request.post<BaseResponse<LoginResponse>>('/login', params)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request.get<BaseResponse<UserInfo>>('/user/info')
}

// 获取侧边栏信息
export const getUserMenuApi = () => {
  return request.get<BaseResponse<{list: MenuListItem[]}>>('/user/menulist')
}

// 获取试卷列表
export const getExaminationListApi = (params: QueryParams) => {
  return request.get<BaseResponse<ExaminationList>>('/examination/list', {params})
}