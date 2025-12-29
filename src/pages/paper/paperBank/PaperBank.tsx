import { delTestPaper, getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import { useEffect, useMemo, useState } from 'react'
import { Form, message, Table, Button, Row, Col, Select, Input } from 'antd'
import style from './PaperBank.module.scss'
import { columns } from './columns'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'
import { testListInfo } from '@/store/TestPaper'

const PaperBank = () => {
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  const [allList, setAllList] = useState<TestListItem[]>([])
  const navigate = useNavigate()

  // 从store中获取数据
  const { testList: list, loading, total, getList } = testListInfo()

  // 只在刚进入路由时调用，获取初始数据
  useEffect(() => {
    // 调用store的getList方法，传递当前分页参数
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

  // 分页
  const pagination = {
    defaultCurrent: 1,
    total: total,
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
        // 删除成功后，调用store的getList方法刷新数据
        getList(params)
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <div className={style.bank}>
      <Button onClick={() => navigate('/paper/create-paper')}>
        创建试卷
      </Button>
      <Form component={false}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name='name'
              label='试卷名称'
              rules={[
                {
                  message: 'Input something!',
                },
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
                {
                  message: 'Select something!',
                },
              ]}
            >
              <Select
                placeholder='请选择'
                options={creators.map((item: string) => ({
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
                {
                  message: 'Select something!',
                },
              ]}
            >
              <Select
                placeholder='请选择'
                options={[
                  {
                    value: '1',
                    label:
                      'aaaa',
                  },
                  {
                    value: '2',
                    label: '222',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col push={2} span={6}>
            <Button style={{marginRight: 10}}>重置</Button>
            <Button type='primary'>查询</Button>
          </Col>
        </Row>
        <Table<TestListItem>
          dataSource={list}
          columns={columns({ onDelPaper })}
          size='middle'
          pagination={pagination}
          loading={loading}
          scroll={{
            x: 'max-content', // 自适应所有列宽度总和
          }}
        />
      </Form>
    </div>
  )
}

export default PaperBank