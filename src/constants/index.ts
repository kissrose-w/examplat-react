export const API_CODE = {
  SUCCESS: 200,
  EXPIRED_CAPTCHA: 1005
} as const

export type API_STATUS_CODE = typeof API_CODE[keyof typeof API_CODE]