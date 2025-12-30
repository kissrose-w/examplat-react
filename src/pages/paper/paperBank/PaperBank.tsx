import { delTestPaper } from '@/services'
import type { TestListItem } from '@/services/type'
import { useEffect, useState, useMemo } from 'react'
import { message, Button } from 'antd'
import style from './PaperBank.module.scss'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'
import { testListInfo } from '@/store/TestPaper'
import Preview from './components/preview/Preview'
import Search from './components/search/Search'

// 定义表单字段类型
export interface FormValues {
  name: string
  creator: string
  subject: string
}

const PaperBank = () => {
  const [open, setOpen] = useState(false) //预览开关
  const [previewLoading, setPreviewLoading] = useState(true) //预览loading
  const [previewList, setPreviewList] = useState<TestListItem>() //预览数据
  const { loading, total, testList, getList, params } = testListInfo() // 从store中获取数据
  const navigate = useNavigate()

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
    getList()
  }, [getList])

  // 使用useMemo根据testList计算唯一的creator列表
  const creators = useMemo<string[]>(() => {
    // 确保testList是数组且有数据
    if (Array.isArray(testList) && testList.length > 0) {
      return Array.from(
        new Set(testList.map((item: TestListItem) => item.creator))
      )
    }
    return []
  }, [testList])
  
  // 科目
  const subjects = useMemo<string[]>(() => {
    // 确保testList是数组且有数据
    if (Array.isArray(testList) && testList.length > 0) {
      return Array.from(
        new Set(testList.map((item: TestListItem) => item.classify))
      )
    }
    return []
  }, [testList])

  // 分页
  const pagination = {
    defaultCurrent: 1,
    total: total, // 使用store中的total作为总数
    pageSizeOptions: [5, 10, 15, 20],
    pageSize: params.pagesize,
    showSizeChanger: true,
    showTitle: true,
    hideOnSinglePage: true,
    onChange: (page: number, pagesize: number) => {
      // 分页变化时调用getList更新数据
      getList({
        page,
        pagesize
      })
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
        // 删除成功后，调用getList更新数据
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
    // 直接调用getList，传递搜索条件和重置的页码
    getList({
      page: 1,
      name: validValues.name,
      classify: validValues.subject, // 映射表单字段到API参数
      creator: validValues.creator
    })
  }

  return (
    <div className={style.bank}>
      <Button style={{marginBottom: 30}} onClick={() => navigate('/paper/create-paper')}>
        创建试卷
      </Button>
      <Search
        loading={loading}
        creators={creators}
        subjects={subjects}
        currentPageData={testList}
        pagination={pagination}
        onSearch={onSearch}
        onLoading={onLoading}
        onDelPaper={onDelPaper}
        setPreviewList={setPreviewList}
      />
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