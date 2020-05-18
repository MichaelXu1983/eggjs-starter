const Controller = require('../../core/base_controller');

class ApplicantsController extends Controller {
  // 登记
  async create() {
    const { ctx } = this;
    const start = Date.now();
    const data = ctx.request.body;

    const ActivityCode = ctx.cookies.get('ActivityCode', {
      encrypt: true,
    });

    if (typeof ActivityCode !== 'undefined') {
      data.ActivityCode = decodeURI(ActivityCode);
    } else if (typeof data.ActivityCode !== 'undefined') {
      data.ActivityCode = decodeURI(data.ActivityCode);
    } else {
      data.ActivityCode = decodeURI(ctx.header.referer);
    }

    const result = await ctx.service.v1.applicants.create(data);
    if (result && result.affectedRows === 1) {
      this.success('登记成功', result, start);
    } else {
      this.fail('请勿重复登记', result, start);
    }
    ctx.status = 201;
  }
  // 获取当前活动配置信息
  async find() {
    const { ctx } = this;
    const start = Date.now();
    const data = ctx.request.query; // ctx.queries
    const result = await ctx.service.v1.applicants.find(data);
    if (result.length !== 0) {
      this.success('查询成功', result, start);
    } else {
      this.fail('未查询到信息', result, start);
    }
  }
}
module.exports = ApplicantsController;
