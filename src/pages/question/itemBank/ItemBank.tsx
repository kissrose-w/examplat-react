import { useEffect, useState } from 'react'
import { Button, Space, Table, message, Input  } from 'antd'
import type { TableProps } from 'antd'
import { getQuestionsListApi, getQuestionDelApi, getQuestionEditApi } from '@/services'
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
  const [question,setQuestion] = useState('')
  const [params,setParams] = useState<Pages>({
    page: 1,
    pagesize: 5
  })
  const [type,setCurType] = useState<string>('')
  const [classify,setClassify] = useState<string>('')
  const [list,setList] = useState<QuestionData[]>([])
  const [total,setTotal] = useState<number>(0)
  const [loading,setLoading] = useState<boolean>(false)
  const [curId,setCurId] = useState<string | null>('')
  const [newQuestion,setNewQuestion] = useState('')
  const getQuestion = async () =>{
    setLoading(true)
    try{
      const queryParams: Pages & { type?: string; question?: string; classify?: string } = {
        page: params.page,
        pagesize: params.pagesize
      }
      if (type) {
        queryParams.type = type
      }
      if (question) {
        queryParams.question = question
      }
      if (classify) {
        queryParams.classify = classify
      }
      const res = await getQuestionsListApi(queryParams)
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
  },[params,type,question,classify])

  const delList = async (id:string) =>{
    try{
      const res = await getQuestionDelApi(id)
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

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>, id: string) =>{
    setNewQuestion(e.target.value)
    const newList = list.map(item =>{
      if(item._id === id){
        return {...item , question: e.target.value}
      }else{
        return item
      }
    })
    setList(newList)
  }
  //更新接口
  const updateChange = async (id:string) =>{
    try{
      const res = await getQuestionEditApi(id,newQuestion)
      if(res.data.code === API_CODE.SUCCESS){
        message.success('更新成功')
      }else{
        message.error(res.data.msg)
      }
    }catch(e){
      console.log(e)
    }
  }
  const confirmChange = (id:string) =>{
    updateChange(id)
    setCurId('')
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
      fixed: 'start',
      render: (_,  record) =>{
        return record._id === curId ?  <Input value={_} onChange={e => handleChange(e,record._id)}/> : record.question
      }
    },
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      render: (_:string) =>{
        return _ === 'fill' ? '填空题' : (_ === 'single' ? '单选题' : (_ === 'multiple' ? '多选题' : '判断题'))
      }
    },
    {
      title: '题型',
      dataIndex: 'classify',
      key: 'classify',
      render: (_) => {
        return _.name
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'end',
      render: (_, record) => {
        // console.log(record)
        return record._id === curId ?
          <Space>
            <Button color="primary" variant="text" onClick={() => confirmChange(record._id)}>
              确认
            </Button>
            <Button color="danger" variant="text" onClick={() => setCurId('')}>
              取消
            </Button>
          </Space> :
          <Space>
            <Button color="primary" variant="text" onClick={() => setCurId(record._id)}>
              编辑
            </Button>
            <Button color="danger" variant="text" onClick={() => delList(record._id)}>
              删除
            </Button>
            <Button color="cyan" variant="text">
              题目详情
            </Button>
          </Space>
      },
    },
  ]
  const changeType = (type:string) =>{
    setCurType(type)
  }
  const inputChange = (question:string) =>{
    setQuestion(question)
  }
  return (
    <>
      <h2>试题库</h2>
      <Search 
        onChange={(type:string) =>{setCurType(type)}} 
        onInpChange={inputChange} 
        onChangeClassify={(classify:string) => setClassify(classify)}
      />
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