import React, { useMemo } from 'react'
import { Descriptions } from 'antd'
import type { CreateExamination, GroupItem } from '@/services/type'
import type { DescriptionsProps } from 'antd'
import { createStyles } from 'antd-style'


interface Props {
  examInfo: CreateExamination
  groups: GroupItem[]
}


const useStyle = createStyles(() => ({
  root: {
    padding: 50,
  },
}))

const stylesFn: DescriptionsProps['styles'] = (info) => {
  if (info.props.size === 'default') {
    return {
      root: {
        width: '70vw',
        borderRadius: 8,
        border: '1px solid #CDC1FF',
        marginBottom: '30px'
      },
      label: { color: '#A294F9' },
    } satisfies DescriptionsProps['styles']
  }
  return {}
}

const label = {
  name: '考试名称',
  classify: '科目分类',
  examiner: '监考人员',
  group: '班级',
  startTime: '开始时间',
  endTime: '结束时间'
}


const Public: React.FC<Props> = ({examInfo, groups}) => {

  console.log(examInfo)
  console.log(groups)

  const { styles: info } = useStyle()

  const infoItems = useMemo(() => {
    // 根据id找到对应的班级名称
    const group = groups.find(v => v._id === examInfo.group)
    console.log(groups)
    console.log(group?.name)
    // 只处理label对象中定义的字段
    const items = Object.keys(label).map(key => {
      const fieldKey = key as keyof typeof label
      const value = examInfo[fieldKey]
      let displayValue = value

      if (fieldKey === 'group') {
        displayValue = group?.name ?? '-'
      } else if (value === undefined || value === null) {
        displayValue = '-'
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value)
      } else {
        displayValue = value
      }

      return {
        key: fieldKey,
        label: label[fieldKey],
        children: displayValue
      }
    })
    return items
  }, [examInfo, groups])

  return (
    <div>
      <Descriptions
        title="考试信息"
        styles={stylesFn}
        size='default'
        bordered={true}
        classNames={info}
        items={infoItems}
      >
        <Descriptions.Item label="文本">
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default Public