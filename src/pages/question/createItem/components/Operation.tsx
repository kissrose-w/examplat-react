import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Form, Input, Radio, Row, Select, Space } from 'antd'
import { getQuestionTypeApi, getSubjectApi } from '@/services'
import type { QuestionTypeItem, SearchSubjectList } from '@/services/type'
import { useNavigate } from 'react-router-dom'
import style from '../CreateItem.module.scss'
import type { RadioChangeEvent } from 'antd/lib'
// 定义表单字段类型
interface FormFields {
  type: string | number // 题型
  classify: string | number // 分类
  question: string // 题目
  optionA: string // A选项
  optionB: string // B选项
  optionC: string // C选项
  optionD: string // D选项
  answer: number // 选中的答案
  explanation: string // 解析
}

// 定义选项类型
interface OptionsType {
  [key: number]: string
}

const Operation = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm<FormFields>() // 获取form实例，添加明确的类型参数
  const [typeData , setTypeData] = useState<QuestionTypeItem[]>([])
  const [classifyData, setClassifyData] = useState<SearchSubjectList[]>([])
  // 选项内容状态，保存每个选项的输入值
  const [options, setOptions] = useState<OptionsType>({
    1: '', // A选项
    2: '', // B选项
    3: '', // C选项
    4: ''  // D选项
  })
  // 选中答案状态，保存当前选中的单选框值
  const [selectedAnswer, setSelectedAnswer] = useState<number>(1)
  // 定义Select选项类型
  interface SelectOption {
    label: string
    value: string | number
    key: string
  }

  const formatMenuList = (list:QuestionTypeItem[]): SelectOption[] =>{
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
  // 处理选项内容变化
  const handleOptionChange = (optionKey: keyof OptionsType, value: string) => {
    setOptions(prev => ({
      ...prev,
      [optionKey]: value
    }))
  }

  // 处理选中答案变化
  const handleAnswerChange = (e: RadioChangeEvent) => {
    setSelectedAnswer(Number(e.target.value))
  }

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 获取选中的答案内容
      const answerContent = options[selectedAnswer]
      console.log('选中的答案：', answerContent)
      console.log('所有表单数据：', values)
      console.log('选项内容：', options)
      console.log('选中的答案索引：', selectedAnswer)
    }).catch(errorInfo => {
      console.log('表单验证失败：', errorInfo)
    })
  }

  const renderOptionType = () =>{
    return (
      <Form.Item label="选项" rules={[{required: true, message: '请完善所有选项'}]}>
        <div style={{marginBottom: 16}}>
          <Radio.Group name="answer" value={selectedAnswer} onChange={handleAnswerChange}>
            <Space orientation="vertical" style={{width: '100%'}}>
              {/* A选项 */}
              <Flex align="center" style={{width: '100%'}}>
                <Radio value={1} style={{marginRight: 16}}>A</Radio>
                <Form.Item
                  name="optionA"
                  noStyle
                  rules={[{required: true, message: '请输入A选项内容'}]}
                >
                  <Input
                    placeholder="请输入A选项内容"
                    value={options[1]}
                    onChange={(e) => handleOptionChange(1, e.target.value)}
                    style={{flex: 1}}
                  />
                </Form.Item>
              </Flex>
              
              {/* B选项 */}
              <Flex align="center" style={{width: '100%'}}>
                <Radio value={2} style={{marginRight: 16}}>B</Radio>
                <Form.Item
                  name="optionB"
                  noStyle
                  rules={[{required: true, message: '请输入B选项内容'}]}
                >
                  <Input
                    placeholder="请输入B选项内容"
                    value={options[2]}
                    onChange={(e) => handleOptionChange(2, e.target.value)}
                    style={{flex: 1}}
                  />
                </Form.Item>
              </Flex>
              
              {/* C选项 */}
              <Flex align="center" style={{width: '100%'}}>
                <Radio value={3} style={{marginRight: 16}}>C</Radio>
                <Form.Item
                  name="optionC"
                  noStyle
                  rules={[{required: true, message: '请输入C选项内容'}]}
                >
                  <Input
                    placeholder="请输入C选项内容"
                    value={options[3]}
                    onChange={(e) => handleOptionChange(3, e.target.value)}
                    style={{flex: 1}}
                  />
                </Form.Item>
              </Flex>
              
              {/* D选项 */}
              <Flex align="center" style={{width: '100%'}}>
                <Radio value={4} style={{marginRight: 16}}>D</Radio>
                <Form.Item
                  name="optionD"
                  noStyle
                  rules={[{required: true, message: '请输入D选项内容'}]}
                >
                  <Input
                    placeholder="请输入D选项内容"
                    value={options[4]}
                    onChange={(e) => handleOptionChange(4, e.target.value)}
                    style={{flex: 1}}
                  />
                </Form.Item>
              </Flex>
            </Space>
          </Radio.Group>
        </div>
      </Form.Item>
    )
  }
  return (
    <Form form={form} layout='vertical' requiredMark={true} className={style.form}>
      <Row gutter={18}>
        <Col span={9}>
          <Form.Item label="题型" rules={[{required: true, message: '请选择题型'}]} className={style.select}>
            <Select 
              options={formatMenuList(typeData)} 
              placeholder="请选择题型"
              onChange={value => {
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
      <Col span={8}>
        <Form.Item label='解析' rules={[{required: true, message: '请输入需要创建的题目'}]}>
          <Input.TextArea rows={3} placeholder='请输入题目'/>
        </Form.Item>
      </Col>
      <Form.Item>
        <Flex justify='end'>
          <Space>
            <Button color="default" variant="dashed">
              重置
            </Button>
            <Button color="primary" variant="solid" onClick={handleSubmit}>
              提交
            </Button>
            <Button color="default" variant="outlined" onClick={() => navigate('/question/item-bank')}>
              返回
            </Button>
          </Space>
        </Flex>
      </Form.Item>
    </Form>
  )
}

export default Operation