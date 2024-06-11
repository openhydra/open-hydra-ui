/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/28)
 * @Description:
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.less';
import { Button, Form, Input } from 'antd';
import * as LoginServices from '@src/services/login/login';
import { LockOutlined, UserOutlined } from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import { encode } from 'js-base64';
import logo from '@src/assets/images/static/login_logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();


  const onSubmitHandle = (values: any) => {

    LoginServices.login({
      metadata:{name: values.username},
      spec:{password: values.password}
    }, {name: values.username}).then((res) => {
      let role = res?.spec?.role || 1;

      stateStorage.set('token', encode(`${values.username}:${values.password}`));
      stateStorage.set('role', role);
      stateStorage.set('name', values.username);
      navigate('/');
    });
  };
  return (
    <div className={styles.view}>
      <div className={styles.left}>
        <div className={styles.left_top}>
          <img alt={'OpenHydra'} src={logo} />
          <div>
              {/*<span>OpenHydra</span>*/}
            {/*<span className={styles.cmp}>{CMP}</span>*/}
          </div>
        </div>
        <div className={styles.form}>
          <Form form={form} onFinish={onSubmitHandle}>

            <Form.Item
              label=""
              name="username"
              rules={[{ required: true, message:'请输入用户名'}]}
              style={{ marginBottom: 50 }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={'请输入用户名'}
                className={styles.input}
                size={'large'}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="password"
              rules={[{ required: true, message:'请输入密码' }]}
              style={{ marginBottom: 80 }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className={styles.input}
                placeholder={'请输入密码'}
                size={'large'}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                size={'large'}
                style={{
                  width: '100%',
                  height: '68px',
                  fontSize: '24px',
                  backgroundColor: '#0953cc'
                }}
                type="primary"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right_bottom}>{/*@{CMP} {version}*/}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.intro}>
          {/*<img alt={CMP} src={login_left} />*/}
        </div>
      </div>
    </div>
  );
};

export default Login;
