'use strict';
// 我们需要有一个消息中间件的客户端，它会和服务端保持长连接，这一类的长连接维持比较适合在 Agent 进程上做，可以有效降低连接数，减少两端的消耗。所以我们在 Agent 进程上来开启消息监听
// 在大部分情况下，我们在写业务代码的时候完全不用考虑 Agent 进程的存在，但是当我们遇到一些场景，只想让代码运行在一个进程上的时候，Agent 进程就到了发挥作用的时候了。
// 由于 Agent 只有一个，而且会负责许多维持连接的脏活累活，因此它不能轻易挂掉和重启，所以 Agent 进程在监听到未捕获异常时不会退出，但是会打印出错误日志，我们需要对日志中的未捕获异常提高警惕
// 所以能够通过定时任务解决的问题就不要放到 Agent 上执行

const Subscriber = require('./lib/subscriber');

module.exports = agent => {
  agent.logger.info('init subscriber');
  const subscriber = new Subscriber();
  agent.logger.info('=>通知所有进程 refresh push');
  subscriber.on('changed', () => agent.messenger.sendToApp('refresh', 'push')); // 发送给所有的 app 进程:1.在 app 上调用该方法会发送给自己和其他的 app 进程;2.在 agent 上调用该方法会发送给所有的 app 进程
  subscriber.on('error', err => agent.logger.error(err));
};
