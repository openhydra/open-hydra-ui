/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/24)
 * @Description: 本地测试修改请不要提交，除非添加 url
 */

const AppService = {
  AppService: 'http://172.16.151.70:30861/api/', // 测试
  staticHost: 'https://172.16.50.79', // 静态资源,
  baiduTrans: 'https://fanyi-api.baidu.com/api/trans/vip/translate'
};

module.exports = {
  proxy: [
    {
      context: ['/apis/open-hydra-server.openhydra.io/'],
      target: AppService.AppService,
      secure: false,
      changeOrigin: true
    },
    {
      context: ['/baidu-trans'],
      target: AppService.baiduTrans,
      secure: false,
      changeOrigin: true
    }
  ]
};
