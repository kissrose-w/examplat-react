import React, { useEffect, useState } from 'react'
import style from './CreateSubject.module.scss'
import type { TableProps } from 'antd'
import { Form, Input, InputNumber,  Table, Button, Space, message } from 'antd'
import type { Pages } from '@/services/type'
import { getSubjectApi } from '@/services'
import type { SearchSubjectList } from '@/services/type'
import { API_CODE } from '@/constants'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getDelSubjectApi, getCreateSubjectApi } from '@/services'
import Dialog from './components/Dialog'
import type { FieldType } from '@/services/type'
// 注册utc插件（用于时区转换）
dayjs.extend(utc)
export interface DataType extends SearchSubjectList {
  key: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const CreateCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [pageInfo,setPageInfo] = useState<Pages>({
    page: 1,
    pagesize: 5
  })
  const [list,setList] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [editData, setEditData] = useState<DataType | null>(null)
  const getList = async () =>{
    try{
      setLoading(true)
      const res = await getSubjectApi(pageInfo)
      if(res.data.code === API_CODE.SUCCESS){
        // 转换API返回的数据结构，确保包含key字段
        const data = res.data.data.list.map((item: SearchSubjectList, index: number) => ({
          ...item,
          key: item._id || index.toString()
        }))
        setList(data)
        setTotal(res.data.data.total || 0)
      }
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    getList()
  }, [pageInfo])
  
  //删除接口
  const delsubject = async (id:string) =>{
    try{
      const res = await getDelSubjectApi(id)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS){
        message.success('删除成功')
      }else{
        message.error(res.data.msg)
      }
    }catch(e){
      console.log(e)
    }
  }
  const handleDel = (id:string) =>{
    delsubject(id)
    getList()
  }
  const dialogChange = (isModalOpen:boolean) =>{
    setIsModalOpen(isModalOpen)
    if (!isModalOpen) {
      setEditData(null)
    }
  }
  //创建接口
  const createSub = async (params:FieldType) =>{
    try{
      const res = await getCreateSubjectApi(params)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS){
        message.success('创建成功')
      }else{
        message.error(res.data.msg)
      }
    }catch(e){
      console.error(e)
    }
  }
  const dialogCreat = (values:FieldType) =>{
    console.log('点击了确认',values)
    createSub(values)
    getList()
  }
  const handleEdit = (values:DataType) =>{
    console.log('点击了编辑',values)
    setEditData(values)
    setIsModalOpen(true)
  }
  
  //调编辑接口
  // const getEdit = async (id,values) =>{
  //   try{
  //   }catch(e){
  //     console.error(e)
  //   }
  // }
  const dialogEdit = (values:FieldType) =>{
    console.log('点击了编辑确认',values)
    // getEdit(editData?._id,values)
  }
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
      render: (_:string) => {
        if (!_) return '-'
        return dayjs(_).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 250,
      render: (_:undefined, record: DataType) => {
        return (
          <> 
            <Space>
              <Button color="primary" variant="text" onClick={() => handleEdit(record)}>
                编辑
              </Button>
              <Button color="danger" variant="text" onClick={() =>handleDel(record._id)}>
                删除
              </Button>
            </Space>
          </>
        )
      },
    },
  ]
  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    }
  })

  const pagination = {
    defaultCurrent: 1,
    total: total,
    // current: pageInfo.page,
    pageSize: pageInfo.pagesize,
    showSizeChanger: true,
    onChange: (page: number,pagesize: number) => {
      setPageInfo({...pageInfo,page,pagesize})
    },
    pageSizeOptions: [3, 5, 8, 10]
  }
  return (
    <div className={style.category}>
      <Button color="primary" onClick={() => setIsModalOpen(true)}>
        创建科目
      </Button>
      <Form form={form} component={false}>
        <Table<DataType>
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={list}
          columns={mergedColumns}
          pagination={pagination}
          loading={loading}
          scroll={{
            x: 'max-content', // 自适应所有列宽度总和
          }}
        />
      </Form>
      <Dialog 
        onChange={dialogChange}
        isModalOpen={isModalOpen}
        onCreat={dialogCreat}
        editData={editData}
        onEdit={dialogEdit}
      />
    </div>
  )
}

export default CreateCategory