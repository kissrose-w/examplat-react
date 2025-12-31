import { API_CODE } from '@/constants'
import { createTestPaper, getQuestionsListApi } from '@/services'
import type { QuestionData } from '@/services/type'
import {
  ProCard,
  ProFormDatePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components'
import { Button, message, Segmented, Modal, Input } from 'antd'
import { useEffect, useState } from 'react'
import Choice from './choice/Choice'
import { createListInfo } from '@/store/CreatePaper'
import BaseInfo from './baseInfo/baseInfo'

const CreatePaper = () => {
  const [loading,setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [randomQuestionCount, setRandomQuestionCount] = useState<number>(0) // 随机组卷数量
  const [showQues, setShowQues] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [name, setName] = useState('')
  const { testList: list, getList} = createListInfo() // 创建类型
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setLoading(true)
      setTimeout(() => {
        resolve(true)
        setLoading(false)
      }, time)
    })
  }
  
  useEffect(() => {
    getList()
  }, [getList])

  // 选择科目
  const onChange = async (value: string) => {
    console.log(`selected ${value}`)
    setSelectValue(value)
    // 清空之前选中的题目
    setSelectedQuestions([])
    
    // 根据科目获取题目
    if (value) {
      try {
        const res = await getQuestionsListApi({ 
          page: 1, 
          pagesize: 100, 
          classify: value 
        })
        if (res.data.code === API_CODE.SUCCESS) {
          console.log(res.data.data.list)
          setQuestions(res.data.data.list || [])
        } else {
          message.error(res.data.msg)
        }
      } catch(e) {
        console.error('获取题目失败：', e)
        message.error('获取题目失败')
      }
    } else {
      setQuestions([])
    }
  }

  // 点击选择试题
  const showModal = () => {
    setIsModalOpen(true)
  }

  // 处理题目选择
  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        // 取消选择
        return prev.filter(id => id !== questionId)
      } else {
        // 选择题目
        return [...prev, questionId]
      }
    })
  }

  // 随机抽取指定数量的不重复试题
  const randomSelectQuestions = (count: number) => {
    // 复制原数组，避免修改原数组
    const shuffledQuestions = [...questions]
    
    // 使用Fisher-Yates洗牌算法
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]
    }
    
    // 取前count个试题的ID
    const selectedIds = shuffledQuestions.slice(0, count).map(q => q._id)
    if (selectedIds) {
      // 更新选中的试题
      setSelectedQuestions(selectedIds)
      
      // 提示用户抽取结果
      return message.success(`成功随机抽取了 ${selectedIds.length} 道试题`)
    }
    return message.error('抽取失败，请重新抽取')
  }

  // 对话框确认
  const handleOk = () => {
    setIsModalOpen(false)
  }

  // 对话框取消
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // 点击提交
  const onSubmit = async () => {
    // 验证是否选择了题目
    if (selectedQuestions.length === 0) {
      message.error('请至少选择一道题目')
      return
    }
    
    const params = {
      name,
      classify: selectValue,
      questions: selectedQuestions
    }
    try {
      const res = await createTestPaper(params)
      if (res.data.code === API_CODE.SUCCESS) {
        console.log(res)
        message.success('试卷创建成功')
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
      message.error('创建试卷失败')
    }
  }
  
  return (
    <ProCard>
      <StepsForm<{
        name: string
      }>
        onFinish={async (values) => {
          console.log(values)
          await waitTime(1000)
          onSubmit()
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return (
                <Button loading={loading} type="primary" onClick={() => props.onSubmit?.()}>
                  去第二步 {'>'}
                </Button>
              )
            }
            if (props.step === 1) {
              return [
                <Button key="pre" onClick={() => props.onPre?.()}>
                  返回第一步
                </Button>,
                <Button
                  type="primary"
                  key="goToTree"
                  onClick={() => {
                    // 校验有没有选择试题
                    if (selectedQuestions.length === 0) {
                      message.error('请至少选择一道题目')
                      return
                    }
                    // 校验通过，进入第三步
                    props.onSubmit?.()
                  }}
                >
                  去第三步 {'>'}
                </Button>,
              ]
            }
            return [
              <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                {'<'} 返回第二步
              </Button>,
              <Button
                type="primary"
                key="goToTree"
                onClick={() => props.onSubmit?.()}
                loading={loading}
              >
                提交 √
              </Button>,
            ]
          },
        }}
      >
        <StepsForm.StepForm<{
          name: string
        }>
          name="base"
          title="试卷基础信息"
          onFinish={async ({ name }) => {
            console.log(name)
            await waitTime(1000)
            setName(name)
            return true
          }}
        >
          <ProFormText
            name="name"
            label="试卷名称"
            width="md"
            tooltip="最长为 24 位，用于标定的唯一 id"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormDatePicker name="date" label="创建日期" />
          <ProFormDateTimeRangePicker  name="dateTime" label="考试时长" />
          <ProFormTextArea
            name="remark"
            label="备注"
            width="lg"
            placeholder="请输入备注"
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          subject: string
        }>
          name="checkbox"
          title="选择组卷方式&科目"
        >
          <ProFormSelect
            name="subject"
            label="科目"
            width="lg"
            tooltip="选择试卷所属科目"
            placeholder="请选择科目"
            rules={[{ required: true, message: '请选择科目' }]}
            showSearch={{ optionFilterProp: 'label' }}
            onChange={onChange}
            options={list.map(item => ({
              value: item._id,
              label: item.name
            }))}
          />
          <Segmented<string | number>
            options={['选题组卷', '随机组卷']} 
            style={{marginBottom: 20}} 
            block 
            onChange={() => setShowQues(!showQues)}
          />
          {!showQues ? 
            <div>
              <Button block style={{marginBottom: 30}} type="primary" onClick={showModal}>
              选择试题
              </Button>
              <Modal
                title={`选择试题 (已选择 ${selectedQuestions.length} 题)`}
                closable={true}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    取消
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleOk}>
                    确认选择
                  </Button>,
                ]}
              >
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                  {questions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>暂无题目</p>
                  ) : (
                    questions.map(question => (
                      <Choice
                        key={question._id}
                        question={question} 
                        handleQuestionSelect={handleQuestionSelect}
                        selectedQuestions={selectedQuestions}
                      />
                    ))
                  )}
                </div>
              </Modal>
            </div> : 
            <div>
              <div style={{ marginBottom: 20 }}>
                试题数量：
                <span style={{ color: '#1890ff', marginLeft: 8 }}>
                  当前科目下共有 {questions.length} 道试题，最多可选择 {questions.length} 道
                </span>
              </div>
              <Input.Search
                type="number"
                min={1}
                max={questions.length}
                value={randomQuestionCount}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0
                  setRandomQuestionCount(count)
                }}
                onSearch={(value) => {
                  const count = parseInt(value) || 0
                  // 校验数字是否超过试题最大长度
                  if (count > questions.length) {
                    message.error(`试题数量不能超过 ${questions.length}，当前科目下只有 ${questions.length} 道试题`)
                    return
                  }
                  if (count < 1) {
                    message.error('试题数量不能小于 1')
                    return
                  }
                  // 执行随机抽取
                  randomSelectQuestions(count)
                }}
                allowClear
                style={{width: 150, marginBottom: 10}}
                enterButton="确定"
                placeholder="请输入数量"
              />
              <div style={{ marginBottom: 10, color: '#666', fontSize: 12 }}>
                已选择 {selectedQuestions.length} 道试题
              </div>
            </div>
          }
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="展示试卷基本信息">
          {/* 展示试卷基本信息 */}
          <BaseInfo 
            name={name} 
            subjectName={list.find(item => item._id === selectValue)?.name || ''} 
            questions={questions.filter(q => selectedQuestions.includes(q._id))} 
            showQues={showQues}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  )
}

export default CreatePaper