import axios from 'axios'

axios.defaults.baseURL = '/api'
// 基础类型
export type Base<T> = {
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
  "_id": string
  "username": string
  "password": string
  "status": number
  "__v": number
}
export const usersListApi = (params: UsersListParams) => {
  return axios.get<Base<UsersListResponse>>('/user/list', {
    params,
    headers: {
      Authorization: 'Bear' + getToken()
    }
  })
}