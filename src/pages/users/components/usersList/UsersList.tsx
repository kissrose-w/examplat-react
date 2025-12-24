import React from 'react'
import { Space, Table, Tag, Pagination} from 'antd'
import type { TableProps, TablePaginationConfig } from 'antd'
import type { UsersListResponse, UsersListParams } from '@/services'

type Props = {
  usersInfo: UsersListResponse[]
  params: UsersListParams
  onSetParams: (params: UsersListParams) => void
  total: number
}

const UsersList:React.FC<Props> = ({usersInfo, params, onSetParams, total}) => {
  
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
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: '操作',
      render: () => (
        <Space>
          <Tag color='blue'>编辑</Tag>
          <Tag color='red'>删除</Tag>
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
      style={{display:'flex', justifyContent: 'flex-end'}}
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