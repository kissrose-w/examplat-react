import { delTestPaper, getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import { useEffect, useState, useMemo } from 'react'
import { Form, message, Table, Button, Input, Select, Row, Col } from 'antd'
import style from './PaperBank.module.scss'
import { columns } from './columns'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'
import { testListInfo } from '@/store/TestPaper'
import Preview from './components/preview/Preview'

// 定义表单字段类型
interface FormValues {
  name: string
  creator: string
  subject: string
}

const PaperBank = () => {
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  const [allList, setAllList] = useState<TestListItem[]>([]) //所有试卷数据
  const [searchConditions, setSearchConditions] = useState<Partial<FormValues>>({}) //搜索条件
  const [form] = Form.useForm<FormValues>() // 获取form实例
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) //预览开关
  const [previewLoading, setPreviewLoading] = useState(true) //预览loading
  const [previewList, setPreviewList] = useState<TestListItem>() //预览数据


  // 从store中获取数据
  const { loading, total, getList } = testListInfo()

  // 点击预览
  const onLoading = () => {
    setOpen(true)
    setPreviewLoading(true)
    setTimeout(() => {
      setPreviewLoading(false)
    }, 1000)
  }

  // 只在刚进入路由时调用，获取初始数据
  useEffect(() => {
    getList(params)
  }, [params, getList])

  // 当total获取到后，获取所有数据用于获取完整的creator列表
  useEffect(() => {
    if (total > 0) {
      // 直接调用API获取所有数据，pagesize设置为total
      // 不修改store中的list数据，只用于获取creator
      getTestPaperList({ page: 1, pagesize: total }).then((res) => {
        if (res.data.code === API_CODE.SUCCESS) {
          console.log(res.data.data.list)
          setAllList(res.data.data.list)
        }
      })
    }
  }, [total])

  // 使用useMemo根据allList计算唯一的creator列表
  const creators = useMemo<string[]>(() => {
    // 确保allList是数组且有数据
    if (Array.isArray(allList) && allList.length > 0) {
      return Array.from(
        new Set(allList.map((item: TestListItem) => item.creator))
      )
    }
    return []
  }, [allList])
  
  // 科目
  const subjects = useMemo<string[]>(() => {
    // 确保allList是数组且有数据
    if (Array.isArray(allList) && allList.length > 0) {
      return Array.from(
        new Set(allList.map((item: TestListItem) => item.classify))
      )
    }
    return []
  }, [allList])

  // 使用useMemo根据allList和搜索条件过滤数据
  const filteredList = useMemo(() => {
    // 确保allList是数组
    if (!Array.isArray(allList)) {
      return []
    }

    return allList.filter(item => {
      // 过滤条件：name、creator、subject（对应classify字段）
      const matchName = !searchConditions.name || item.name.includes(searchConditions.name)
      const matchCreator = !searchConditions.creator || item.creator === searchConditions.creator
      const matchSubject = !searchConditions.subject || item.classify === searchConditions.subject
      
      return matchName && matchCreator && matchSubject
    })
  }, [allList, searchConditions])

  // 根据过滤后的数据和分页参数计算当前页显示的数据
  const currentPageData = useMemo(() => {
    const { page, pagesize } = params
    const startIndex = (page - 1) * pagesize
    const endIndex = startIndex + pagesize
    return filteredList.slice(startIndex, endIndex)
  }, [filteredList, params])

  // 分页
  const pagination = {
    defaultCurrent: 1,
    total: filteredList.length, // 使用过滤后的数据总数
    pageSizeOptions: [5, 10, 15, 20],
    pageSize: params.pagesize,
    showSizeChanger: true,
    showTitle: true,
    hideOnSinglePage: true,
    onChange: (page: number, pagesize: number) => {
      setParams({...params, page, pagesize})
    },
    showQuickJumper: true,
    responsive: true,
    showTotal: (total: number) => `一共 ${total} 条`
  }
  
  // 点击删除
  const onDelPaper = async (id: string) => {
    try {
      const res = await delTestPaper(id)
      console.log(res)
      if (res.data.code === API_CODE.SUCCESS) {
        message.success('删除成功')
        // 删除成功后，更新allList，过滤掉已删除的记录
        setAllList(prevList => prevList.filter(item => item._id !== id))
        // 同时更新store中的数据，确保数据一致性
        getList(params)
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
    }
  }

  // 点击搜索
  const onSearch = (validValues: Partial<FormValues>) => {
    // 只更新搜索条件，不调用API
    setSearchConditions(validValues)
    // 重置页码到第1页
    setParams(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className={style.bank}>
      <Button style={{marginBottom: 30}} onClick={() => navigate('/paper/create-paper')}>
        创建试卷
      </Button>
      <Form 
        component={false} 
        form={form}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name='name'
              label='试卷名称'
              rules={[
                { message: 'Input something!' },
              ]}
            >
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='creator'
              label='创建人'
              rules={[
                { message: 'Select something!' },
              ]}
            >
              <Select
                placeholder='请选择'
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
              rules={[
                { message: 'Select something!' },
              ]}
            >
              <Select
                placeholder='请选择'
                options={subjects.map(item => ({
                  value: item,
                  label: item
                }))}
              />
            </Form.Item>
          </Col>
          <Col push={2} span={6}>
            <Button style={{marginRight: 10}} onClick={() => {
              form.resetFields()
              // 清空搜索条件
              setSearchConditions({})
              // 重置页码到第1页
              setParams(prev => ({ ...prev, page: 1 }))
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
          columns={columns({ onDelPaper, onLoading, setPreviewList })}
          size='middle'
          pagination={pagination}
          loading={loading}
          scroll={{
            x: 'max-content', // 自适应所有列宽度总和
          }}
        />
      </Form>
      <Preview
        open={open}
        loading={previewLoading}
        onClose={() => setOpen(false)}
        previewList={previewList}
      />
    </div>
  )
}

export default PaperBank