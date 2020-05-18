const Controller = require('../../core/base_controller');

class WXActivityController extends Controller {
  constructor(ctx) {
    super(ctx);
    // 定义创建接口的请求参数规则
    this.createRule = {
      ActivityCode: 'string',
      // accesstoken: "string",
      // title: "string",
      // tab: { type: "enum", values: ["ask", "share", "job"], required: false },
      // content: "string",
    };
  }
  // 写入活动配置信息
  async create() {
    const {
      ctx,
      // app,service,config,logger,
    } = this;
    ctx.validate(this.createRule); // 校验参数
    // 组装参数
    // const author = ctx.session.userId;
    // const req = Object.assign(ctx.request.body, { author });

    const data = ctx.request.body; // 默认post请求，get请求为：ctx.request.query，url参数为：ctx.params.id
    const result = await ctx.service.v1.wxactivity.create(data); // 调用 Service 进行业务处理
    // 设置响应内容和响应状态码
    if (result.affectedRows === 1) {
      this.success('插入或更新成功', result);
    } else {
      this.fail('插入或更新失败', result);
    }
    // ctx.body = result;
    ctx.status = 201;
  }
  // 获取当前活动配置信息
  async find() {
    const { ctx } = this;
    const data = ctx.request.query; // ctx.queries

    const result = await ctx.service.v1.wxactivity.find(data);
    // console.log('host' + ctx.host);
    // console.log('protocol' + ctx.protocol);
    // console.log('ips' + ctx.ips);
    // console.log('ip' + ctx.ip);

    if (result.length !== 0) {
      // 设置活动来源标识，供其他服务调用辨别
      const minute = 24 * 60;
      ctx.cookies.set(
        'ActivityCode',
        encodeURI(ctx.request.query.ActivityCode),
        { maxAge: minute, path: '/', secure: false, encrypt: true }
      );

      // ctx.session.ActivityCode = encodeURI(ctx.request.query.ActivityCode);
      this.success('查询成功', result);
    } else {
      this.fail('未查询到信息', result);
    }
  }
}
module.exports = WXActivityController;
