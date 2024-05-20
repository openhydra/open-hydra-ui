import LayoutComponent from '@src/components/LayoutComponent/LayoutComponent';
import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';
import AuthRoute from './private';
import * as _ from 'lodash-es';
import {ExperimentOutlined} from '@src/utils/antdIcon';
import DeviceSVG from '@src/assets/images/teacher/device.svg';
import DataSVG from '@src/assets/images/teacher/data.svg';
import ResourceSVG from '@src/assets/images/teacher/resource.svg';
import SettingSVG from '@src/assets/images/teacher/setting.svg';
import UserSVG from '@src/assets/images/teacher/user.svg';

function LazyWrapper(path: string) {
  const Component = lazy(() => import(`@src/pages/${path}`));
  return (
    <Suspense
      fallback={
        <Spin
          style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            marginTop: '20vh'
          }}
        />
      }
    >
      <AuthRoute component={<Component />} path={path} />
    </Suspense>
  );
}
const sourceRouterLists: any = [
  {
    path: '/login',
    key: 'login',
    element: LazyWrapper('login/view')
  },
  {
    path: '/',
    element: <LayoutComponent />,
    children: [
      {
        label: '管理端',
        key: 'manage',
        role: 1,
        items: [
          {
            label: '账号管理',
            path: '/teacher',
            icon: <UserSVG />,
            key: '1',
            element: LazyWrapper('teacher/account'),
            rule: ''
          },
          {
            label: '设备管理',
            path: '/device',
            key: '1',
            icon: <DeviceSVG />,
            element: LazyWrapper('teacher/device'),
            rule: ''
          },
          {
            label: '数据集管理',
            path: '/data',
            icon:<DataSVG />,
            key: '1',
            element: LazyWrapper('teacher/data'),
            rule: ''
          },
          {
            label: '课程资源管理',
            path: '/resource',
            icon: <ResourceSVG />,
            key: '1',
            element: LazyWrapper('teacher/resource'),
            rule: ''
          },
          {
            label: '平台配置',
            path: '/setting',
            icon:<SettingSVG />,
            key: '1',
            element: LazyWrapper('teacher/setting'),
            rule: ''
          }
        ]
      },
      {
        label: '学生端',
        key: 'student',
        role: 2,
        items: [
          {
            label: '实验环境',
            path: '/student',
            key: '0',
            element: LazyWrapper('student'),
            icon: <ExperimentOutlined />,
            rule: '',
            items: [
              {
                label: '实验',
                path: '/student/experiment',
                key: '0-1',
                element: LazyWrapper('student/experiment'),
                rule: ''
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    key: '*',
    element: LazyWrapper('notFound/404'),
    label: '404'
  }
];

export { sourceRouterLists };

/**
 * @desc 修改route框架结构,原来items下面内容，包含element的
 * @param {Object} sourceData routerLists下面每一项的children
 * @param {number} key 层级/面包屑的下标
 * @return {Array} result children的结果内容 = items下面包含element的项集合
 * */
let breadcrumbItem: any[] = [];
const changeStructure = (sourceData, key) => {
  let result: any[] = [];
  sourceData.forEach((item) => {
    // 设置层级的面包屑
    breadcrumbItem[key] = item?.element
      ? {
        label: item.label,
        path: item?.path,
        key: item?.key,
        subKey: item?.subKey
      }
      : {
        label: item.label,
        key: item?.key,
        role: item?.role,
        subKey: item?.subKey
      };
    // 遍历的层级大于当前面包屑，砍去多余
    if (breadcrumbItem.length > key) {
      breadcrumbItem = breadcrumbItem.splice(0, key + 1);
    }
    // 有items 进行递归
    if (item.items && item.items.length > 0) {
      // 有element 也需要存放结果，并将当前的items删掉
      if (item.element) {
        item.breadcrumbItem = _.cloneDeep(breadcrumbItem);
        result.push(item);
        result = result.concat(changeStructure(item.items, key + 1));
        delete item.items;
      } else {
        result = result.concat(changeStructure(item.items, key + 1));
      }
    } else if (item.children && item.children.length > 0) {
      item?.children?.forEach((childrenItem) => {
        let content: any = {};
        if (childrenItem.path.length > 0) {
          content = childrenItem;
        } else {
          let cloneDeepItem = _.cloneDeep(item);
          delete cloneDeepItem.children;
          cloneDeepItem.element = childrenItem.element;
          content = cloneDeepItem;
        }

        let json = {
          ...content,
          path: childrenItem.path.length > 0 ? item.path + '/' + childrenItem.path : item.path
        };
        let ary = _.cloneDeep(breadcrumbItem);
        if (childrenItem.path.length > 0) {
          ary.push({
            label: childrenItem.label,
            path: json.path
          });
        }
        json.breadcrumbItem = ary;
        // 将当前面包屑塞入结果数据中
        result.push(json);
      });
      delete item.children;
    } else {
      // 将当前面包屑塞入结果数据中
      item.breadcrumbItem = _.cloneDeep(breadcrumbItem);
      result.push(item);
    }
  });
  return result;
};

/**
 * @desc 将原router改成框架所识别的结构
 * @param {Object} tree === routerLists
 * */
const getNewRouterList = (tree) => {
  tree.map((module) => {
    module?.children && (module.children = changeStructure(module?.children, 0));
  });
  return tree;
};

export default getNewRouterList(_.cloneDeep(sourceRouterLists));
