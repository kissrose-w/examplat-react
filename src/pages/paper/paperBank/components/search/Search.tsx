import { columns } from '@/pages/paper/paperBank/columns'
import { Form, Table, Button, Input, Select, Row, Col } from 'antd'
import type { FormValues } from '../../PaperBank'
import type { ClassifyItem, TestListItem } from '@/services/type'

// 定义分页参数类型
interface PaginationParams {
  defaultCurrent: number
  total: number
  pageSizeOptions: number[]
  pageSize: number
  showSizeChanger: boolean
  showTitle: boolean
  hideOnSinglePage: boolean
  onChange: (page: number, pagesize: number) => void
  showQuickJumper: boolean
  responsive: boolean
  showTotal: (total: number) => string
}

interface Props {
  loading: boolean
  creators: string[]
  subjects: string[]
  currentPageData: TestListItem[]
  onSearch: (validValues: Partial<FormValues>) => void
  onLoading: () => void
  onDelPaper: (id: string) => Promise<void>
  setPreviewList: (value: TestListItem) => void
  pagination: PaginationParams // 添加pagination类型定义
  classifyList: ClassifyItem[] // 添加科目列表参数
}

const Search: React.FC<Props> = ({
  loading,
  creators,
  subjects,
  currentPageData,
  onSearch,
  onLoading,
  onDelPaper,
  setPreviewList,
  pagination,
  classifyList
}) => {
  const [form] = Form.useForm<FormValues>() // 获取form实例
  return (
    <Form 
      component={false} 
      form={form}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name='name'
            label='试卷名称'
          >
            <Input placeholder='请输入' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name='creator'
            label='创建人'
          >
            <Select
              placeholder='请选择'
              allowClear
              options={creators.map(item => ({
                value: item,
                label: item
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name='subject'
            label='查询科目'
          >
            <Select
              placeholder='请选择'
              allowClear
              options={ subjects.map(item => {
                // 查找匹配的科目
                const classify = classifyList.find(v => item === v._id)
                // 返回正确的value和label，value为ID，label为名称
                return {
                  value: item,
                  label: classify ? classify.name : item
                }
              })}
            />
          </Form.Item>
        </Col>
        <Col push={2} span={6}>
          <Button style={{marginRight: 10}} onClick={() => {
            form.resetFields()
            // 清空搜索条件并重置页码
            onSearch({})
          }}>重置</Button>
          <Button type='primary' onClick={() => {
            // 验证表单，类型从Form.useForm<FormValues>()推断
            form.validateFields().then((values: FormValues) => {
              const validValues = Object.entries(values).reduce((prev: Partial<FormValues>, [key, value]) => {
                if (value) {
                  prev[key as keyof FormValues] = value
                }
                return prev
              }, {})
              onSearch(validValues)
            }).catch(errorInfo => {
              console.log('表单验证失败:', errorInfo)
            })
          }}>查询</Button>
        </Col>
      </Row>
      <Table<TestListItem>
        dataSource={currentPageData}
        columns={columns({ onDelPaper, onLoading, setPreviewList, classifyList })}
        size='middle'
        pagination={pagination}
        loading={loading}
        rowKey="_id" // 添加rowKey，使用_id作为唯一标识符
        scroll={{
          x: 'max-content', // 自适应所有列宽度总和
        }}
      />
    </Form>
  )
}

export default Search