const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { name, version, description, author } = ctx.app.config.pkg;
    const pkginfo = {
      name,
      version,
      description,
      author,
    };
    await ctx.render('home.tpl', pkginfo);
  }
}

module.exports = HomeController;
