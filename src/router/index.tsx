import NotFound from '@/pages/404/NotFound'
import CreateExam from '@/pages/exam/createExam/CreateExam'
import RecordExam from '@/pages/exam/recordExam/RecordExam'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import GroupList from '@/pages/manageGroup/groupList/GroupList'
import GroupStudents from '@/pages/manageGroup/groupStudents/GroupStudents'
import CreatePaper from '@/pages/paper/createPaper/CreatePaper'
import PaperBank from '@/pages/paper/paperBank/PaperBank'
import CreateItem from '@/pages/question/createItem/CreateItem'
import CreateSubject from '@/pages/question/createSubject/CreateSubject'
import ItemBank from '@/pages/question/itemBank/ItemBank'
import MenuManage from '@/pages/userManage/menuManage/MenuManage'
import Personal from '@/pages/userManage/personal/Personal'
import System from '@/pages/userManage/system/System'
import UserOptions from '@/pages/userManage/userOptions/UserOptions'


const routes = [
  {
    // 首页
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/question/create-subject',
        element: <CreateSubject/>
      },
    ]
  },
  
  {
    // 登录
    path: '/login',
    element: <Login />
  },
  
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes