/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space } from 'antd';
import globalStyles from '@src/assets/css/global.less';
import CustomIconButton from '@src/components/CustomIconButton';
import IDName from '@src/components/IDName';
import { DeleteOutlined } from '@src/utils/antdIcon';

const columns = (tableRef) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '数据集',
      dataIndex: ['metadata', 'name'],
      key: 'data',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
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
        let disabled = record.subnetCount > 0;
        return (
          <Space>
              <CustomIconButton
                toolTipProps={{ placement: 'right' }}
                title={disabled ? '当前网络下有绑定的子网，暂不可删除' : '删除'}
                icon={
                  <DeleteOutlined
                    className={disabled ? globalStyles.iconDisabled : globalStyles.iconRed}
                    onClick={() => {
                      if (!disabled) {
                        tableRef.current.openDeleteModal(record);
                      }
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
