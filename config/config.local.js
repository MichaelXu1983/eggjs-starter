/*
 * @Author: Michael Xu
 * @Date: 2020-04-29 16:44:41
 * @LastEditTime: 2020-05-21 12:27:08
 * @LastEditors: Michael Xu
 * @Description: 默认配置文件
 * @FilePath: /register/config/config.local.js
 * @Blog: https://www.michaelxu.cn/
 */
/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    security: {
      csrf: {
        enable: true, // 开启或关闭安全插件
        // headerName: 'x-csrf-token',
        useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
        ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求(该选项已废弃，攻击者可以通过 flash + 307 来攻破，请不要在生产环境打开该选项！)
        cookieName: 'csrfToken', // csrf token's cookie name
        sessionName: 'csrfToken', // csrf token's session name
        headerName: 'x-csrf-token', // request csrf token's name in header
        bodyName: '_csrf', // request csrf token's name in body
        queryName: '_csrf', // request csrf token's name in query
      },
      methodnoallow: {
        enable: true,
      },
      domainWhiteList: [
        'http://127.0.0.1:9527',
      ],
    },
  });

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
