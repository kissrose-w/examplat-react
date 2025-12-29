import type { TableColumnsType } from 'antd'
import type { TestListItem } from '@/services/type'
import { Space, Button } from 'antd'

// 定义columns组件的props类型
interface Props {
  onDelPaper: (id: string) => void
  onLoading: () => void
  setPreviewList: (value: TestListItem) => void
}

// 定义试卷列表的列配置
export const columns = ({ onDelPaper, onLoading, setPreviewList }: Props): TableColumnsType<TestListItem> => [
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
    width: 100,
    align: 'center',
    render: (_) => {
      if (!_) return '--'
      return _
    }
  },
  {
    title: '考试时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
    align: 'center',
    render: (_) => {
      if (!_) return '--'
      return _
    }
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
    align: 'center'
  },
  {
    title: '科目类型',
    dataIndex: 'classify',
    key: 'classify',
    width: 250,
    align: 'center'
  },
  
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'center',
    render: (_: string) => {
      if (!_) return '--'
      return _
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
