module.exports = {
  // 通过 ctx.helper 访问到 helper 对象
  parseInt(string) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
};
