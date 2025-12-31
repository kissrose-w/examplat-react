import type {API_STATUS_CODE} from '@/constants'
import type { IconKeys } from '@/constants/icons'


// 公共响应类型
export type BaseResponse<T = never> = {
  code: API_STATUS_CODE,
  msg: string,
  data: T
}

// 验证码图片参数
export type CaptchaResponse = {
  code: string,
  text: string,
  sessionId: string
}

// 登录参数
export type LoginParams = Record<'username' | 'password' | 'code' | 'sessionId', string>

// 登录响应
export type LoginResponse = {
  token: string
}

// 权限
export type PermissionItem = {
  name: string
  path: string
}

// 用户信息
export type UserInfo = {
  _id: string
  username: string
  sex: string
  avator: string
  email: string
  age: number
  role: string[]
  permission: PermissionItem[]
  status?: string
}

// 菜单
export type MenuListItem = {
  component: string
  createTime: number
  createdAt: string
  creator: string
  disabled: string
  icon: IconKeys
  isBtn: boolean
  name: string
  path: string
  pid: string
  updatedAt: string
  _id: string
  children?: MenuListItem[]
}

// 试卷列表
interface Ques {
  order: number
  question: string
  score: number
  _id: string
}
export type TestListItem = {
  classify: string
  createdAt: string
  createTime: string
  creator: string
  description: string
  duration: number
  name: string
  questions: Ques[]
  status: number
  totalScore: number
  updatedAt: string
  __V: number
  _id: string
}
export type TestList = {
  list: TestListItem[]
  total: number
  totalPage: number
}
// 试卷参数
export type TestParams = {
  page: number
  pagesize: number
}

// 查询参数
export type QueryParams = {
  page: number,
  pagesize: number,
  classify?: string,
  createAt?: string,
  creator?: string,
  startTime?: string,
  endTime?: number
  examiner?: string
  group?: string
  name?: string
}

//页数
export type Pages = {
  page: number,
  pagesize: number
}

// 考试记录列表
export type ExaminationList = {
  list: ExaminationItem[],
  total: number,
  totalPage: number
}

// 考试记录列表项
export type ExaminationItem = {
  classify: string
  createdAt: string
  creator: string
  endTime: number
  examId: string
  examiner: string[]
  group: string[]
  name: string
  questionsList: QuestionItem[]
  startTime: number
  status: number
  __v: number
  _id: string
}

export type QuestionItem = {
  answer: string,
  classify: string,
  options: string[],
  question: string,
  type: string,
  __v: number,
  _id: string
}

// 创建考试
export type CreateExamination = {
  name: string,
  classify: string,
  examId: string,
  group: string | string[],
  examiner: string | string[],
  startTime: string,
  endTime: string
}

//科目查询list
export type SearchSubjectList = {
  _id: string
  name: string
  value: string
  creator: string
  createTime: number
  __v: number
}

//科目查询
export type SearchSubject = {
  total: number
  list: SearchSubjectList[]
  page: number
  pagesize: number
  totalPage: number
}

//创建科目参数
export type FieldType = {
  name: string
  value: string
} 

//创建科目返回值
export type SubjectCreat = Pick<BaseResponse , 'code'> & {
  msg: string
}

//试题data
export type QuestionData = {
  answer: string
  classify: string
  options: string[]
  question: string
  type: 0 | 1 | 2 | 3
  __v: number
  _id: string
}

//试题列表
export type QuestionType = {
  total: number
  totalPage: number
  list: QuestionData[]
}

export type QuestionTypeItem = Pick<SearchSubjectList, 'name' | '_id' | 'value'>


//试题类型
export type QuestionTypeValue = {
  list:QuestionTypeItem[]
}


// 查询班级响应
export type GroupResponse = {
  total: number,
  totalPage: number,
  list: GroupItem[]
}

// 班级类型
export type GroupItem = {
  classify: string,
  createTime: number,
  creator: string,
  name: string,
  students: [],
  teacher: string,
  __v: number,
  _id: string
}
//创建试卷，试卷科目分类项
export type ClassifyItem = {
  _id: string
  name: string
  sort: number
  value: string
  createdAt: string
  updatedAt: string
}

// 科目分类列表
export type ClassifyList = {
  list: ClassifyItem[]
  total: number
  totalPage: number
}

// 试卷详情questions
export type TestDetailQues = {
  _id: string
  question: string
  type: string
  classify: string
  answer: string
  options: string[]
  desc: string
  __v: number
}
// 试卷详情
export type TestPaperDetail = {
  _id: string
  name: string
  classify: string
  questions: TestDetailQues[]
}

//试题创建参数
export type CreatQuestion = Omit<TestDetailQues, '_id' | '__v'>
