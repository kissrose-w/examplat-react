import { useState, useEffect } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Flex, message, Upload } from 'antd'
import type { GetProp, UploadProps } from 'antd'
import { photoApi, userEditApi } from '@/services'
import { useUserStore } from '@/store/userStore'


const Avatar = () => {
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const { userInfo } = useUserStore()

  useEffect(() => {
    setImageUrl(userInfo?.avatar)
  },[userInfo])

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式')
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片需小于 5MB')
    }
    return isJpgOrPng && isLt5M
  }

  const uploadImageToServer = async (file: FileType): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await photoApi(formData) 
      console.log('接口响应结构：', res)
      console.log(res.data)
      if (res.data.code === 200) {
        return res.data.data.url 
      } else {
        throw new Error(res.data.msg || '上传失败')
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      throw error
    }
  }

  const updateUserAvatar = async (avatarUrl: string) => {
    try {
      const response = await userEditApi({
        id: userInfo?._id as string,
        avatar: avatarUrl
      })
      
      if (response.data.code === 200) {
        message.success('头像更新成功')
        return true
      } else {
        throw new Error(response.data.msg || '头像更新失败')
      }
    } catch (error) {
      console.error('更新用户头像失败:', error)
      throw error
    }
  }

  const AvatarUpload = async (file: FileType) => {
    try {
      setLoading(true)
      const imageUrl = await uploadImageToServer(file)
      
      await updateUserAvatar(imageUrl)
      
      getBase64(file, (base64Url) => {
        // setImageUrl(base64Url) // 这里用Base64预览
        // 或者用服务器返回的URL：setImageUrl(imageUrl)
        setImageUrl(imageUrl || base64Url)
      })
    } catch (error) {
      message.error((error as Error).message || '头像上传失败')
    } finally {
      setLoading(false)
    }
  }
  
  const getPhoto: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options
    
    try {
      onProgress!({ percent: 0 })
      onProgress!({ percent: 30 })
      await AvatarUpload(file as FileType)
      onProgress?.({ percent: 100 })
      onSuccess?.({ url: imageUrl }, file)
    } catch (error) {
      onError!(error as Error)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>点击上传头像</div>
    </button>
  )

  return (
    <div>
      <Flex gap="middle" wrap>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={getPhoto}
          beforeUpload={beforeUpload}
        >
          {imageUrl ? (
            <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Flex>
    </div>
  )
}

export default Avatar