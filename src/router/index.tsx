import NotFound from '@/pages/404/NotFound'
import CreateExam from '@/pages/exam/createExam/CreateExam'
import RecordExam from '@/pages/exam/recordExam/RecordExam'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import Users from '@/pages/users/Users'
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
        path: '/userManage/userOptions',
        element: <UserOptions />
      },
      {
        path: '/userManage/system',
        element: <System />
      },
      {
        path: '/userManage/menuManage',
        element: <MenuManage />
      },
      {
        path: '/userManage/personal',
        element: <Personal />
      },
      {
        path: '/paper/create-paper',
        element: <CreatePaper />
      },
      {
        path: '/paper/paper-bank',
        element: <PaperBank />
      },
      {
        path: '/exam/record',
        element: <RecordExam />
      },
      {
        path: '/exam/create',
        element: <CreateExam />
      },
      {
        path: '/question/item-bank',
        element: <ItemBank />
      },
      {
        path: '/question/create-item',
        element: <CreateItem />
      },
      {
        path: '/question/create-subject',
        element: <CreateSubject />
      },
      {
        path: '/manage-group/group-list',
        element: <GroupList />
      },
      {
        path: '/manage-group/group-students',
        element: <GroupStudents />
      },
    ]
  },
  
  {
    path: '/users',
    element: <Users />, 
  },
  {
    // 登录
    path: '/login',
    element: <Login />
  },
  {
    // 错误路径
    path: '*',
    element: <NotFound />
  }
]


export default routes