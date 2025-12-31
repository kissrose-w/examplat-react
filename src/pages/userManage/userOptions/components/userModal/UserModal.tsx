import React, { useCallback, useEffect, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { Form, Input, Select, Space } from 'antd'
import { userRoleApi, userEditApi } from '@/services'
// import type { UserInfo } from '@/services/type'
import type {UserCreateParams, UserEditParams} from '@/services'

interface Props {
  onEdit: (params: UserEditParams) => void
  originInfo: UserEditParams
  setIsModalOpen: (p: boolean) => void
  isModalOpen: boolean
  mode: string,
  onCreate: (params: UserCreateParams) => void
}

const UserModal:React.FC<Props> = ({onEdit, originInfo, setIsModalOpen, isModalOpen, mode, onCreate}) => {
  
  const tailLayout = {
    wrapperCol: { offset: 16, span: 8 },
  }
  const [form] = Form.useForm()

  const [roleList, setRoleList] = useState<{ label: string; value: string; }[]>([])

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

  const onFinish = (values: UserEditParams) => {
    // console.log(values)
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

  const initEdit = useCallback(() => {
    form.setFieldsValue(originInfo)
  },[form, originInfo])

  useEffect(() => {
    if(isModalOpen && originInfo && mode === 'edit'){
      initEdit()
    }
  },[isModalOpen, originInfo, initEdit, mode])

  const getRoleList = async() =>{
    try {
      const res = await userRoleApi()
      // console.log(res.data)
      // console.log(111)
      const options = res.data.data.list.map((item) => {
        return {
          label: item.name,
          value: item._id
        }
      })
      // console.log(options)
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
  // const onRoleChange = (value: string) => {
  //   // return roleList.map((item) => {
  //   //   form.setFieldsValue(item.value)
  //   // })
  //   // console.log(value) 
  // }

  const roleSet = async(values: { name?: string }) => {
    // console.log(111)
    try {
      // const res = await roleUpdateApi({
      //   id: originInfo.id,
      //   name: values.name
      // })
      // console.log(res.data)
      const res = await userEditApi({
        id: originInfo.id,
        role: [values.name || '']
      })
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
          <Form.Item name="id" initialValue={originInfo.id} hidden>
            <Input />
          </Form.Item>
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
                // onChange={onRoleChange}
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