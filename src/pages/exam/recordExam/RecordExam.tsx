/* eslint-disable react-hooks/set-state-in-effect */
import { getExaminationListApi, removeExamRecordApi } from '@/services'
import React, { useEffect, useMemo, useState } from 'react'
import style from './record.module.scss'
import { Button, Flex, message, Table, Tag, type TableColumnsType } from 'antd'
import type { ExaminationItem } from '@/services/type'
import Popup from '../components/Popup'
import { API_CODE } from '@/constants'
import { ProFormDatePicker, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components'


const RecordExam = () => {

  // const {styles} = useStyle()

  const [recordList, setRecordList] = useState<ExaminationItem[]>()
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  const [isShow, setIsShow] = useState(false)
  const [curExam, setCurExam] = useState<ExaminationItem>()

  // 每一列的设置
  const columns: TableColumnsType<ExaminationItem> = [
    
    {
      title: '试卷名',
      width: 130,
      className: style.column,
      dataIndex: 'name',
      key: 'name',
      fixed: 'start',
      align: 'center'
    },
    {
      title: '科目',
      width: 180,
      className: style.column,
      dataIndex: 'classify',
      key: 'classify',
      align: 'center'
    },
    {
      title: '开始时间',
      width: 200,
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
      width: 200,
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
        return _ === 1 ?
          <Tag color='green'>已结束</Tag>
          :
          '— —'
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
        return _.length !== 0 ? _ : '— —'
      }
    },
    {
      title: '考试班级',
      width: 200,
      className: style.column,
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      render: (_) => {
        return _.length === 0 || _[0] === null ? '— —' : _
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
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render: (_, record) => {
        return _ ?
          new Date(_).toLocaleString()
          :
          record.createdAt ?
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

  // 根据参数的变化实时调用
  useEffect(() => {
    getExaminationList()
  }, [params])

  // 删除选中的考试记录
  const rmExamRecord = async (id: string) => {
    try {
      const res = await removeExamRecordApi(id)
      console.log(res)
      if(res.data.code === API_CODE.SUCCESS) {
        message.success('删除成功')
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

  return (
    <div className={style.record}>
      {/* 筛选 */}
      <QueryFilter defaultCollapsed split>
        <ProFormText name="name" label="考试名称" />
        <ProFormSelect name="classify" label="科目分类" />
        <ProFormText name="creator" label="创建者" />
        <ProFormDatePicker name="createTime" label="创建时间" />
        <ProFormSelect name="status" label="应用状态" />
        <ProFormText name="examiner" label="监考人" />
        <ProFormSelect name="group" label="考试班级" />
        <ProFormDatePicker name="time" label="考试时间" />
      </QueryFilter>

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
      
    </div>
  )
}

export default RecordExam