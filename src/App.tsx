import { useLocation, useRoutes } from 'react-router-dom'
import routes from './router'
import { useUserStore } from './store/userStore'
import { useEffect } from 'react'

const LoginPath = '/login'

const App = () => {

  const getUserInfo = useUserStore(state => state.getUserInfo)
  const location = useLocation()

  // console.log(location.pathname)
  useEffect(() => {
    if(location.pathname !== LoginPath){
      getUserInfo()
    }
  }, [location.pathname, getUserInfo])

  return useRoutes(routes)
}

export default App