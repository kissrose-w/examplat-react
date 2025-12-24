import React, { useEffect, useState } from 'react'
import { usersListApi, userSDelApi, userEditApi } from '@/services'
import UsersList from './components/usersList/UsersList'
import Search from './components/search/Search'
import {type  UsersListResponse, } from '@/services'
// import { type UserInfo } from '@/services/type'
import { message } from 'antd'


const Users = () => {
  const [usersInfo, setUsersInfo] = useState<UsersListResponse[]>([])
  const [total, setTotal] = useState(0)
  // const [originInfo, setOriginInfo] = useState<UserInfo[]>([])
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
  }, [params])

  const CodeEum = {
    SUCCESS: 200,
    FALSE: 400
  }

  // 删除用户
  const onDel = async(id: string) =>{
    try {
      const res = await userSDelApi(id)
      if(res.data.code === CodeEum.SUCCESS){
        getUsers()
        message.success('删除成功')
      }else{
        message.success('删除失败')
      }
    } catch (error) {
      console.log(error) 
    }
  }

  // 编辑用户
  // const onEdit = (editParams: UserInfo) => {
  //   setOriginInfo(editParams)
  // }

  return (
    <div>
      <Search />
      <UsersList
        usersInfo={usersInfo}
        params={params}
        onSetParams={setParams}
        total={total}
        onDel={onDel}
      />
    </div>
  )
}

export default Users