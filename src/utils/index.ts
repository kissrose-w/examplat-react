
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