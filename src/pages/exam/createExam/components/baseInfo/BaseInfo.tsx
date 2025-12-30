import { ProFormDateTimeRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import type { SelectProps } from 'antd'
import React from 'react'
import style from './baseInfo.module.scss'



interface Props {
  subOptions: SelectProps['options'],
  userOptions: SelectProps['options'],
  groupOptions: SelectProps['options'],
  onSaveCur: (val: string) => void
}



const BaseInfo: React.FC<Props> = ({
  subOptions,
  userOptions,
  groupOptions,
  onSaveCur
}) => {
  return (
    <div>
      <ProFormText
        name="name"
        label="考试名称"
        width="md"
        tooltip="最长为 24 位，用于标定的唯一 id"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormDateTimeRangePicker rules={[{ required: true }]} name="dateTime" label="考试时间" />
      <ProFormSelect
        label="科目分类"
        name='classify'
        options={subOptions}
        placeholder="请选择"
        rules={[{ required: true }]}
        onChange={(val: string) => {onSaveCur(val)}}
      />
      <ProFormSelect
        className={style.multiple}
        mode="multiple"
        label="监考人"
        name='examiner'
        options={userOptions}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        className={style.multiple}
        mode="multiple"
        label="考试班级"
        name='group'
        options={groupOptions}
        rules={[{ required: true }]}
      />
    </div>
  )
}

export default BaseInfo