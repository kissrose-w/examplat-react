import React, { useState } from 'react'
import style from './CreateItem.module.scss'
import classNames from 'classnames'
import Operation from './components/Operation.tsx'
import Batch from './components/Batch.tsx'

const CreateItem = () => {
  const navList = ['手动添加', '批量导入']
  const [activeIndex,setActiveIndex] = useState<number>(0)
  return (
    <>
      <h2>添加试题</h2>
      <nav>
        {navList.map((item,index) =>{
          return <span 
            key={item}
            onClick={() => setActiveIndex(index)}
            className={classNames(style.item, {[style.active]: activeIndex === index })}
          >{item}</span>
        })}
      </nav>
      <main>
        {
          activeIndex === 0 ? 
            <Operation/> : 
            <Batch/>
        }
      </main>
    </>
  )
}

export default CreateItem