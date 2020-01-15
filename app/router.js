'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // app.redirect('/', '/news');
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);
  router.get('/source', controller.source.index);
};
