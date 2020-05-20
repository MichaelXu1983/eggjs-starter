const { app, assert } = require('egg-mock/bootstrap');

const mockActivityCode = 'test-20200520';

describe('test/app/controller/v1/applicants.test.js', () => {
  describe('POST /api/v1/applicants', () => {
    it('should status 200 with Cookies', () => {
      app.mockCsrf();
      app.mockCookies({
        ActivityCode: mockActivityCode,
      });
      return app
        .httpRequest()
        .post('/api/v1/applicants')
        .send({
          RealName: '测试',
          Tel: '13971111111',
          Other: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          console.log(`response=>${JSON.stringify(response)}`);
        });
    });
  });
  describe('POST /api/v1/applicants', () => {
    it('should status 200 with ActivityCode', () => {
      app.mockCsrf();
      return app
        .httpRequest()
        .post('/api/v1/applicants')
        .send({
          ActivityCode: mockActivityCode,
          RealName: '测试',
          Tel: '13971111111',
          Other: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          console.log(`response=>${JSON.stringify(response)}`);
        });
    });
  });
  describe('POST /api/v1/applicants', () => {
    it('should status 200 with Headers', () => {
      app.mockCsrf();

      app.mockHeaders({
        referer: mockActivityCode,
      });
      return app
        .httpRequest()
        .post('/api/v1/applicants')
        .send({
          RealName: '测试',
          Tel: '13971111111',
          Other: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          console.log(`response=>${JSON.stringify(response)}`);
        });
    });
  });
  describe('GET /api/v1/applicants:ActivityCode', () => {
    it('should work', async () => {
      const res = await app
        .httpRequest()
        .get(`/api/v1/applicants?ActivityCode=${mockActivityCode}`);
      assert(res.status === 200);
    });
  });
});
