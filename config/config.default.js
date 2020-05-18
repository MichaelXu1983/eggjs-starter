/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const fs = require("fs");
const path = require("path");

module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const {
    baseDir,
    name,
    // pkg, HOME, root, env
  } = appInfo;
  const config = (exports = {
    mysql: {
      // 所有数据库配置的默认值
      // default: {
      //   database: null,
      //   connectionLimit: 5,
      // },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
      debug: true,
      clients: {
        ms_activity: {
          host: "x.x.x.x",
          port: "3306",
          user: "mysql",
          password: "mysql",
          database: "ms_activity",
        },
        ms_appconfig: {
          host: "x.x.x.x",
          port: "3306",
          user: "mysql",
          password: "mysql",
          database: "ms_appconfig",
        },
      },
    },
    security: {
      csrf: {
        enable: false, // 开启或关闭安全插件
        // headerName: 'x-csrf-token',
        useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
        cookieName: "csrfToken", // Cookie 中的字段名，默认为 csrfToken
        sessionName: "csrfToken", // Session 中的字段名，默认为 csrfToken
      },
      methodnoallow: {
        enable: true,
      },
      domainWhiteList: ["http://127.0.0.1:9527"],
      //   ssrf: {
      //     ipBlackList: [
      //       '10.0.0.0/8', // 支持 IP 网段
      //       '0.0.0.0/32',
      //       '127.0.0.1',  // 支持指定 IP 地址
      //     ],
      //     // 配置了 checkAddress 时，ipBlackList 不会生效
      //     checkAddress(ip) {
      //       return ip !== '127.0.0.1';
      //     },
      //   },
    },
    // 将 logger 目录放到代码目录下
    logger: {
      dir: path.join(baseDir, "logs"),
    },
    cookies: {
      httpOnly: true, // 默认就是 true
      encrypt: true, // 加密传输
      // sameSite: 'none|lax|strict', // strict:完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。lax:Get 请求发送，POST 表单、iframe、AJAX、Image 不发送。none:必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。
    },
    proxy: false,
    notfound: {
      pageUrl: "",
    },
    siteFile: {
      "/favicon.ico": fs.readFileSync(
        path.join(appInfo.baseDir, "app/public/favicon.ico")
      ),
    },
    bodyParser: {
      // 在调整 bodyParser 支持的 body 长度时，如果我们应用前面还有一层反向代理（Nginx），可能也需要调整它的配置，确保反向代理也支持同样长度的请求 body
      enable: true,
      encoding: "utf8",
      formLimit: "1mb",
      jsonLimit: "1mb",
      textLimit: "1mb",
      strict: true,
      // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
      queryString: {
        arrayLimit: 100,
        depth: 5,
        parameterLimit: 1000,
      },
      onerror(err) {
        err.message += ", check bodyParser config";
        throw err;
      },
    },
    httpclient: {
      enableDNSCache: false,
      dnsCacheLookupInterval: 10000,
      dnsCacheMaxLength: 1000,

      request: {
        timeout: 5000,
      },
      httpAgent: {
        keepAlive: true,
        freeSocketTimeout: 4000,
        maxSockets: Number.MAX_SAFE_INTEGER,
        maxFreeSockets: 256,
      },
      httpsAgent: {
        keepAlive: true,
        freeSocketTimeout: 4000,
        maxSockets: Number.MAX_SAFE_INTEGER,
        maxFreeSockets: 256,
      },
    },
    cluster: {
      listen: {
        port: 7002,
        hostname: "0.0.0.0",
        // path: '/var/run/egg.sock',
      },
    },
    // use for cookie sign key, should change to your own and keep security
    keys: name + "_1588058816005_963",
    middleware: ["errorHandler", "robot"],
    view: {
      defaultViewEngine: "nunjucks",
      mapping: {
        ".tpl": "nunjucks",
      },
    },
    robot: {
      ua: [/Baiduspider/i],
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
