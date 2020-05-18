const Service = require('egg').Service;

class ApplicantsService extends Service {
  // 登记信息
  async create(data) {
    const { app } = this;
    const activityDB = app.mysql.get('ms_activity');

    const { ActivityCode, Tel } = data; // 取入参用户信息

    // 查询是否已存在该用户信息
    const user = await activityDB.select(ActivityCode, {
      where: { Tel },
      columns: [ 'RealName' ],
    });

    if (user.length === 0) {
      // 该用户未登记过
      const result = await activityDB.insert(ActivityCode, data);

      return result;
    }
  }

  // 获取登记信息
  async find(data) {
    const { app } = this;
    const activityDB = app.mysql.get('ms_activity');

    const { ActivityCode } = data;

    const result = await activityDB.select(ActivityCode, {
      where: { ActivityCode },
      orders: [[ 'AddTime', 'desc' ]],
    });

    return result;
  }
}

module.exports = ApplicantsService;
