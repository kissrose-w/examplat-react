import { useEffect, useState } from 'react'
import { Button, Space, Table, message  } from 'antd'
import type { TableProps } from 'antd'
import { getQuestionsListApi, getQuestionDelApi } from '@/services'
import type { Pages, QuestionData } from '@/services/type'
import style from './ItemBank.module.scss'
import { useNavigate } from 'react-router-dom'
import { API_CODE } from '@/constants'
import Search from './components/Search'
interface DataType {
  answer: string;
  question: string;
  type: number;
  _id: string;
  options: string[];
  classify: string
}


const ItemBank = () => {
  const navigate = useNavigate()
  const [params,setParams] = useState<Pages>({
    page: 1,
    pagesize: 5
  })
  const [type,setCurType] = useState<string>()
  const [list,setList] = useState<QuestionData[]>([])
  const [total,setTotal] = useState<number>(0)
  const [loading,setLoading] = useState<boolean>(false)
  const getQuestion = async () =>{
    setLoading(true)
    try{
      const res = await getQuestionsListApi({...params,type})
      console.log(res.data) 
      setList(res.data.data.list)
      setTotal(res.data.data.total)
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() =>{
    getQuestion()
  },[params,type])

  const delList = async (id:string) =>{
    try{
      const res = await getQuestionDelApi(id)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS){
        message.success('删除成功')
        await getQuestion()
      }else{
        message.error(res.data.msg)
      }
    }catch(e){
      console.log(e)
    }
  }
  const handleDel = (id:string) =>{
    console.log(id)
    delList(id)
  }
  const pagination = {
    pageSize: params.pagesize,
    total: total,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5' ,'10' ,'15', '20'],
    onChange: (page: number,pagesize: number) =>{
      setParams({...params,page,pagesize})
    }
  }
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '试题列表',
      dataIndex: 'question',
      key: 'question',
      className: style.question,
      fixed: 'start'
    },
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      render: (_:string) =>{
        return _ === '4' ? '填空题' : (_ === '1' ? '单选题' : (_ === '2' ? '多选题' : '判断题'))
      }
    },
    {
      title: '题型',
      dataIndex: 'classify',
      key: 'classify',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'end',
      render: (_, record) => (
        <Space>
          <Button color="primary" variant="text">
            编辑
          </Button>
          <Button color="danger" variant="text" onClick={() =>handleDel(record._id)}>
            删除
          </Button>
          <Button color="cyan" variant="text">
            试题详情
          </Button>
        </Space>
      ),
    },
  ]
  const changeType = (type:string) =>{
    console.log('类型变为',type)
    setCurType(type)
  }
  return (
    <>
      <h2>试题库</h2>
      <Search onChange={changeType}/>
      <Button color="primary" variant="solid" className={style.create} onClick={() => navigate('/question/create-item')}>添加试题</Button>
      <Table<DataType> 
        columns={columns} 
        dataSource={list} 
        loading={loading}
        pagination={pagination}
        rowKey="_id"
        scroll={{
          x: 'max-content', // 自适应所有列宽度总和
        }}
      />
    </>
    
  )
}

export default ItemBank