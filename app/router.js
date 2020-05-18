/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('index', '/home/index', controller.home.index);
  app.router.redirect('/', '/home/index', 302);
  router.get('/api/v1/wxactivity', controller.v1.wxactivity.find);
  router.post('/api/v1/wxactivity', controller.v1.wxactivity.create);
  router.get('/api/v1/applicants', controller.v1.applicants.find);
  router.post('/api/v1/applicants', controller.v1.applicants.create);
};
