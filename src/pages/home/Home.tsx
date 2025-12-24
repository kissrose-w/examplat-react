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
import { useUserStore } from '@/store/userStore'
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
  const userMenuList = useUserStore(state => state.menuList)
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路由计算选中的菜单键
  const selectedKeys: React.Key[] = [location.pathname]
  
  // 根据当前路由计算展开的菜单键
  const openKeys: React.Key[] = location.pathname.startsWith('/student') ? ['/student'] : []

  // 菜单点击事件
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key as string)
  }

  // 菜单展开/收起事件
  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    // 这里可以添加菜单展开/收起的逻辑
  }

  // 菜单数据
  const items: MenuItem[] = [
    getItem('首页', '/', <ReadOutlined />),
    getItem('学生管理', '/student', <BookOutlined />, [
      getItem('考试列表', '/student', <BarsOutlined />),
      getItem('考试详情', '/student/detail', <FileTextOutlined />),
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