import React, { useEffect, useState } from 'react'
import style from './CreateSubject.module.scss'
import type { TableProps } from 'antd'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import type { Pages } from '@/services/type'
import { getSubjectApi } from '@/services'
import type { SearchSubjectList } from '@/services/type'
import { API_CODE } from '@/constants'
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
}

const originData = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}))
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
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [data, setData] = useState<DataType[]>(originData)
  const [pageInfo,setPageInfo] = useState<Pages>({
    page: 1,
    pagesize: 5
  })
  const [list,setList] = useState<SearchSubjectList[] | null>(null)
  const getList = async () =>{
    try{
      const res = await getSubjectApi(pageInfo)
      console.log(res.data)
      Promise.resolve().then(() =>{
        if(res.data.code === API_CODE.SUCCESS){
          setList(res.data.data.list)
        }
      })
    }catch(e){
      console.error(e)
    }
  }
  useEffect(() => {
    getList()
  },[])
  const isEditing = (record: DataType) => record.key === editingKey
  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
    setEditingKey(record.key)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const columns = [
    {
      title: '科目名称',
      dataIndex: 'title',
      width: '25%',
      editable: true,
    },
    {
      title: '科目内容',
      dataIndex: 'con',
      width: '40%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record: DataType) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              确认
            </Typography.Link>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })
  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType
      console.log(row)
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const pagination = {
    defaultCurrent: 1,
    total: list?.length
  }
  return (
    <div className={style.category}>
      <Form form={form} component={false}>
        <Table<DataType>
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={pagination}
        />
      </Form>
    </div>
  )
}

export default CreateCategory