import { getGroupListApi } from '@/services'
import React from 'react'

const GroupList = () => {
  const getList = async () => {
    try {
      const res = await getGroupListApi()
      console.log(res)
    } catch(e) {
      console.log(e)
    }
  }
  getList()
  return (
    <div>GroupList</div>
  )
}

export default GroupList