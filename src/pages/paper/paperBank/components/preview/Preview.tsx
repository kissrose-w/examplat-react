import { getTestPaperDetail } from '@/services'
import type { ClassifyItem, TestDetailQues, TestListItem } from '@/services/type'
import { Drawer } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import style from './Preview.module.scss'

// 定义Preview组件的Props类型
interface PreviewProps {
  open: boolean
  loading: boolean
  onClose: () => void
  previewList?: TestListItem
  classifyList: ClassifyItem[]
}

const Preview: React.FC<PreviewProps> = ({ 
  open, 
  loading, 
  onClose, 
  previewList,
  classifyList 
}) => {
  const [list, setList] = useState<TestDetailQues[]>()
  // 分类保存不同类型的题目
  const [singleQuestions, setSingleQuestions] = useState<TestDetailQues[]>([])
  const [judgeQuestions, setJudgeQuestions] = useState<TestDetailQues[]>([])
  const [multipleQuestions, setMultipleQuestions] = useState<TestDetailQues[]>([])
  const [blankQuestions, setBlankQuestions] = useState<TestDetailQues[]>([])

  const typeList = useMemo(() => {
    const list = classifyList.find(item => previewList?.classify === item._id)
    return  list?.name
  }, [previewList, classifyList])
  
  // 只有当open为true且previewList有值时才打印
  useEffect(() => {
    if (open && previewList) {
      console.log(previewList)
      const getList = async () => {
        try {
          const res = await getTestPaperDetail(previewList!._id)
          console.log(res)
          console.log(res.data.data.questions)
          setList(res.data.data.questions)
        } catch(e) {
          console.log(e)
        }
      } 
      getList()
    }
  }, [open, previewList])

  // 分类处理题目
  useEffect(() => {
    if (list) {
      const single: TestDetailQues[] = []
      const judge: TestDetailQues[] = []
      const multiple: TestDetailQues[] = []
      const blank: TestDetailQues[] = []

      list.forEach(item => {
        switch (item.type) {
        case 'single':
          single.push(item)
          setSingleQuestions(single)
          break
        case 'judge':
          judge.push(item)
          setJudgeQuestions(judge)
          break
        case 'multiple':
          multiple.push(item)
          setMultipleQuestions(multiple)
          break
        default:
          blank.push(item)
          setBlankQuestions(blank)
          break
        }
      })
    }
  }, [list])

  // 渲染题目内容
  const renderQuestion = (question: TestDetailQues, index: number) => {
    return (
      <div key={question._id} style={{ margin: '16px 0' }}>
        <p className={style.conTit}>
          第{index + 1}题（<span className={style.num}>{question.score}分</span>）：
          {question.question}
        </p>
        {question.type === 'single' && (
          <div style={{marginTop: 10}}>
            {question.options.map(v => (
              <div style={{ marginBottom: 10 }} key={v._id}>
                {v.label}: {v.value}
              </div>
            ))}
          </div>
        )}
        {question.type === 'judge' && (
          <div className={style.judge}>
            <p style={{ marginRight: 20 }}>A.对</p>
            <p>B.错</p>
          </div>
        )}
        {question.type === 'multiple' && (
          <div style={{marginTop: 10}}>
            {question.options.map(v => (
              <div style={{ marginBottom: 10 }} key={v._id}>
                {v.label}: {v.value}
              </div>
            ))}
          </div>
        )}
        {question.type !== 'single' && question.type !== 'judge' && question.type !== 'multiple' && (
          <div>
            <p className={style.blankTip}>（填空题）</p>
          </div>
        )}
      </div>
    )
  }

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
          <p className={style.subType}>科目类型：{typeList}</p>
          <div className={style.des}>
            <p>总分：{previewList.totalScore}</p>
            <p>考试时长：{previewList.duration}分钟</p>
            <p>创建人：{previewList.creator}</p>
          </div>

          {/* 单选题部分 */}
          {singleQuestions.length > 0 && (
            <div className={style.questionSection}>
              <h3 className={style.sectionTitle}>单选题</h3>
              {singleQuestions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}

          {/* 判断题部分 */}
          {judgeQuestions.length > 0 && (
            <div className={style.questionSection}>
              <h3 className={style.sectionTitle}>判断题</h3>
              {judgeQuestions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}

          {/* 多选题部分 */}
          {multipleQuestions.length > 0 && (
            <div className={style.questionSection}>
              <h3 className={style.sectionTitle}>多选题</h3>
              {multipleQuestions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}

          {/* 填空题部分 */}
          {blankQuestions.length > 0 && (
            <div className={style.questionSection}>
              <h3 className={style.sectionTitle}>填空题</h3>
              {blankQuestions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}
        </>
      )}
    </Drawer>
  )
}

export default Preview