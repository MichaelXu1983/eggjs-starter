# Egg.js 应用脚手架

基于 Egg.js 搭建的企业级应用脚手架，可以帮助开发团队和开发人员降低开发和维护成本。 

> moment 扩展 & 禁止百度、谷歌、新浪爱问爬虫访问 & 单元测试 & 多进程模型和进程间通讯



### 目录简介

1. [介绍](#介绍) 

2. [程序目录](#程序目录)

3. [项目启动](#项目启动)
   - [环境配置](#环境配置)
     - [初始化](#初始化)
     - [配置运行和停止命令](#配置运行和停止命令)
     - [配置开发和调试命令](#配置开发和调试命令)
     - [进行可视化调试](#进行可视化调试)
     - [对请求参数进行验证](#对请求参数进行验证)
     - [编写扩展](#编写扩展)
     - [编写 Middleware](#编写Middleware)
     - [单元测试](#单元测试)
   - [开发调试](#开发调试)
   - [发布](#发布)
   - [其他命令](#其他命令)

4. [访问 MySQL 数据库](#访问MySQL数据库)
5. [安全配置](#安全配置)

6. [客户端请求配置](#客户端请求配置)

     
### 介绍

- 提供基于 Egg 定制上层框架能力，继承于 Koa

- 提供高度可扩展的插件机制

- 服务器需要预装 Node.js，框架支持的 Node 版本为 `>= 8.0.0`

- 内置多进程管理，基于 Koa 开发，测试覆盖率高，可以进行渐进式开发

- 框架内置了 [egg-cluster](https://github.com/eggjs/egg-cluster) 来启动 [Master 进程](http://eggjs.org/zh-cn/core/cluster-and-ipc.html#master)，Master 有足够的稳定性，不再需要使用 [pm2](https://github.com/Unitech/pm2) 等进程守护模块，同时保证了 Node.js 进程（未捕获异常、OOM、系统异常）优雅的退出

- 当一个应用启动时，会同时启动这三类进程  
```bash
  | 类型    | 进程数量              | 作用                        | 稳定性 | 是否运行业务代码 |
  | ------ | ------------------- | ---------------------------- | ------ | ----------- |
  | Master | 1                   | 进程管理，进程间消息转发         | 非常高  | 否           |
  | Agent  | 1                   | 后台运行单个进程工作            | 高      | 少量         |
  | Worker | 一般设置为 CPU 核数   | 执行业务代码                   | 一般    | 是           |
```
- 框架的启动时序  
  ```bash
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
  1. Master 启动后先 fork Agent 进程
  2. Agent 初始化成功后，通过 IPC 通道通知 Master
  3. Master 再 fork 多个 App Worker
  4. App Worker 初始化成功，通知 Master
  5. 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功

      > * 由于 App Worker 依赖于 Agent，所以必须等 Agent 初始化完成后才能 fork App Worker
      > * Agent 虽然是 App Worker 的『小秘』，但是业务相关的工作不应该放到 Agent 上去做，不然把她累垮了就不好了
      > * 由于 Agent 的特殊定位，我们应该保证它相对稳定。当它发生未捕获异常，框架不会像 App Worker 一样让他退出重启，而是记录异常日志、报警等待人工处理
      > * 能够通过定时任务解决的问题就不要放到 Agent 上执行
      > * 当 Worker 进程异常退出时，Master 进程会重启一个 Worker 进程

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

- [快速入门](https://eggjs.org/zh-cn/intro/quickstart.html)、[RESTful API统一处理](https://eggjs.org/zh-cn/tutorials/restful.html)、[issues](https://github.com/eggjs/egg/issues)  

### 程序目录
```
├── package.json
├── app.js (可选)                           // 用于自定义启动时的初始化 Master 工作
├── agent.js (可选)                         // 用于自定义启动时的初始化 Agent 工作
├── app
|   ├── router.js                          // 映射 controller 文件，创建 RESTful 风格的路由 
│   ├── controller                         // 用于解析用户的输入，处理后返回相应的结果
│   |   └── home.js                        // 默认首页
│   |   └── news.js                        // 新闻相关接口
│   ├── service                            // 用于编写业务逻辑层
│   |   └── news.js                        // 用户相关接口实际生效的业务逻辑
│   ├── middleware (可选)                   // 用于编写中间件
│   |   └── robot.js                       // 禁止百度爬虫访问
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
|   ├── config.test.js (可选) 	          // 测试配置
|   ├── config.local.js (可选)            // 本地配置
|   └── config.unittest.js (可选)         // 单元测试配置
└── test                                 // 用于单元测试
    ├── middleware
    |   └── robot.test.js
    └── controller
        └── home.test.js
```  

### 项目启动

#### 环境配置

1. 初始化  
    ```bash
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

2. 配置运行和停止命令（ --type=simple 里已包含）安装命令  
    ```bash
    npm i -S egg-scripts
    ```

    添加 `npm scripts` 到 `package.json`：

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
    > `--title=egg-server-showcase` 用于方便 ps 进程时 grep 用，默认为 `egg-server-${appname}`；
    >
    > 更多参数可查看 [egg-scripts](https://github.com/eggjs/egg-scripts) 和 [egg-cluster](https://github.com/eggjs/egg-cluster) 文档

    你也可以在 `config.{env}.js` 中配置指定端口启动

    ```javascript
    // config/config.default.js
    config.cluster = {
      listen: {
        port: 7002,
        hostname: '127.0.0.1',
        // path: '/var/run/egg.sock',
      }
    }
    ```

    > 说明：如需要对服务进行性能监控，内存泄露分析，故障排除，请查看[Node.js 性能平台](http://eggjs.org/zh-cn/core/deployment.html)

3. 配置开发和调试命令（ --type=simple 里已包含）  
    添加 `npm dev`  和 `npm debug ` 到 `package.json`  ：

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
4. 安装 [vscode-eggjs](https://github.com/eggjs/vscode-eggjs) 扩展，进行可视化调试（必装，有利于调试 bug）  
    首先进入 vscode 编辑器安装 Egg.js dev tools 插件  

    其次配置

    ```javascript
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
5. 使用 validate 插件，对请求参数进行验证  
    ```bash
    npm i -S egg-validate
    ```

    ```javascript
    // config/plugin.js
    exports.validate = {
      enable: true,
      package: 'egg-validate',
    };
    ```

    ```javascript
    // app/controller/topics.js
    const Controller = require('egg').Controller;

    // 定义创建接口的请求参数规则
    const createRule = {
      accesstoken: 'string',
      title: 'string',
      tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
      content: 'string',
    };

    class TopicController extends Controller {
      async create() {
        const ctx = this.ctx;
        // 校验 `ctx.request.body` 是否符合我们预期的格式
        // 如果参数校验未通过，将会抛出一个 status = 422 的异常
        ctx.validate(createRule);
        // 调用 service 创建一个 topic
        const id = await ctx.service.topics.create(ctx.request.body);
        // 设置响应体和状态码
        ctx.body = {
          topic_id: id,
        };
        ctx.status = 201;
      }
    }
    module.exports = TopicController;

    ```  
6. 模版渲染  
   ```bash
   npm i egg-view-nunjucks --save
   ```

    ```javascript
    // config/plugin.js
    exports.nunjucks = {
        enable: true,
        package: 'egg-view-nunjucks'
    }      
    ```   

    ```javascript
    // 添加 view 配置
    exports.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
          '.tpl': 'nunjucks',
        },
    };      
    ```   

    ```html
    <!-- app/view/news/list.tpl -->
    <html>
        <head>
          <title>Hacker News</title>
          <link rel="stylesheet" href="/public/css/news.css" />
        </head>
        <body>
          <ul class="news-view view">
            {% for item in list %}
              <li class="item">
                <a href="{{ item.url }}">{{ item.title }}</a>
              </li>
            {% endfor %}
          </ul>
        </body>
    </html>      
    ```
7. 编写扩展  
    ```bash
    npm i -S moment
    ```
    ```javascript
    // app/extend/helper.js
    const moment = require('moment');
    exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();
    ```
    ```html
    <!-- app/view/news/list.tpl -->
    {{ helper.relativeTime(1483203661) }}
    ```  
8. 编写 Middleware  
    ```javascript  
    // 禁止百度爬虫访问
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
      
    // curl http://localhost:7005/news -A "Baiduspider"
    ```  
9.  单元测试  
    ```javascript
    // test/app/middleware/robot.test.js
    const { app, mock, assert } = require('egg-mock/bootstrap');
    
    describe('test/app/middleware/robot.test.js', () => {
      it('should block robot', () => {
        return app.httpRequest()
          .get('/')
          .set('User-Agent', "Baiduspider")
          .expect(403);
      });
    });
    ```

    ```bash
    npm i egg-mock --save-dev
    npm test
    ```
   
#### 开发调试
  ```bash
  npm i
  npm run dev
  open http://localhost:7005/
  ```  
  
#### 发布

  ```bash
  npm start
  npm stop
```

#### 其他命令

- Use `npm run lint` to check code style.

- Use `npm test` to run unit test.

- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail....

  

#### 访问 MySQL 数据库

安装对应的插件 [egg-mysql](https://github.com/eggjs/egg-mysql) ：

  ```bash
  npm i --save egg-mysql
  ```

开启插件：

  ```javascript
  // config/plugin.js
  exports.mysql = {
    enable: true,
    package: 'egg-mysql',
  };
  ```

配置数据源

  ```javascript
  // config/config.default.js
  module.exports = appInfo => {
    const config = exports = {
      mysql: {
        db1: {
            // host
            host: 'mysql.com',
            // 端口号
            port: '3306',
            // 用户名
            user: 'test_user',
            // 密码
            password: 'test_password',
            // 数据库名
            database: 'test',
        },
        db2: {
            // host
            host: 'mysql.com',
            // 端口号
            port: '3306',
            // 用户名
            user: 'test_user',
            // 密码
            password: 'test_password',
            // 数据库名
            database: 'test',
        },
        // default: {// 所有数据库配置的默认值
        //   database: null,
        //   connectionLimit: 5,
        // },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
      }
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1530270948065_2624';

    // add your config here
    config.middleware = [];

    return config;
  };
  ```

使用方式：

  ```javascript
  const client1 = app.mysql.get('db1');
  await client1.query(sql, values);

  const client2 = app.mysql.get('db2');
  await client2.query(sql, values);
  ```

> 具体可参考：[egg-mysql](http://eggjs.org/zh-cn/tutorials/mysql.html)



#### 安全配置

安装对应插件：

  ```bash
  npm i egg-cors --save
  ```

开启插件：

  ```javascript
  // {app_root}/config/plugin.js
  exports.cors = {
    enable: true,
    package: 'egg-cors',
  };
  ```

配置：

  ```javascript
  // config/config.default.js
  exports.cors = {
      // {string|Function} origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true
  };

  exports.security = {
    csrf: {
      headerName: 'x-csrf-token',
    },
    domainWhiteList: ['http://127.0.0.1:8081']
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

  // http 请求方法：request.js
  // 创建axios实例
  const service = axios.create({
      baseURL: process.env.BASE_API, // api的base_url
      timeout: 15000, // 请求超时时间
      withCredentials: true, //表示跨域请求时是否需要使用凭证，默认 false 可导致服务端无法获取cookies
      headers: {'x-csrf-token': Cookies.get('csrfToken')},
  })
  ```



#### 客户端请求配置

  ```javascript
  // 创建axios实例
  const service = axios.create({
      withCredentials: true, //表示跨域请求时是否需要使用凭证，默认 false 可导致服务端无法获取cookies
      headers: {'x-csrf-token': Cookies.get('csrfToken')},
  })
  ```

