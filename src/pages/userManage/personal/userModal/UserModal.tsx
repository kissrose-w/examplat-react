import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Select, Space, message } from 'antd'
import { personalEditApi } from '@/services'
import type { PersonalP } from '@/services'
import { useUserStore } from '@/store/userStore'
import{ API_CODE } from '@/constants'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (p: boolean) => void
}

const UserModal: React.FC<Props> = ({isModalOpen, setIsModalOpen}) => {
  const { userInfo, getUserInfo } = useUserStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
 
  useEffect(() => {
    if (userInfo && isModalOpen) { 
      form.setFieldsValue(userInfo)
    }
  }, [form, userInfo, isModalOpen])
  
  const handleCancel = () => {
    form.resetFields()
    form.setFieldsValue(userInfo)
    setIsModalOpen(false)
  }
 
  const onFinish = async(values: PersonalP) => {
    await editPersonalInfo(values)
    getUserInfo()
    setIsModalOpen(false)
  }

  const onReset = () => {
    form.resetFields()
    form.setFieldsValue(userInfo)
  }

  const editPersonalInfo = async(params: PersonalP) => {
    setLoading(true)
    try {
      const res = await personalEditApi(params)
      if(res.data.code === API_CODE.SUCCESS ){
        message.success('修改信息成功')
      }else{
        message.error(res.data.msg)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Modal
        title="编辑信息"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        loading={loading}
      >
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item name="id" initialValue={userInfo?._id}  hidden>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
            <Select
              allowClear
              placeholder="请选择性别"
              options={[
                { label: '男', value: 1 },
                { label: '女', value: 0 }
              ]}
            />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal></div>
  )
}

export default UserModal