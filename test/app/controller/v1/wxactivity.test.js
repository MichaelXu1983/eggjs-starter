/*
 * @Author: Michael Xu
 * @Date: 2020-05-19 11:15:08
 * @LastEditTime: 2020-05-21 12:25:11
 * @LastEditors: Michael Xu
 * @Description: 活动信息设置和获取单元测试
 * @FilePath: /register/test/app/controller/v1/wxactivity.test.js
 * @Blog: https://www.michaelxu.cn/
 */
const { app, assert } = require('egg-mock/bootstrap');

const mockActivityCode = 'test-20200520';

describe('test/app/controller/v1/wxactivity.test.js', () => {
  // before(() => console.log('order 1'));
  // before(() => console.log('order 2'));
  // after(() => console.log('order 6'));
  // beforeEach(() => console.log('order 3'));
  // afterEach(() => console.log('order 5'));
  describe('POST /api/v1/wxactivity', () => {
    it('should status 200 and get the request body', () => {
      app.mockCsrf();
      return app
        .httpRequest()
        .post('/api/v1/wxactivity')
        .send({
          ActivityCode: mockActivityCode,
          Title: '单元测试',
          Des: '单元测试数据',
          StartTime: null,
          EndTime: null,
          IsTest: 1,
          ShareAppMessageView: 0,
          ShareTimelineView: 0,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          console.log(`response=>${JSON.stringify(response)}`);
        });
    });
    it('should status 500', () => {
      app.mockCsrf();
      return app
        .httpRequest()
        .post('/api/v1/wxactivity')
        .send({
          // ActivityCode: mockActivityCode,
          Title: '单元测试',
          Des: '单元测试数据',
          StartTime: null,
          EndTime: null,
          IsTest: 1,
          ShareAppMessageView: 0,
          ShareTimelineView: 0,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500);
    });
  });
  describe('GET /api/v1/wxactivity:ActivityCode', () => {
    it('should work', async () => {
      const res = await app
        .httpRequest()
        .get(`/api/v1/wxactivity?ActivityCode=${mockActivityCode}`);
      assert(res.status === 200);
    });
    it('should mock service error', () => {
      app.mockServiceError('v1.wxactivity', 'find', 'mock user service error');
      return app.httpRequest()
        .get(`/api/v1/wxactivity?ActivityCode=${mockActivityCode}`)
        .expect(500)
        .expect(/mock user service error/);
    });
  });
});
