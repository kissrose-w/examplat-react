// 首页

import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import style from './home.module.scss'
import {
  ReadOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useUserStore } from '@/store/userStore'

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

const items: MenuItem[] = [
  getItem('Option 1', '1'),
  getItem('Option 2', '2'),
  getItem('User', 'sub1','', [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', '', [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9',),
]

const Home = () => {

  const [collapsed, setCollapsed] = useState(false)
  const userMenuList = useUserStore(state => state.menuList)

  console.log(userMenuList)

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
            
            <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Content className={style.content}>Content</Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Home