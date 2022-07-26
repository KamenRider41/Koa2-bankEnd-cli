// 导入包
const Koa = require("koa");
const KoaBody = require("koa-body");
const render = require("koa-art-template");
const path = require("path");
const serve = require("koa-static");
// 统一的错误处理函数
const errHandler = require("./errHandler");
// 创建app实例
const app = new Koa();
// 配置koa-art-template模板引擎
render(app, {
  root: path.join(path.resolve(__dirname, ".."), "views"), //视图的位置
  extname: ".html", // 模板文件的后缀
});
// 导入封装好的路由
const userRouter = require("../routers/user.route");
const homeRouter = require("../routers/home.route");
// 创建中间件
app.use(KoaBody());
app.use(userRouter.routes());
app.use(homeRouter.routes());
app.use(serve(path.resolve(__dirname, '..') + '/public'))
// 监听统一的错误处理
app.on("error", errHandler);
module.exports = app;
