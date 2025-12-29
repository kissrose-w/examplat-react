import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Radio, Row, Select } from 'antd'
import { getQuestionTypeApi, getSubjectApi } from '@/services'
import type { QuestionTypeItem, SearchSubjectList } from '@/services/type'
import style from '../CreateItem.module.scss'
const Operation = () => {
  const [typeData , setTypeData] = useState<QuestionTypeItem[]>([])
  const [classifyData, setClassifyData] = useState<SearchSubjectList[]>([])
  const [curSelect, setCurSelect] = useState<number | string>(0)
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
  const renderOptionType = () =>{
    switch(curSelect){
    case 1:
      return (
        <Form.Item rules={[{required: true, message: '请完善选项'}]}>
          <Radio.Group
            name="radiogroup"
            defaultValue={1}
            options={[
              { value: 1, label: 'A' },
              { value: 2, label: 'B' },
              { value: 3, label: 'C' },
              { value: 4, label: 'D' },
            ]}
          />
        </Form.Item>
      )
    }
  }
  return (
    <Form layout='vertical' requiredMark={true} className={style.form}>
      <Row gutter={18}>
        <Col span={9}>
          <Form.Item label="题型" rules={[{required: true, message: '请选择题型'}]} className={style.select}>
            <Select 
              options={formatMenuList(typeData)} 
              placeholder="请选择题型"
              onChange={value => {
                setCurSelect(value)
                console.log(value)
              }}
            ></Select>
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item label="分类" rules={[{required: true, message: '请选择类型'}]} className={style.select}>
            <Select
              options={formatMenuList(classifyData)}
              placeholder="请选择类型"
            ></Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label='题目' rules={[{required: true, message: '请输入需要创建的题目'}]}>
        <Input.TextArea rows={3} placeholder='请输入题目'/>
      </Form.Item>
      {renderOptionType()}
    </Form>
  )
}

export default Operation