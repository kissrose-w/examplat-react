import { getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import React, { useEffect, useState } from 'react'
import { Form, Table, Space, Button, type TableColumnsType} from 'antd'
import style from './PaperBank.module.scss'

const PaperBank = () => {
  const [list, setList] = useState<TestListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  // 获取试卷列表数据
  const getList = async () => {
    try {
      setLoading(true)
      const res = await getTestPaperList(params)
      const data = res.data.data.list.map((item, index) => ({
        ...item,
        key: item._id || index.toString()
      }))
      console.log(res)
      setList(data)
      setTotal(res.data.data.total)
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getList()
  }, [params])

  const columns: TableColumnsType<TestListItem> = [
    {
      title: '科目名称',
      dataIndex: 'name',
      width: 200,
      key: 'name',
      fixed: 'left'
    },
    {
      title: '科目类型',
      dataIndex: 'classify',
      key: 'value',
      width: 250,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_:string) => {
        if (!_) return '-'
        return _
      },
    },
    {
      title: '操作',
      fixed: 'right',
      width: 250,
      render: () => {
        return (
          <> 
            <Space>
              <Button color="primary" variant="text">
                编辑
              </Button>
              <Button color="danger" variant="text">
                删除
              </Button>
            </Space>
          </>
        )
      },
    },
  ]

  // 分页
  const pagination = {
    defaultCurrent: 1,
    total: total,
    pageSizeOptions: [5, 10, 15, 20],
    pageSize: params.pagesize,
    showSizeChanger: true,
    showTitle: true,
    hideOnSinglePage: true,
    onChange: (page: number, pagesize: number) => {
      setParams({...params, page, pagesize})
    },
    showQuickJumper: true,
    responsive: true,
    showTotal: (total: number) => `一共 ${total} 条`
  }
  
  return (
    <div className={style.bank}>
      <Form component={false}>
        <Table<TestListItem>
          // components={{
          //   body: { cell: EditableCell },
          // }}
          bordered
          dataSource={list}
          columns={columns}
          size='middle'
          pagination={pagination}
          loading={loading}
          scroll={{
            x: 'max-content', // 自适应所有列宽度总和
          }}
        />
      </Form>
    </div>
  )
}

export default PaperBank