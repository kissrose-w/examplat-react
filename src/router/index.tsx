import NotFound from "@/pages/404/NotFound";
import Home from "@/pages/home/Home";
import Student from "@/pages/student/Student";
import { lazy } from "react";

const Exam_list = lazy(() => import('@/pages/student/components/exam_list/Exam_list'))
const Exam_detail = lazy(() => import('@/pages/student/components/exam_detail/Exam_detail'))

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/student',
    element: <Student />,
    children: [
      {path: '/student', element: <Exam_list /> },
      {path: '/student/examDetail', element: <Exam_detail /> }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes