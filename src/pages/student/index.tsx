/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { Alert, Button, message, Modal, Spin } from 'antd';
import {ExperimentOutlined, ExperimentTwoTone, SyncOutlined} from '@src/utils/antdIcon';
import { getDevicesDetail } from '@src/services/student';
import stateStorage from '@src/storage/stateStorage';
import * as DevicesServices from '@src/services/teacher/device';

let intervalTime:any = null;

const Student: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // '' 未运行 Creating 创建中 Pending 排队(资源不足) 运行中 Running 运行中 Terminating 关闭中
  const [status, setStatus] = useState<string>('');
  const [ideType, setIdeType] = useState<string>('');
  const [sourceData, setSourceData] = useState<any>(null);



  const getDevicesDetailHandle = () => {
    clearInterval(intervalTime)
    getDevicesDetail({name: stateStorage.get('name')}).then((res) => {
      setSourceData(res);
      if(!(res?.spec?.deviceStatus === 'Running' || res?.spec?.deviceStatus === 'default')){
        intervalTime = setInterval(() => getDevicesDetailHandle(), 5000);
      }
      setStatus(res?.spec?.deviceStatus || '');
      setIdeType(res?.spec?.ideType || '');
    });
  };

  const closeHandle = () => {
    Modal.confirm({
      title: '关闭实验环境',
      content: '确定关闭当前实验环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.delDevices({
          metadata:{name: sourceData?.metadata?.name},
          spec:{}
        }, {name: sourceData?.metadata?.name}).then(() => {
          setLoading(false);
          message.success('关闭成功');
          getDevicesDetailHandle();
        });
      }
    });
  };
  const openHandle = () => {
    Modal.confirm({
      title: '开启实验环境',
      content: '确定开启当前实验环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.addDevices({
          metadata:{name: sourceData?.metadata?.name},
          spec:{
            openHydraUsername: sourceData?.metadata?.name,
            usePublicDataSet: true,
            deviceGpu: 0,
            ideType: 'jupyterlab'
          }
        }).then(() => {
          setLoading(false);
          message.success('启动成功');
          getDevicesDetailHandle();
        });
      }
    });
  };
  const openVSCodeHandle = () => {
    Modal.confirm({
      title: '开启实验环境',
      content: '确定开启当前实验环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.addDevices({
          metadata:{name: sourceData?.metadata?.name},
          spec:{
            openHydraUsername: sourceData?.metadata?.name,
            usePublicDataSet: true,
            deviceGpu: 0,
            ideType: 'vscode'
          }
        }).then(() => {
          setLoading(false);
          message.success('启动成功');
          getDevicesDetailHandle();
        });
      }
    });
  };

  useEffect(() => {
    getDevicesDetailHandle();
    () => clearInterval(intervalTime);
  }, []);

  return (
    <div className={styles.view}>
      <Spin spinning={loading}>
        <Alert
          message={
            status === '' ?
              '未运行' : (
                status === 'Creating' ? `创建中 实验室环境创建中，当前排队数 ${sourceData?.spec?.lineNo || 0} 个` : (
                  status === 'Running' ? '运行中' : (
                    status === 'Pending' ? '排队(资源不足)' : '关闭中'
                  )
                ))
          }
          type={
            status === '' ?
              'error' : (
                status !== 'Running' ? 'warning' : 'success')
          }
          showIcon
        />
        <div className={styles.content}>
          <div className={styles.options}>
            <Button
              type={'primary'}
              disabled={!(status === '')}
              icon={<SyncOutlined />}
              loading={status === 'Create' || status === 'Pending' }
              onClick={() => openHandle()}>
              开启实验环境
            </Button>
            <Button
              type={'primary'}
              disabled={!(status === '')}
              icon={<SyncOutlined />}
              loading={status === 'Create' || status === 'Pending' }
              onClick={() => openVSCodeHandle()}>
              开启 vscode 环境
            </Button>
            <Button
              type={'primary'}
              danger
              disabled={status === '' || status === 'Terminating'}
              icon={<SyncOutlined />}
              loading={status === 'Terminating'}
              onClick={() => closeHandle()}>
              关闭实验环境
            </Button>
          </div>
          <div className={status === 'Running' ? styles.entry : `${styles.entry} ${styles.entryGray}`}>
            {
              status === 'Running'  ? <ExperimentTwoTone style={{ fontSize: 50 }} /> :
                <ExperimentOutlined style={{ fontSize: 50, color: '#aaa' }} />
            }
            <div className={status === 'Running'  ? styles.title : `${styles.title} ${styles.titleGray}`}>xedu 实验环境</div>
            <div>
              <a
                className={status === 'Running' && ideType === 'jupyterlab' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}
                href={status === 'Running' && ideType === 'jupyterlab' ? sourceData?.spec?.easyTrainUrl : '#!'}
                target={status === 'Running' && ideType === 'jupyterlab' ? '_blank' : '_self'}
                rel="noreferrer">easy train</a>
              <a
                className={status === 'Running' && ideType === 'jupyterlab' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}
                href={status === 'Running' && ideType === 'jupyterlab' ? sourceData?.spec?.jupyterLabUrl :'#!'}
                target={status === 'Running' && ideType === 'jupyterlab' ? '_blank' : '_self'}
                rel="noreferrer">Jupyter Lab</a>
              <a
                className={status === 'Running' && ideType === 'vscode' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}
                href={status === 'Running' && ideType === 'vscode' ? sourceData?.spec?.vsCodeUrl :'#!'}
                target={status === 'Running' && ideType === 'vscode' ? '_blank' : '_self'}
                rel="noreferrer">VScode</a>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Student;
