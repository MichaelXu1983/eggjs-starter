const { app, assert } = require('egg-mock/bootstrap');

const mockActivityCode = 'test-20200520';

describe('test/app/service/v1/applicants.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });
  describe('create()', () => {
    it('should create success', async () => {
      const res = await ctx.service.v1.applicants.create({
        ActivityCode: mockActivityCode,
        Tel: '13971111113',
      });
      res && assert(res.affectedRows === 1);
    });
    it('should create null when user exists', async () => {
      const res = await ctx.service.v1.applicants.create({
        ActivityCode: mockActivityCode,
        Tel: '13971111113',
      });
      assert(!res);
    });
  });
  describe('list()', () => {
    it('should list success with default limit null offset null order AddTime desc', async () => {
      const data = await ctx.service.v1.applicants.list({
        ActivityCode: mockActivityCode,
      });
      assert(data.length >= 0);
    });
    it('should return the giving offset rows', async () => {
      const data1 = await ctx.service.v1.applicants.list({
        ActivityCode: mockActivityCode,
      });
      const data2 = await ctx.service.v1.applicants.list({
        limit: 99999,
        offset: 1,
        ActivityCode: mockActivityCode,
      });
      assert(data1.length === data2.length + 1); // 1 为 data2 的 offset 值
    });
    it('should return the giving limit rows', async () => {
      const data = await ctx.service.v1.applicants.list({
        limit: 1,
        offset: 0,
        ActivityCode: mockActivityCode,
      });
      assert(data.length === 1); // 1 为 data 的 limit 值
    });
    it('should return the list of the giving ActivityCode', async () => {
      const data = await ctx.service.v1.applicants.list({
        ActivityCode: mockActivityCode,
      });
      assert(data.length !== 0);
    });
  });
});
