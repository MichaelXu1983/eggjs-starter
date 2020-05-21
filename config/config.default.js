/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
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
          host: '120.79.26.168',
          port: '3306',
          user: 'tdreamer',
          password: 'Qcq5rqH$AlNJXGpcf^L8',
          database: 'ms_activity',
        },
        ms_appconfig: {
          host: '120.79.26.168',
          port: '3306',
          user: 'tdreamer',
          password: 'Qcq5rqH$AlNJXGpcf^L8',
          database: 'ms_appconfig',
        },
      },
    },
    security: {
      csrf: {
        enable: true, // 开启或关闭安全插件
        // headerName: 'x-csrf-token',
        useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
        ignoreJSON: false, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求(该选项已废弃，攻击者可以通过 flash + 307 来攻破，请不要在生产环境打开该选项！)
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
        'https://wx.tdreamer.xin',
        'http://wx.tdreamer.com',
        'https://manage.tdreamer.xin',
      ],
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
    jsonp: {
      whiteList: [ /^https?:\/\/test.com\//, 'sub2.test.com' ], // 配置 referrer 白名单的方式来限制 JSONP 的第三方请求在可控范围之内
      csrf: true,
      callback: 'callback', // 识别 query 中的 `callback` 参数
      limit: 100, // 函数名最长为 100 个字符
    },
    // 将 logger 目录放到代码目录下
    logger: {
      dir: path.join(baseDir, 'logs'),
      level: 'INFO',
      consoleLevel: 'INFO',
    },
    cookies: {
      maxAge: 24 * 60 * 60 * 1000, // 浏览器的最长保存时间，是一个从服务器当前时刻开始的毫秒数
      path: '/', // 设置键值对生效的 URL 路径
      domain: '', // 设置键值对生效的域名
      httpOnly: true, // 设置键值对是否可以被 js 访问
      encrypt: true, // 对 Cookie 进行加密
      overwrite: true, // 后设置的值会覆盖前面设置的，防止发送两个 set-cookie 响应头
      signed: false, // 默认为 true，用来防止前端对这个值进行篡改，但会导致获取不到前端或者其他系统设置的 cookie 的值，所以此处设置为 false
      // secure: true, // 设置键值对只在 HTTPS 连接上传输
      // sameSite: 'none|lax|strict', // strict:完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。lax:Get 请求发送，POST 表单、iframe、AJAX、Image 不发送。none:必须同时设置 Secure 属性（Cookie 只能通过 HTTPS 协议发送），否则无效。
    },
    session: {
      key: 'EGG_SESS', // 键名
      maxAge: 8640 * 3600 * 1000, // 有效期
      httpOnly: true, // 是否允许前端访问
      signed: true, // 签名
      encrypt: true, // 加密
    },
    proxy: false,
    notfound: {
      pageUrl: '',
    },
    siteFile: {
      '/favicon.ico': fs.readFileSync(
        path.join(appInfo.baseDir, 'app/public/favicon.ico')
      ),
    },
    bodyParser: {
      // 在调整 bodyParser 支持的 body 长度时，如果我们应用前面还有一层反向代理（Nginx），可能也需要调整它的配置，确保反向代理也支持同样长度的请求 body
      enable: true,
      encoding: 'utf8',
      formLimit: '1mb',
      jsonLimit: '1mb',
      textLimit: '1mb',
      strict: true,
      // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
      queryString: {
        arrayLimit: 100,
        depth: 5,
        parameterLimit: 1000,
      },
      // onerror(err) {
      //   err.message += ', check bodyParser config';
      //   throw err;
      // },
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
        hostname: '0.0.0.0',
        // path: '/var/run/egg.sock',
      },
    },
    // use for cookie sign key, should change to your own and keep security
    keys: name + '_1588058816005_963',
    middleware: [ 'errorHandler', 'robot' ],
    errorHandler: {
      match: '/api',
    },
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.tpl': 'nunjucks',
      },
    },
    robot: {
      ua: [ /Baiduspider/i ],
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
