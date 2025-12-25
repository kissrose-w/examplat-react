import NotFound from '@/pages/404/NotFound'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import Student from '@/pages/student/Student'
// import Exam_list from '@/pages/student/components/exam_list/Exam_list'
// import Exam_detail from '@/pages/student/components/exam_detail/Exam_detail'
import { lazy } from 'react'

const Exam_list = lazy(() => import('@/pages/student/components/exam_list/Exam_list'))
const Exam_detail = lazy(() => import('@/pages/student/components/exam_detail/Exam_detail'))
const GroupList = lazy(() => import('@/pages/group/GroupList/GroupList'))
const GroupStudents = lazy(() => import('@/pages/group/GroupStudents/GroupStudents'))
const CreatePaper = lazy(() => import('@/pages/testPaper/createPaper/CreatePaper'))

const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/student',
        element: <Student />,
        children: [
          {path: '/student/list', element: <Exam_list />},
          {path: '/student/detail', element: <Exam_detail />}
        ]
      }
    ]
  },
  {
    path: '/paper/create-paper',
    element: <CreatePaper />
  },
  {
    path: '/manage-group/group-list',
    element: <GroupList />
  },
  {
    path: '/manage-group/group-students',
    element: <GroupStudents />
  },
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes