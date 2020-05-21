/*
 * @Author: Michael Xu
 * @Date: 2020-04-28 17:09:38
 * @LastEditTime: 2020-05-21 12:25:48
 * @LastEditors: Michael Xu
 * @Description: 活动信息设置和读取
 * @FilePath: /register/app/controller/v1/wxactivity.js
 * @Blog: https://www.michaelxu.cn/
 */
const Controller = require('../../core/base_controller');

class WXActivityController extends Controller {
  constructor(ctx) {
    super(ctx); // 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用
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
    this.validating('参数错误', this.createRule);
    // 组装参数
    // const author = ctx.session.userId;
    // const req = Object.assign(ctx.request.body, { author });

    const data = ctx.request.body; // 默认post请求，get请求为：ctx.request.query，url参数为：ctx.params.id
    // this.logger.debug('current user: %j', data);

    // 调用 Service 进行业务处理
    const result = await ctx.service.v1.wxactivity.create(data);
    // 设置响应内容和响应状态码
    this.success('插入或更新成功', result);
  }
  // 获取当前活动配置信息
  async show() {
    const { ctx } = this;
    const data = ctx.request.query; // ctx.queries

    const result = await ctx.service.v1.wxactivity.find(data);
    // console.log('host' + ctx.host);
    // console.log('protocol' + ctx.protocol);
    // console.log('ips' + ctx.ips);
    // console.log('ip' + ctx.ip);

    ctx.cookies.set('ActivityCode', ctx.request.query.ActivityCode);
    this.success('查询成功', result);
  }
}
module.exports = WXActivityController;
