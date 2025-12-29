import { API_CODE } from '@/constants'
import { getClassifyList, getTestPaperDetail } from '@/services'
import type { ClassifyItem } from '@/services/type'
import {
  ProCard,
  ProFormDatePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components'
import { Button, message, Segmented, Modal } from 'antd'
import { useEffect, useState } from 'react'
import style from './CreatePaper.module.scss'

const CreatePaper = () => {
  const [loading,setLoading] = useState(false)
  const [list, setList] = useState<ClassifyItem[]>([])
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setLoading(true)
      setTimeout(() => {
        resolve(true)
        setLoading(false)
      }, time)
    })
  }
  const [showQues, setShowQues] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectValue, setSelectValue] = useState<string>('')

  // 创建类型
  useEffect(() => {
    const getList = async () => {
      try {
        const res = await getClassifyList({ page: 1, pagesize: 2 })
        console.log(res)
        if (res.data.code === API_CODE.SUCCESS) {
          setList(res.data.data.list)
        } else {
          message.error(res.data.msg)
        }
      } catch(e) {
        console.log(e)
      }
    }
    getList()
  }, [])

  // 选择试题
  const getDetail = async (id: string) => {
    try {
      const res = await getTestPaperDetail(id)
      console.log(res)
    } catch(e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getDetail(selectValue)
  }, [isModalOpen])

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
    setSelectValue(value)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <ProCard>
      <StepsForm<{
        name: string
      }>
        onFinish={async (values) => {
          console.log(values)
          await waitTime(1000)
          message.success('提交成功')
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
                  onClick={() => props.onSubmit?.()}
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
            options={['选题组件', '随机组件']} 
            style={{marginBottom: 30}} 
            block 
            onChange={() => setShowQues(!showQues)}
          />
          {!showQues ? 
            <div>
              <Button block style={{marginBottom: 30}} type="primary" onClick={showModal}>
                选择试题
              </Button>
              <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>Some contents...</p>
              </Modal>
            </div> : 
            <div>111</div>
          }
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="展示试卷基本信息">

        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  )
}

export default CreatePaper