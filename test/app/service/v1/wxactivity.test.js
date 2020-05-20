const { app, assert } = require('egg-mock/bootstrap');

const mockActivityCode = 'test-20200520';

describe('test/app/service/v1/wxactivity.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  describe('create()', () => {
    it('should create success', async () => {
      const res = await ctx.service.v1.wxactivity.create({
        ActivityCode: mockActivityCode,
      });
      assert(res);
      assert(res.affectedRows === 1);
    });
  });
  describe('find(data)', () => {
    it('should find success', async () => {
      const data = { ActivityCode: mockActivityCode };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length !== 0);
    });
    it('should get null when ActivityCode not exists', async () => {
      const data = { ActivityCode: null };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length === 0);
    });
    it(`should mock ${mockActivityCode} exists`, async () => {
      app.mockService('v1.wxactivity', 'find', async () => {
        return [{ ID: 6, ActivityCode: mockActivityCode, Title: '单元测试' }];
      });
      const data = { ActivityCode: mockActivityCode };
      const res = await ctx.service.v1.wxactivity.find(data);
      assert(res);
      assert(res.length !== 0);
    });
  });
});
