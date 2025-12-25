
import {
  SettingOutlined,
  FileTextOutlined,
  PlusOutlined,
  DatabaseOutlined,
  FormOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  BlockOutlined
} from '@ant-design/icons'



export const IconEnum = {
  'setting': <SettingOutlined />,
  'file-text': <FileTextOutlined />,
  'plus': <PlusOutlined />,
  'database': <DatabaseOutlined />,
  'form': <FormOutlined />,
  'team': <TeamOutlined />,
  'list': <UnorderedListOutlined />,
  'user': <UserOutlined />,
  'block': <BlockOutlined />
} as const

export type IconKeys = keyof typeof IconEnum