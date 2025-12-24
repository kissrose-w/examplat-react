// 首页

import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import style from './home.module.scss'
import {
  ReadOutlined,
  BookOutlined,
  BarsOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const Home = () => {

  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路由计算选中的菜单键
  const selectedKeys: MenuProps['selectedKeys'] = [location.pathname]
  
  // 菜单点击事件
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const key = e.key as string
    navigate(key)
    
    // 点击学生管理时展开子菜单
    if (key === '/student') {
      setOpenKeys(['/student'])
    }
  }

  // 菜单展开/收起事件
  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys)
  }

  // 菜单数据
  const items: MenuItem[] = [
    getItem('首页', '/', <ReadOutlined />),
    getItem('学生系统', '/student', <BookOutlined />, [
      getItem('查询学生考试列表', '/student/list', <BarsOutlined />),
      getItem('查询学生考试详情', '/student/detail', <FileTextOutlined />),
    ]),
  ]

  return (
    <div className={style.home}>
      <Layout className={style.layout}>
        <Header className={style.header}>
          <div className={style.demo_logo_vertical} >
            <ReadOutlined />
          </div>
          Header</Header>
        
        <Layout>
          <Sider
            className={style.sider}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={'16vw'}
          >
            
            <Menu 
              mode="inline" 
              items={items} 
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onClick={handleMenuClick}
              onOpenChange={handleOpenChange}
            />
          </Sider>
          <Content className={style.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Home