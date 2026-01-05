import type { ClassifyItem } from '@/services/type'
import { create } from 'zustand'
import { getClassifyList } from '@/services'
import { API_CODE } from '@/constants'
import { message } from 'antd'

interface State {
  testList: ClassifyItem[],
  getList: () => void
}

export const createListInfo = create<State>((set, get) => ({
  testList: [],
  getList: async () => {
    try {
      const res = await getClassifyList()
      if (res.data.code === API_CODE.SUCCESS) { 
        console.log(res)
        set(() => ({testList: res.data.data.list}))
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
    }
  }
}))
