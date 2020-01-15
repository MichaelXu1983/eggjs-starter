'use strict';
// 每 10 分钟定时从远程数据源获取数据更新缓存做兜底
exports.schedule = {
  interval: '10m',
  type: 'all', // run in all workers
};

exports.task = async function(ctx) {
  ctx.app.logger.info('=>10分钟到了，准备强制 update');
  await ctx.service.source.update();
  ctx.app.lastUpdateBy = 'force';
};
