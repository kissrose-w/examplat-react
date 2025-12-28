import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, Select } from 'antd'
import { getQuestionTypeApi, getSubjectApi } from '@/services'
import type { QuestionTypeItem, SearchSubjectList } from '@/services/type'
type Props = {
  onChange: (type: string) =>void
  onInpChange: (question: string) =>void
  onChangeClassify: (classify: string) => void
}
const Search:React.FC<Props> = ({onChange, onInpChange, onChangeClassify}) => {
  const [typeData , setTypeData] = useState<QuestionTypeItem[]>([])
  const [classifyData, setClassifyData] = useState<SearchSubjectList[]>([])
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
      Promise.resolve().then(() =>{
        setTypeData(res.data.data.list)
      })
    }catch(e){
      console.log(e)
    }
  }

  //题型
  const classifyInfo = async () =>{
    try{
      const res = await getSubjectApi()
      console.log(res.data.data.list)
      Promise.resolve().then(() =>{
        setClassifyData(res.data.data.list)
      })
    }catch(e){
      console.log(e)
    }
  }
  useEffect(() => {
    getType()
    classifyInfo()
  },[])
  return (
    <Form 
      layout='inline' 
      {...sharedProps}
      style={{marginBottom: 20}}
    >
      <Form.Item label="试题搜索" style={{width: 350}}>
        <Flex>
          <Input style={{marginRight: 10}} onChange={e =>onInpChange( e.target.value)}/>
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
        <Select options={formatMenuList(classifyData)}  onChange={value => onChangeClassify(value) }/>
      </Form.Item>
    </Form>
  )
}

export default Search