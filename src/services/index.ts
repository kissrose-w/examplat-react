import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  TestList,
  TestParams,
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

// 班级管理接口
export const getGroupList = () => {
  return request.get('/manage-group/group-list')
}

// 查询试卷列表
export const getTestPaperList = (params: TestParams) => {
  return request.get<BaseResponse<TestList>>('/exam/list', { params })
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
export const userEditApi = (params: UserInfo) => {
  return request.post<Omit<Base,'data'>>('/user/update', params)
}

// 创建用户
export const userCreateApi = (params: UserInfo) => {
  return request.post<Omit<Base,'data'>>('/user/create', params)
}

// 查询角色接口
export const userRoleApi = () => {
  return request.get('role/list')
}

// 编辑角色接口
export const roleUpdateApi = (params: string) => {
  return request.post('role/update', params )
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
