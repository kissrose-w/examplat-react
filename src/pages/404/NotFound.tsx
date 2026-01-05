// 路径错误跳转页
import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

  const navigate = useNavigate()

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，你访问的页面已不存在."
        extra={<Button type="primary" onClick={() => navigate('/', {replace: true})}>回到首页</Button>}
      />
    </div>
  )
}

export default NotFound