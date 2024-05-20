/**
 * Author: lx
 * Date: 2022-07-28
 * Description: 基础组件类
 *
 */
import React, { useEffect, useState } from 'react';
import LayoutBreadcrumb from '../LayoutBreadcrumb/LayoutBreadcrumb';
import styles from './style.less';
import { ArrowLeftOutlined } from '@src/utils/antdIcon';
import { Content } from 'antd/lib/layout/layout';
import { useLocation } from 'react-router-dom';
import stateStorage from '@src/storage/stateStorage';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// antd组件国际化翻译
import enUSIntl from 'antd/es/locale/en_US';
import zhCNIntl from 'antd/es/locale/zh_CN';
import zhTWIntl from 'antd/es/locale/zh_TW';
import { ConfigProvider } from 'antd';
import routerLists from '@src/routers/routerLists';

// 国际化语言list
const intlMap = {
  zhCNIntl,
  znENIntl: enUSIntl,
  zhTWIntl
};

const BaseComponent = (props: {
  pageName?: string; // 页面名称
  pageDes?: any; // 描述
  goBack?: boolean; // 是否显示返回上一页按钮
  buttonList?: JSX.Element; // 编辑/取消/保存等操作按钮的slot
  showBreadcrumb?: boolean; // 是否显示整个面包屑 默认true
  breadcrumbParams?: {
    // key为path中的key去掉：
    // 假如path为  /user/:id/tags/:tagId
    // 自定义传参为  params:{id:'自定义,tagId:'自定义'}
    [keyName: string]: string;
  };
  [propName: string]: any;
}) => {
  const currentPath = useLocation().pathname;
  const menuList = routerLists.filter((item) => item.path === '/')[0].children;
  // 默认每个页面需要返回按钮
  const [status, setStatus] = useState<any | boolean>(false);
  dayjs.locale(intlMap[`zh${stateStorage.get('lang')}Intl`]);
  /**
   * @desc 判断当前页面是否需要goBack
   * @param {Object} menu 菜单List
   * @param {string} path 当前path
   * */
  const goBackStatus = (menu, path, show) =>
    menu?.forEach((item) => {
      if (item?.path) {
        // 如果当前path，是接口返回的根模块的，不需要返回按钮
        if (path === item.path) {
          show.isShow = false;
        }
      } else {
        goBackStatus(item.items, path, show);
      }
    });
  useEffect(() => {
    if (props.goBack !== false) {
      let show = { isShow: true };
      goBackStatus(menuList, currentPath, show);
      setStatus(show.isShow);
    }
  }, [props.goBack]);

  const { breadcrumbParams, pageName, pageDes, buttonList, showBreadcrumb = true, customStyle } = props;

  return (
    <>
      {showBreadcrumb && (
        <div className={styles.contentHeader}>
          <div>
            <div style={{ height: '22px' }}>{<LayoutBreadcrumb breadcrumbParams={breadcrumbParams || {}} />}</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px'
              }}
            >
              <div>
                {status && (
                  <a
                    style={{ verticalAlign: 'middle', marginRight: '12px' }}
                    onClick={() => {
                      history.go(-1);
                    }}
                  >
                    <ArrowLeftOutlined style={{ fontSize: '16px', color: '#000' }} />
                  </a>
                )}
                <h2 style={{ display: 'inline', fontSize: '26px', verticalAlign: 'sub' }}>{pageName || '-'}</h2>
              </div>
              <div>{buttonList}</div>
            </div>
          </div>
          {pageDes && <div>{pageDes}</div>}
        </div>
      )}
      <Content
        className="site-layout-background"
        style={
          customStyle || {
            padding: showBreadcrumb ? 20 : 20,
            margin: 0,
            minHeight: 280,
            backgroundColor: '#fff',
            borderRadius:4,
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'auto'
          }
        }
      >
        <ConfigProvider locale={intlMap[`zh${stateStorage.get('lang')}Intl`]}>{props.children}</ConfigProvider>
      </Content>
    </>
  );
};
export default BaseComponent;
