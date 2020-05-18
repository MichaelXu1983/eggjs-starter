const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    const userinfo = {
      name: 'Michael',
    };
    await ctx.render('home.tpl', userinfo);
  }
}

module.exports = HomeController;
