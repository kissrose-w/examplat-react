import type { QueryParams } from '@/services/type'
import {
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import React from 'react'



interface Props {
  subOptions: {label: string, value: string}[],
  paperOptions: {label: string, value: string}[],
  onChangePar: (prev: React.SetStateAction<QueryParams>) => void
}

const Filter: React.FC<Props> = ({
  subOptions,
  paperOptions,
  onChangePar
}) => {




  // 状态下拉框的值
  const statusOptions = [
    {
      label: '未开始',
      value: 0,
    },
    {
      label: '进行中',
      value: 1
    },
    {
      label: '已结束',
      value: 2
    }
  ]



  // 格式化参数
  const formatVal = (values: QueryParams & {time: string[]}) => {

    console.log(values)
    if(values.time) {
      const { time, ...rest } = values
      console.log(rest)
      onChangePar(prev => {
        return {
          page: 1,
          pagesize: prev.pagesize,
          ...rest,
          startTimeFrom: dayjs(time[0]).format(),
          startTimeTo: dayjs(time[1]).format()
        }
      })
    } else {
      onChangePar(prev => {
        return {
          page: 1,
          pagesize: prev.pagesize,
          ...values
        }
      })
    }
  }

  

  return (
    <div>
      <QueryFilter
        defaultCollapsed
        split
        onFinish={(values: QueryParams & {time: string[]}) => {
          console.log(values)
          formatVal(values)
        }}
      >
        <ProFormText name="name" label="考试名称" />
        {/* 要返回objectId格式 */}
        <ProFormSelect
          name="classify"
          label="科目分类"
          options={subOptions}
        />
        {/* 格式为 0、1、2 */}
        <ProFormSelect
          name="status"
          label="考试状态"
          options={statusOptions}
        />
        {/* 试卷名称 -> 传出objectId格式 */}
        <ProFormSelect
          name="examId"
          label="试卷名称"
          options={paperOptions}
        />
        {/* 传出 ISO8601 格式 */}
        <ProFormDateTimeRangePicker name="time" label="开始时间" />
      </QueryFilter>
    </div>
  )
}

export default Filter