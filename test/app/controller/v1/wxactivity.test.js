const { assert, app } = require('egg-mock/bootstrap');

const mockActivityCode = 'lucky-bag';

describe('test/app/controller/v1/wxactivity.test.js', () => {
  describe('POST /api/v1/wxactivity:ActivityCode', () => {
    it('should status 200 and get the request body', () => {
      app.mockCsrf();
      return app
        .httpRequest()
        .post('/api/v1/wxactivity')
        .send({
          ActivityCode: 'lucky-bag',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          assert(response.status, 201);
        });
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
      app.mockServiceError(
        'v1.wxactivity',
        'find',
        'mock wxactivity service error'
      );
      return app
        .httpRequest()
        .get('/api/v1/wxactivity?ActivityCode=lucky-bag')
        .expect(500)
        .expect(/mock wxactivity service error/);
    });
  });
});
