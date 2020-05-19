# 登记服务

基于 Egg.js 搭建的登记服务。

## 目录简介

1. [介绍](#介绍)
2. [程序目录](#程序目录)
3. [项目配置](#项目配置)
   - [环境配置](#环境配置)
     - [初始化](#初始化)
     - [配置运行和停止命令](#配置运行和停止命令)
     - [配置开发和调试命令](#配置开发和调试命令)
     - [进行可视化调试](#进行可视化调试)
   - [数据库配置](#数据库配置)
     - [安装数据库插件](#安装数据库插件)
     - [开启数据库插件](#开启插件)
     - [配置数据源](#配置数据源)
     - [使用数据源](#使用数据库)
   - [安全配置](#安全配置)
     - [安装安全插件](#安装安全插件)
     - [开启安全插件](#开启安全插件)
     - [配置安全插件](#配置安全插件)
     - [客户端请求安全配置](#客户端请求安全配置)
     - [安全注意事项](#安全注意事项)
   - [其他配置](#其他配置) 
     - [安装参数验证插件](#安装参数验证插件) 
     - [统一异常处理](#统一异常处理) 
     - [模板渲染](#模板渲染) 
     - [编写扩展工具库](#编写扩展工具库) 
     - [编写禁止百度爬虫访问中间件](#编写禁止百度爬虫访问中间件) 
     - [配置管理](#配置管理) 
4. [业务开发](#业务开发)
     - [配置路由映射](#配置路由映射)
     - [编写 Controller](#编写Controller)
     - [编写 Service](#编写Service)
     - [单元测试](#单元测试)
5. [发布](#发布)
6. [附录](#附录)
     - [插件](#插件)
     - [定时任务](#定时任务)
     - [框架扩展](#框架扩展)
     - [启动自定义](#启动自定义)
     - [日志](#日志)

## <a name="介绍">介绍</a>

- 提供基于 Egg 定制上层框架能力，继承于 Koa

- 提供高度可扩展的插件机制

- 服务器需要预装 Node.js，框架支持的 Node 版本为  `>= 8.0.0`

- 内置多进程管理，基于 Koa 开发，测试覆盖率高，可以进行渐进式开发

- 框架内置了  [egg-cluster](https://github.com/eggjs/egg-cluster)  来启动  [Master 进程](http://eggjs.org/zh-cn/core/cluster-and-ipc.html#master)，Master 有足够的稳定性，不再需要使用  [pm2](https://github.com/Unitech/pm2)  等进程守护模块，同时保证了 Node.js 进程（未捕获异常、OOM、系统异常）优雅的退出

- 当一个应用启动时，会同时启动这三类进程

  ```
  | 类型    | 进程数量              | 作用                        | 稳定性 | 是否运行业务代码 |
  | ------ | ------------------- | ---------------------------- | ------ | ----------- |
  | Master | 1                   | 进程管理，进程间消息转发         | 非常高  | 否           |
  | Agent  | 1                   | 后台运行单个进程工作            | 高      | 少量         |
  | Worker | 一般设置为 CPU 核数   | 执行业务代码                   | 一般    | 是           |
  ```

- 框架的启动时序

  ```
    +---------+           +---------+          +---------+
    |  Master |           |  Agent  |          |  Worker |
    +---------+           +----+----+          +----+----+
        |      fork agent     |                    |
        +-------------------->|                    |
        |      agent ready    |                    |
        |<--------------------+                    |
        |                     |     fork worker    |
        +----------------------------------------->|
        |     worker ready    |                    |
        |<-----------------------------------------+
        |      Egg ready      |                    |
        +-------------------->|                    |
        |      Egg ready      |                    |
        +----------------------------------------->|
  ```

  **具体步骤**

  1. Master 启动后先 fork Agent 进程
  2. Agent 初始化成功后，通过 IPC 通道通知 Master
  3. Master 再 fork 多个 App Worker
  4. App Worker 初始化成功，通知 Master
  5. 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功

  **注意**

  > - 由于 App Worker 依赖于 Agent，所以必须等 Agent 初始化完成后才能 fork App Worker
  > - Agent 虽然是 App Worker 的『小秘』，但是业务相关的工作不应该放到 Agent 上去做，不然把她累垮了就不好了
  > - 由于 Agent 的特殊定位，我们应该保证它相对稳定。当它发生未捕获异常，框架不会像 App Worker 一样让他退出重启，而是记录异常日志、报警等待人工处理
  > - 能够通过定时任务解决的问题就不要放到 Agent 上执行
  > - 当 Worker 进程异常退出时，Master 进程会重启一个 Worker 进程

- 进程间通讯（IPC）[更详细](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)

  ```
  广播消息： agent => all workers
                  +--------+          +-------+
                  | Master |<---------| Agent |
                  +--------+          +-------+
                  /    |     \
              /     |      \
              /      |       \
              /       |        \
              v        v         v
  +----------+   +----------+   +----------+
  | Worker 1 |   | Worker 2 |   | Worker 3 |
  +----------+   +----------+   +----------+

  指定接收方： one worker => another worker
                  +--------+          +-------+
                  | Master |----------| Agent |
                  +--------+          +-------+
                  ^    |
      send to    /     |
      worker 2  /      |
              /       |
              /        v
  +----------+   +----------+   +----------+
  | Worker 1 |   | Worker 2 |   | Worker 3 |
  +----------+   +----------+   +----------+
  ```

- [快速入门](https://eggjs.org/zh-cn/intro/quickstart.html)、[RESTful API 统一处理](https://eggjs.org/zh-cn/tutorials/restful.html)、[issues](https://github.com/eggjs/egg/issues)

## <a name="程序目录">程序目录</a>

```
├── package.json
├── app.js (可选)                           // 用于自定义启动时的初始化 Master 工作
├── agent.js (可选)                         // 用于自定义启动时的初始化 Agent 工作
├── app
|   ├── router.js                          // 映射 controller 文件，创建路由
│   ├── controller                         // 用于解析用户的输入，处理后返回相应的结果
│   |   └── home.js                        // 默认首页
│   |   ├── v1
│   │   |   └──wxactivity.js               // 活动配置相关
│   ├── service                            // 用于编写业务逻辑层
│   |   ├── v1
│   │   |   └──wxactivity.js               // 活动配置相关接口实际生效的业务逻辑
│   ├── middleware (可选)                   // 用于编写中间件
│   |   └── robot.js                       // 编写禁止百度爬虫访问中间件
│   |   └── error_handler.js               // 统一错误处理
│   ├── schedule (可选)                     // 用于定时任务
│   |   └── force_refresh.js               // 用于间歇执行强制任务
│   |   └── pull_refresh.js                // 用于间歇执行普通任务
│   ├── public (可选)                       // 用于放置静态资源
│   |   ├── js
│   │   |   └──lib.js
│   |   ├── css
│   │   |   └──reset.css
│   ├── view (可选)                        // 用于放置模板文件
│   |   └── home.tpl
│   ├── model (可选)                       // 用于放置领域模型
│   └── extend (可选)                      // 用于框架的扩展函数编写
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config                                // 用于编写配置文件
|   ├── plugin.js                         // 用于配置需要加载的插件
|   ├── config.default.js                 // 默认配置（以下覆盖默认配置同名配置）
│   ├── config.prod.js                    // 开发配置
|   ├── config.test.js (可选) 	           // 测试配置
|   ├── config.local.js (可选)             // 本地配置
|   └── config.unittest.js (可选)          // 单元测试配置
└── test                                  // 测试所使用到的 fixtures 和相关辅助脚本都应该放在此目录下
│   ├── middleware
│   |   └── robot.test.js
│   └── controller
│   |   ├── v1
│   │   |   └──wxactivity.test.js         // 测试脚本文件统一按 ${filename}.test.js 命名，必须以 .test.js 作为文件后缀
│   └── service
│   |   ├── v1
│   │   |   └──wxactivity.test.js         
```

## <a name="项目配置">项目配置</a>

### <a name="环境配置">环境配置</a>

#### <a name="初始化">初始化</a>

```shell
npm i egg-init -g
egg-init egg-example --type=simple
cd egg-example
npm i
```

| 骨架类型  | 说明                  |
| --------- | --------------------- |
| simple    | 简单 egg 应用程序骨架 |
| empty     | 空的 egg 应用程序骨架 |
| plugin    | egg plugin 骨架       |
| framework | egg framework 骨架    |

#### <a name="配置运行和停止命令">配置运行和停止命令</a>

> --type=simple 里已包含

```bash
npm i -S egg-scripts
```

添加  `npm scripts`  到  `package.json`：

```javascript
{
  "scripts": {
    "start": "egg-scripts start --daemon --title=egg-server-showcase",
    "stop": "egg-scripts stop --title=egg-server-showcase"
  }
}
```

> 注意：`egg-scripts` 不支持 Windows 系统。
>
> `--daemon` 是否允许在后台模式，无需 `nohup`。若使用 Docker 建议直接前台运行；
>
> `--workers=2` 框架 worker 线程数，默认会创建和 CPU 核数相当的 app worker 数，可以充分的利用 CPU 资源；
>
> `--title=egg-server-showcase`  用于方便 ps 进程时 grep 用，默认为  `egg-server-${appname}`；
>
> 更多参数可查看  [egg-scripts](https://github.com/eggjs/egg-scripts)  和  [egg-cluster](https://github.com/eggjs/egg-cluster)  文档

你也可以在  `config.{env}.js`  中配置指定端口启动  

> 参考：https://github.com/eggjs/egg/blob/master/config/config.default.js  

```javascript
// config/config.default.js
config.cluster = {
  listen: {
    port: 7002,
    hostname: "127.0.0.1",
    // path: '/var/run/egg.sock',
  },
};
```

> 说明：如需要对服务进行性能监控，内存泄露分析，故障排除，请查看[Node.js 性能平台](http://eggjs.org/zh-cn/core/deployment.html)

#### <a name="配置开发和调试命令">配置开发和调试命令</a>

> --type=simple 里已包含

添加  `npm dev`   和 `npm debug` 到  `package.json` ：

```bash
npm i -S egg-bin
```

```javascript
{
  "scripts": {
    "dev": "egg-bin dev",
    "debug": "egg-bin debug",
  }
}
```

#### <a name="安装可视化调试插件">安装可视化调试插件</a>

1. 首先进入 vscode 编辑器安装 Egg.js dev tools 插件
2. 其次配置

   ```js
   // .vscode/launch.json
   {
       // 使用 IntelliSense 了解相关属性。
       // 悬停以查看现有属性的描述。
       // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
       "version": "0.2.0",
       "configurations": [
           {
               "type": "node",
               "request": "launch",
               "name": "Egg Debug",
               "runtimeExecutable": "npm",
               "runtimeArgs": [
                   "run",
                   "debug",
                   "--",
                   "--inspect-brk"
               ],
               "console": "integratedTerminal",
               "restart": true,
               "protocol": "auto",
               "port": 9229,
               "autoAttachChildProcesses": true
           },
           {
               "type": "node",
               "request": "launch",
               "name": "Egg Test",
               "runtimeExecutable": "npm",
               "runtimeArgs": [
                   "run",
                   "test-local",
                   "--",
                   "--inspect-brk"
               ],
               "protocol": "auto",
               "port": 9229,
               "autoAttachChildProcesses": true
           },
           {
               "type": "node",
               "request": "attach",
               "name": "Egg Attach to remote",
               "localRoot": "${workspaceRoot}",
               "remoteRoot": "/usr/src/app",
               "address": "localhost",
               "protocol": "auto",
               "port": 9999
           }
       ]
   }
   ```

### <a name="数据库配置">数据库配置</a>

#### <a name="安装数据库插件">安装数据库插件</a>

```bash
npm i --save egg-mysql
```

#### <a name="开启数据库插件">开启数据库插件</a>

```js
// config/plugin.js
module.exports = {
    ...
    mysql: {
    enable: true,
    package: 'egg-mysql',
    },
};
```

#### <a name="配置数据源">配置数据源</a>

```js
// config/config.default.js
module.exports = (appInfo) => {
  const config = (exports = {
    mysql: {
      clients: {
        db1: {
          // host
          host: "mysql.com",
          // 端口号
          port: "3306",
          // 用户名
          user: "test_user",
          // 密码
          password: "test_password",
          // 数据库名
          database: "test",
        },
        db2: {
          // host
          host: "mysql.com",
          // 端口号
          port: "3306",
          // 用户名
          user: "test_user",
          // 密码
          password: "test_password",
          // 数据库名
          database: "test",
        },
      },
      // default: {// 所有数据库配置的默认值
      //   database: null,
      //   connectionLimit: 5,
      // },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1530270948065_2624";

  // add your config here
  config.middleware = [];

  return config;
};
```  

#### <a name="使用数据源">使用数据源</a>

```js
const client1 = app.mysql.get("db1");
await client1.query(sql, values);

const client2 = app.mysql.get("db2");
await client2.query(sql, values);
```

> 详细可参考：[egg-mysql](http://eggjs.org/zh-cn/tutorials/mysql.html)

### <a name="安全配置">安全配置</a>

#### <a name="安装安全插件">安装安全插件</a>

```bash
npm i egg-cors --save
```

#### <a name="开启安全插件">开启安全插件</a>

```js
// {app_root}/config/plugin.js
  module.exports = {
    ...
    cors: {
        enable: true,
        package: 'egg-cors',
    },
  };
```

#### <a name="配置安全插件">配置安全插件</a>

```js
// config/config.default.js
module.exports = appInfo => {
/**
 * built-in config
 * @type {Egg.EggAppConfig}
 **/
const config = (exports = {
 ...
  security: {
    csrf: {
      enable: false, // 开启或关闭安全插件
      headerName: 'x-csrf-token',
    },
    methodnoallow: {
      enable: true,
    },
    domainWhiteList: [
      'http://127.0.0.1:9527',
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
});
...
};
```

#### <a name="客户端请求安全配置">客户端请求安全配置</a>

```js
// 创建axios实例
const service = axios.create({
  withCredentials: true, //表示跨域请求时是否需要使用凭证，默认 false 可导致服务端无法获取cookies
  headers: { "x-csrf-token": Cookies.get("csrfToken") },
});
// ajax
$.ajax({
  type: "Post",
  url: "",
  data: {},
  xhrFields: { withCredentials: true },
  crossDomain: true,
  dataType: "json",
  async: false,
  cache: false,
  success: function (result) {},
});
```

#### <a name="安全注意事项">安全注意事项</a>

**防止 XSS 攻击**

- 当网站需要直接输出用户输入的结果时，请务必使用 `helper.escape()` 包裹起来`；当网站输出的内容会提供给 JavaScript 来使用时，需要使用`helper.sjs()` 来进行过滤；若存在模板中输出一个 JSON 字符串给 JavaScript 使用的场景，请使用 helper.sjson(变量名) 进行转义，这些都是用来防止反射型的 XSS 攻击
- 框架提供了 helper.shtml() 方法对字符串进行 XSS 过滤，用来防止存储型 XSS 攻击。由于是一个非常复杂的安全处理过程，对服务器处理性能一定影响，如果不是输出 HTML，请勿使用
- 框架内部使用 jsonp-body 来对 JSONP 请求进行安全防范

**防止 CSRF 攻击**

- 同步表单的 CSRF 校验
- Session vs Cookie 存储
- 刷新 CSRF token

**其他安全工具**

- ctx.isSafeDomain(domain) 是否为安全域名。安全域名在配置中配置，见 ctx.redirect 部分。
- app.injectCsrf(str) 这个函数提供了模板预处理－自动插入 CSRF key 的能力，可以自动在所有的 form 标签中插入 CSRF 隐藏域，用户就不需要手动写了。
- app.injectNonce(str) 这个函数提供了模板预处理－自动插入 nonce 的能力，如果网站开启了 CSP 安全头，并且想使用 CSP 2.0 nonce 特性，可以使用这个函数。参考 CSP 是什么。这个函数会扫描模板中的 script 标签，并自动加上 nonce 头。
- app.injectHijackingDefense(str) 对于没有开启 HTTPS 的网站，这个函数可以有效的防止运营商劫持。


## <a name="其他配置">其他配置</a>  
### <a name="安装参数验证插件">安装参数验证插件</a>  
```shell
npm i -S egg-validate
```

```js
// config/plugin.js
module.exports = {
...
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
```

### <a name="统一异常处理">统一异常处理</a>  
```js
// middleware/error_handler.js
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && app.config.env === 'prod'
          ? '服务正在维护中，请稍后再试' // 'Internal Server Error'
          : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};

// config/config.default.js
module.exports = (appInfo) => {
  ...
  config.middleware = [ 'errorHandler' ];

  return config;
};
```

### <a name="模板渲染">模板渲染</a>  
**安装插件：**  
```shell
npm i egg-view-nunjucks --save
```  

**开启插件：**  
```js
// config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};
```  

```js
// config/config.default.js
exports.keys = <此处改为你自己的 Cookie 安全字符串>;
// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};
``` 

**编写模板文件：**  
```
<html>
  <head>
    <title>Hello {{name}}</title>
  </head>
  <body>
    Hello {{ name }} !
  </body>
</html>
```  

**添加 Controller 和 Router：**  
```js
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    const userinfo = {
      name: 'Michael',
    };
    await ctx.render('home.tpl', userinfo);
  }
}

module.exports = HomeController;

// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
};
```  

### <a name="编写扩展工具库">编写扩展工具库</a>  

```js
// extend/helper.js
module.exports = {
  parseInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
};
```  

### <a name="编写禁止百度爬虫访问中间件">编写禁止百度爬虫访问中间件</a>  
```js
// app/middleware/robot.js
// options === app.config.robot
module.exports = (options, app) => {
  return async function robotMiddleware(ctx, next) {
    const source = ctx.get('user-agent') || '';
    const match = options.ua.some(ua => ua.test(source));
    if (match) {
      ctx.status = 403;
      ctx.message = 'Go away, robot.';
    } else {
      await next();
    }
  }
};

// config/config.default.js
// add middleware robot
exports.middleware = [
  'robot'
];
// robot's configurations
exports.robot = {
  ua: [
    /Baiduspider/i,
  ]
};
```   

```shell
curl http://localhost:7002/ -A "Baiduspider"
```  

### <a name="配置管理">配置管理</a>  
> 详细请见[config.default.js](https://github.com/eggjs/egg/blob/master/config/config.default.js)  

配置的管理有多种方案，以下列一些常见的方案：

- 使用平台管理配置，应用构建时将当前环境的配置放入包内，启动时指定该配置。但应用就无法一次构建多次部署，而且本地开发环境想使用配置会变的很麻烦。  
- 使用平台管理配置，在启动时将当前环境的配置通过环境变量传入，这是比较优雅的方式，但框架对运维的要求会比较高，需要部署平台支持，同时开发环境也有相同痛点。  
- 使用代码管理配置，在代码中添加多个环境的配置，在启动时传入当前环境的参数即可。但无法全局配置，必须修改代码。  

我们选择了最后一种配置方案，**配置即代码**，配置的变更也应该经过 review 后才能发布。应用包本身是可以部署在多个环境的，只需要指定运行环境即可。  

**内置的 appInfo**  
| appInfo | 说明 |  
| --- | --- |  
| pkg | package.json |  
| name | 应用名，同 pkg.name |  
| baseDir |  应用代码的目录 |  
| HOME | 用户目录，如 admin 账户为 /home/admin |  
| root | 应用根目录，只有在 local 和 unittest 环境下为 baseDir，其他都为 HOME|  

## <a name="业务开发">业务开发</a>
### <a name="配置路由映射">配置路由映射</a>
```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  ...
  router.get('/api/v1/wxactivity', controller.v1.wxactivity.find);
  router.post('/api/v1/wxactivity', controller.v1.wxactivity.create);
};
```

### <a name="编写Controller">编写 Controller</a>  
[`app/controller/wxactivity.js`](app/controller/wxactivity.js)  

**什么是 Controller**  
Controller 负责解析用户的输入，处理后返回相应的结果。  
- 在 RESTful 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。  
- 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。  
- 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。  

**大致步骤**  
1. 获取用户通过 HTTP 传递过来的请求参数。
2. 校验、组装参数。
3. 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
4. 通过 HTTP 将结果响应给用户。

> Controller 有 `class` 和 `exports` 两种编写方式，你可能需要参考 [Controller](https://eggjs.org/zh-cn/basics/controller.html) 文档  
> Config 也有 `module.exports` 和 `exports` 的写法，具体参考 [Node.js modules](https://nodejs.org/api/modules.html#modules_exports_shortcut) 文档  

**注意事项**  
* 如果用户的请求 body 超过了我们配置的解析最大长度，会抛出一个状态码为 413 的异常  
* 如果用户请求的 body 解析失败（错误的 JSON），会抛出一个状态码为 400 的异常  
* 在调整 bodyParser 支持的 body 长度时，如果我们应用前面还有一层反向代理（Nginx），可能也需要调整它的配置，确保反向代理也支持同样长度的请求 body  
* 由于浏览器和其他客户端实现的不确定性，为了保证 Cookie 可以写入成功，建议 value 通过 base64 编码或者其他形式 encode 之后再写入  
* 由于浏览器对 Cookie 有长度限制限制，所以尽量不要设置太长的 Cookie。一般来说不要超过 4093 bytes。当设置的 Cookie value 大于这个值时，框架会打印一条警告日志  

### <a name="编写service">编写 service</a>  
[`app/service/wxactivity.js`](app/service/wxactivity.js)  

在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 [Service](https://eggjs.org/zh-cn/basics/service.html)

* 保持 Controller 中的逻辑更加简洁  
* 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用  
* 将逻辑和展现分离，更容易编写测试用例  

**使用场景**  
* 复杂数据的处理，比如要展现的信息需要从数据库获取，还要经过一定的规则计算，才能返回用户显示。或者计算完成后，更新到数据库  
* 第三方服务的调用，比如 GitHub 信息获取等  

**Service ctx**  
* this.ctx.curl 发起网络调用  
* this.ctx.service.otherService 调用其他 Service  
* this.ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块  

**注意事项**  
* Service 文件必须放在 app/service 目录，可以支持多级目录，访问的时候可以通过目录名级联访问  
* 一个 Service 文件只能包含一个类， 这个类需要通过 module.exports 的方式返回  
* Service 需要通过 Class 的方式定义，父类必须是 egg.Service  
* Service 不是单例，是 请求级别 的对象，框架在每次请求中首次访问 ctx  
* service.xx 时延迟实例化，所以 Service 中可以通过 this.ctx 获取到当前请求的上下文  

### <a name="单元测试">单元测试</a>  

**为什么要单元测试**   

先问我们自己以下几个问题：  
* 你的代码质量如何度量？
* 你是如何保证代码质量？
* 你敢随时重构代码吗？
* 你是如何确保重构的代码依然保持正确性？
* 你是否有足够信心在没有测试的情况下随时发布你的代码？

如果答案都比较犹豫，那么就证明我们非常需要单元测试。  

它能带给我们很多保障：  
* 代码质量持续有保障
* 重构正确性保障
* 增强自信心
* 自动化运行

应用的 Controller、Service、Helper、Extend 等代码，都必须有对应的单元测试保证代码质量。 当然，框架和插件的每个功能改动和重构都需要有相应的单元测试，并且要求尽量做到修改的代码能被 100% 覆盖到。  

**测试工具和模块**   

统一使用 egg-bin 来运行测试脚本， 自动将内置的 Mocha、co-mocha、power-assert，nyc 等模块组合引入到测试脚本中， 让我们聚焦精力在编写测试代码上，而不是纠结选择那些测试周边工具和模块。  

**测试执行顺序**     

Mocha 使用 before/after/beforeEach/afterEach 来处理前置后置任务，基本能处理所有问题。 每个用例会按 before -> beforeEach -> it -> afterEach -> after 的顺序执行，而且可以定义多个。  
```js
describe('egg test', () => {
  before(() => console.log('order 1'));
  before(() => console.log('order 2'));
  after(() => console.log('order 6'));
  beforeEach(() => console.log('order 3'));
  afterEach(() => console.log('order 5'));
  it('should worker', () => console.log('order 4'));
});
```  

**异步测试**   

egg-bin 支持测试异步调用，它支持多种写法：  
```js
// 使用返回 Promise 的方式
it('should redirect', () => {
  return app.httpRequest()
    .get('/')
    .expect(302);
});

// 使用 callback 的方式
it('should redirect', done => {
  app.httpRequest()
    .get('/')
    .expect(302, done);
});

// 使用 async
it('should redirect', async () => {
  await app.httpRequest()
    .get('/')
    .expect(302);
});
```  

使用哪种写法取决于不同应用场景，如果遇到多个异步可以使用 async function，也可以拆分成多个测试用例。  

## <a name="发布">发布</a>  

```bash
$ npm start
$ npm stop
```

## <a name="附录">附录</a>  
### <a name="插件列表">插件列表</a>  
框架默认内置了企业级应用常用的插件：  
* onerror 统一异常处理
* Session Session 实现
* i18n 多语言
* watcher 文件和文件夹监控
* multipart 文件流式上传
* security 安全
* development 开发环境配置
* logrotator 日志切分
* schedule 定时任务
* static 静态服务器
* jsonp jsonp 支持
* view 模板引擎

> 详情见：https://eggjs.org/zh-cn/basics/plugin.html  

### <a name="框架扩展">框架扩展</a>  
框架提供了多种扩展点扩展自身的功能：  
* Application
* Context
* Request
* Response
* Helper  

在开发中，我们既可以使用已有的扩展 API 来方便开发，也可以对以上对象进行自定义扩展，进一步加强框架的功能。  

> 详情请见：https://eggjs.org/zh-cn/basics/extend.html#request  

### <a name="启动自定义">启动自定义</a>  
框架提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法来执行启动应用过程中的初始化工作。  

框架提供了这些[生命周期函数](https://eggjs.org/zh-cn/advanced/loader.html#life-cycles)供开发人员处理：  
* 配置文件即将加载，这是最后动态修改配置的时机（configWillLoad）
* 配置文件加载完成（configDidLoad）
* 文件加载完成（didLoad）
* 插件启动完毕（willReady）
* worker 准备就绪（didReady）
* 应用启动完成（serverDidReady）
* 应用即将关闭（beforeClose）

**注意事项**  
* 在自定义生命周期函数中不建议做太耗时的操作，框架会有启动的超时检测  

### <a name="日志">日志</a>  
> 详情请见：https://eggjs.org/zh-cn/core/logger.html