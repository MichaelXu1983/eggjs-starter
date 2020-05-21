/*
 * @Author: Michael Xu
 * @Date: 2020-05-18 17:03:14
 * @LastEditTime: 2020-05-21 11:57:07
 * @LastEditors: Michael Xu
 * @Description: 登记和获取登记列表
 * @FilePath: /register/app/service/v1/applicants.js
 * @Blog: https://www.michaelxu.cn/
 */

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
    let result = null;
    if (user.length === 0) {
      // 该用户未登记过
      result = await activityDB.insert(ActivityCode, data);
    }
    return result;
  }

  // 获取登记信息列表
  async list(data) {
    const { app } = this;
    const activityDB = app.mysql.get('ms_activity');

    const { ActivityCode, offset, limit } = data;

    const result = await activityDB.select(ActivityCode, {
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: { ActivityCode },
      orders: [
        [ 'AddTime', 'desc' ],
        [ 'id', 'desc' ],
      ],
    });

    return result;
  }
}

module.exports = ApplicantsService;
