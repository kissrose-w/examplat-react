import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import type { ProFormInstance } from '@ant-design/pro-components'
import {
  ProCard,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProTable,
} from '@ant-design/pro-components'
import { message } from 'antd'
import {
  getSubjectApi,
  usersListApi,
  getGroupListApi,
  getTestPaperList,
  createExamApi
} from '@/services'
import type { CreateExamination, GroupItem, SearchSubjectList, TestListItem, UserInfo } from '@/services/type'
import style from './createExam.module.scss'
import Public from './components/public/Public'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'



const CreateExam = () => {

  const formRef = useRef<ProFormInstance>(null)
  const [subList, setSubList] = useState<SearchSubjectList[]>()
  const [userList, setUserList] = useState<UserInfo[]>()
  const [groupList, setGroupList] = useState<GroupItem[]>()
  const [paperList, setPaperList] = useState<TestListItem[]>()
  const [crParams, setCrParams] = useState<CreateExamination>({
    name: '',
    classify: '',
    examId: '',
    group: '',
    examiner: '',
    startTime: '',
    endTime: ''
  })
  const [curSub, setCurSub] = useState<string>()
  const navigate = useNavigate()

  // 获取各个数据列表
  const getSubject = async () => {
    try {
      const res = await getSubjectApi()
      const userRes = await usersListApi()
      const groupRes = await getGroupListApi()
      const paperRes = await getTestPaperList()
      // console.log(res)
      // console.log(userRes)
      // console.log(groupRes)
      // console.log(paperRes)
      Promise.resolve().then(() => {
        setSubList(res.data.data.list)
        setUserList(userRes.data.data.list)
        setGroupList(groupRes.data.data.list)
        setPaperList(paperRes.data.data.list)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // 进页面调用
  useEffect(() => {
    getSubject()
  }, [])

  // 提取更改符合options的数据格式
  const subOptions = useMemo(() => {
    return subList?.map(item => {
      return {
        value: item.name,
        label: item.name
      }
    })
  }, [subList])

  const userOptions = useMemo(() => {
    return userList?.map(item => {
      return {
        label: item.username,
        value: item.username
      }
    })
  }, [userList])

  const groupOptions = useMemo(() => {
    return groupList?.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    })
  }, [groupList])

  const paperOptions = useMemo(() => {
    const filPapers = paperList?.filter(v => v.classify === curSub)
    return filPapers?.map(item => {
      return {
        ...item,
        key: item._id
      }
    })
  }, [paperList, curSub])


  // 配置试卷中表格列项
  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: '科目分类',
      dataIndex: 'classify',
      key: 'classify',
      width: 250
    },
    {
      title: '试卷创建立人',
      dataIndex: 'creator',
      key: 'creator',
      width: 250
    },
    {
      title: '试卷创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }
  ]


  // 提交后调用创建考试
  const createExam = async (params: CreateExamination) => {
    const start = (Date.parse(params.startTime)) + ''
    const end = (Date.parse(params.endTime)) + ''
    const cPa = {
      ...params,
      startTime: start,
      endTime: end
    } as CreateExamination
    try {
      const res = await createExamApi(cPa)
      console.log(res)
      if(res.data.code === API_CODE.SUCCESS){
        message.success(res.data.msg)
        navigate('/exam/record')
        formRef.current?.resetFields()
      } else {
        message.error(res.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <ProCard>
        <StepsForm<CreateExamination>
          formRef={formRef}
          onFinish={async () => {
            message.success('提交成功')
            console.log(crParams)
            createExam(crParams)
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          {/* 考试基本信息 */}
          <StepsForm.StepForm<CreateExamination>
            title="考试基本信息"
            
            onFinish={async () => {
              console.log(formRef.current?.getFieldsValue())
              const base = formRef.current?.getFieldsValue()
              // 转换dateTime为startTime和endTime字符串
              const startTimeStr = dayjs(base.dateTime[0]).format('YYYY-MM-DD HH:mm:ss')
              const endTimeStr = dayjs(base.dateTime[1]).format('YYYY-MM-DD HH:mm:ss')
              // 移除原始dateTime字段，避免React渲染dayjs对象
              const { dateTime, ...rest } = base
              const updatedValues = {
                ...rest,
                startTime: startTimeStr,
                endTime: endTimeStr
              }
              formRef.current?.setFieldsValue(updatedValues)
              setCrParams(updatedValues)
              console.log(updatedValues)
              
              return true
            }}
          >
            <ProFormText
              name="name"
              label="考试名称"
              width="md"
              tooltip="最长为 24 位，用于标定的唯一 id"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />
            <ProFormDateTimeRangePicker rules={[{ required: true }]} name="dateTime" label="考试时间" />
            <ProFormSelect
              label="科目分类"
              name='classify'
              options={subOptions}
              placeholder="请选择"
              rules={[{ required: true }]}
              onChange={(val: string) => {
                // console.log(val)
                setCurSub(val)
              }}
            />
            <ProFormSelect
              label="监考人"
              name='examiner'
              options={userOptions}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="考试班级"
              name='group'
              options={groupOptions}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
          {/* 配置试卷 */}
          <StepsForm.StepForm<CreateExamination>
            title="配置试卷"
            onFinish={async () => {
              const id = formRef.current?.getFieldValue('examId')
              console.log(formRef.current?.getFieldValue('examId'))
              if(!id) {
                message.error('请选择试卷')
                return false
              }
              
              formRef.current?.setFieldsValue({
                examId: id
              })
              // 更新crParams状态，确保包含当前步骤的数据
              setCrParams(prev => ({
                ...prev,
                examId: id
              }))
              console.log(formRef.current?.getFieldsValue())
              console.log(crParams)
              return true
            }}
          >
            <ProTable
              className={style.proTable}
              columns={columns}
              dataSource={paperOptions}
              rowKey="key"
              
              pagination={{
                pageSize: 8,
                showQuickJumper: true,
              }}
              search={false}
              dateFormatter="string"
              options={false}
              rowSelection={{
                type: 'radio',
                onChange: (key) => {
                  console.log(key)
                  formRef.current?.setFieldValue('examId', key[0])
                  setCrParams(prev => {
                    return {
                      ...prev,
                      examId: key[0] + ''
                    }
                  })
                }
              }}
              tableAlertRender={false}
            />
            
          </StepsForm.StepForm>
          {/* 发布考试 */}
          <StepsForm.StepForm<CreateExamination>
            title="发布考试"
            onFinish={async () => {
              console.log(crParams)
              return true
            }}
          >
            <Public examInfo={crParams} groups={groupList || []} />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </div>
  )
}

export default CreateExam