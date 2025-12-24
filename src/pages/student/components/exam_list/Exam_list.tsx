import { useState } from 'react'
import style from './Exam_list.module.scss'
import { Form, Input, Select, Button } from 'antd'

const Exam_list = () => {

  return (
    <Form
      labelAlign='right'
    >
      <Form.Item
        name='name'
        label='名字'
        rules={[
          {
            required: true,
            message: 'Input something!',
          },
        ]}
      >
        <Input placeholder="placeholder" />
      </Form.Item>
      <Form.Item
        name='1'
        label='2'
        rules={[
          {
            required: true,
            message: 'Select something!',
          },
        ]}
        initialValue="1"
      >
        <Select
          options={[
            {
              value: '1',
              label: 'longlonglonglonglonglonglong',
            },
            {
              value: '2',
              label: '222',
            },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default Exam_list