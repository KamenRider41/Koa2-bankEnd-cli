module.exports = (err, ctx) => {
  let status = 500;
  switch (err.code) {
    case "10001":
      status = 400;   // 请求参数有误
      break;
    case "10003":
    case "10004":
    case "10005":
      status = 404;
      break;
    case "10002":
    case "10006":
      status = 409;   // 和被请求的资源的当前状态之间存在冲突
      break;
    default:
      status = 500;
  }
  ctx.status = status;
  ctx.body = err;
};
