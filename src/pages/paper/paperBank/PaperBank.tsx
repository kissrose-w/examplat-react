import { delTestPaper } from '@/services'
import type { TestListItem } from '@/services/type'
import { useEffect, useState } from 'react'
import { Form, message, Table, Button } from 'antd'
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
  const navigate = useNavigate()

  // 从store中获取数据
  const { testList: list, loading, total, getList } = testListInfo()

  useEffect(() => {
    // 调用store的getList方法，传递当前分页参数
    getList(params)
  }, [params, getList])

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
        <Table<TestListItem>
          dataSource={list}
          columns={columns({ onDelPaper })}
          size="middle"
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