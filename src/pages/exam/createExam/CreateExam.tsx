import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import type { ProFormInstance } from '@ant-design/pro-components'
import {
  ProCard,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components'
import { message } from 'antd'
import {
  getSubjectApi,
  usersListApi,
  getGroupListApi,
  getTestPaperList,
  createExamApi,
  type UsersListResponse
} from '@/services'
import type { CreateExamination, GroupItem, SearchSubjectList, TestListItem } from '@/services/type'
import Public from './components/public/Public'
import Config from './components/config/Config'
import BaseInfo from './components/baseInfo/BaseInfo'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'



const CreateExam = () => {

  const formRef = useRef<ProFormInstance>(null)
  const [subList, setSubList] = useState<SearchSubjectList[]>()
  const [userList, setUserList] = useState<UsersListResponse[]>()
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
  const [curId, setCurId] = useState<string>()
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
    const filPapers = paperList?.filter(v => v.classify._id === curId)
    console.log(filPapers, curId)
    return filPapers?.map(item => {
      return {
        ...item,
        key: item._id
      }
    }) as (TestListItem & {key: string})[]
  }, [paperList, curId])


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
      width: 250,
      render: (_: {
        _id: string,
        name: string
      }) => {
        return _.name
      }
    },
    {
      title: '试卷创建立人',
      dataIndex: 'creator',
      key: 'creator',
      width: 250
    },
    {
      title: '试卷创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: string) => {
        return dayjs(_).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]


  const saveCur = (val: string) => {
    setCurSub(val)
    setCurId(subList?.find(v => v.name === val)?._id)
  }

  // 第一步结束后执行，格式化数据
  const onfinishNext = async () => {
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
  }

  // 提交后调用创建考试
  const createExam = async (params: CreateExamination) => {
    const start = (dayjs(params.startTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
    const end = (dayjs(params.endTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
    const cPa = {
      ...params,
      startTime: start,
      endTime: end,
      classify: curId
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
            // message.success('提交成功')
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
            
            onFinish={onfinishNext}
          >

            <BaseInfo
              subOptions={subOptions}
              userOptions={userOptions}
              groupOptions={groupOptions}
              onSaveCur={saveCur}
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
            <Config
              columns={columns}
              paperOptions={paperOptions}
              formRef={formRef}
              onSaveId={setCrParams}
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