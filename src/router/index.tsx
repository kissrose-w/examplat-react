import NotFound from "@/pages/404/NotFound";
import Home from "@/pages/home/Home";



const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />
  }
]


export default routes