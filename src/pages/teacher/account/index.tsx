/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useRef, useState } from 'react';
import BaseComponent from '@src/components/BaseComponent';
import PublicTable from '@src/components/PublicTable';
import { Space, Button, Modal, Upload, Form, message } from 'antd';
import {columns} from './constant';
import { ExclamationCircleOutlined, UploadOutlined } from '@src/utils/antdIcon';
import CreateAccount from './create';
import * as AccountServices from '@src/services/teacher/account';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';

const Account: React.FC = () => {
  // const [form] = Form.useForm();
  const tableRef = useRef<any>(null);
  // const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);
  const [importData, setImportData] = useState(false);
  const [fileList, setFileList] = useState<any>(null);

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => AccountServices.getAccount(params).then((res) => {
    res.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
    return res;
  }), { manual: true });

  const fileProps = {
    maxCount: 1,
    accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onRemove: () => {
      setFileList(null);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList
  };
  return (
    <BaseComponent pageName={'账号管理'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData?.items || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef)}
        hiddenSearchOperate
        modalSetting={
          {
            creatButtonName: '创建账号',
            modalTitle: '创建账号',
            formName: 'createAccount',
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
            FormItems: (form) => <CreateAccount form={form} />,
            onSubmit: (values) => {
              setCreateLoading(true);
              delete values.confirmPassword;
              let newValues = _.cloneDeep(values);
              delete newValues.name;
              AccountServices.addAccount({
                metadata: {name: values?.name},
                spec: newValues
              })
                .then((res) => {
                  message.success('创建成功');
                  setCreateLoading(false);
                  tableRef.current.closeCreateModal(true);
                })
                .catch(() => setCreateLoading(false));
            }
          }
        }
        // buttonList={
        //     <Space>
        //       <Button type={'primary'} onClick={() => setImportData(true)}>批量导入</Button>
        //     </Space>
        // }
        deleteModalSetting={{
          title: '删除账号',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选账号？
            </>
          ),
          deleteRun: (params) => {
            setCreateLoading(true);
            AccountServices.delAccount({ name: params?.metadata?.name })
              .then(() => {
                message.success('删除成功');
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />
      <Modal
        title={'批量导入'}
        open={importData}
        onCancel={() => setImportData(false)}
        onOk={() => {}}
        cancelText={'取消'}
        okText={'导入'}
      >
        <Form>
          <Form.Item
            label={'选择文件'}
            rules={[{ required: true, message: '请选择文件' }]}>
            <Upload {...fileProps}>
              <Button icon={<UploadOutlined />}>文件上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </BaseComponent>
  );
};

export default Account;
