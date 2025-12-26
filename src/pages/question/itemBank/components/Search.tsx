import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, Select } from 'antd'
import { getQuestionTypeApi } from '@/services'
import type { QuestionTypeItem } from '@/services/type'
type Props = {
  onChange: (type: string) =>void
}
const Search:React.FC<Props> = ({onChange}) => {
  const [typeData , setTypeData] = useState<QuestionTypeItem[]>([])
  const sharedProps = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const formatMenuList = (list:QuestionTypeItem[]) =>{
    return list.map((item,index )=> {
      return {
        label: item.name,
        value: item.value,
        key: `${item.value || index}-${index}`
      }
    })
  }
  const getType = async () =>{
    try{
      const res = await getQuestionTypeApi()
      console.log(res.data.data)
      Promise.resolve().then(() =>{
        setTypeData(res.data.data.list)
      })
    }catch(e){
      console.log(e)
    }
  }
  useEffect(() => {
    getType()
  },[])
  return (
    <Form 
      
      layout='inline' 
      {...sharedProps}
      style={{marginBottom: 20}}
    >
      <Form.Item label="试题搜索" style={{width: 350}}>
        <Flex>
          <Input style={{marginRight: 10}}/>
          <Button color="primary" variant="solid">搜索</Button>
        </Flex>
      </Form.Item>
      <Form.Item label="试题分类" style={{width: 300}}>
        <Select 
          placeholder='请选择类型'
          options={formatMenuList(typeData)} 
          onChange={value => onChange(value)}
        />
      </Form.Item>
      <Form.Item label="题目类型" style={{width: 300}}>
        <Select options={[{ label: 'Demo', value: 'demo' }]} />
      </Form.Item>
    </Form>
  )
}

export default Search