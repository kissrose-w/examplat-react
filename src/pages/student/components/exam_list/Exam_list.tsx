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
        <Input placeholder="名字" />
      </Form.Item>
      <Form.Item
        name='sex'
        label='性别'
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
              label: '男',
            },
            {
              value: '0',
              label: '女',
            },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default Exam_list