import { delTestPaper, getTestPaperList } from '@/services'
import type { TestListItem } from '@/services/type'
import { useEffect, useState, useMemo } from 'react'
import { message, Button } from 'antd'
import style from './PaperBank.module.scss'
import { API_CODE } from '@/constants'
import { useNavigate } from 'react-router-dom'
import { testListInfo } from '@/store/TestPaper'
import Preview from './components/preview/Preview'
import Search from './components/search/Search'
import { createListInfo } from '@/store/CreatePaper'

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
  const [allTestPapers, setAllTestPapers] = useState<TestListItem[]>([]) // 所有试卷数据，用于生成完整的搜索选项
  const { testList: classifyList, getList: getType} = createListInfo() // 所有科目数据，用于生成科目类型名称
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
    getType()
  }, [getList, getType])

  // 在组件加载时获取所有试卷数据，用于生成完整的搜索选项
  useEffect(() => {
    const fetchAllTestPapers = async () => {
      try {
        // 调用API获取所有试卷数据，设置较大的pagesize
        const res = await getTestPaperList({ page: 1, pagesize: 100 }) // 增加pagesize，确保获取所有试卷
        if (res.data.code === API_CODE.SUCCESS) {
          console.log('初始化allTestPapers:', res.data.data.list)
          setAllTestPapers(res.data.data.list)
        }
      } catch (e) {
        console.log('获取所有试卷数据失败:', e)
      }
    }
    fetchAllTestPapers()
  }, [])

  // 使用useMemo根据allTestPapers计算唯一的creator列表
  const creators = useMemo<string[]>(() => {
    // 确保allTestPapers是数组且有数据
    if (Array.isArray(allTestPapers) && allTestPapers.length > 0) {
      return Array.from(
        new Set(allTestPapers.map((item: TestListItem) => item.creator))
      )
    }
    return []
  }, [allTestPapers])
  
  // 科目
  const subjects = useMemo<string[]>(() => {
    // 确保allTestPapers是数组且有数据
    if (Array.isArray(allTestPapers) && allTestPapers.length > 0) {
      return Array.from(
        new Set(allTestPapers.map((item: TestListItem) => item.classify))
      )
    }
    return []
  }, [allTestPapers])

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
        // 更新allTestPapers，过滤掉已删除的试卷
        setAllTestPapers(prev => prev.filter(item => item._id !== id))
      } else {
        message.error(res.data.msg)
      }
    } catch(e) {
      console.log(e)
    }
  }

  // 点击搜索
  const onSearch = async (validValues: Partial<FormValues>) => {
    // 直接调用getList，传递搜索条件和重置的页码
    getList({
      page: 1,
      name: validValues.name,
      classify: validValues.subject, // 映射表单字段到API参数
      creator: validValues.creator
    })
    
    // 同时更新allTestPapers，确保获取最新的创建人数据
    try {
      const res = await getTestPaperList({ 
        page: 1, 
        pagesize: 100 // 增加pagesize，确保获取所有试卷
      })
      if (res.data.code === API_CODE.SUCCESS) {
        console.log('更新allTestPapers:', res.data.data.list)
        setAllTestPapers(res.data.data.list)
      }
    } catch (e) {
      console.log('更新allTestPapers失败:', e)
    }
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
        classifyList={classifyList} // 传递科目列表
      />
      <Preview
        open={open}
        loading={previewLoading}
        onClose={() => setOpen(false)}
        previewList={previewList}
        classifyList={classifyList}
      />
    </div>
  )
}

export default PaperBank