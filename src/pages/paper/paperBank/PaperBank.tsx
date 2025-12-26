import { getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import React, { useEffect, useState } from 'react'
import { Form, Table} from 'antd'
import type { DataType } from '@/pages/question/createSubject/CreateSubject'

interface List extends TestListItem {
  key: string
}

const PaperBank = () => {
  const [list, setList] = useState<List[]>([])
  const [loading, setLoading] = useState(false)
  const getList = async () => {
    try {
      setLoading(true)
      const res = await getTestPaperList({
        page: 1,
        pagesize: 10
      })
      const data = res.data.data.list.map((item, index) => ({
        ...item,
        key: item._id || index.toString()
      }))
      console.log(res)
      setList(data)
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = [
    {
      title: '科目名称',
      dataIndex: 'name',
      width: 200,
      editable: true,
      key: 'name',
      fixed: 'left'
    },
    {
      title: '科目类型',
      dataIndex: 'classify',
      key: 'value',
      width: 250,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_:string) => {
        if (!_) return '-'
        return _
        // dayjs(_).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 250,
      // render: (_:undefined, record: DataType) => {
      //   return (
      //     <> 
      //       <Space>
      //         <Button color="primary" variant="text" onClick={() => handleEdit(record)}>
      //           编辑
      //         </Button>
      //         <Button color="danger" variant="text" onClick={() =>handleDel(record._id)}>
      //           删除
      //         </Button>
      //       </Space>
      //     </>
      //   )
      // },
    },
  ]
  
  return (
    <div>
      <Form component={false}>
        <Table<DataType>
          // components={{
          //   body: { cell: EditableCell },
          // }}
          bordered
          dataSource={list}
          columns={columns}
          // pagination={pagination}
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