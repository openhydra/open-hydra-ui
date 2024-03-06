/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import styles from '@src/pages/student/style.less';

const Experiment = () => {
  let location = useLocation();
  const { jupyterLabUrl, easyTrainUrl } = location.state.params.spec;
  const items = [
    {
      label: '训练界面',
      key: '1',
      children: <iframe
        src={easyTrainUrl}
        style={{width: '100%', height: '100%', borderStyle: 'hidden'}}
                />
    },
    {
      label: 'Jupyter Lab',
      key: '2',
      children: <iframe
        src={jupyterLabUrl}
        style={{width: '100%', height: '100%', borderStyle: 'hidden'}}
      />
    }
  ];
  return (
    <div className={styles.view}>
      <Tabs
        defaultActiveKey="1"
        style={{ marginBottom: 32 }}
        items={items}
      />
    </div>
  );
};

export default Experiment;
