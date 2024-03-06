import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RootContext } from '@src/frame/rootContext';
import RouterComponent from '@src/routers/router';
import '@src/assets/css/global.less';
import './i18n/i18n';
import { rootInitReduce, rootInitState } from '@src/frame/getNewReducer';

const Root = () => {
  // 全局state的配置
  const [state, dispatch] = useReducer(rootInitReduce, rootInitState());

  return (
    /* 采用严格模式 */
    // eslint-disable-next-line react/jsx-filename-extension
    // <React.StrictMode>
    <RootContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    </RootContext.Provider>
    // </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
