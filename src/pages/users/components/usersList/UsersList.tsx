import React from 'react'
import { Space, Table, Tag, Pagination, Switch} from 'antd'
import type { TableProps, TablePaginationConfig } from 'antd'
import type { UsersListResponse, UsersListParams } from '@/services'

type Props = {
  usersInfo: UsersListResponse[]
  params: UsersListParams
  onSetParams: (params: UsersListParams) => void
  total: number
  onDel: (id: string) => void
}

const UsersList:React.FC<Props> = ({usersInfo, params, onSetParams, total, onDel}) => {

  const changeSwitch = (checked: boolean) => {
    console.log(`switch to ${checked}`)
  }
  
  const columns: TableProps<UsersListResponse>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: () => {
        return <Switch onChange={changeSwitch}></Switch>
      }
    },
    {
      title: '头像',
      dataIndex: 'avator',
      key: 'avator',
      render: (_) => _ ??  ' __'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (_) => _ ??  ' __'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (_) => _ ??  ' __'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (_) => _ ??  ' __'
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastOnlineTime',
      key: 'lastOnlineTime',
      render: (_) => _ ??  ' __'
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (_) => _ ??  ' __'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Tag color='green'>分配角色</Tag>
          <Tag color='blue'>编辑</Tag>
          <Tag color='red' onClick={() => onDel(record._id)}>删除</Tag>
        </Space>
      ),
    },
  ]
  const onChange = (pagination:TablePaginationConfig) => {
    const newPage = pagination.current!
    const newPageSize = pagination.pageSize || params.pagesize
    // 更新分页参数
    onSetParams({
      page: newPage,
      pagesize: newPageSize,
    })
  }

  return (
    <div>
      <Table<UsersListResponse> columns={columns} dataSource={usersInfo} onChange={onChange}/> 
      <Pagination
        style={{display: 'flex', justifyContent: 'flex-end'}}
        total={total}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
        defaultPageSize={params.pagesize}
        defaultCurrent={params.page}
      />
    </div>
  )
}

export default UsersList