import React, { useEffect } from 'react'
import { Button, Modal, Form, Input, Space  } from 'antd'
import type { FormProps } from 'antd'
import type { FieldType } from '@/services/type'
import type { DataType } from '../CreateSubject'
interface Props{
  onChange: (isModalOpen: boolean) => void
  isModalOpen : boolean
  onCreat: (values:FieldType) => void
  editData?: DataType | null
  onEdit:(values: FieldType) => void
}

const Dialog:React.FC<Props> = ({onChange, isModalOpen, onCreat, editData, onEdit}) => {
  const isEdit = !!editData
  const [form] = Form.useForm()
  useEffect(() => {
    if(isModalOpen){
      if(isEdit){
        form.setFieldsValue({
          name: editData.name || '',
          value: editData.value || ''
        })
      }else{
        form.resetFields()
      }
    }
  },[editData,isModalOpen,form])
  const handleCancel = () => {
    onChange(false)
    form.resetFields()
  }
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
    onChange(false)
    if(isEdit){
      onEdit(values)
    }else{
      onCreat(values)
    }
    form.resetFields()
  }
    
  return (
    <>
      <Modal
        title={isEdit ? '编辑科目' : '创建科目'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer= {false}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4}}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 500 ,marginTop: 30}}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="科目名称"
            name="name"
            rules={[{ required: true, message: '请输入科目名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="科目内容"
            name="value"
            rules={[{ required: true, message: '请输入科目描述' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null} style={{ textAlign: 'right',marginTop: 35 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Dialog