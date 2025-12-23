// 登录页
import React, { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input } from 'antd';
import style from './login.module.scss'
import { getCaptchaApi } from '@/services';

const Login = () => {

  const [captcha, setCaptcha] = useState();


  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const getCaptcha = async () => {
    try {
      const res = await getCaptchaApi();
      console.log(res)
      setCaptcha(res.data.data.code);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCaptcha();
  }, [])


  return (
    <div className={style.login}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        className={style.form}
        onFinish={onFinish}
      >
        <Form.Item>
          <h2><i>LOGIN</i></h2>
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="captcha" noStyle rules={[{required: true, message: '请输入验证码!'}]}>
              <Input />
            </Form.Item>
            <img src={captcha} />
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login