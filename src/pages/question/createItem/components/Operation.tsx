import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Form, Input, message, Row, Select, Space } from 'antd'
import { getQuestionTypeApi, getSubjectApi } from '@/services'
import type { QuestionTypeItem, SearchSubjectList } from '@/services/type'
import { useNavigate } from 'react-router-dom'
import style from '../CreateItem.module.scss'
import type { RadioChangeEvent } from 'antd/es'
import OptionRenderer from './OptionRenderer'
// 定义表单字段类型
interface FormFields {
  type: string | number // 题型
  classify: string | number // 分类
  question: string // 题目
  optionA?: string // A选项
  optionB?: string // B选项
  optionC?: string // C选项
  optionD?: string // D选项
  answer: number | number[] // 选中的答案，支持单选和多选
  blankAnswer?: string // 填空题答案
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
  const [curSelect, setCurSelect] = useState<number | string>(0)
  // 选项内容状态，保存每个选项的输入值
  const [options, setOptions] = useState<OptionsType>({
    1: '', // A选项
    2: '', // B选项
    3: '', // C选项
    4: ''  // D选项
  })
  // 选中答案状态，保存当前选中的单选框值或多选框值
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[]>(1)
  // 判断题答案变量1，默认值为1
  const [judgeAnswer, setJudgeAnswer] = useState<number>(1)
  // 填空题答案
  const [blankAnswer, setBlankAnswer] = useState<string>('')
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

  // 处理单选答案变化
  const handleRadioAnswerChange = (e: RadioChangeEvent) => {
    const value = Number(e.target.value)
    if (curSelect === 3) { // 判断题
      setJudgeAnswer(value) // 更新判断题答案变量1
    } else { // 单选题
      setSelectedAnswer(value) // 更新单选题答案
    }
  }

  // 处理多选答案变化
  const handleCheckboxAnswerChange = (checkedValues: number[]) => {
    setSelectedAnswer(checkedValues)
  }

  // 处理填空题答案变化
  const handleBlankAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlankAnswer(e.target.value)
  }

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 自定义验证逻辑
      let validationError = ''
      
      if (curSelect === 1) { // 单选题
        // 检查是否选择了答案
        if (!selectedAnswer) {
          validationError = '请选择单选题答案'
        } else {
          // 检查选择的选项内容是否为空
          const selectedOptionContent = options[selectedAnswer as number] || ''
          if (!selectedOptionContent.trim()) {
            validationError = '请确保选择的选项内容不为空'
          }
        }
      } else if (curSelect === 2) { // 多选题
        // 检查是否至少选择了两个答案
        const selectedAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : []
        if (selectedAnswers.length < 2) {
          validationError = '请至少选择两个答案'
        } else {
          // 检查所有选择的选项内容是否为空
          const emptyOptions = selectedAnswers.filter(answer => {
            const optionContent = options[answer] || ''
            return !optionContent.trim()
          })
          if (emptyOptions.length > 0) {
            validationError = '请确保所有选择的选项内容不为空'
          }
        }
      } else if (curSelect === 3) { // 判断题
        // 检查是否选择了答案
        if (!judgeAnswer) {
          validationError = '请选择判断题答案'
        }
      } else if (curSelect === 4) { // 填空题
        // 检查是否输入了答案
        if (!blankAnswer.trim()) {
          validationError = '请输入填空题答案'
        }
      }
      
      // 如果有验证错误，抛出错误信息
      if (validationError) {
        message.error(`${validationError}`)
        return
      }
      
      // 获取选中的答案内容
      let answerContent: string | string[] = ''
      if (curSelect === 4) {
        // 填空题：直接使用输入的答案内容
        answerContent = blankAnswer
      } else if (Array.isArray(selectedAnswer)) {
        // 多选题：获取所有选中选项的内容
        answerContent = selectedAnswer.map(answer => options[answer] || '')
      } else {
        // 单选题/判断题：获取单个选中选项的内容
        const answerValue = curSelect === 3 ? judgeAnswer : (selectedAnswer as number)
        answerContent = options[answerValue] || ''
      }
      
      // 构造最终提交的数据
      const submitData = {
        ...values,
        answer: answerContent,
        // 可以根据需要添加判断题的答案变量
        judgeAnswer
      }
      
      console.log('选中的答案：', answerContent)
      console.log('所有表单数据：', values)
      console.log('选项内容：', options)
      console.log('选中的答案索引：', curSelect === 3 ? judgeAnswer : selectedAnswer)
      console.log('判断题答案变量1：', judgeAnswer)
      console.log('填空题答案：', blankAnswer)
      console.log('最终提交数据：', submitData)
      
      // 这里可以添加实际的提交逻辑
      // submitDataToServer(submitData)
    }).catch(errorInfo => {
      message.error(errorInfo.message)
    })
  }
  return (
    <Form form={form} layout='vertical' requiredMark={true} className={style.form}>
      <Row gutter={18}>
        <Col span={9}>
          <Form.Item name="type" label="题型" rules={[{required: true, message: '请选择题型'}]} className={style.select}>
            <Select 
              options={formatMenuList(typeData)} 
              placeholder="请选择题型"
              onChange={value => {
                setCurSelect(value)
                // 题型切换时，重置选中答案为正确的类型
                if (value === 2) { // 多选题
                  setSelectedAnswer([]) // 多选题默认空数组
                } else if (value === 3) { // 判断题
                  setJudgeAnswer(1) // 判断题答案变量1默认值为1
                } else if (value === 4) { // 填空题
                  setBlankAnswer('') // 填空题默认空字符串
                } else { // 单选题
                  setSelectedAnswer(1) // 单选题默认选中第一个选项
                }
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
      <OptionRenderer
        curSelect={curSelect}
        selectedAnswer={curSelect === 3 ? judgeAnswer : selectedAnswer}
        options={options}
        blankAnswer={blankAnswer}
        handleOptionChange={handleOptionChange}
        handleRadioAnswerChange={handleRadioAnswerChange}
        handleCheckboxAnswerChange={handleCheckboxAnswerChange}
        handleBlankAnswerChange={handleBlankAnswerChange}
      />
      <Col span={8}>
        <Form.Item label='解析' rules={[{required: true, message: '请输入解析内容'}]}>
          <Input.TextArea rows={3} placeholder='请输入解析'/>
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