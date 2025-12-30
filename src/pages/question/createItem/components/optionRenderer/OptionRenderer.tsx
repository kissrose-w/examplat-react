import React from 'react'
import { Checkbox, Flex, Form, Input, Radio, Space } from 'antd'
import type { RadioChangeEvent } from 'antd/es'

// 定义选项类型
interface OptionsType {
  [key: number]: string
}

// 定义组件Props接口
interface OptionRendererProps {
  curSelect: number | string
  selectedAnswer: number | number[]
  options: OptionsType
  blankAnswer: string
  handleOptionChange: (optionKey: keyof OptionsType, value: string) => void
  handleRadioAnswerChange: (e: RadioChangeEvent) => void
  handleCheckboxAnswerChange: (checkedValues: number[]) => void
  handleBlankAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// 定义选项类型常量
const OptionType = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox'
} as const

// 定义选项类型类型
type OptionTypeValue = typeof OptionType[keyof typeof OptionType]

const OptionRenderer: React.FC<OptionRendererProps> = ({
  curSelect,
  selectedAnswer,
  options,
  blankAnswer,
  handleOptionChange,
  handleRadioAnswerChange,
  handleCheckboxAnswerChange,
  handleBlankAnswerChange
}) => {
  // 渲染单个选项项的公共函数
  const renderOptionItem = (optionKey: number, optionType: OptionTypeValue) => {
    const optionLabel = String.fromCharCode(64 + optionKey) // A, B, C, D
    const optionName = `option${optionLabel}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'
    
    return (
      <Flex align="center" style={{ width: '100%' }} key={optionKey}>
        {optionType === OptionType.RADIO ? (
          <Radio value={optionKey} style={{ marginRight: 16 }}>{optionLabel}</Radio>
        ) : (
          <Checkbox value={optionKey} style={{ marginRight: 16 }}>{optionLabel}</Checkbox>
        )}
        <Form.Item
          name={optionName}
          noStyle
          rules={[{ required: true, message: `请输入${optionLabel}选项内容` }]}
        >
          <Input
            placeholder={`请输入${optionLabel}选项内容`}
            value={options[optionKey]}
            onChange={(e) => handleOptionChange(optionKey, e.target.value)}
            style={{ flex: 1 }}
          />
        </Form.Item>
      </Flex>
    )
  }

  // 根据题型渲染不同的选项和答案输入
  const renderContent = () => {
    // 渲染选择题（单选、多选、判断）的通用组件
    const renderChoiceOptions = () => {
      // 判断题特殊处理，只有两个固定选项
      if (curSelect === 3 || curSelect === 'judge') {
        return (
          <Form.Item label="选项">
            <Radio.Group value={selectedAnswer as number} onChange={handleRadioAnswerChange}>
              <Space orientation="vertical" style={{ width: '100%' }}>
                <Flex align="center" style={{ width: '100%' }}>
                  <Radio value={1} style={{ marginRight: 16 }}>对</Radio>
                </Flex>
                <Flex align="center" style={{ width: '100%' }}>
                  <Radio value={2} style={{ marginRight: 16 }}>错</Radio>
                </Flex>
              </Space>
            </Radio.Group>
          </Form.Item>
        )
      }
      
      // 单选题和多选题的通用渲染逻辑
      const isRadio = curSelect === 1 || curSelect === 'single'
      const isCheckbox = curSelect === 2 || curSelect === 'multiple'
      const optionCount = 4
      
      return (
        <Form.Item label="选项">
          <div style={{ marginBottom: 16 }}>
            {isRadio ? (
              <Radio.Group value={selectedAnswer as number} onChange={handleRadioAnswerChange}>
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {Array.from({ length: optionCount }, (_, i) => i + 1).map(optionKey => 
                    renderOptionItem(optionKey, OptionType.RADIO)
                  )}
                </Space>
              </Radio.Group>
            ) : isCheckbox ? (
              <Checkbox.Group
                value={Array.isArray(selectedAnswer) ? selectedAnswer : []}
                onChange={handleCheckboxAnswerChange}
              >
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {Array.from({ length: optionCount }, (_, i) => i + 1).map(optionKey => 
                    renderOptionItem(optionKey, OptionType.CHECKBOX)
                  )}
                </Space>
              </Checkbox.Group>
            ) : null}
          </div>
        </Form.Item>
      )
    }
    
    switch (curSelect) {
    case 1:
    case 'single': // 单选题
    case 2:
    case 'multiple': // 多选题
    case 3:
    case 'judge': // 判断题
      return renderChoiceOptions()

    case 4:
    case 'fill': // 填空题
      return (
        <>
          <Form.Item
            label="正确答案"
            name="blankAnswer"
            rules={[{ required: true, message: '请输入填空题答案' }]}
          >
            <Input
              placeholder="请输入填空题答案"
              value={blankAnswer}
              onChange={handleBlankAnswerChange}
            />
          </Form.Item>
        </>
      )
    default:
      return null
    }
  }

  return <>{renderContent()}</>
}

export default OptionRenderer
