/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, {useEffect, useState} from 'react';
import BaseComponent from '@src/components/BaseComponent';
import DetailComponent from '@src/components/DetailComponent/DetailComponent';
import {Form, Select, Spin, message} from 'antd';
import * as SettingServices from '@src/services/teacher/setting';

const Setting: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);


  const getDefaultSettingHandle = () => {
    SettingServices.getDefaultSetting({}).then((res) => {
      setLoading(false);
      setDetail(res);
    });
  }

  /**
   * @desc 更新参数
   * */
  const updateInfo = (values) => {
    setLoading(true);
    SettingServices.putDefaultSetting({
      metadata:{name: detail?.metadata?.name},
      spec:{default_gpu_per_device: values.deviceType}
    })
      .then(() => {
        message.success('编辑成功', 1);
        setLoading(false);
        getDefaultSettingHandle();
      })
      .catch((err) => console.log(err));
  };


  useEffect(() => {
    getDefaultSettingHandle();
  }, []);

  const infoData = [
    {
      title: '基本信息',
      infoItem: [
        {
          name: '设备类型',
          value: detail?.spec?.default_gpu_per_device === 0 ? 'CPU' : 'GPU',
          editItem: {
            key: 'deviceType',
            value: (
              <Form.Item label={'设备类型'} name="deviceType">
                <Select options={[{label: 'CPU', value: 0}, {label: 'GPU', value: 1}]}/>
              </Form.Item>
            )
          }
        }
      ]
    }
  ];

  return (
    <BaseComponent pageName={'平台设置'}>
      <Spin spinning={loading}>
        {detail ? <DetailComponent infoData={infoData} isEdit submitCallBack={updateInfo} /> : null}
      </Spin>
    </BaseComponent>
  );
};

export default Setting;
