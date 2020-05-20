const { app, assert } = require('egg-mock/bootstrap');

describe('parseInt()', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  it('should int with default int', () => {
    assert(ctx.helper.parseInt(1000) === 1000);
  });
  it('should int with default not null or undefined or false', () => {
    assert(ctx.helper.parseInt(null) === null);
    assert(ctx.helper.parseInt(undefined) === undefined);
    assert(ctx.helper.parseInt(false) === false);
  });
  it('should int with default Function or RegExp or Date', () => {
    assert(ctx.helper.parseInt(() => {}) === 0);
    assert(ctx.helper.parseInt(new Date()) === 0);
    assert(ctx.helper.parseInt(new RegExp('ab+c')) === 0);
  });
});
