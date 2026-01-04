import React, { useEffect, useState } from 'react'
import { Button, Flex, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { getStudentsApi } from '@/services'
import type { StudentItem } from '@/services/type'

const GroupStudents = () => {
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  const [studentList, setStudentList] = useState<StudentItem[]>([])
  const [ total, setTotal] = useState<number>(0)
  const getStudentList = async () =>{
    try{
      const res = await getStudentsApi(params)
      console.log(res.data.data.list)
      Promise.resolve().then(() =>{
        setStudentList(res.data.data.list)
        setTotal(res.data.data.total)
      })
    }catch(e){
      console.log(e)
    }
  }
  useEffect(() =>{
    getStudentList()
  },[params])
  const columns: TableProps<StudentItem>['columns'] = [
    {
      title: '排序',
      dataIndex: 'index',
      key: 'index',
      render: (_,record,index) => index + 1,
      fixed: 'start'
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (_ , record) => _ === 0 ? '女' : '男'
    },
    {
      title: '班级',
      key: 'class',
      render: (_:StudentItem , record:StudentItem) => {
        const className = record.classId?.name || '——'
        console.log('当前行班级信息：', className)
        return className
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button >编辑</Button>
      ),
      fixed: 'end'
    }, 
  ]
  const pagination = {
    total: total,
    onChange: (page:number, pagesize:number) => {
      setParams({...params,page,pagesize})
    } 
  }
  return (
    <Table<StudentItem> 
      columns={columns} 
      dataSource={studentList} 
      rowKey='_id'
      scroll={{
        x: 'max-content', // 自适应所有列宽度总和
      }}
      pagination={pagination}
    />
  )
}

export default GroupStudents