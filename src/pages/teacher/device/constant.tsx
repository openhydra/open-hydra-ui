/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space, Tag, Button, Tooltip } from 'antd';
import globalStyles from '@src/assets/css/global.less';
import CustomIconButton from '@src/components/CustomIconButton';
// import IDName from '@src/components/IDName';
import { SyncOutlined } from '@src/utils/antdIcon';

const statusMap = {
  Running: {
    color: 'blue',
    text: '运行中'
  },
  1: {
    color: 'green',
    text: '已完成'
  },
  2: {
    color: '',
    text: '未运行'
  },
  3: {
    color: 'volcano',
    text: '警告'
  },
  4: {
    color: 'red',
    text: '失败'
  }
};

const columns = (tableRef, openHandle, closeHandle) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '40px',
      ellipsis: {
        showTitle: false
      }
    },
    // {
    //   title: '名称',
    //   dataIndex: 'name',
    //   key: 'name',
    //   width: '150px',
    //   ellipsis: {
    //     showTitle: false
    //   },
    //   render: (_, record) => <Tooltip placement={'top'} title={record?.metadata?.name || '-'}>{record?.metadata?.name || '-'}</Tooltip>
    // },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: '100px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.spec?.deviceIP || '-'
    },
    {
      title: '账号',
      dataIndex: ['metadata', 'name'],
      key: 'account',
      width: '100px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.metadata?.name || '-'
    },
    {
      title: '启动时间',
      dataIndex: ['metadata', 'creationTimestamp'],
      key: 'created',
      width: '100px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.metadata?.creationTimestamp || '-'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '60px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => (
        <Tag color={record?.spec?.role === 1 ? 'blue' : 'green'}>{record?.spec?.role === 1 ? '教师' : '学生'}</Tag>
      )
    },
    {
      title: '姓名',
      dataIndex: ['spec', 'chineseName'],
      key: 'name',
      width: '80px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.spec?.chineseName || '-'
    },
    {
      title: '容器状态',
      dataIndex: ['spec', 'deviceStatus'],
      key: 'status',
      width: 80,
      ellipsis: {
        showTitle: false
      },
      valueEnum:(_) => {
        return {
          default: { text: '未运行', status: 'Default' },
          Creating: { text: '创建中', status: 'Default' },
          Pending: { text: '排队(资源不足)', status: 'Default' },
          Running: { text: '运行中', status: 'Processing' },
          Terminating: { text: '关闭中', status: 'Success' }
          // Queued: { text: `排队中 ( 前面有${_?.spec?.lineNo}在等待 )`, status: 'Success' }
        };
      }
    },
    {
      title: '容器类型',
      dataIndex: 'type',
      key: 'type',
      width: '80px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => <Tag color={record?.spec?.deviceType === 'cpu' ? 'gold' : 'volcano'}>{record?.spec?.deviceType || '-'}</Tag>
    },
    {
      title: 'jupyterLabUrl',
      dataIndex: ['spec', 'jupyterLabUrl'],
      key: 'type',
      width: 180,
      ellipsis: {
        showTitle: true
      },
      render: (_, record) => record?.spec?.jupyterLabUrl ? <a href={record?.spec?.jupyterLabUrl} target="_blank" rel="noop">{record?.spec?.jupyterLabUrl}</a> : '-'
    },
    {
      title: 'vsCodeUrl',
      dataIndex: ['spec', 'vsCodeUrl'],
      key: 'type',
      width: 180,
      ellipsis: {
        showTitle: true
      },
      render: (_, record) => record?.spec?.vsCodeUrl ? <a href={record?.spec?.vsCodeUrl} target="_blank" rel="noop">{record?.spec?.vsCodeUrl}</a> : '-'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '180px',
      align: 'center',
      fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => {
        let canOpen = record?.spec?.deviceStatus === 'default';
        let canClose = record?.spec?.deviceStatus === 'default' || record?.spec?.deviceStatus === 'Terminating';
        return (
          <Space>
            <Button
              type="link"
              disabled={!canOpen}
              icon={<SyncOutlined />}
              loading={record?.spec?.deviceStatus === 'Create' || record?.spec?.deviceStatus === 'Pending' }
              onClick={() => canOpen && openHandle(record)}>
              {(record?.spec?.deviceStatus === 'Create' || record?.spec?.deviceStatus === 'Pending') ? '启动中' : '启动'}
            </Button>
            <Button
              type="link"
              danger
              disabled={canClose}
              icon={<SyncOutlined />}
              loading={record?.spec?.deviceStatus === 'Terminating'}
              onClick={() => !canClose && closeHandle(record)}>
              {record?.spec?.deviceStatus === 'Terminating' ? '关闭中' : '关闭'}
            </Button>
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
