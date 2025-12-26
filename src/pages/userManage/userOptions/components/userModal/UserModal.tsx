import React, { useEffect, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { Form, Input, Select, Space } from 'antd'
import { userRoleApi, roleUpdateApi } from '@/services'
import type { UserInfo } from '@/services/type'


interface Props {
  onEdit: (params: UserInfo) => void
  originInfo: UserInfo
  setIsModalOpen: (p: boolean) => void
  isModalOpen: boolean
  mode: string,
  onCreate: (params: UserInfo) => void
}

const UserModal:React.FC<Props> = ({onEdit, originInfo, setIsModalOpen, isModalOpen, mode, onCreate}) => {
  
  const tailLayout = {
    wrapperCol: { offset: 16, span: 8 },
  }
  const [form] = Form.useForm()

  const [roleList, setRoleList] = useState([])

  const onGenderChange = (value: string) => {
    switch (value) {
    case '1':
      form.setFieldsValue({ note: 'Hi, man!' })
      break
    case '0':
      form.setFieldsValue({ note: 'Hi, lady!' })
      break
    default:
    }
  }

  const onFinish = (values) => {
    console.log(values)
    if(mode === 'edit'){
      onEdit(values)
    }else if(mode === 'create'){
      onCreate(values)
    }else if(mode === 'distribute'){
      roleSet(values)
    }
    form.resetFields()
    setIsModalOpen(false)
  }

  const onReset = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const initEdit = () => {
    form.setFieldsValue(originInfo)
  }

  useEffect(() => {
    if(isModalOpen && originInfo && mode === 'edit'){
      initEdit()
    }
  },[isModalOpen, originInfo])

  const getRoleList = async() =>{
    try {
      const res = await userRoleApi()
      console.log(res.data)
      console.log(111)
      
      const options = res.data.data.list.map((item) => {
        return {
          label: item.name,
          value: item.value}
      })
      console.log(options)
      
      setRoleList(options)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(mode === 'distribute' && mode){
      Promise.resolve().then(() => {
        getRoleList()
      })
    }
  },[isModalOpen, mode])
  const onRoleChange = (value: string) => {
    // roleList.map((item) => {
    //   form.setFieldsValue(item.value)
    // })
    console.log(value) 
  }
  const roleSet = async(values) => {
    console.log(111)
    
    try {
      const res = await roleUpdateApi(values.value)
      console.log(res.data)
      if(res.data.code === 200){
        message.success('分配成功')
      }else{
        message.error('分配失败')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      {mode !== 'distribute' ? <Modal
        title={mode === 'create' ? '创建用户' : '编辑用户'}
        closable={false}
        open={isModalOpen}
        footer={false}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
            <Select
              allowClear
              placeholder="请选择"
              onChange={onGenderChange}
              options={[
                { label: '男', value: '1' },
                { label: '女', value: '0' },
              ]}
            />
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType='submit'>
                提交
              </Button>
              <Button htmlType="button" onClick={onReset}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
        : 
        <Modal 
          title='分配角色'
          closable={false}
          open={isModalOpen}
          footer={false}>
          <Form
            form={form}
            onFinish={onFinish}
          >
            <Form.Item name="name" label="角色" rules={[{ required: true }]}>
              <Select
                allowClear
                placeholder="请选择"
                onChange={onRoleChange}
                options={roleList}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType='submit'>
                  提交
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>}
    </div>
  )
}

export default UserModal