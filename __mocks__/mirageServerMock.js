// 测试环境下的 Mirage 桩：真实 Mirage 依赖浏览器 XMLHttpRequest（Pretender），
// 在 node 测试环境不可用。渲染型测试只需 makeServer 为无副作用的空实现。
module.exports = {
  makeServer: () => ({
    shutdown() {},
  }),
};
