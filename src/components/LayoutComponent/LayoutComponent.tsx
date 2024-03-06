/**
 * @AUTHOR zhy
 * @DATE zhy (2022/04/18)
 * @Description:
 */
import {
  createFromIconfontCN,
  ExportOutlined,
  LogoutOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined
} from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import type { MenuProps } from 'antd';
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

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_2001023_a6frjckis3n.js']
});
const { Header, Sider } = Layout;

function LayoutComponent() {
  const navigate = useNavigate();
  const routerParams = useParams();
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
                    <Tooltip placement="bottomLeft" title={ol.label}>
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
                      </div>
                    </Tooltip>,
                    ol.key + '_' + index
                  )
                );
                menu.breadcrumbItem[currentIndex].path === ol.path &&
                  setSelectedKeys(_.cloneDeep([ol.key + '_' + index]));
              });
              currentItems.push(
                getItem(
                  <Tooltip placement="bottomLeft" title={item.label}>
                    {item.label}
                  </Tooltip>,
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
                    <Tooltip placement="bottomLeft" title={item.label}>
                      <div
                        onClick={() => {
                          setSelectedKeys([item.key + '_' + index]);
                          navigate(item.routePath || item.path);
                        }}
                      >
                        {item.label}
                      </div>
                    </Tooltip>,
                    item.key + '_' + index
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
                  <img src={logo} alt="" />
                  <span>OpenHydra</span>
                </div>
              </div>
              <ul className={styles.headerRight}>
                <li>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    onClick={(item) => changeMenu(item.key)}
                    items={[
                      {
                        key: 'user',
                        icon: <UserOutlined style={{ fontSize: 18, color: '#fff' }} />,
                        label: stateStorage.get('name'),
                        children: [
                          {
                            key: 'logOut',
                            icon: <LogoutOutlined style={{ fontSize: 16 }} />,
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
                  width={200}
                  collapsible
                  collapsed={collapsed}
                  style={{ paddingBottom: 93 }}
                  onCollapse={() => setCollapsed(!collapsed)}
                  collapsedWidth={0}
                  trigger={
                    <div>
                      {collapsed ? (
                        <RightOutlined style={{ fontSize: 18 }} />
                      ) : (
                        <LeftOutlined style={{ fontSize: 18 }} />
                      )}
                    </div>
                  }
                >
                  <div className={`${styles.allService} ${(collapsed && styles.centerAllService) || ''}`}>
                    <IconFont type={bigTitle?.icon || 'iconjisuan'} style={{ marginRight: 8, fontSize: 18 }} />
                    <Tooltip placement="bottomLeft" title={!collapsed && bigTitle?.name}>
                      <span>{!collapsed && bigTitle?.name}</span>
                    </Tooltip>
                  </div>
                  <Menu
                    mode="inline"
                    openKeys={(!collapsed && openKeys) || undefined}
                    selectedKeys={selectedKeys}
                    items={currentMenuList}
                    className={styles.fixMenu}
                  />
                </Sider>
              )}

              <Layout style={{ padding: '20px', overflow: 'auto' }}>
                <Outlet />
              </Layout>
            </Layout>
        </Layout>
      </Spin>
    </ConfigProvider>
  );
}

export default LayoutComponent;
