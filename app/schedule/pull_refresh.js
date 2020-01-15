'use strict';
// 每 10s 让一个 worker 调用检查接口，当发现数据有变化时，通过 messenger 提供的方法通知所有的 Worker
exports.schedule = {
  interval: '10s',
  type: 'worker', // only run in one worker
};

exports.task = async function(ctx) {
  ctx.app.logger.info('=>10秒钟到了，准备 checkupdate');
  const needRefresh = await ctx.service.source.checkUpdate();
  if (!needRefresh) return;

  // notify all workers to update memory cache from `file`
  ctx.app.messenger.sendToApp('refresh', 'pull'); // 发送给所有的 app 进程:1.在 app 上调用该方法会发送给自己和其他的 app 进程;2.在 agent 上调用该方法会发送给所有的 app 进程
};
