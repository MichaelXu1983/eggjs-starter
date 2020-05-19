const { app, assert } = require('egg-mock/bootstrap');

const mockActivityCode = 'lucky-bag';

describe('test/app/service/v1/wxactivity.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  describe('find(data)', () => {
    it('should find success', async () => {
      const data = { ActivityCode: mockActivityCode };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length !== 0);
    });
    it('should get null when ActivityCode not exists', async () => {
      const data = { ActivityCode: 'null' };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length === 0);
    });
    it('should mock ActivityCode exists', async () => {
      app.mockService('v1.wxactivity', 'find', async () => {
        return [{ ID: 6, ActivityCode: 'lucky-bag', Title: 'lucky-bag' }];
      });
      const data = { ActivityCode: mockActivityCode };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length !== 0);
    });
  });
  describe('create()', () => {
    it('should create success', async () => {
      const res = await ctx.service.v1.wxactivity.create({
        ActivityCode: 'lucky-bag',
      });
      assert(res.affectedRows === 1);
    });
  });
});
