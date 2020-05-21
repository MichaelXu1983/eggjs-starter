/*
 * @Author: Michael Xu
 * @Date: 2020-04-29 09:50:10
 * @LastEditTime: 2020-05-21 11:56:09
 * @LastEditors: Michael Xu
 * @Description:
 * @FilePath: /register/app/extend/helper.js
 * @Blog: https://www.michaelxu.cn/
 */

module.exports = {
  /**
   * 通过 ctx.helper 访问到 helper 对象
   * @param {string} string 需要转换的变量
   * @return {(number|null|undefined|boolean)} 可能返回的变量类型
   */
  parseInt(string) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
};
