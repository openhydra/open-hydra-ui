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
import * as DataSetServices from '@src/services/teacher/data';

const Data: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [fileList, setFileList] = useState<any>(null);

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => DataSetServices.getDatasets(params).then((res) => {
    res.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
    return res;
  }), { manual: true });


  return (
    <BaseComponent pageName={'数据集管理'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData?.items || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef)}
        hiddenSearchOperate
        modalSetting={
          {
            creatButtonName: '上传数据集',
            modalTitle: '上传数据集',
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

              DataSetServices.addDatasets(formObj)
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
          title: '删除数据',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选数据集？
            </>
          ),
          deleteRun: (params) => {
            DataSetServices.delDatasets({ name: params.metadata.name })
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

export default Data;
