/* eslint-disable react-hooks/set-state-in-effect */
import { getExaminationListApi, getSubjectApi, getTestPaperList, removeExamRecordApi, usersListApi, type UsersListResponse } from '@/services'
import React, { useEffect, useMemo, useState } from 'react'
import style from './record.module.scss'
import { Button, Flex, Form, message, Table, Tag, type TableColumnsType } from 'antd'
import type { ExaminationItem, QueryParams, SearchSubjectList, TestListItem } from '@/services/type'
import Popup from './components/popup/Popup'
import { API_CODE } from '@/constants'
import Filter from './components/filter/Filter'
import type { BaseItem } from '@/services/type'
import Edit from './components/edit/Edit'

const RecordExam = () => {


  const [form] = Form.useForm()
  const [recordList, setRecordList] = useState<ExaminationItem[]>()
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    pagesize: 5
  })
  const [isShow, setIsShow] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curExam, setCurExam] = useState<ExaminationItem>()
  const [subList, setSubList] = useState<SearchSubjectList[]>()
  const [paperList, setPaperList] = useState<TestListItem[]>()
  const [userList, setUserList] = useState<UsersListResponse[]>()

  // 每一列的设置
  const columns: TableColumnsType<ExaminationItem> = [
    {
      title: '考试名称',
      width: 130,
      className: style.column,
      dataIndex: 'name',
      key: 'name',
      fixed: 'start',
      align: 'center'
    },
    {
      title: '科目',
      width: 120,
      className: style.column,
      dataIndex: 'classify',
      key: 'classify',
      align: 'center',
      render: (_) => {
        return _.name
      }
    },
    {
      title: '试卷名',
      width: 140,
      className: style.column,
      dataIndex: 'examId',
      key: 'examId',
      align: 'center',
      render: (_) => {
        return _.name
      }
    },
    {
      title: '开始时间',
      width: 150,
      className: style.column,
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      render: (_) => {
        return new Date(_).toLocaleString()
      }
    },
    {
      title: '结束时间',
      width: 150,
      className: style.column,
      dataIndex: 'endTime',
      key: 'endTime',
      align: 'center',
      render: (_) => {
        return new Date(_).toLocaleString()
      }
    },
    {
      title: '状态',
      width: 200,
      className: style.column,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_) => {
        switch(_) {
        case 0: return <Tag color='purple'>未开始</Tag>
        case 1: return <Tag color='green'>进行中</Tag>
        case 2: return <Tag color='volcano'>已结束</Tag>
        default: return '— —'
        }
      }
    },
    {
      title: '监考人',
      width: 200,
      className: style.column,
      dataIndex: 'examiner',
      key: 'examiner',
      align: 'center',
      render: (_) => {
        return _.length !== 0 ? _.join('、') : '— —'
      }
    },
    {
      title: '考试班级',
      width: 200,
      className: style.column,
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      render: (_: BaseItem[]) => {
        return _.length === 0 || _[0] === null ? '— —' : _.map(v => v.name).join('、')
      }
    },
    {
      title: '创建人',
      width: 200,
      className: style.column,
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: '创建时间',
      width: 200,
      className: style.column,
      dataIndex: 'createAt',
      key: 'createAt',
      align: 'center',
      render: (_, record) => {
        return record.createdAt ?
          new Date(record.createdAt).toLocaleString()
          :
          '— —'
      }
    },
    {
      title: '操作',
      width: 240,
      className: style.column,
      key: 'action',
      fixed: 'end',
      align: 'center',
      render: (_, record) => {
        return <Flex gap='small' wrap>
          <Button
            color="cyan"
            variant="text"
            onClick={() => viewDetails(record)}
          >查看</Button>
          <Button
            color="pink"
            variant="text"
            onClick={() => {
              console.log(record)
              form.setFieldsValue({
                ...record,
                classify: record.classify?._id ?? record.classify,
              })
              setIsEdit(true)
            }}
          >编辑</Button>
          <Button
            color="danger"
            variant="text"
            onClick={() => {
              rmExamRecord(record._id)
            }}
          >删除</Button>
        </Flex>
      }
    }
  ]

  // 展示考试详情
  const viewDetails = (record: ExaminationItem) => {
    console.log(record)
    setIsShow(true)
    setCurExam(record)
  }

  // 获取考试记录列表
  const getExaminationList = async () => {
    try {
      setLoading(true)
      const res = await getExaminationListApi(params)
      console.log(res)
      setRecordList(res.data.data.list)
      setTotal(res.data.data.total)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  // 获取科目列表
  const getData = async () => {
    try {
      const subRes = await getSubjectApi()
      const paperRes = await getTestPaperList()
      const userRes = await usersListApi()

      setSubList(subRes.data.data.list)
      setPaperList(paperRes.data.data.list)
      setUserList(userRes.data.data.list)
    } catch (e) {
      console.log(e)
    }
  }

  // 获取下拉框中的数据

  // 进页面调用
  useEffect(() => {
    getData()
  }, [])

  const subOptions = useMemo(() => {
    return subList?.map(item => {
      return {
        value: item._id,
        label: item.name
      }
    })
  }, [subList])

  const paperOptions = useMemo(() => {
    // const filPapers = paperList?.filter(v => v.classify === curId)
    // console.log(filPapers, curId)
    return paperList?.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    })
  }, [paperList])

  const userOptions = useMemo(() => {
    return userList?.map(item => {
      return {
        label: item.username,
        value: item._id
      }
    })
  }, [userList])

  // 根据参数的变化实时调用
  useEffect(() => {
    console.log(params)
    getExaminationList()
  }, [params])

  // 编辑考试
  const upExamination = async () => {
    try {
      // const res = await updateExaminationApi(ueParams)
    } catch (e) {
      console.log(e)
    }
  }

  // 删除选中的考试记录
  const rmExamRecord = async (id: string) => {
    try {
      const res = await removeExamRecordApi(id)
      console.log(res)
      if(res.data.code === API_CODE.SUCCESS) {
        message.success('删除成功')
        // 更新列表
        getExaminationList()
      } else {
        message.error(res.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 格式化数据
  const dataSource = useMemo(() => {
    return recordList?.map(item => {
      const key = item._id
      return {
        ...item, key
      }
    })
  }, [recordList])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      console.log(values)
    } catch (e) {
      console.log(e)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEdit(false)
  }

  return (
    <div className={style.record}>
      {/* 筛选 */}
      <Filter
        onChangePar={setParams}
        subOptions={subOptions!}
        paperOptions={paperOptions!}
      />

      {/* 考试记录 */}
      <Table<ExaminationItem>
        className={style.table}
        columns={columns}
        dataSource={dataSource}
        tableLayout='fixed'
        size='large'
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          total,
          pageSize: params.pagesize,
          pageSizeOptions: ['5', '10', '15', '20'],
          showTotal: (total, range) =>
            `第${range[0]} - ${range[1]} 条 / 共 ${total} 条`,
          onChange: (page, size) => {
            console.log(page,size)
            setParams({
              page,
              pagesize: size
            })
          },
        }}
      />
      {
        isShow ?
          <Popup detail={curExam!} changeShow={() => setIsShow(false)} />
          :
          ''
      }
      <Edit
        isEdit={isEdit}
        form={form}
        subOptions={subOptions!}
        userOptions={userOptions!}
        onHandleOk={handleOk}
        onHandleCancel={handleCancel}
      />
    </div>
  )
}

export default RecordExam