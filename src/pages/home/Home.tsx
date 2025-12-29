// 首页

import React, { useMemo, useState } from 'react'
import { Layout, Menu, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import style from './home.module.scss'
import type { MenuProps } from 'antd'
import { useUserStore } from '@/store/userStore'
import type { MenuListItem } from '@/services/type'
import {IconEnum} from '@/constants/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const formatList = (list: MenuListItem[]): MenuProps['items'] => {
  return list.map(item => {
    const other = item.children ? {
      children: formatList(item.children)
    } : {}
    return {
      label: item.children ? item.name : <Link to={item.path}>{item.name}</Link>,
      key: item.path,
      icon: IconEnum[item.icon],
      ...other
    }
  })
}

const Home = () => {

  const [collapsed, setCollapsed] = useState(false)
  const userMenuList = useUserStore(state => state.menuList)
  const userInfo = useUserStore(state => state.userInfo)
  const location = useLocation() // 获取当前路由路径

  const menuList = useMemo(() => {
    const baseMenu: MenuProps['items'] = [
      {
        label: <Link to='/'>教务平台</Link>,
        key: '/',
        icon: IconEnum['block']
      }
    ]
    return baseMenu.concat(formatList(userMenuList)!)
  }, [userMenuList])

  return (
    <div className={style.home}>
      <Layout className={style.layout}>
        <Header className={style.header}>
          <div className="demo-logo-vertical" />
          
          <div className={style.user}>
            <Avatar style={{ backgroundColor: '#6A7DB2' }} icon={<UserOutlined />} />
            {userInfo?.username}
          </div>
        </Header>
        
        <Layout>
          <Sider
            className={style.sider}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={'160px'}
            theme='light'
          >
            
            <Menu className={style.menu} defaultSelectedKeys={['1']} mode="inline" items={menuList} />
          </Sider>
          <Content className={style.content_wrap}>
            <div className={style.content} >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Home