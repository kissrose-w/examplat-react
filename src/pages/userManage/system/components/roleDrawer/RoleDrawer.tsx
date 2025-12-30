import React, { useState, useEffect} from 'react'
import { Tree, Drawer, Button, message } from 'antd'
import type { TreeProps } from 'antd'
import type{ PermissionType } from '@/services'
import { roleUpdateApi } from '@/services'
import{ API_CODE } from '@/constants'
interface Props {
  open: boolean
  setOpen: (p: boolean) => void
  permissionList: PermissionType[]
  itemPer: string[] | undefined
  editP: {
    _id: string
    name?: string
    permission?: string | string[]
  }
  onSuccess?: () => void  
}

const RoleDrawer: React.FC<Props> = ({open, setOpen, itemPer, editP, permissionList,
  onSuccess}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const checkedArr = checkedKeysValue as string[]
    setCheckedKeys(checkedArr)
  }

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setCheckedKeys(itemPer)
      })
    } else {
      Promise.resolve().then(() => {
        setCheckedKeys([])
      })
    }
  }, [open, itemPer])

  const onSave = async () => {
    try {
      const res = await roleUpdateApi({
        id: editP._id,
        name: editP.name || '', 
        permission: checkedKeys
      })
      if (res.data.code === API_CODE.SUCCESS) {
        message.success('权限分配成功')
        setOpen(false)
        onSuccess()
      } else {
        message.error( '权限分配失败')
      }
    } catch (error) {
      message.error('权限分配失败')
    }
  }


  return (
    <div>
      <Drawer
        title="分配角色"
        onClose={() => setOpen(false)}
        open={open}
        footer={<Button type='primary' onClick={() => {
          onSave()
        }}>确定</Button>}
      >
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={permissionList}
          fieldNames={{ title: 'name', key: '_id' }}
          defaultExpandAll
          multiple={true}
        /> 
      </Drawer>
      
    </div>
  )
}

export default RoleDrawer