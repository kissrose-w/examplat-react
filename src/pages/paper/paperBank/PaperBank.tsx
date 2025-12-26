import { getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import React, { useEffect, useState } from 'react'

const PaperBank = () => {
  const [list, setList] = useState<TestListItem[]>([])

  useEffect(() => {
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
    
    getList()
  }, [])
  
  return (
    <div>
      <ul>
        类型
        {list.map(item => 
          <li>{item.classify}</li>
        )}
      </ul>
    </div>
  )
}

export default PaperBank