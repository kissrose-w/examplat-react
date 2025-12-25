import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  Pages,
  SearchSubject,
  FieldType,
  SubjectCreat
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

//查询科目列表
export const getSubjectApi = (params: Pages) => {
  return request.get<BaseResponse<SearchSubject>>('/classify/list', {params})
}

//删除科目
export const getDelSubjectApi = (id:string) => {
  return request.post<SubjectCreat>('/classify/remove',{id})
}

//创建科目接口 
export const getCreateSubjectApi = (params: FieldType) => {
  return request.post<SubjectCreat>('/classify/create',params)
} 