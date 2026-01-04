import type { TestDetailQues } from '@/services/type'
import React, { useMemo } from 'react'
import style from './baseInfo.module.scss'

// 定义BaseInfo组件的Props类型
interface BaseInfoProps {
  name: string // 试卷名称
  subjectName: string // 科目名称
  questions: TestDetailQues[] // 题目列表
  showQues: boolean
}

const method  = ['选题组卷', '随机组卷']

const BaseInfo: React.FC<BaseInfoProps> = ({
  name,
  subjectName,
  questions,
  showQues
}) => {
  // 分类处理题目，使用useMemo避免重复计算
  const { singleQuestions, judgeQuestions, multipleQuestions, blankQuestions } = useMemo(() => {
    const single: TestDetailQues[] = []
    const judge: TestDetailQues[] = []
    const multiple: TestDetailQues[] = []
    const blank: TestDetailQues[] = []

    questions.forEach(item => {
      switch (item.type) {
      case 'single':
        single.push(item)
        break
      case 'judge':
        judge.push(item)
        break
      case 'multiple':
        multiple.push(item)
        break
      default:
        blank.push(item)
        break
      }
    })

    return {
      singleQuestions: single,
      judgeQuestions: judge,
      multipleQuestions: multiple,
      blankQuestions: blank
    }
  }, [questions])

  // 计算总分
  const totalScore = useMemo(() => {
    return questions.reduce((sum, question) => sum + (question.score || 0), 0)
  }, [questions])

  // 渲染题目内容
  const renderQuestion = (question: TestDetailQues, index: number) => {
    return (
      <div key={question._id} style={{ margin: '16px 0' }}>
        <p className={style.conTit}>
          第{index + 1}题（<span className={style.num}>{question.score || 0}分</span>）：
          {question.question}
        </p>
        {question.type === 'single' && (
          <div style={{marginTop: 10}}>
            {question.options && question.options.map(v => (
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
            {question.options && question.options.map(v => (
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
    <div className={style.baseInfo}>
      <h2>{name}</h2>
      <p className={style.subType}>科目类型：{subjectName}</p>
      <p className={style.subType}>组卷方式：{showQues ? method[1] : method[0]}</p>
      <div className={style.des}>
        <p>总分：{totalScore}</p>
        <p>题目数量：{questions.length}道</p>
        <p>单选题：{singleQuestions.length}道</p>
        <p>判断题：{judgeQuestions.length}道</p>
        <p>多选题：{multipleQuestions.length}道</p>
        <p>填空题：{blankQuestions.length}道</p>
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
    </div>
  )
}

export default BaseInfo