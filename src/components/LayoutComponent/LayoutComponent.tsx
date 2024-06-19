/**
 * @AUTHOR zhy
 * @DATE zhy (2022/04/18)
 * @Description:
 */
import {
  ExportOutlined,
  LogoutOutlined,
  UserOutlined,
  UnlockOutlined
} from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import {Modal, MenuProps, message, Form, Input} from 'antd';
import {
  ConfigProvider,
  Layout,
  Menu,
  Spin,
  Tooltip
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './style.less';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import routerLists from '@src/routers/routerLists';
import * as _ from 'lodash-es';
import { SlideMenuTitleList } from './constant';
import { RootContext } from '@src/frame/rootContext';
import logo from '@src/assets/images/static/img.png';
import StudentSVG from '@src/assets/images/student/logo.svg';
import TeacherSVG from '@src/assets/images/teacher/logo.svg';
import { checkKeystonePassword } from '@src/utils/regular';
import * as CommonServices from '@src/services/common';

const { Header, Sider } = Layout;

function LayoutComponent() {
  const navigate = useNavigate();
  const routerParams = useParams();
  const [form] = Form.useForm();
  // 获取全局的数据
  const { state } = useContext(RootContext);

  const [collapsed, setCollapsed] = useState(false);


  const [currentMenuList, setCurrentMenuList] = useState<any>([]);

  type MenuItem = Required<MenuProps>['items'][number];
  const location = useLocation();
  const { pathname } = location;

  const [bigTitle, setBigTitle] = useState<any>({});
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);



  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem;
  }

  /**
   * @desc 切换用户中心下的菜单
   * @param {string} key  每个菜单的唯一标志key
   * */
  const changeMenu = (key) => {
    if (key === 'logOut') {
      navigate('/login');
      stateStorage.clear();
    } else if (key === 'changePassword') {
      setPasswordOpen(true);
    }
  };

  /**
   * @desc 将routerList中的path + 参数 —— 转成浏览器路由形式
   * @param {string} path routerList中的path
   * @return {string} 转成浏览器路由形式
   * */
  const getCurrentPath = (path) => {
    Object.keys(routerParams).forEach((key) => {
      path = path?.replace(`:${key}`, routerParams[key]);
    });
    return path;
  };

  /***
   * @desc 左边新菜单
   * @param {Object} allMenuList 扁平化数据
   * @param {pathname} 当前url path
   * */
  const getNewMenuHandle = (allMenuList, pathname) => {
    if (pathname === '/') pathname = '/welcome';

    allMenuList.map((menu: any) => {
      if (getCurrentPath(menu.path) === pathname) {
        let currentIndex = 0;
        menu.breadcrumbItem.forEach((breadcrumb, index) => {
          if (breadcrumb.path && currentIndex === 0) currentIndex = index;
        });
        let currentKey = menu.breadcrumbItem[currentIndex].key.includes('-')
          ? menu.breadcrumbItem[currentIndex].key.split('-')[0]
          : menu.breadcrumbItem[currentIndex].key;

        // 当前菜单结构
        let currentMenu:any = SlideMenuTitleList.filter((el: any) => el.key === currentKey)[0] || {};
        let currentItems: any = [];

        if (currentMenu?.children) {
          let keys: any = [];
          currentMenu?.children.forEach((item: any) => {
            let array: any = [];
            keys.push(item.key); // 展开的菜单key

            // 当前所有二级菜单的项
            let linkMenu: any = allMenuList.filter((el) => el.key === item.key || el.subKey === item.key) || [];

            // 有二级菜单，才进行处理
            if (linkMenu.length > 0) {
              linkMenu?.forEach((ol, index) => {
                // 所有二级菜单扁平化，放入array数组中
                array.push(
                  getItem(
                    // <Tooltip placement="topRight" title={ol.label}>
                      <div
                        style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => {
                          setSelectedKeys([ol.key + '_' + index]);
                          navigate(ol.path);
                        }}
                      >
                        {ol.label}
                        {ol.subKey && ol.key !== item.key && (
                          <ExportOutlined style={{ fontSize: 16, marginLeft: 8, color: '#aaa' }} />
                        )}
                      </div>,
                    // </Tooltip>,
                    ol.key + '_' + index
                  )
                );
                menu.breadcrumbItem[currentIndex].path === ol.path &&
                  setSelectedKeys(_.cloneDeep([ol.key + '_' + index]));
              });
              currentItems.push(
                getItem(
                  item.label,
                  // <Tooltip placement="topRight" title={item.label}>
                  //   {item.label}
                  // </Tooltip>,
                  item.key,
                  null,
                  array
                )
              );
            }
          });
          setOpenKeys(keys);
        } else {
          // 当前菜单结构没有子标题
          allMenuList
            .filter((el) => el.key === currentMenu.key)
            .forEach((item, index) => {
              (item.rule === '') &&
                currentItems.push(
                  getItem(
                    // <Tooltip placement="topRight" title={item.label}>
                      <div
                        onClick={() => {
                          setSelectedKeys([item.key + '_' + index]);
                          navigate(item.routePath || item.path);
                        }}
                      >
                        {item.label}
                      </div>,
                    // </Tooltip>,
                    item.key + '_' + index,
                    item.icon
                  )
                );
              menu.breadcrumbItem[currentIndex].path === item.path &&
                setSelectedKeys(_.cloneDeep([item.key + '_' + index]));
            });
        }
        setCurrentMenuList(currentItems);
        setBigTitle({ name: currentMenu?.label || '', icon: currentMenu?.icon });
      }
    });
  };
  const editPasswordHandle = () => {
    form.validateFields().then(async (values) => {
      CommonServices.updateUserPassword(
        {
          metadata:{name: stateStorage.get('name')},
          spec:{password: values.password, role: stateStorage.get('role')}
        }, {name: stateStorage.get('name')}
      )
        .then(() => {
          message.success('修改成功');
          stateStorage.set('password', values.password);
          setEditLoading(false);
          setPasswordOpen(false);
        })
        .catch((error) => {
          setEditLoading(false);
          message.success(error.error.message);
        });
    });
  };
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
      password?.length > 0 &&
      type === 'confirm'
    ) {
      return Promise.reject('两次密码不一致');
    }
    return Promise.resolve();
  };
  useEffect(() => {
    let role = stateStorage.get('role');
    let allMenuList = routerLists.filter((item) => item.path === '/')[0]?.children;
    allMenuList = allMenuList.filter((res) => res.breadcrumbItem.filter((breadcrumb) => breadcrumb.role === role).length > 0);

    allMenuList.filter((menu) => menu.path === pathname).length === 0 && navigate('/404');

    getNewMenuHandle(allMenuList, pathname);
    if(pathname === '/') navigate(stateStorage.get('role') === 1 ? '/teacher' : '/student');
  }, [pathname, stateStorage.get('lang')]);

  return (
    <ConfigProvider locale={stateStorage.get('lang') === 'CN' ? zhCN : enUS}>
      <Spin spinning={false}>
        <Layout style={{ height: '100vh' }}>
          <Header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}>
                <img src={logo} alt=""/>
                <span>用开源的方式助力人工智能</span>
              </div>
            </div>
            <ul className={styles.headerRight}>
              <li>
                <Menu
                  theme="light"
                  mode="horizontal"
                  onClick={(item) => changeMenu(item.key)}
                  items={[
                    {
                      key: 'user',
                      icon: <UserOutlined style={{fontSize: 18, color: '#fff'}}/>,
                      label: '', //stateStorage.get('name'),
                      children: [
                        {
                          key: 'changePassword',
                          icon: <UnlockOutlined style={{ fontSize: 16 }} />,
                          label:'修改密码'
                        },
                        {
                          key: 'logOut',
                          icon: <LogoutOutlined style={{fontSize: 16}}/>,
                          label: '退出登录'
                        }
                      ]
                    }
                  ]}
                />
              </li>
            </ul>
          </Header>

          <Layout>
            {!state.LayoutComponent.isAutoEdit && (
              <Sider
                theme="light"
                width={256}
                collapsible
                collapsed={collapsed}
                style={{paddingBottom: 93}}
                onCollapse={() => setCollapsed(!collapsed)}
                >
                  <div className={`${styles.allService} ${(collapsed && styles.centerAllService) || ''}`}>
                    {/*<ApartmentOutlined style={{ marginRight: 8, fontSize: 18, height: 20 }} />*/}
                    {/*<img src={student} />*/}
                    {
                      stateStorage.get('role') === 1 ?
                        <TeacherSVG style={{ width: 30}}/> :
                        <StudentSVG style={{ width: 30}}/>
                    }
                    {
                      !collapsed &&
                      <Tooltip placement="bottomLeft" title={!collapsed && bigTitle?.name}>
                        <span style={{paddingLeft: 8}}>{!collapsed && bigTitle?.name}</span>
                      </Tooltip>
                    }

                  </div>
                  <Menu
                    mode="inline"
                    openKeys={(!collapsed && openKeys) || undefined}
                    selectedKeys={selectedKeys}
                    items={currentMenuList}
                  />
                </Sider>
              )}

              <Layout style={{ padding: '30px', overflow: 'auto', background:'#E4E9F6' }}>
                <Outlet />
              </Layout>
            </Layout>
        </Layout>
        <Modal
          title={'修改密码'}
          open={passwordOpen}
          onOk={editPasswordHandle}
          onCancel={() => {
            setPasswordOpen(false);
            form.resetFields();
          }}
          okText={'确认'}
          cancelText={'取消'}
          confirmLoading={editLoading}
        >
          <Form form={form} name={'editUser'} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Form.Item
              label={'新密码'}
              name="password"
              rules={[
                { required: true, message: ''},
                { validator: (rule, value) => validatorPassword(rule, value) }
              ]}
            >
              <Input.Password autoComplete="new-password" placeholder={'请输入新密码'} />
            </Form.Item>
            <Form.Item
              label={'确认新密码'}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '' },
                { validator: (rule, value) => validatorPassword(rule, value, 'confirm') }
              ]}
            >
              <Input.Password placeholder={'请再次输入新密码'} />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </ConfigProvider>
  );
}

export default LayoutComponent;
