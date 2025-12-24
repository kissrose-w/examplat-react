import NotFound from "@/pages/404/NotFound";
import Home from "@/pages/home/Home";
import Users from "@/pages/users/Users";


const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes