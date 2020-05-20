

module.exports = app => {
  app.beforeStart(async () => {
    // 示例：启动的时候去读取 https://registry.npmjs.com/egg/latest 的版本信息
    app.logger.debug('app beforeStart');
    // const result = await app.curl('https://registry.npmjs.com/egg/latest', {
    //   dataType: 'json',
    // });
    // app.logger.info('egg latest version: %s', result.data.version);
  });
  // 自定义校验规则
  // app.validator.addRule('json', (rule, value) => {
  //   try {
  //     JSON.parse(value);
  //   } catch (err) {
  //     return 'must be json string';
  //   }
  // });
};
