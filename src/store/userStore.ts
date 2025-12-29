import { create } from 'zustand'
import { getUserInfoApi, getUserMenuApi } from '@/services'
import type { MenuListItem, UserInfo } from '@/services/type'



interface State {
  userInfo: UserInfo | null,
  menuList: MenuListItem[],
  getUserInfo: () => void
}

export const useUserStore = create<State>((set) => ({
  userInfo: null,
  menuList: [],
  getUserInfo: async () => {
    try {
      const res = await getUserInfoApi()
      // console.log(res)
      set(() => ({userInfo: res.data.data}))
      const menuRes = await getUserMenuApi()
      set(() => ({menuList: menuRes.data.data.list}))
    } catch (e) {
      console.log(e)
    }
  }
}))