import type { TableColumnsType } from 'antd'
import type { ClassifyItem, TestListItem } from '@/services/type'
import { Space, Button } from 'antd'
import dayjs from 'dayjs'

// 定义columns组件的props类型
interface Props {
  onDelPaper: (id: string) => void
  onLoading: () => void
  setPreviewList: (value: TestListItem) => void
  classifyList: ClassifyItem[] // 添加科目列表参数
}

// 定义试卷列表的列配置
export const columns = ({ onDelPaper, onLoading, setPreviewList, classifyList }: Props): TableColumnsType<TestListItem> => [
  {
    title: '试卷名称',
    dataIndex: 'name',
    width: 150,
    key: 'name',
    fixed: 'start',
    align: 'center'
  },
  {
    title: '总分',
    dataIndex: 'totalScore',
    key: 'totalScore',
    width: 200,
    align: 'center',
    render: (_) => {
      if (!_) return '--'
      return `${_}分`
    }
  },
  {
    title: '考试时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 200,
    align: 'center',
    render: (_) => {
      if (!_) return '--'
      return `${_}分钟`
    }
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
    width: 200,
    align: 'center'
  },
  {
    title: '科目类型',
    dataIndex: 'classify',
    key: 'classify',
    width: 250,
    align: 'center',
    render: (_) => {
      if (!_) return '--'
      // 根据_id查找对应的科目名称
      const classify = classifyList.find(item => item._id === _)
      return classify ? classify.name : '--'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    width: 300,
    render: (_: string) => {
      if (!_) return '--'
      return dayjs(_).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'center',
    width: 300,
    render: (_: string) => {
      if (!_) return '--'
      return dayjs(_).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '操作',
    fixed: 'right',
    align: 'center',
    width: 250,
    render: (_, record) => {
      return (
        <Space>
          <Button color="primary" variant="text">
            编辑
          </Button>
          <Button color="danger" variant="text" onClick={() => onDelPaper(record._id)}>
            删除
          </Button>
          <Button color="green" variant="text" onClick={() => {
            onLoading()
            setPreviewList(record)
          }}>
            预览
          </Button>
        </Space>
      )
    },
  },
]
