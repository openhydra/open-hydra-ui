/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space, Tag } from 'antd';
import globalStyles from '@src/assets/css/global.less';
import CustomIconButton from '@src/components/CustomIconButton';
import { DeleteOutlined } from '@src/utils/antdIcon';

const columns = (tableRef) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '100px',
      fixed: 'left',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '账号',
      dataIndex: ['metadata', 'name'],
      key: 'account',
      width: 180
    },
    {
      title: '姓名',
      dataIndex: ['spec', 'chineseName'],
      key: 'name',
      width: 180
    },
    {
      title: '角色',
      dataIndex: ['spec', 'role'],
      key: 'role',
      width: '100px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => (
        <Tag color={record?.spec?.role === 1 ? 'blue' : 'green'}>{record?.spec?.role === 1 ? '教师' : '学生'}</Tag>
      )
    },
    {
      title: '描述',
      dataIndex: ['spec', 'description'],
      key: 'description',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '120px',
      align: 'center',
      fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
              <CustomIconButton
                toolTipProps={{ placement: 'right' }}
                title={'删除'}
                icon={
                  <DeleteOutlined
                    className={globalStyles.iconRed}
                    onClick={() => {
                      tableRef.current.openDeleteModal(record);
                    }}
                  />
                }
              />
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
