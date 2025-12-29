import React, { type RefObject } from 'react'
import { ProTable, type ProFormInstance } from '@ant-design/pro-components'
import style from './config.module.scss'
import type { CreateExamination, TestListItem } from '@/services/type'


interface Props {
  columns: {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
  }[],
  paperOptions: (TestListItem & {key: string})[],
  formRef: RefObject<ProFormInstance | null>,
  onSaveId: (prev: React.SetStateAction<CreateExamination>) => void
}

const Config: React.FC<Props> = ({columns, paperOptions, formRef, onSaveId}) => {

  return (
    <div>
      <ProTable
        className={style.proTable}
        columns={columns}
        dataSource={paperOptions}
        rowKey="key"
        
        pagination={{
          pageSize: 8,
          showQuickJumper: true,
        }}
        search={false}
        dateFormatter="string"
        options={false}
        rowSelection={{
          type: 'radio',
          onChange: (key) => {
            console.log(key)
            formRef.current?.setFieldValue('examId', key[0])
            onSaveId(prev => {
              return {
                ...prev,
                examId: key[0] + ''
              }
            })
          }
        }}
        tableAlertRender={false}
      />
    </div>
  )
}

export default Config