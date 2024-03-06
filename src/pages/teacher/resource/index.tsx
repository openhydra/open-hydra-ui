/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useRef, useState } from 'react';
import BaseComponent from '@src/components/BaseComponent';
import PublicTable from '@src/components/PublicTable';
import { message } from 'antd';
import {columns} from './constant';
import {ExclamationCircleOutlined} from '@src/utils/antdIcon';
import UploadData from './uploadData';
import { useRequest } from 'ahooks';
import * as ClassServices from '@src/services/teacher/resource';

const Class: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [fileList, setFileList] = useState<any>(null);

  // 初始化表格数据
  const {
    data: sourceData = {},
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => ClassServices.getClass(params).then((res) => {
    res.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
    return res;
  }), { manual: true });


  return (
    <BaseComponent pageName={'课程资源管理'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData.items || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef)}
        hiddenSearchOperate
        modalSetting={
          {
            creatButtonName: '上传课程资源',
            modalTitle: '上传课程资源',
            formName: 'updateData',
            createLoading: createLoading,
            modalWidth: 650,
            layoutConfig: {
              labelWrap: true,
              labelCol: {
                span: 6
              },
              wrapperCol: {
                span: 15
              }
            },
            FormItems: (form) => <UploadData form={form} fileList={fileList} setFileList={setFileList}/>,
            onSubmit: (values) => {
              setCreateLoading(true);
              let formObj = new FormData();
              formObj.append('file', fileList[0]);
              formObj.append('name', values?.name);
              formObj.append('description', values?.description || '');

              ClassServices.addClass(formObj)
                .then(() => {
                  message.success('创建成功');
                  setCreateLoading(false);
                  tableRef.current.closeCreateModal(true);
                })
                .catch(() => setCreateLoading(false));
            }
          }
        }
        deleteModalSetting={{
          title: '删除资源',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选课程资源？
            </>
          ),
          deleteRun: (params) => {
            ClassServices.delClass({ name: params.metadata.name })
              .then((err) => {
                message.success('删除成功');
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />
    </BaseComponent>
  );
};

export default Class;
