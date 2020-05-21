/*
 * @Author: Michael Xu
 * @Date: 2020-04-30 10:06:51
 * @LastEditTime: 2020-05-21 11:40:32
 * @LastEditors: Michael Xu
 * @Description: 自定义 Controller 基类
 * @FilePath: /register/app/core/base_controller.js
 * @Blog: https://www.michaelxu.cn/
 */

const { Controller } = require('egg');
class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    // 定义创建接口的请求参数规则
    this.codeMessage = {
      200: '服务器成功返回请求的数据。',
      201: '新建或修改数据成功。',
      202: '一个请求已经进入后台排队（异步任务）。',
      204: '删除数据成功。',
      400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
      401: '用户没有权限（令牌、用户名、密码错误）。',
      403: '用户得到授权，但是访问是被禁止的。',
      404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
      406: '请求的格式不可得。',
      410: '请求的资源被永久删除，且不会再得到的。',
      422: '当创建一个对象时，发生一个验证错误。',
      500: '服务器发生错误，请检查服务器。',
      502: '网关错误。',
      503: '服务不可用，服务器暂时过载或维护。',
      504: '网关超时。',
    };
  }

  /**
   * 调用正常情况的返回数据封装
   * @param {string} msg  - 描述
   * @param {object} data - 数据
   */
  success(msg, data) {
    this.ctx.body = {
      status: 'ok',
      msg: msg || '操作成功',
      data,
    };
    this.ctx.status = 200;
    // ctx.redirect(url) //如果不在配置的白名单域名内，则禁止跳转
  }

  /**
   * 处理失败，处理传入的失败原因
   * @param {string} msg  - 描述
   * @param {object} data - 数据
   */
  fail(msg, data) {
    this.ctx.body = {
      status: 'error',
      msg: msg || '操作失败',
      data,
    };
  }

  /**
   * 参数验证
   * @param {string} msg  - 描述
   * @param {object} rule - 规则
   */
  validating(msg, rule) {
    try {
      this.ctx.validate(rule);
    } catch (err) {
      this.ctx.logger.warn(err.errors);
      this.fail(msg, err.errors);
      return;
    }
  }

  // notFound(msg) {
  //   msg = msg || 'not found';
  //   this.ctx.throw(404, msg);
  // }
}
module.exports = BaseController;
