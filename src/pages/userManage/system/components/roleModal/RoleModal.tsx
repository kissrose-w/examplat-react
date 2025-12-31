import React, {useState} from 'react'
import { Button, Modal, Form, Input, Space } from 'antd'
import type { RoleCreateP } from '@/services'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (p: boolean) => void
  onCreate: (p: RoleCreateP) => void
}
const RoleModal:React.FC<Props> = ({isModalOpen, setIsModalOpen, onCreate}) => {
  
  const tailLayout = {
    wrapperCol: { offset: 16, span: 8 },
  }
  const [form] = Form.useForm()

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = (values) => {
    // console.log(values)
    onCreate(values)
    form.resetFields()
    setIsModalOpen(false)
  }

  const onReset = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  return (
    <div> 
      <Modal
        title="创建角色"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="_id" label="id" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="角色" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item name="creator" label="创建者" rules={[{ required: true }]}>
            <Input />
          </Form.Item> */}
          <Form.Item name="createAt" label="创建时间" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="拥有权限" rules={[{ required: true }]}>
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
    </div>
  )
}

export default RoleModal