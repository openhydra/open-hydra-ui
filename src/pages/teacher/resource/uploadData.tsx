/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React from 'react';
import {UploadOutlined} from '@src/utils/antdIcon';
import { Form, Input, Button, Upload } from 'antd';

const UploadData = (props) => {
  const {fileList, setFileList} = props;


  const fileProps = {
    maxCount: 1,
    accept: '.zip,.rar',
    onRemove: () => {
      setFileList(null);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {() => (
        <>
          <Form.Item label={'课程资源名称'} rules={[{ required: true, message: '请输入'}]} name="name">
            <Input placeholder={'请输入'} />
          </Form.Item>

          <Form.Item
            label={'选择文件'}
            name={'file'}
            rules={[{ required: true, message: '请选择文件' }]}>
            <Upload {...fileProps}>
              <Button icon={<UploadOutlined />}>文件上传</Button>
            </Upload>
          </Form.Item>

          <Form.Item label={'描述'} rules={[{ required: false, message: '' }]} name={'description'}>
            <Input.TextArea
              showCount
              maxLength={100}
              style={{ height: 80, resize: 'none' }}
              placeholder={'请输入描述'}
            />
          </Form.Item>

        </>
      )}
    </Form.Item>
  );
};
export default UploadData;
