import React,{ useState} from 'react'
import { Space, Table, Tag, Switch} from 'antd'
import type { TableProps} from 'antd'
import type { UsersListResponse, UsersListParams } from '@/services'
import type { UserInfo } from '@/services/type'
type Props = {
  usersInfo: UsersListResponse[]
  params: UsersListParams
  onSetParams: (params: UsersListParams) => void
  total: number
  onDel: (id: string) => void
  onSetOriginInfo: (params: UserInfo) => void
  setIsModalOpen: (p: boolean) => void
  setMode: (p: string) => void
}

const UsersList:React.FC<Props> = ({usersInfo, params, onSetParams, total, onDel, onSetOriginInfo,setIsModalOpen, setMode}) => {

  
  const changeSwitch = (checked: boolean) => {
    console.log(`switch to ${checked}`)
  }
  
  const columns: TableProps<UsersListResponse>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      fixed: 'start',
      width: 100,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return  <Switch 
          checked={record.status === 1}  
          onChange={(checked) => changeSwitch(checked, record)}
        />
      },
      width: 100,
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avator',
      key: 'avator',
      render: (_) => _ ??  ' __',
      width: 200,
      align: 'center'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (_) => _ ??  ' __',
      width: 100,
      align: 'center'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (_) => _ ??  ' __',
      width: 100,
      align: 'center'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (_) => _ ??  ' __',
      width: 200,
      align: 'center'
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastOnlineTime',
      key: 'lastOnlineTime',
      render: (_) => _ ??  ' __',
      width: 200,
      align: 'center'
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (_) => _ ??  ' __',
      width: 100,
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      align: 'center'
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Tag color='green' onClick={() => {
            setIsModalOpen(true)
            setMode('distribute')
          }}>分配角色</Tag>
          <Tag color='blue' onClick={() => {
            // console.log(record)
            onSetOriginInfo(record)
            setIsModalOpen(true)
            setMode('edit')
          }}>编辑</Tag>
          <Tag color='red' onClick={() => onDel(record._id)}>删除</Tag>
        </Space>
      ),
      fixed: 'end',
      width: 250,
      align: 'center'
    },
  ]

  return (
    <div>
      <Table<UsersListResponse> 
        columns={columns} 
        scroll={{ x: 1200 }}
        dataSource={usersInfo}
        pagination={
          {
            showSizeChanger: true,
            current: params.page,
            pageSize: params.pagesize,
            total: total,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: [5, 10, 15, 20],
            onChange: (page, pagesize) => {
              onSetParams({
                page,
                pagesize
              })
            }
          }
        } 
      /> 
    </div>
  )
}

export default UsersList