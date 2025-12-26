import { getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import React, { useEffect, useState } from 'react'
import { Form, Table} from 'antd'
import type { DataType } from '@/pages/question/createSubject/CreateSubject'

const PaperBank = () => {
  const [list, setList] = useState<TestListItem[]>([])

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await getTestPaperList({
          page: 1,
          pagesize: 10
        })
        console.log(res)
        setList(res.data.data.list)
      } catch(e) {
        console.log(e)
      }
    }
    
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
      title: '科目内容',
      dataIndex: 'value',
      key: 'value',
      width: 250,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      // render: (_:string) => {
      //   if (!_) return '-'
      //   return dayjs(_).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
      // },
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
    <Form component={false}>
      <Table<DataType>
        // components={{
        //   body: { cell: EditableCell },
        // }}
        bordered
        dataSource={list}
        columns={columns}
        // pagination={pagination}
        // loading={loading}
        scroll={{
          x: 'max-content', // 自适应所有列宽度总和
        }}
      />
    </Form>
  )
}

export default PaperBank