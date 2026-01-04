import { useState } from 'react'
import Avatar from './avatar/Avatar'
import { useUserStore } from '@/store/userStore'
import UserModal from './userModal/UserModal'
import { Button } from 'antd'

const Personal = () => {
  const { userInfo } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      <Avatar />
      <div style={{marginTop: 20}}>
        <p>用户名：{userInfo?.username}</p>
        <p>性别：{userInfo?.sex === 1 ? '男' : '女'}</p>
        <p>年龄：{userInfo?.age}</p>
        <p>邮箱地址：{userInfo?.email}</p>
        <p>id: {userInfo?._id}</p>
      </div>
      <Button type="primary" onClick={showModal} style={{marginTop: 15}}>
        编辑个人信息
      </Button>
      <UserModal
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
}

export default Personal