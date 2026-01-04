import React, { useState } from 'react'
import { ProCard } from '@ant-design/pro-components'
import RcResizeObserver from 'rc-resize-observer'
import style from './popup.module.scss'
import type { ExaminationItem } from '@/services/type'
import { CloseOutlined } from '@ant-design/icons' 
import { Space, Descriptions, Statistic } from 'antd'


interface Props {
  detail: ExaminationItem
  changeShow: () => void
}

const Popup: React.FC<Props> = ({ detail, changeShow }) => {
  const [responsive, setResponsive] = useState(false)

  const items = [
    {
      key: 'classify',
      label: '学科',
      children: detail.classify.name,
    },
    {
      key: 'creator',
      label: '创建人',
      children: detail.creator,
    },
    {
      key: 'examiner',
      label: '监考员',
      children: detail.examiner.length !== 0 ? detail.examiner : '— —',
    },
    {
      key: 'startTime',
      label: '开始时间',
      children: new Date(detail.startTime).toLocaleString(),
    },
    {
      key: 'endTime',
      label: '结束时间',
      children: new Date(detail.endTime).toLocaleString(),
    },
    {
      key: 'group',
      label: '考试班级',
      children: detail.group.length === 0 || detail.group[0] === null ? '— —' : detail.group.map(v => v.name).join('、'),
    },
  ]

  // 渲染题目
  // const renderQues = () => {
  //   return 
  // }

  return (
    <div className={style.popup} onClick={() => changeShow()}>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596)
        }}
      >
        <ProCard
          onClick={e => e.stopPropagation()}
          title={
            <Space>
              <CloseOutlined onClick={() => changeShow()} />
              <div>试卷预览</div>
            </Space>
            
          }
          extra={new Date(detail.createdAt).toLocaleString()}
          split={responsive ? 'horizontal' : 'vertical'}
          bordered
          className={style.proCard}
          headerBordered
        >
          <ProCard className={style.content}>
            <div style={{ height: 360 }}>
              <Descriptions title={<Statistic
                value={detail.name}
                style={{
                  fontSize: '30px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              />} items={items} />
            </div>
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </div>
  )
}

export default Popup