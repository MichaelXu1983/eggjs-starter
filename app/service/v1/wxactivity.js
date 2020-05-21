/*
 * @Author: Michael Xu
 * @Date: 2020-05-19 17:47:09
 * @LastEditTime: 2020-05-21 11:57:31
 * @LastEditors: Michael Xu
 * @Description: 活动信息设置和读取
 * @FilePath: /register/app/service/v1/wxactivity.js
 * @Blog: https://www.michaelxu.cn/
 */

const Service = require('egg').Service;
const moment = require('moment');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class WXActivityService extends Service {
  // 设置活动信息
  async create(data) {
    const { app } = this;
    const appConfigDB = app.mysql.get('ms_appconfig');

    const {
      ActivityCode,
      Title,
      Des,
      StartTime,
      EndTime,
      IsTest,
      ShareAppMessageView,
      ShareTimelineView,
    } = data; // 取入参活动信息

    // 查询是否已存在该活动信息
    const info = await appConfigDB.select('wx_activity', {
      where: { ActivityCode },
      columns: [ 'Title' ],
    });
    // this.ctx.logger.debug('debug info from service');
    let result = null;
    if (info.length === 0) {
      // 未查询到活动信息，就插入，否则更新
      result = await appConfigDB.insert('wx_activity', data);
    } else {
      const row = {
        Title,
        Des,
        StartTime,
        EndTime,
        IsTest,
        ShareAppMessageView,
        ShareTimelineView,
        AddTime: moment().format(dateFormat),
      };
      const options = {
        where: {
          ActivityCode,
        },
      };
      result = await appConfigDB.update('wx_activity', row, options);
    }

    return result;
  }

  // 获取活动配置信息
  async find(data) {
    const { app } = this;
    const appConfigDB = app.mysql.get('ms_appconfig');

    const { ActivityCode } = data;

    const result = await appConfigDB.select('wx_activity', {
      where: { ActivityCode },
    });

    return result;
  }
}

module.exports = WXActivityService;
