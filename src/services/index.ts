import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  TestList,
  TestParams,
  ClassifyList,
  TestPaperDetail
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
  return request.get<BaseResponse<TestList>>('/exam/list', { params })
}

// 删除试卷
export const delTestPaper = (id: string) => {
  return request.post<BaseResponse>('/exam/remove', { id })
}

// 获取试卷科目
export const getClassifyList = (params: TestParams) => {
  return request.get<BaseResponse<ClassifyList>>('/classify/list', { params })
}

// 试卷详情
export const getTestPaperDetail = (id: string) => {
  return request.get<BaseResponse<TestPaperDetail>>('/exam/detail', {
    params: { id }
  })
}
