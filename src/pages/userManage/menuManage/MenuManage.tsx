import React, { useEffect, useState } from 'react'
import { getPermissionApi } from '@/services'
import type { PermissionType } from '@/services'
import {  Button, Space, Table } from 'antd'
import type { TableColumnsType } from 'antd'



const MenuManage = () => {

  const [menuList, setMenuList] = useState<PermissionType[]>([])
  
  const columns: TableColumnsType<PermissionType> = [
    { title: '菜单名称', dataIndex: 'name', key: 'name' },
    { title: '菜单路径', dataIndex: 'path', key: 'path' },
    { 
      title: '权限类型',
      dataIndex: 'isBtn', 
      key: 'isBtn',
      render: (_, record) => {
        return record.isBtn === false ? '页面' : '按钮'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (_, record) => {
        return new Date( record.createTime).toLocaleString()
      }
    },
    {
      title: '操作',
      key: 'action',
      render: () => {
        return <Space>
          <Button color="primary" variant="text">编辑</Button>
          <Button color="danger" variant="text">删除</Button>
        </Space>
      },
    },
  ]

  const onGetPermission = async() => {
    try {
      const res = await getPermissionApi()
      console.log(res.data)
      setMenuList(res.data.data.list)
    } catch (error) {
      console.log(error)  
    }
  }

  useEffect(() =>{
    Promise.resolve().then(() => {
      onGetPermission()
    })
  }, [])

  
  return (
    <div>
      <div style={{ marginBottom: 20}}><h3>菜单列表</h3></div>
      <Table<PermissionType>
        columns={columns}
        expandable={{
          childrenColumnName: 'children', 
          expandIconColumnIndex: 0,
        }}
        dataSource={menuList}
        rowKey={row => row._id}
      />
    </div>
  )
}

export default MenuManage