/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, {useEffect, useRef, useState} from 'react';
import { useRequest } from 'ahooks';
import BaseComponent from '@src/components/BaseComponent';
import PublicTable from '@src/components/PublicTable';
import {Alert, message, Modal, Radio, Space, Spin, Tooltip} from 'antd';
import { columns } from './constant';
import * as DevicesServices from '@src/services/teacher/device';
import * as SettingServices from "@src/services/teacher/setting";

let intervalTime:any = null;
const Data: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [isLoop, setIsLoop] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [settingLoading, setSettingLoading] = useState(false);
  const [optionLoading, setOptionLoading] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>({});
  const [type, setType] = useState(0); // gpu 1 cpu 0
  const [sandboxName, setSandboxName] = useState('jupyterlab'); // vscode or jupyterlab
  const [sandboxList, setSandboxLis] = useState<any>([]); // vscode or jupyterlab

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack,
    refresh: refreshCallBack
  } = useRequest((params) => DevicesServices.getDevices(params).then((res) => {
    clearInterval(intervalTime)
    res.items.map((el, index) => (el.spec.deviceStatus = el?.spec?.deviceStatus || 'default', el.id = el.metadata.name + '_' +index));
    params.searchContent && (res.items = res.items.filter((a) => a.metadata.name.includes(params.searchContent)));

    for(let item of res.items){
      if(!(item.spec.deviceStatus === 'Running' || item.spec.deviceStatus === 'default')){
        setIsLoop(true);
        intervalTime = setInterval(() => refreshCallBack(), 5000);
        break;
      }
    }

    return res;
  }), { manual: true });

  /* Tips===使用情况 */
  const {
    data: sumupsData
  } = useRequest(() => DevicesServices.getDevicesSum());

  /* 默认的设备类型 === 在菜单平台设置中进行配置的*/
  const {
    data: defaultDeviceType,
    refresh
  } = useRequest(() => SettingServices.getDefaultSetting({}).then((res) => {
    setType(res.spec?.default_gpu_per_device);
    setSandboxName(Object.keys(res.spec?.plugin_list?.sandboxes)[0] || '');
    setSandboxLis(res.spec?.plugin_list?.sandboxes ? Object.keys(res.spec?.plugin_list?.sandboxes) : [])
    return res;
  }), {manual: true});


  const openHandle = (record) => {
    refresh();
    setShowOpen(true);
    setCurrentDevice(record);
  };
  const closeHandle = (record) => {
    Modal.confirm({
      title: '关闭设备',
      content: '确定关闭当前设备吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        DevicesServices.delDevices({
          metadata: { name: record?.metadata?.name },
          spec: {}
        }, { name: record?.metadata?.name }).then(() => {
          message.success('关闭成功');
          refreshCallBack();
        });
      }
    });
  };
  useEffect(() => {
    () => clearInterval(intervalTime);
  }, []);

  return (
    <BaseComponent pageName={'设备管理'}>
      <Spin spinning={optionLoading}>
        <Alert
          message={
            <div>
              <span>设置使用情况</span>
              <span style={{
                fontWeight: 'bold',
                fontSize: 16
              }}> {sumupsData?.spec?.podAllocated} / {sumupsData?.spec?.podAllocatable} </span>
              <span>  &nbsp; GPU占用</span>
              <span style={{
                fontWeight: 'bold',
                fontSize: 16
              }}> {sumupsData?.spec?.gpuAllocated} / {sumupsData?.spec?.gpuAllocatable}</span>
            </div>
          }
          type={'info'}
          showIcon
          style={{ marginBottom: 20 }} />
        <PublicTable
          ref={tableRef}
          dataSource={sourceData?.items || []}
          loading={isLoop ? false : isLoading}
          searchName={'姓名'}
          updateTable={paginationCallBack}
          columns={columns(tableRef, openHandle, closeHandle)}
          modalSetting={false}
          hasRowSelection
          rowSelection={{
            getCheckboxProps: (record) => ({
              disabled: record?.spec?.deviceStatus === 'Terminating'
            }),
            // 判断某些状态下不可选择的提示
            renderCell(checked, record, index, node) {
              if (record?.spec?.deviceStatus === 'Terminating') {
                return <Tooltip title={'关闭中，暂无法操作！'}>{node}</Tooltip>;
              }
              return node;
            }
          }}
          tableAlertOptionRender={({ selectedRows, onCleanSelected }) => (
            <Space>
              {
                <a
                  onClick={() => {
                    Modal.confirm({
                      okText: '确定',
                      cancelText: '取消',
                      title: '批量更新',
                      content: '确认要更新所选服务吗？',
                      onOk: () => {
                        setOptionLoading(true);
                        let optionsList: any = [];
                        selectedRows.forEach((item) => {
                          let canOpen = item?.spec?.deviceStatus === 'default';
                          let canClose = item?.spec?.deviceStatus === 'default' || item?.spec?.deviceStatus === 'Terminating';

                          canOpen && optionsList.push(DevicesServices.addDevices({
                            metadata: { name: item?.metadata?.name },
                            spec: {
                              openHydraUsername: item?.metadata?.name,
                              usePublicDataSet: true,
                              deviceGpu: defaultDeviceType?.spec?.default_gpu_per_device
                            }
                          }));
                          !canClose && optionsList.push(DevicesServices.delDevices({
                            metadata: { name: item?.metadata?.name },
                            spec: {}
                          }, { name: item?.metadata?.name }));
                        });
                        Promise.allSettled(optionsList).then(() => {
                          setOptionLoading(false);
                          message.success('批量操作成功');
                          refreshCallBack();
                          onCleanSelected();
                        })
                      }
                    });
                  }}
                >
                  批量操作
                </a>
              }
            </Space>
          )}

        />
      </Spin>

      <Modal
        title={'启动容器'}
        open={showOpen}
        okText={'确定'}
        cancelText={'取消'}
        onOk={() => {
          setSettingLoading(true);
          DevicesServices.addDevices({
            metadata: { name: currentDevice?.metadata?.name },
            spec: {
              openHydraUsername: currentDevice?.metadata?.name,
              usePublicDataSet: true,
              deviceGpu: type === 1 ? 1 :undefined,
              sandboxName: sandboxName
            }
          }).then(() => {
            setSettingLoading(false);
            message.success('启动成功');
            setShowOpen(false);
            refreshCallBack();
          });
        }}
        onCancel={() => setShowOpen(false)}
        confirmLoading={settingLoading}
      >
        <Radio.Group style={{marginBottom: '10px'}} onChange={(e) => setType(e.target.value)} value={type}>
          <Radio value={0}>CPU 实验室</Radio>
          <Radio value={1}>GPU 实验室</Radio>
        </Radio.Group>
        <Radio.Group onChange={(e) => setSandboxName(e.target.value)} value={sandboxName}>
          {
            sandboxList.map((item) => {
              return  <Radio value={item}>{item}</Radio>
            })
          }
        </Radio.Group>
      </Modal>
    </BaseComponent>
  );
};

export default Data;
