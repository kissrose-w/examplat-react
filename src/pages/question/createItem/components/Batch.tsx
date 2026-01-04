import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload, Form, Space, Button } from 'antd'

const Batch = () => {
  const { Dragger } = Upload
  const checkExcelFile = (file: File) => {
    // Excel文件的MIME类型
    const excelTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.oasis.opendocument.spreadsheet' // .ods
    ]
    
    // 获取文件后缀名
    const fileName = file.name
    const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
    
    // 校验文件类型
    if (!['xls', 'xlsx', 'ods'].includes(fileExt) && !excelTypes.includes(file.type)) {
      message.error('只能上传Excel格式的文件（.xls/.xlsx）！')
      return false
    }
    return true
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accept: '.xls,.xlsx',
    beforeUpload: (file) => {
      return checkExcelFile(file)
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  return (
    <Form layout='vertical'>
      <Form.Item label="上传excel批量导入" rules={[{required: true, message: '请上传excel表格'}]}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          <p className="ant-upload-hint">
            支持单次或批量上传，仅允许上传 .xls / .xlsx 格式的Excel文件
          </p>
        </Dragger>
      </Form.Item>
      <Form.Item>
        <Space>  
          <Button color="primary" variant="solid">
            提交
          </Button>
          <Button color="default" variant="dashed">
            重置
          </Button>
          <a href="/public/templates/question-import-template.xlsx" download="题目批量导入模板.xlsx">
            下载导入模板
          </a>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Batch