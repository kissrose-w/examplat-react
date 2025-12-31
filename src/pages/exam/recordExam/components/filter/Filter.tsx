import type { QueryParams } from '@/services/type'
import { ProFormDateTimePicker, ProFormDateTimeRangePicker, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components'
import React from 'react'



interface Props {
  onSearch: (params: QueryParams) => void
}

const Filter: React.FC<Props> = () => {
  return (
    <div>
      <QueryFilter
        defaultCollapsed
        split
        onFinish={(values) => {
          console.log(values)
        }}
      >
        <ProFormText name="name" label="考试名称" />
        <ProFormSelect name="classify" label="科目分类" />
        <ProFormText name="creator" label="创建者" />
        <ProFormDateTimePicker name="createTime" label="创建时间" />
        <ProFormSelect name="status" label="应用状态" />
        <ProFormText name="examiner" label="监考人" />
        <ProFormSelect name="group" label="考试班级" />
        <ProFormDateTimeRangePicker name="time" label="考试时间" />
      </QueryFilter>
    </div>
  )
}

export default Filter