/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('index', '/', controller.home.index);
  // app.router.redirect('/', '/home/index', 302);
  router.get('/api/v1/wxactivity', controller.v1.wxactivity.show);
  router.post('/api/v1/wxactivity', controller.v1.wxactivity.create);
  router.get('/api/v1/applicants', controller.v1.applicants.index);
  router.post('/api/v1/applicants', controller.v1.applicants.create);
};
