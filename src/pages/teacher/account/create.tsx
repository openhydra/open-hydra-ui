/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React from 'react';
import { Form, Input, Select } from 'antd';
import { checkKeystonePassword } from '@src/utils/regular';

const CreateAccount = (props) => {
  const form = props.form;
  /**
   * @desc 密码校验
   * */
  const validatorPassword = (rule, value, type?: string) => {
    let password = form.getFieldValue('password');
    let confirmPassword = form.getFieldValue('confirmPassword');
    if (!checkKeystonePassword(value)) {
      return Promise.reject('密码需要包含数字、字母、且长度至少7位');
    } else if (
      confirmPassword !== password &&
      confirmPassword?.length > 0 &&
      password?.length > 0
    ) {
      return Promise.reject('两次密码不一致');
    }
    return Promise.resolve();
  };
  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {({ getFieldValue, setFieldsValue }) => (
        <>
          <Form.Item label={'账号'} rules={[{ required: true, message: '请输入账号'}]} name="name">
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label={'姓名'} rules={[{ required: true, message: '请输入姓名'}]} name="chineseName">
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label={'密码'}
            rules={[
              { required: true, message: '请输入密码' },
              { validator: (rule, value) => validatorPassword(rule, value) }
            ]}
            name="password">
            <Input.Password autoComplete="new-password" placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label={'确认密码'}
            rules={[
              { required: true, message: '请再次输入密码' },
              { validator: (rule, value) => validatorPassword(rule, value) }
            ]}
            name="confirmPassword">
            <Input.Password placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label={'角色'}
            rules={[
              { required: true, message: '请选择' }
            ]}
            name="role">
            <Select
              options={[
                {value: 1, label: '教师'},
                {value: 2, label: '学生'}
              ]}
              placeholder={'请选择'} />
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
export default CreateAccount;
