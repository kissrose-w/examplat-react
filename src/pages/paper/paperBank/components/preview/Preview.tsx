import type { TestListItem } from '@/services/type'
import { Drawer } from 'antd'
import React, { useEffect } from 'react'

// 定义Preview组件的Props类型
interface PreviewProps {
  open: boolean
  loading: boolean
  onClose: () => void
  previewList?: TestListItem
}

const Preview: React.FC<PreviewProps> = ({ open, loading, onClose, previewList }) => {
  // 只有当open为true且previewList有值时才打印
  useEffect(() => {
    if (open && previewList) {
      console.log(previewList)
    }
  }, [open, previewList])

  return (
    <Drawer
      closable
      destroyOnHidden
      title={<p>试卷预览</p>}
      placement="right"
      open={open}
      loading={loading}
      onClose={onClose}
      size="large"
    >
      {previewList && (
        <>
          <h2>{previewList.name}</h2>
          <p>总分：{previewList.totalScore}</p>
          <p>考试时长：{previewList.duration}分钟</p>
          <p>创建人：{previewList.creator}</p>
          <p>科目类型：{previewList.classify}</p>
          <h3>试卷内容：</h3>
          {/* 这里可以根据previewList.questions渲染具体的题目 */}
          {previewList.questions?.map((question, index) => (
            <div key={question._id || index} style={{ margin: '16px 0' }}>
              <h4>第{index + 1}题：{question.question}</h4>
              <p>分值：{question.score}</p>
            </div>
          ))}
        </>
      )}
    </Drawer>
  )
}

export default Preview