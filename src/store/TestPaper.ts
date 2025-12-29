import type { TestListItem } from '@/services/type'
import { create } from 'zustand'
import { getTestPaperList } from '@/services'
import { API_CODE } from '@/constants'
import { message } from 'antd'

interface State {
  testList: TestListItem[],
  total: number,
  loading: boolean,
  params: {
    page: number,
    pagesize: number
  },
  getList: (params?: { page?: number, pagesize?: number }) => void
}

export const testListInfo = create<State>((set, get) => ({
  testList: [],
  total: 0,
  loading: false,
  params: {
    page: 1,
    pagesize: 5
  },
  getList: async (newParams) => {
    try {
      // 合并新参数和现有参数
      const params = {
        ...get().params,
        ...newParams,
        // 确保page和pagesize是数字
        page: newParams?.page || get().params.page,
        pagesize: newParams?.pagesize || get().params.pagesize
      }
      
      set(() => ({ loading: true, params }))
      const res = await getTestPaperList(params)
      if (res.data.code === API_CODE.SUCCESS) { 
        const data = res.data.data.list.map((item, index) => ({
          ...item,
          key: item._id || index.toString()
        }))
        console.log(res)
        // 使用set函数更新store状态
        set(() => ({
          testList: data,
          total: res.data.data.total
        }))
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
    } finally {
      set(() => ({ loading: false }))
    }
  }
}))
