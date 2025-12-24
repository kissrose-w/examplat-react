import NotFound from '@/pages/404/NotFound'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'



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
    path: '*',
    element: <NotFound />
  }
]


export default routes