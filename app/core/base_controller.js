const { Controller } = require('egg');
class BaseController extends Controller {
  success(msg, data) {
    this.ctx.body = {
      status: 'ok',
      msg: msg || '操作成功',
      data,
    };
  }

  fail(msg, data) {
    this.ctx.body = {
      status: 'error',
      msg: msg || '操作失败',
      data,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
