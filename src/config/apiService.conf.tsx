import * as _ from 'lodash-es';

interface apiServiceType {
  [x: string]: {
    [y: string]: any;
  };
}


const apiService: apiServiceType = {
  resources: {
    // 登陆
    getLogin: { url: 'v1/openhydrausers/login/{name}' },
    // 账号
    getAccount: { url: 'v1/openhydrausers', method: 'GET' },
    addAccount: { url: 'v1/openhydrausers', method: 'POST' },
    delAccount: { url: 'v1/openhydrausers/{name}', method: 'DELETE' },
    // 设备
    getDevices: { url: 'v1/devices', method: 'GET' },
    getDevicesDetail: { url: 'v1/devices/{name}', method: 'GET' },
    addDevices: { url: 'v1/devices', method: 'POST' },
    delDevices: { url: 'v1/devices/{name}', method: 'DELETE' },
    getDevicesSum: { url: 'v1/sumups', method: 'GET' },
    // 数据集
    getDatasets: { url: 'v1/datasets', method: 'GET' },
    addDatasets: { url: 'v1/datasets', method: 'POST' },
    delDatasets: { url: 'v1/datasets/{name}', method: 'DELETE' },
    // 课题
    getClass: { url: 'v1/courses', method: 'GET' },
    addClass: { url: 'v1/courses', method: 'POST' },
    delClass: { url: 'v1/courses/{name}', method: 'DELETE' },
    // 设置
    getDefaultSetting: { url: 'v1/settings/default', method: 'GET' },
    putDefaultSetting: { url: 'v1/settings/default', method: 'PUT' },

    // 修改密码
    updateUserPassword: { url: 'v1/openhydrausers/{name}', method: 'PUT' }
  },
  setting: {
    prefix: '/apis/open-hydra-server.openhydra.io/',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    },
    timeout: 3600000
  }
};

(function checkData(obj:any) {
  let apiServiceList = Object.values(obj);
  // 去重后的内容
  let deduplicationList: any = Array.from(new Set(apiServiceList.map((i) => i.url)));
  // 相同url的API集合详情
  let someUrlList: any = [];
  deduplicationList.forEach((item) => {
    // 检查到同URL的内容，放入someUrlList即可
    apiServiceList.filter((el) => el.url === item).length > 1 &&
      someUrlList.push(apiServiceList.filter((el) => el.url === item));
  });

  someUrlList.forEach((urlListItem) => {
    if (urlListItem.filter((item) => _.isNil(item.method)).length) {
      // eslint-disable-next-line no-console
      console.clear();
      let msg = 'apiService.resources中存在重复的URL,缺少字段method,请处理！';
      console.error(
        msg,
        urlListItem.filter((item) => _.isNil(item.method))
      );
      throw new Error(msg);
    } else if (
      new Set(urlListItem.map((item) => JSON.stringify([item.url, item.method]))).size !== urlListItem.length
    ) {
      // eslint-disable-next-line no-console
      console.clear();
      let msg = 'apiService.resources中存在重复的api,请修改url或者method,请检查！';
      console.error(msg, urlListItem);
      throw new Error(msg);
    }
  });
})(apiService.resources);

export default apiService;
