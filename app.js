'use strict';
// 在启动自定义文件中监听 refresh 事件，并更新数据，所有的 Worker 进程都能收到这个消息，并触发更新
module.exports = app => {
  app.beforeStart(async () => {
    // ensure memory cache exists before app ready
    await app.runSchedule('force_refresh');
  });

  const { messenger } = app;

  messenger.on('refresh', by => { // 在 messenger 上监听对应的 action 事件，就可以收到其他进程发送来的信息了
    app.logger.info('=>启动 refresh push/pull');
    app.logger.info('start update by %s', by);
    // create an anonymous context to access service
    const ctx = app.createAnonymousContext();
    // a convenient way to excute with generator function
    // can replaced by `co`
    ctx.runInBackground(async () => {
      await ctx.service.source.update();
      app.lastUpdateBy = by;
    });
  });
};
