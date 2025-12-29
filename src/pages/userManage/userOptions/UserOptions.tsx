import React, { useEffect, useState } from 'react'
import { usersListApi, userSDelApi, userEditApi, userCreateApi} from '@/services'
import UsersList from '../../userManage/userOptions/components/usersList/UsersList'
import Search from '../../userManage/userOptions/components/search/Search'
import UserModal from '../../userManage/userOptions/components/userModal/UserModal'
import type { UsersListResponse } from '@/services'
import type { UserInfo } from '@/services/type'
import { message } from 'antd'

const UserOptions = () => {
  const [usersInfo, setUsersInfo] = useState<UsersListResponse[]>([])
  const [total, setTotal] = useState(0)
  const [originInfo, setOriginInfo] = useState<UserInfo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [loading, setLoading] = useState(false)
  const [searchP, setSearchP] = useState({})
  const [params, setParams] = useState({
    page: 1,
    pagesize: 5
  })
  // 获取用户列表
  const getUsers = async() => {
    try {
      const res = await usersListApi({...params,...searchP})
      // console.log(params)
      // console.log(res.data)
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
  }, [params, searchP])

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
  const onEdit = async(editParams: UserInfo) => {
    setLoading(true)
    try {
      const res = await userEditApi(editParams)
      // console.log(res.data)
      if(res.data.code === CodeEum.SUCCESS){
        message.success('编辑成功')
      }else{
        message.error('编辑失败')
      }
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  // 创建用户
  const onCreate = async(createParams: UserInfo) => {
    setLoading(true)
    try {
      const formattedParams = {
        ...createParams,
        age: Number(createParams.age),
      }
      const res = await userCreateApi(formattedParams)
      // console.log(formattedParams)
      // console.log(res.data)
      if(res.data.code === CodeEum.SUCCESS){
        message.success('创建成功')
      }else{
        message.error('创建失败')
      }
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  const getSearchP = (p) => {
    setSearchP(p)
    setParams({...params, page: 1})
    // getUsers()
  }
  
 
  return (
    <div>
      <Search 
        setIsModalOpen={setIsModalOpen}
        setMode={setMode}
        getSearchP={getSearchP}
      />
      <UsersList
        loading={loading}
        usersInfo={usersInfo}
        params={params}
        onSetParams={setParams}
        total={total}
        onDel={onDel}
        onSetOriginInfo={setOriginInfo}
        setIsModalOpen={setIsModalOpen}
        setMode={setMode}
      />
      <UserModal 
        onEdit={onEdit}
        originInfo={originInfo}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        mode={mode}
        onCreate={onCreate}
      />
    </div>
  )
}

export default UserOptions