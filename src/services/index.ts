import type {
  MenuListItem,
  BaseResponse,
  CaptchaResponse,
  LoginParams,
  LoginResponse,
  UserInfo,
  TestList,
  TestParams,
  QueryParams,
  ExaminationList,
  Pages,
  SearchSubject,
  FieldType,
  SubjectCreat,
  QuestionType,
  QuestionTypeValue,
  GroupResponse,
  ClassifyList,
  TestPaperDetail,
  createTestParams,
  TestCreate,
  CreateExamination
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

// 班级管理接口
export const getGroupList = () => {
  return request.get('/manage-group/group-list')
}

// 查询班级接口
export const getGroupListApi = (params?: QueryParams) => {
  return request.get<BaseResponse<GroupResponse>>('/studentGroup/list', {
    params: params || ''
  })
}

// 获取试卷列表
export const getExaminationListApi = (params: QueryParams) => {
  return request.get<BaseResponse<ExaminationList>>('/examination/list', {params})
}

// 删除考试记录
export const removeExamRecordApi = (id: string) => {
  return request.post<BaseResponse>('/examination/remove', {id})
}

// 创建考试
export const createExamApi = (params: CreateExamination) => {
  return request.post<BaseResponse>(`/examination/create?${Date.now()}`, params)
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
  'status': 0 | 1
  '__v': number,
  'lastOnlineTime'?: string
}
// 获取用户列表
export const usersListApi = (params?: UsersListParams) => {
  return request.get<Base<UsersListResponse[]>>('/user/list', {
    params: params || {}
  })}

// 删除用户
export const userSDelApi = (id: string) => {
  return request.post<Omit<Base,'data'>>('/user/remove', {id})
}

export type UserCreateParams = {
  username?: string,
  password?: string,
  email?: string,
  sex?: 0 | 1,
  age?: number,
  role?: []
}

export type UserEditParams = UserCreateParams & {
  id : string
  status?: 0 | 1 
}
// 编辑用户
export const userEditApi = (params: UserEditParams) => {
  return request.post<Omit<Base,'data'>>('/user/update', params)
}

// 创建用户
export const userCreateApi = (params: UserCreateParams) => {
  return request.post<Omit<Base,'data'>>('/user/create', params)
}

// 查询角色接口
export const userRoleApi = () => {
  return request.get<Base<PermissionType[]>>('/role/list')
}

// 编辑角色接口
export const roleUpdateApi = (params: {
  id: string,
  name?: string,
  permission?: string[]
}) => {
  return request.post<Base<PermissionType>>('/role/update', params )
}
//删除角色接口role/remove 
export const roleRemoveApi = (id: string) => {
  return request.post<Base>('/role/remove', { id } )
}
export type RoleCreateP = {
  _id?: string
  name: string
  creator?: string
  createdAt?: string
  description: string
}
// 创建角色接口
export const roleCreateApi = (params:RoleCreateP) => {
  return request.post<Base>('/role/create', params )
}

export type PermissionType = {
  children?: PermissionType[]
  component: 'Layout'
  createTime: number
  createdAt: string
  creator: string
  disabled: boolean 
  icon: string
  isBtn: boolean
  name: string
  path: string
  pid: null
  sort: 1
  updatedAt: string
  _id: string
}
//查询权限菜单
export const getPermissionApi = () => {
  return request.get<Base<PermissionType>>('/permission/list' )
}

//编辑权限菜单
export const permissionEditApi = (params: {
  id: string,
  name?: string,
  path?: string,
  isBtn?: boolean
}) => {
  return request.post('/permission/update', params)
}

// 删除权限菜单
export const permissionRemoveApi = (id: string) => {
  return request.post<Base>('/permission/remove', {id})
}

export type PerCreateP = {
  pid?: string,
  name?: string,
  path: string,
  disabled: boolean,
  isBtn?: boolean
}
// 创建权限菜单
export const permissionCreateApi = (params: PerCreateP) => {
  return request.post<Base>('/permission/create', params)
}

export type PersonalP = {
  username: string
  age: number
  sex: 0 | 1
  email: string
}

// 修改个人信息
export const personalEditApi = (params: PersonalP) => {
  return request.post('/user/update/info', params)
}


//查询科目列表
export const getSubjectApi = (params?: Pages) => {
  return request.get<BaseResponse<SearchSubject>>('/classify/list', {
    params: params || ''
  })
}

//删除科目
export const getDelSubjectApi = (id:string) => {
  return request.post<SubjectCreat>('/classify/remove',{id})
}

//创建科目接口 
export const getCreateSubjectApi = (params: FieldType) => {
  return request.post<SubjectCreat>('/classify/create', params)
} 

//编辑科目接口
export const getEditSubjectApi = (id:string,value:FieldType) =>{
  return request.post<SubjectCreat>('/classify/update',{id,...value})
}

//查看题库列表
export const getQuestionsListApi = (params: (Pages & {type?: string} & {question?: string} & {classify?: string})) => {
  return request.get<BaseResponse<QuestionType>>('/question/list', {params})
}

//删除题目
export const getQuestionDelApi = (id: string) => {
  return request.post<SubjectCreat>('/question/remove', {id})
}

//查询题目分类
export const getQuestionTypeApi = () =>{
  return request.get<BaseResponse<QuestionTypeValue>>('/question/type/list')
}

//编辑题目接口
export const getQuestionEditApi = (id: string, question: string) =>{
  return request.post<SubjectCreat>('/question/update',{id,question})
}
// 查询试卷列表
export const getTestPaperList = (params?: TestParams) => {
  return request.get<BaseResponse<TestList>>('/exam/list', {
    params: params || ''
  })
}

// 删除试卷
export const delTestPaper = (id: string) => {
  return request.post<BaseResponse>('/exam/remove', { id })
}

// 获取试卷科目
export const getClassifyList = () => {
  return request.get<BaseResponse<ClassifyList>>('/classify/list')
}

// 试卷详情
export const getTestPaperDetail = (id: string) => {
  return request.get<BaseResponse<TestPaperDetail>>('/exam/detail', {
    params: { id }
  })
}

// 创建试卷
export const createTestPaper = (params: createTestParams) => {
  return request.post<BaseResponse<TestCreate>>('/exam/create', params)
}
//创建试题
export const getCreatQuestionApi = (params: {
  question: string
  answer: string | string[]
  type: string | number
  classify: string | number
  options: { label: string, value: string }[]
  explanation: string
}) => {
  return request.post<BaseResponse>('/question/create', params)
}
