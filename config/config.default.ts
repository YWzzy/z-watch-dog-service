import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.trafficStatsScheduleMin = '0 */60 * * * *';

  config.trafficStatsScheduleDay = '59 59 */23 * * *';

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name }_1702282822597_3491`;

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.security = {
    domainWhiteList: [ 'http://192.168.104.105:8080', 'http://localhost:8081' ],
    csrf: {
      enable: false,
      ignore: '/api/desktop/**',
    },
  };

  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.appIndexName = {
    page_traffics: 'page_traffics_yourAppId',
    page_report: 'page_report_yourAppId',
  };

  config.multipart = {
    mode: 'file',
    fieldSize: '10000kb',
    // 单个文件大小
    fileSize: '100mb',
    fileExtensions: [ '.map' ],
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
