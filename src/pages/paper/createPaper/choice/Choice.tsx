import type { QuestionData } from '@/services/type'
import type React from 'react'
import style from './Choice.module.scss'

interface Props {
  question: QuestionData
  handleQuestionSelect: (questionId: string) => void
  selectedQuestions: string[]
}

const Choice: React.FC<Props> = ({
  question,
  handleQuestionSelect,
  selectedQuestions
}) => {
  return (
    <div 
      className={style.box}
      key={question._id} 
      style={{
        backgroundColor: selectedQuestions.includes(question._id) ? '#f0f9ff' : '#fff',
        borderColor: selectedQuestions.includes(question._id) ? '#1890ff' : '#e8e8e8',
      }}
      onClick={() => handleQuestionSelect(question._id)}
    >
      <div className={style.question}>
        {question.question}
      </div>
      <div className={style.type}>
        题型：{
          question.type === 'single' ? '单选题' : 
            question.type === 'multiple' ? '多选题' : 
              question.type === 'judge' ? '判断题' : '填空题'
        }
      </div>
      {question.options && question.options.length > 0 && (
        question.options.map(item => 
          <div key={item._id}>
            {item.label}:{item.value}
          </div>
        )
      ) || 
        <div>
          <p>对</p>
          <p>错</p>
        </div>
      }
    </div>
  )
}

export default Choice