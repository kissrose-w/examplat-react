import type { GroupItem } from '@/services/type'

const TOKEN_NAME = 'exam_token'

export const setToken = (token: string) => {
  if(!token) throw new Error('token 错误')
  localStorage.setItem(TOKEN_NAME, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_NAME)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_NAME)
}

// 根据id查找班级名称
export const showGroupName = (strArr: string[], groArr: GroupItem[]) => {
  const res: GroupItem[] = []
  strArr.forEach(item => {
    const found = groArr.find(v => v._id === item)
    if (found) res.push(found)
  })
  return res.map( v => v.name)
}