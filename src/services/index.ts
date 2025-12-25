import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  TestList,
  TestParams
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

// 班级管理接口
export const getGroupList = () => {
  return request.get('/manage-group/group-list')
}

// 查询试卷列表
export const getTestPaperList = (params: TestParams) => {
  return request.post<BaseResponse<TestList>>('/exam/list', params)
}