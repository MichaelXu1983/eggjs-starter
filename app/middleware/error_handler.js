/*
 * @Author: Michael Xu
 * @Date: 2020-05-20 11:38:50
 * @LastEditTime: 2020-05-21 12:34:49
 * @LastEditors: Michael Xu
 * @Description: 统一错误处理
 * @FilePath: /eggjs-starter/app/middleware/error_handler.js
 * @Blog: https://www.michaelxu.cn/
 */
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
      ctx.status = status;
    }
  };
};
