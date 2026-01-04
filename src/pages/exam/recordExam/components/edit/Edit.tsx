import type { UEParams } from '@/services/type'
import { ProFormSelect } from '@ant-design/pro-components'
import { Form, Input, Modal, type FormInstance } from 'antd'
import React from 'react'



interface Props {
  form: FormInstance<UEParams>,
  isEdit: boolean,
  subOptions: {label: string, value: string}[],
  userOptions: {label: string, value: string}[],
  onHandleOk: () => void,
  onHandleCancel: () => void
}


const Edit: React.FC<Props> = ({
  form,
  isEdit,
  subOptions,
  userOptions,
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
              // name='classify'
              options={subOptions}
              placeholder="请选择"
              // rules={[{ required: true }]}
              // onChange={(val: string) => {onSaveCur(val)}}
            />
          </Form.Item>
          
          <Form.Item
            name="examiner"
            rules={[{ required: true, message: '请选择监考人!' }]}
          >
            <ProFormSelect
              // className={style.multiple}
              mode="multiple"
              label="监考人"
              // name='examiner'
              options={userOptions}
              // rules={[{ required: true }]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Edit