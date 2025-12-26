/* eslint-disable react-hooks/set-state-in-effect */
import { getExaminationListApi } from '@/services'
import React, { useEffect, useMemo, useState } from 'react'
import style from './record.module.scss'
import { Button, Table, type TableColumnsType } from 'antd'
import type { ExaminationItem } from '@/services/type'



// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: #eaeaea transparent;
//           }
//         }
//       }
//     `,
//   }
// })

const RecordExam = () => {

  // const {styles} = useStyle()

  const [recordList, setRecordList] = useState<ExaminationItem[]>()
  const [total, setTotal] = useState<number>()
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })

  const columns: TableColumnsType = [
    {
      title: 'Id',
      width: 200,
      dataIndex: '_id',
      key: '_id',
      fixed: 'start'
    },
    {
      title: '试卷名',
      width: 150,
      dataIndex: 'name',
      key: 'name',
    },
    
    {
      title: '科目',
      width: 200,
      dataIndex: 'classify',
      key: 'classify',
    },
    {
      title: '开始时间',
      width: 200,
      dataIndex: 'startTime',
      key: 'startTime',
      render: (_) => {
        return new Date(_).toLocaleString()
      }
    },
    {
      title: '结束时间',
      width: 200,
      dataIndex: 'endTime',
      key: 'endTime',
      render: (_) => {
        return new Date(_).toLocaleString()
      }
    },
    {
      title: '出题人',
      width: 200,
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createTime',
      key: 'createTime',
      render: (_) => {
        return new Date(_).toLocaleString()
      }
    },
    {
      title: '操作',
      width: 150,
      key: 'action',
      fixed: 'end',
      render: () => {
        return <Button>查看</Button>
      }
    }
  ]

  

  const getExaminationList = async () => {
    try {
      const res = await getExaminationListApi(params)
      console.log(res)
      setRecordList(res.data.data.list)
      setTotal(res.data.data.total)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getExaminationList()
  }, [])

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
      <Table
        // className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        tableLayout='fixed'
        size='middle'
        scroll={{ x: 'max-content' }}
        pagination={{
          total,
          pageSize: params.pagesize,
          pageSizeOptions: ['5', '10', '15', '20'],
          showTotal: (total, range) =>
            `第${range[0]} - ${range[1]} 条 / 共 ${total} 条`,
          onChange: (page, size) => {
            setParams({
              page,
              pagesize: size
            })
            // setUserList([]);
          },
          // onShowSizeChange: (cur, size) => changeSize(cur, size)
        }}
      />
      {/* {JSON.stringify(recordList)} */}
    </div>
  )
}

export default RecordExam