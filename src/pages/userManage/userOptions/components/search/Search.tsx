import React from 'react'
import { Button, Form, Input, Select, Space } from 'antd'
import style from './Search.module.scss'

interface Props {
  setIsModalOpen: (p: boolean) => void
  setMode: (p: string) => void
  getSearchP: (p:{
    username: string,
    status: string
  }) => void
}

const Search: React.FC<Props> = ({setIsModalOpen, setMode, getSearchP}) => {
  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // }

  // const tailLayout = {
  //   wrapperCol: { offset: 16, span: 8 },
  // }
  const [form] = Form.useForm()

  const onGenderChange = (value: string) => {
    switch (value) {
    case '1':
      form.setFieldsValue({ note: '开' })
      break
    case '0':
      form.setFieldsValue({ note: '关' })
      break
    default:
    }
  }

  const onFinish = (values: unknown) => {
    // console.log(values) 
    getSearchP(values)
  }

  const onReset = () => {
    form.resetFields()
    getSearchP({})
  }
  return (
    <div className={style.box}>
      <Form
        className={style.search}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        
        <Form.Item name="username" label="用户名" >
          <Input placeholder="请输入" style={{width: 160}}/>
        </Form.Item>

        <Form.Item name="status" label="启用状态" >
          <Select
            style={{width: 160}}
            placeholder="请选择"
            onChange={onGenderChange}
            options={[
              { label: '关', value: '0' },
              { label: '开', value: '1' },
            ]}
          />
        </Form.Item>
        
        <Form.Item >
          <Space>
            <Button type="primary" htmlType='submit'>
              查询
            </Button>
            <Button onClick={onReset}>
              重置
            </Button>
            <Button type="primary" onClick={() => {
              setIsModalOpen(true)
              setMode('create')
            }}>
              创建用户
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Search