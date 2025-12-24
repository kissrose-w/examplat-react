import NotFound from '@/pages/404/NotFound'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import CreateSubiject from '@/pages/createSubject/CreateSubject'

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/question/create-subject',
    element: <CreateSubiject/>
  },
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes