import { useEffect, useState, useCallback } from 'react'
import { userRoleApi, roleRemoveApi, roleCreateApi, getPermissionApi } from '@/services'
import type { RoleCreateP, PermissionType } from '@/services'
import { Space, Table, Button, message } from 'antd'
import type { TableProps } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import RoleModal from './components/roleModal/RoleModal'
import RoleDrawer from './components/roleDrawer/RoleDrawer'
import{ API_CODE } from '@/constants'

const System = () => {
  const [roleList, setRoleList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [permissionList, setPermissionList] = useState<PermissionType[]>([])
  const [editP, setEditP] = useState<{
  _id: string
  name: string
  permission?: string[]
} | null>({
  _id: '',
  name: '',
  permission: []
})
  
  const getRoleList = useCallback(async() =>{
    try {
      const res = await userRoleApi()
      console.log(res.data)
      setRoleList(res.data.data.list)
      // const options = res.data.data.list.map((item) => {
      //   return {
      //     label: item.name,
      //     creator: item.creator
      //   }
      // })
      // console.log(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  // 分配角色按钮
  const assignRole = (record: DataType) => {
    const permissionIds = record.permission?.map(item => item._id) || []
    setEditP({
      _id: record._id!,
      name: record.name!,
      permission: permissionIds
    })

    onGetPermission()
    setOpen(true)
  }

interface DataType {
  _id: string,
  name: string
  value: string
  createdAt: string,
  description: string
  permission?:  Array<{ _id: string; name: string }>
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'id',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: '角色',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (_, record) =>{
      return new Date( record.createdAt).toLocaleString()
    }
  },
  {
    title: '拥有权限',
    key: 'description',
    dataIndex: 'description',

  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type='primary' onClick={() => {
          assignRole(record)
        }}>分配角色</Button>
        <Button danger onClick={() => onDel(record._id)}>删除</Button>
      </Space>
    ),
  },
]
// 删除角色
const onDel = async(id: string) => {
  try {
    const res = await roleRemoveApi(id)
    // console.log(res.data)
    if(res.data.code === API_CODE.SUCCESS ){
      message.success('删除角色成功')
      console.log(roleList)
      getRoleList()
    }else{
      message.error('删除角色失败')
    }
  } catch (error) {
    console.log(error)  
  }
}

//创建角色
const onCreate = async(p: RoleCreateP) => {
  try {
    const res = await roleCreateApi(p)
    // console.log(res.data)
    if(res.data.code === API_CODE.SUCCESS ){
      message.success('创建角色成功')
      getRoleList()
    }else{
      message.error('创建角色失败')
    }
  } catch (error) {
    console.log(error)  
  }
}
// 查询权限
const onGetPermission = useCallback(async() => {
  try {
    const res = await getPermissionApi()
    setPermissionList(res.data.data.list)
  } catch (error) {
    console.log(error)  
  }
}, [])

// 获取角色列表
useEffect(() => {
  const initData = async () => {
    await getRoleList()
    await onGetPermission()
  }
  initData()
}, [getRoleList, onGetPermission])


return (
  <div>
    <Button 
      type='primary' 
      style={{marginBottom: 20}} 
      icon={<PlusCircleOutlined />}
      onClick={() => {
        setIsModalOpen(true)
      }}
    >创建角色</Button>
    <Table<DataType> columns={columns} dataSource={roleList} rowKey="_id"/>
    <RoleModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      onCreate={onCreate}
    />
    <RoleDrawer 
      open={open}
      setOpen={setOpen}
      permissionList={permissionList}
      itemPer={editP?.permission}
      editP={editP!}
      onSuccess={() => {
        getRoleList()  
        onGetPermission()
      }} 
    />
  </div>
)
}

export default System