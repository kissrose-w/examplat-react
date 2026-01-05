export const API_CODE = {
  // 成功
  SUCCESS: 200,
  // 验证码过期
  EXPIRED_CAPTCHA: 1005,
  // 参数错误
  PARAMS_ERROR: 1000
} as const

export type API_STATUS_CODE = typeof API_CODE[keyof typeof API_CODE]


export const API_STATUS = {
  NOT_START: 0,
  IN_PROGRESS: 1,
  FINISHED: 2
}