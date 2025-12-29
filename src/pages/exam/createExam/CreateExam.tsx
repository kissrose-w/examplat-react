import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ProFormInstance } from '@ant-design/pro-components'
import {
  ProCard,
  ProFormCheckbox,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProTable
} from '@ant-design/pro-components'
import { message } from 'antd'
import {
  getSubjectApi,
  usersListApi,
  getGroupListApi,
  getTestPaperList
} from '@/services'
import type { GroupItem, SearchSubjectList, TestListItem, UserInfo } from '@/services/type'
import style from './createExam.module.scss'



const CreateExam = () => {

  const formRef = useRef<ProFormInstance>(null)
  const [subList, setSubList] = useState<SearchSubjectList[]>()
  const [userList, setUserList] = useState<UserInfo[]>()
  const [groupList, setGroupList] = useState<GroupItem[]>()
  const [paperList, setPaperList] = useState<TestListItem[]>()
  const [selected, setSelected] = useState()

  // 获取各个数据列表
  const getSubject = async () => {
    try {
      const res = await getSubjectApi()
      const userRes = await usersListApi()
      const groupRes = await getGroupListApi()
      const paperRes = await getTestPaperList()
      console.log(res)
      console.log(userRes)
      console.log(groupRes)
      console.log(paperRes)
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
    return paperList?.map(item => {
      return {
        ...item,
        key: item._id
      }
    })
  }, [paperList])


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

  return (
    <div>
      <ProCard>
        <StepsForm<{
          name: string
        }>
          formRef={formRef}
          onFinish={async () => {
            message.success('提交成功')
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          {/* 考试基本信息 */}
          <StepsForm.StepForm<{
            name: string
          }>
            name="base"
            title="考试基本信息"
            
            onFinish={async () => {
              console.log(formRef.current?.getFieldsValue())
              return true
            }}
          >
            <ProFormText
              name="name"
              label="考试名称"
              width="md"
              tooltip="最长为 24 位，用于标定的唯一 id"
              placeholder="请输入名称"
              // rules={[{ required: true }]}
            />
            <ProFormDateTimeRangePicker name="dateTime" label="考试时间" />
            <ProFormSelect
              label="科目分类"
              name='classify'
              options={subOptions}
              placeholder="请选择"
            />
            <ProFormSelect
              label="监考人"
              name='examin'
              options={userOptions}
            />
            <ProFormSelect
              label="考试班级"
              name='group'
              options={groupOptions}
            />
          </StepsForm.StepForm>
          {/* 配置试卷 */}
          <StepsForm.StepForm<{
            radio: string
          }>
            name="radio"
            title="配置试卷"
            onFinish={async (values) => {
              console.log(values)
              console.log(formRef.current?.getFieldsValue())
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
                  formRef.current?.setFieldsValue({
                    examId: key[0],
                  })
                }
              }}
              tableAlertRender={false}
            />
            
          </StepsForm.StepForm>
          {/* 发布考试 */}
          <StepsForm.StepForm
            name="time"
            title="发布考试"
          >
            <ProFormCheckbox.Group
              name="checkbox"
              label="部署单元"
              rules={[
                {
                  required: true,
                },
              ]}
              options={['部署单元1', '部署单元2', '部署单元3']}
            />
            <ProFormSelect
              label="部署分组策略"
              name="remark"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue="1"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
            <ProFormSelect
              label="Pod 调度策略"
              name="remark2"
              initialValue="2"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </div>
  )
}

export default CreateExam