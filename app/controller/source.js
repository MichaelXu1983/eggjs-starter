'use strict';

const Controller = require('egg').Controller;

class Source extends Controller {
  index() {
    const { ctx, service } = this;
    ctx.body = {
      index: service.source.get('index'),
      lastUpdateBy: ctx.app.lastUpdateBy,
    };
  }
}

module.exports = Source;
