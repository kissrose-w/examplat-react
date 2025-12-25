import { getTestPaperList } from '@/services'
import type { TestList, TestListItem } from '@/services/type'
import React, { useEffect, useState } from 'react'

const CreatePaper = () => {
  const [list, setList] = useState<TestListItem>()


  const getList = async () => {
    try {
      const res = await getTestPaperList({
        page: 1,
        pagesize: 10
      })
      console.log(res)
      setList(res.data.data.list)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getList()
  }, [])
  
  return (
    <div>
      {list}
    </div>
  )
}

export default CreatePaper