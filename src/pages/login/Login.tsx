// 登录页
import { useEffect, useState } from 'react'
import { LockOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, message } from 'antd'
import style from './login.module.scss'
import { getCaptchaApi, toLoginApi } from '@/services'
import type { LoginParams } from '@/services/type'
import { API_CODE } from '@/constants'
import { setToken } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

const Login = () => {

  const [captcha, setCaptcha] = useState<string>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const getUserInfo = useUserStore(state => state.getUserInfo)
  const [session, setSession] = useState<string>()


  const onFinish = async (values: LoginParams) => {
    console.log(values)
    try {
      setLoading(true)
      const res = await toLoginApi(values)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS){
        message.success(res.data.msg)
        setToken(res.data.data.token)
        setSession(res.data.data.sessionId)
        getUserInfo()
        navigate('/')
      } else if (res.data.code === API_CODE.EXPIRED_CAPTCHA) {
        message.error(res.data.msg)
        getCaptcha()
      } else {
        message.error(res.data.msg)
      }
    } catch (e) {
      console.log(e)
      message.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const getCaptcha = async () => {
    try {
      const res = await getCaptchaApi()
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS){
        setCaptcha(res.data.data.code)
      } else {
        message.error(res.data.msg)
      }
      
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCaptcha()
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
          <Input prefix={<UserOutlined />} autoComplete='new-password' placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input prefix={<LockOutlined />} autoComplete='new-password' type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center" className={style.changeCaptcha}>
            <Form.Item name="code" noStyle rules={[{required: true, message: '请输入验证码!'}]}>
              <Input autoComplete='new-password' placeholder='验证码' />
            </Form.Item>
            <img className={style.captcha} src={captcha} />
            <div onClick={() => {
              getCaptcha()
            }} className={style.change}><RedoOutlined /><span>换一换</span></div>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login