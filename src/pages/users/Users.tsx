import React, { useEffect, useState } from 'react'
import { usersListApi } from '@/services'
import UsersList from './components/usersList/UsersList'
import Search from './components/search/Search'
import { type UsersListResponse } from '@/services'


const Users = () => {
  const [usersInfo, setUsersInfo] = useState<UsersListResponse[]>([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  const getUsers = async() => {
    try {
      const res = await usersListApi(params)
      console.log(res.data)
      setUsersInfo(res.data.data.list)
      setTotal(res.data.data.total!)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      getUsers()
    })
  }, [])

  return (
    <div>
      <Search />
      <UsersList
      usersInfo={usersInfo}
      params={params}
      onSetParams={setParams}
      total={total}
      ></UsersList>
    </div>
  )
}

export default Users