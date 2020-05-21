/*
 * @Author: Michael Xu
 * @Date: 2020-05-19 09:52:15
 * @LastEditTime: 2020-05-21 12:10:07
 * @LastEditors: Michael Xu
 * @Description: 登记和获取登记列表
 * @FilePath: /register/app/controller/v1/applicants.js
 * @Blog: https://www.michaelxu.cn/
 */

const Controller = require('../../core/base_controller');

class ApplicantsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      ActivityCode: 'string',
    };
  }
  // 登记
  async create() {
    const { ctx } = this;

    const data = ctx.request.body;

    const ActivityCode = ctx.cookies.get('ActivityCode', {
      encrypt: true,
    });
    if (typeof ActivityCode !== 'undefined') {
      data.ActivityCode = decodeURI(ActivityCode);
    } else if (typeof data.ActivityCode !== 'undefined') {
      data.ActivityCode = decodeURI(data.ActivityCode);
    } else {
      this.fail('参数错误');
      return;
    }

    const result = await ctx.service.v1.applicants.create(data);
    if (result && result.affectedRows === 1) {
      this.success('登记成功', result);
    } else {
      this.fail('请勿重复登记', result);
    }
  }
  // 获取登记信息列表
  async index() {
    const { ctx } = this;
    const data = ctx.request.query; // ctx.queries
    const result = await ctx.service.v1.applicants.list(data);
    this.success('查询成功', result);
  }
}
module.exports = ApplicantsController;
