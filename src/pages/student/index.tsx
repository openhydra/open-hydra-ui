/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { Alert, Button, message, Modal, Spin } from 'antd';
import {PoweroffOutlined, ExperimentTwoTone, SyncOutlined} from '@src/utils/antdIcon';
import { getDevicesDetail, getDefaultSetting } from '@src/services/student';
import stateStorage from '@src/storage/stateStorage';
import * as DevicesServices from '@src/services/teacher/device';


let intervalTime:any = null;

const Student: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // '' 未运行 Creating 创建中 Pending 排队(资源不足) 运行中 Running 运行中 Terminating 关闭中
  const [status, setStatus] = useState<string>('');
  const [ideType, setIdeType] = useState<string>('');
  const [sandboxName, setSandboxName] = useState<string>('');
  const [sandboxURL, setSandboxURL] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>({});



  const getDevicesDetailHandle = () => {
    clearInterval(intervalTime)

    /* 默认的设备类型 === 在菜单平台设置中进行配置的*/
    getDefaultSetting({}).then((res) => {
      setCardData(res?.spec?.plugin_list?.sandboxes || {});
    })

    getDevicesDetail({name: stateStorage.get('name')}).then((res) => {
      setSourceData(res);
      if(!(res?.spec?.deviceStatus === 'Running' || res?.spec?.deviceStatus === 'default')){
        intervalTime = setInterval(() => getDevicesDetailHandle(), 5000);
      }
      setStatus(res?.spec?.deviceStatus || '');
      setSandboxName(res?.spec?.sandboxName || '');
      setSandboxURL(res?.spec?.sandboxURLs.split(',') || []);
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
  const openHandle = (key) => {
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
            sandboxName: key
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
      {/*<Spin spinning={loading}>*/}
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
        <div className={styles.content} >
          {
            Object.keys(cardData).map((key, index) => {
              return (
                <div className={styles.card} key={index}>
                  <div className={styles.name}>{key}</div>
                  <div className={styles.description}>{cardData[key].description}</div>
                  <div className={styles.componentInfo}>
                    <div>{sandboxName === key && status!=='' ? 'ports' :'组件信息'}</div>
                    {
                        (sandboxName === key && status!=='') ?
                          sandboxURL?.map((info) => {
                            return (
                              <a href={info}
                                 target={'_blank'}>{info}</a>
                            );
                          }) :
                          cardData[key]?.developmentInfo?.map((info) => {
                              return (
                              <p key={info}>{info}</p>
                          )})
                    }
                  </div>
                  <div className={styles.status}>
                    {
                      sandboxName === key ? (
                        <>
                          {
                            status !== '' && <div className={styles.running}></div>
                          }
                          <span>
                            {
                              status === '' ?
                                '未运行' : (
                                  status === 'Creating' ? `创建中，当前排队数 ${sourceData?.spec?.lineNo || 0} 个` : (
                                    status === 'Running' ? '运行中' : (
                                      status === 'Pending' ? '排队(资源不足)' : '关闭中'
                                    )
                                  ))
                            }
                          </span>
                        </>
                      ):'未运行'
                    }

                  </div>
                  <Button
                    className={styles.close}
                    size={'large'}
                    icon={<PoweroffOutlined/>}
                    disabled={ sandboxName==='' ? false : (
                      !(sandboxName === key && (status==='' || status==='Running')) )
                  }
                    onClick={() => {
                      sandboxName === '' ? openHandle(key) :(
                        !(status === '' || status === 'Terminating') && closeHandle() ||
                        status === '' && openHandle(key)
                      )
                      }}>
                    {
                      sandboxName !== key ? '开启实验环境' : (
                        (status === '' || status === 'Terminating') ? '开启实验环境' : '关闭实验环境'
                      )
                    }

                  </Button>
                  <i className={styles.icon}
                     style={{backgroundImage:`url(/studentImg/${cardData[key].icon_name})`}}></i>
                </div>
              );
            })
          }




          {/*<div className={styles.options}>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    disabled={!(status === '')}*/}
          {/*    icon={<SyncOutlined />}*/}
          {/*    loading={status === 'Create' || status === 'Pending' }*/}
          {/*    onClick={() => openHandle()}>*/}
          {/*    开启实验环境*/}
          {/*  </Button>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    disabled={!(status === '')}*/}
          {/*    icon={<SyncOutlined />}*/}
          {/*    loading={status === 'Create' || status === 'Pending' }*/}
          {/*    onClick={() => openVSCodeHandle()}>*/}
          {/*    开启 vscode 环境*/}
          {/*  </Button>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    danger*/}
          {/*    disabled={status === '' || status === 'Terminating'}*/}
          {/*    icon={<SyncOutlined />}*/}
          {/*    loading={status === 'Terminating'}*/}
          {/*    onClick={() => closeHandle()}>*/}
          {/*    关闭实验环境*/}
          {/*  </Button>*/}
          {/*</div>*/}
          {/*<div className={status === 'Running' ? styles.entry : `${styles.entry} ${styles.entryGray}`}>*/}
          {/*  {*/}
          {/*    status === 'Running'  ? <ExperimentTwoTone style={{ fontSize: 50 }} /> :*/}
          {/*      <ExperimentOutlined style={{ fontSize: 50, color: '#aaa' }} />*/}
          {/*  }*/}
          {/*  <div className={status === 'Running'  ? styles.title : `${styles.title} ${styles.titleGray}`}>xedu 实验环境</div>*/}
          {/*  <div>*/}
          {/*    <a*/}
          {/*      className={status === 'Running' && sandboxName === 'jupyterlab' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}*/}
          {/*      href={status === 'Running' && sandboxName === 'jupyterlab' ? sourceData?.spec?.easyTrainUrl : '#!'}*/}
          {/*      target={status === 'Running' && sandboxName === 'jupyterlab' ? '_blank' : '_self'}*/}
          {/*      rel="noreferrer">easy train</a>*/}
          {/*    <a*/}
          {/*      className={status === 'Running' && sandboxName === 'jupyterlab' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}*/}
          {/*      href={status === 'Running' && sandboxName === 'jupyterlab' ? sourceData?.spec?.jupyterLabUrl :'#!'}*/}
          {/*      target={status === 'Running' && sandboxName === 'jupyterlab' ? '_blank' : '_self'}*/}
          {/*      rel="noreferrer">Jupyter Lab</a>*/}
          {/*    <a*/}
          {/*      className={status === 'Running' && sandboxName === 'vscode' ? styles.entryLink : `${styles.entryLink} ${styles.linkGray}`}*/}
          {/*      href={status === 'Running' && sandboxName === 'vscode' ? sourceData?.spec?.vsCodeUrl :'#!'}*/}
          {/*      target={status === 'Running' && sandboxName === 'vscode' ? '_blank' : '_self'}*/}
          {/*      rel="noreferrer">VScode</a>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      {/*</Spin>*/}
    </div>
  );
};

export default Student;
