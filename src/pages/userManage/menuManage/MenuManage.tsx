import React, { useEffect, useState } from 'react'
import { getPermissionApi, permissionRemoveApi, permissionEditApi } from '@/services'
import type { PermissionType } from '@/services'
import { API_CODE } from '@/constants'
import MenuDrawer from './menuDrawer/MenuDrawer'
import { Button, message, Space, Table, Input } from 'antd'
import type { TableColumnsType } from 'antd'
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'

const MenuManage = () => {

  const [menuList, setMenuList] = useState<PermissionType[]>([])
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [curId, setCurId] = useState('')
  const [curName, setCurName] = useState('')
  const [curPath, setCurPath] = useState('')
  const [curIsBtn, setCurIsBtn] = useState(false)
  const [open, setOpen] = useState(false)

  
  const columns: TableColumnsType<PermissionType> = [
    { 
      title: '菜单名称',
      dataIndex: 'name', 
      key: 'name',
      onCell: () => ({
        style: {
          paddingBottom: 16
        }
      }),
      render: (_, record) => {

        if(edit && record._id === curId){
          return <Input type="text" placeholder='请输入' value={curName} onChange={(e) => setCurName(e.target.value)} suffix={<CloseCircleOutlined onClick={() => setCurName('')}/>}/> 
        } else {
          return record.name
        }
      },
      align: 'center'
    },
    { 
      title: '菜单路径', 
      dataIndex: 'path', 
      key: 'path',
      render: (_, record) => {
        if(edit && record._id === curId){
          return <Input type="text" placeholder='请输入' value={curPath} onChange={(e) => setCurPath(e.target.value)} suffix={<CloseCircleOutlined  onClick={() => setCurPath('')}/>}/>
        } else {
          return record.path
        }
      },
      align: 'center' 
    },
    { 
      title: '权限类型',
      dataIndex: 'isBtn', 
      key: 'isBtn',
      render: (_, record) => {
        if(edit && record._id === curId){
          return <Input type="text" value={curIsBtn.toString()} onChange={(e) => setCurIsBtn(e.target.value)} suffix={<CloseCircleOutlined onClick={() => setCurIsBtn(false)}/>}/>
        } else {
          return record.isBtn === false ? '页面' : '按钮'
        }
      },
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        return new Date( record.createdAt).toLocaleString()
      },
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return <>
          {
            (edit && record._id === curId) ? <Space>
              <Button color="primary" variant="text" onClick={async() =>{
                await permissionEdit(record._id, curName, curPath, curIsBtn)
                await onGetPermission()
                setEdit(false)
              }}>保存</Button>
              <Button color="danger" variant="text" onClick={() => setEdit(false)}>取消</Button>
            </Space>
              : 
              <Space>
                <Button color="primary" variant="text" onClick={() => {
                  pressEdit(record._id, record.name, record.path, record.isBtn)
                }}>编辑</Button>
                <Button color="danger" variant="text" onClick={() => permissionRemove(record._id)}>删除</Button>
              </Space>}
        </>
      },
      align: 'center'
    },
  ]

  const onGetPermission = async() => {
    setLoading(true)
    try {
      const res = await getPermissionApi()
      // console.log(res.data)a
      setMenuList(res.data.data.list)
    } catch (error) {
      console.log(error)  
    } finally{
      setLoading(false)
    }
  }

  useEffect(() =>{
    onGetPermission()
  }, [])
  // 删除权限
  const permissionRemove = async(id:string) => {
    setLoading(true)
    try {
      const res = await permissionRemoveApi(id)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS ){
        message.success('删除权限成功')
        onGetPermission()
      }else{
        message.error('删除权限失败')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // 权限编辑
  const permissionEdit = async(id: string, name: string, path: string, isBtn: boolean) => {
    try {
      const res = await permissionEditApi({id, name, path, isBtn})
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS ){
        message.success('编辑权限成功')
      }else{
        message.error('编辑权限失败')
      }
    } catch (error) {
      console.error( error)
    }
  }

  const pressEdit = (id: string, name: string, path: string, isBtn: boolean) => {
    setEdit(true)
    setCurId(id)
    setCurName(name)
    setCurPath(path)
    setCurIsBtn(isBtn)
  }
  
  return (
    <div>
      <div style={{ marginBottom: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between'}}>
        <h3>菜单列表</h3>
        <Button 
          type='primary' 
          style={{marginBottom: 20}} 
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setOpen(true)
          }}
        >添加菜单</Button>
      </div>
      <Table<PermissionType>
        columns={columns}
        expandable={{
          childrenColumnName: 'children', 
          expandIconColumnIndex: 0,
        }}
        dataSource={menuList}
        rowKey={row => row._id}
      />
      <MenuDrawer
        open={open}
        setOpen={setOpen}
        menuList={menuList}
        onGetPermission={onGetPermission}
      />
    </div>
  )
}

export default MenuManage