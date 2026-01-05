import type { UEParams } from '@/services/type'
import { ProFormDateTimeRangePicker, ProFormSelect } from '@ant-design/pro-components'
import { Form, Input, Modal, type FormInstance } from 'antd'
import React from 'react'



interface Props {
  form: FormInstance<UEParams>,
  isEdit: boolean,
  prohibit: boolean,
  subOptions: {label: string, value: string}[],
  userOptions: {label: string, value: string}[],
  groupOptions: {label: string, value: string}[],
  onHandleOk: () => void,
  onHandleCancel: () => void
}


const Edit: React.FC<Props> = ({
  form,
  isEdit,
  prohibit,
  subOptions,
  userOptions,
  groupOptions,
  onHandleOk,
  onHandleCancel
}) => {
  return (
    <div>
      <Modal
        title='编辑'
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isEdit}
        onOk={onHandleOk}
        onCancel={onHandleCancel}
      >
        <Form
          form={form}
          name="edit"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入考试名称!' }]}
          >
            <Input
              placeholder="name"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item name="classify" rules={[{ required: true, message: '请选择科目!' }]}>
            <ProFormSelect
              label="科目分类"
              options={subOptions}
              placeholder="请选择"
            />
          </Form.Item>
          
          <Form.Item
            name="examiner"
            rules={[{ required: true, message: '请选择监考人!' }]}
          >
            <ProFormSelect
              mode="multiple"
              label="监考人"
              options={userOptions}
            />
          </Form.Item>

          <Form.Item
            name="group"
            rules={[{ required: true, message: '请选择考试班级!' }]}
          >
            <ProFormSelect
              mode="multiple"
              label="考试班级"
              options={groupOptions}
            />
          </Form.Item>

          <Form.Item
            name="dateTime"
            rules={[{ required: true }]}
          >
            <ProFormDateTimeRangePicker disabled={prohibit} name="dateTime" label="考试时间" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Edit