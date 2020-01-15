'use strict';
const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  const config = {
    env: appInfo.env,
    name: appInfo.name,
    keys: appInfo.name + '_1531466185250_9292',
    proxy: false,
    pkg: appInfo.pkg,
    baseDir: appInfo.baseDir,
    HOME: appInfo.HOME,
    workerStartTimeout: 600000,
  };
  config.session = {
    maxAge: 86400000,
    key: 'EGG_SESS',
    httpOnly: true,
    encrypt: true,
    overwrite: true,
    signed: true,
    encode: '<Function encode>',
    decode: '<Function decode>',
    genid: '<Function anonymous>',
  };
  config.jsonp = {
    limit: 50,
    callback: [ '_callback', 'callback' ],
    csrf: false,
  };
  config.httpclient = {
    enableDNSCache: false,
    dnsCacheMaxLength: 1000,
    dnsCacheMaxAge: 10000,
    request: {
      timeout: 5000,
    },
    httpAgent: {
      keepAlive: true,
      freeSocketKeepAliveTimeout: 4000,
      maxSockets: 9007199254740991,
      maxFreeSockets: 256,
    },
    httpsAgent: {
      keepAlive: true,
      freeSocketKeepAliveTimeout: 4000,
      maxSockets: 9007199254740991,
      maxFreeSockets: 256,
    },
  };
  config.onerror = {
    errorPageUrl: '',
    appErrorFilter: null,
  };
  config.notfound = {
    pageUrl: '',
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(
      path.join(appInfo.baseDir, 'app/public/favicon.png')
    ),
  };
  config.cluster = {
    listen: {
      port: 7005,
      hostname: 'localhost',
      // path: '/var/run/egg.sock',
    },
  };
  config.clusterClient = {
    maxWaitTime: 60000,
    responseTimeout: 60000,
  };

  config.middleware = [ 'robot', 'errorHandler' ];

  config.robot = {
    ua: [ /Baiduspider/i, /Googlebot/i, /iaskspider/i ],
  };

  config.errorHandler = {
    match: '/',
  };
  config.security = {
    domainWhiteList: [
      'http://127.0.0.1:8080',
      'http://127.0.0.1:9527',
      'https://wx.tdreamer.xin',
      'https://manage.tdreamer.xin',
    ],
    protocolWhiteList: [],
    defaultMiddleware:
      'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta',
    csrf: {
      enable: true,
      useSession: false,
      ignoreJSON: false,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
      queryName: '_csrf',
      matching: '<Function anonymous>',
    },
    xframe: {
      enable: true,
      value: 'SAMEORIGIN',
      matching: '<Function anonymous>',
    },
    hsts: {
      enable: false,
      maxAge: 31536000,
      includeSubdomains: false,
    },
    dta: {
      enable: true,
      matching: '<Function anonymous>',
    },
    methodnoallow: {
      enable: true,
      matching: '<Function anonymous>',
    },
    noopen: {
      enable: true,
      matching: '<Function anonymous>',
    },
    nosniff: {
      enable: true,
      matching: '<Function anonymous>',
    },
    xssProtection: {
      enable: true,
      value: '1; mode=block',
      matching: '<Function anonymous>',
    },
    csp: {
      enable: false,
      policy: {},
    },
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
  };
  config.cors = {
    // {string|Function} origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  return config;
};
