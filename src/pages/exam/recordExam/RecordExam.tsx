/* eslint-disable react-hooks/set-state-in-effect */
import { getExaminationListApi, getGroupListApi, getSubjectApi, getTestPaperList, removeExamRecordApi, updateExaminationApi, usersListApi, type UsersListResponse } from '@/services'
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import style from './record.module.scss'
import { Button, Flex, Form, message, Table, Tag, type TableColumnsType } from 'antd'
import type { ExaminationItem, GroupItem, QueryParams, SearchSubjectList, TestListItem } from '@/services/type'
import Popup from './components/popup/Popup'
import { API_CODE, API_STATUS } from '@/constants'
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
  const [prohibit, setProhibit] = useState(false)
  const [curExam, setCurExam] = useState<ExaminationItem>()
  const [curUEId, setCurUEId] = useState<string>()
  const [subList, setSubList] = useState<SearchSubjectList[]>()
  const [paperList, setPaperList] = useState<TestListItem[]>()
  const [userList, setUserList] = useState<UsersListResponse[]>()
  const [groupList, setGroupList] = useState<GroupItem[]>()

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
              setCurUEId(record._id)
              form.setFieldsValue({
                ...record,
                classify: record.classify?._id,
                group: record.group.map(g => g?._id ?? g),
                dateTime: [
                  record.startTime ? dayjs(record.startTime) : undefined,
                  record.endTime ? dayjs(record.endTime) : undefined,
                ]
              })
              if(record.status === API_STATUS.NOT_START) {
                setProhibit(false)
              } else {
                setProhibit(true)
              }
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
      const groupRes = await getGroupListApi()

      setSubList(subRes.data.data.list)
      setPaperList(paperRes.data.data.list)
      setUserList(userRes.data.data.list)
      setGroupList(groupRes.data.data.list)
    } catch (e) {
      console.log(e)
    }
  }


  // 进页面调用
  useEffect(() => {
    getData()
  }, [])

  // 格式化的科目列表
  const subOptions = useMemo(() => {
    return subList?.map(item => {
      return {
        value: item._id,
        label: item.name
      }
    })
  }, [subList])

  // 格式化的班级列表
  const groupOptions = useMemo(() => {
    return groupList?.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    })
  }, [groupList])

  // 格式化后的试卷列表
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

  // 格式化的监考人列表
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
  // const upExamination = async () => {
  //   try {
  //     // const res = await updateExaminationApi(ueParams)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

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

  // 确定编辑
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      console.log(values)
      const {dateTime, ...rest} = values
      const ueParams = prohibit ? {
        ...rest,
        id: curUEId
      } : {
        ...rest,
        id: curUEId,
        startTime: dayjs(dateTime[0]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        endTime: dayjs(dateTime[1]).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      }
      console.log(ueParams)
      const res = await updateExaminationApi(ueParams)
      console.log(res)
      if (res.data.code === API_CODE.SUCCESS) {
        message.success(res.data.msg)
        setParams({
          page: 1,
          pagesize: 5
        })
      } else if (res.data.code === API_CODE.PARAMS_ERROR) {
        message.error(res.data.msg)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsEdit(false)
    }
  }

  // 取消编辑
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
          current: params.page,
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
        prohibit={prohibit}
        form={form}
        subOptions={subOptions!}
        userOptions={userOptions!}
        groupOptions={groupOptions!}
        onHandleOk={handleOk}
        onHandleCancel={handleCancel}
      />
    </div>
  )
}

export default RecordExam