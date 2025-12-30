import React, { useMemo, useState } from 'react'
import { permissionCreateApi } from '@/services'
import type { PermissionType, PerCreateP } from '@/services'
import { API_CODE } from '@/constants'
import { Button, Col, Drawer, Form, Input, Row, Select, Space, message} from 'antd'
import type { FormProps } from 'antd'

interface Props {
  open: boolean
  setOpen: (p: boolean) => void
  menuList: PermissionType[]
  onGetPermission: () => void
}

const MenuDrawer: React.FC<Props> = ({open, setOpen, menuList, onGetPermission}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const newMenuList = useMemo(() => {
    if (!Array.isArray(menuList)) return []
    return menuList?.map((item) => {
      return {
        ...item,
        label: item.name,
        value: item._id
      }
    })
  }, [menuList])
  const onClose = () => {
    setOpen(false)
    form.resetFields()
  }

  const onFinish: FormProps<PerCreateP>['onFinish'] = async(values) => {
    console.log('Success:', values)
    await createPermission(values)
    onGetPermission()

    onClose()
  }

  const createPermission = async(params: PerCreateP) => {
    setLoading(true)
    try {
      const res = await permissionCreateApi(params)
      console.log(res.data)
      if(res.data.code === API_CODE.SUCCESS ){
        message.success('创建权限成功')
      }else{
        message.error('创建权限失败')
      }
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <Drawer
        title="添加菜单"
        size={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        footer={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={() => {
              form.submit()
            }} 
            type="primary" 
            >
              提交
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" requiredMark={true} form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="菜单名字"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="pid"
                label="选择菜单等级"
                rules={[{ required: true, 
                  message: 'Please select an owner',
                  validator: (_, value) => {
                    // 只有 value 是 undefined（未选择任何选项）时才报错
                    if (value === undefined) {
                      return Promise.reject(new Error('请选择菜单等级'))
                    }
                    // null/其他值都视为已选择，通过校验
                    return Promise.resolve()
                  } 
                }]}
              >
                <Select
                  placeholder="请选择"
                  options={[
                    { label: '新建一级菜单', value: null }, 
                    ...newMenuList,
                  ]}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="disabled"
                label="状态"
                rules={[{ required: true, message: 'Please choose the type' }]}
              >
                <Select
                  placeholder="请选择"
                  options={[
                    { label: '开', value: 'false' },
                    { label: '关', value: 'true'},
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isBtn"
                label="权限类型"
                rules={[{ required: true, message: 'Please choose the approver' }]}
              >
                <Select
                  placeholder="请选择"
                  options={[
                    { label: '页面', value: 'false' },
                    { label: '按钮', value: 'true' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="path"
                label="路径"
                rules={[{ required: true, message: 'Please choose the approver' }]}
              >
                <Input
                  placeholder="请输入正确的路径"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}

export default MenuDrawer