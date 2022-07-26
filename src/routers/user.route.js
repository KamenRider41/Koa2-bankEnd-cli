const Router = require("koa-router");

const router = new Router({ prefix: "/users" });

// 导入controller
const {
  register,
  login,
  login_byCookie,
  changePassword,
} = require("../controller/user.controller");
// 导入中间件
const {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
} = require("../middleware/user.middleware");
const { auth, cookie_auth } = require("../middleware/auth.middleware");
// 注册接口
router.post("/register", userValidator, verifyUser, cryptPassword, register);
// token放在body的登陆接口
router.post("/login", userValidator, verifyLogin, login);
// token放在cookie的登陆接口
router.post("/login_byCookie", userValidator, verifyLogin, login_byCookie);
// 修改密码接口(token放在body)
router.patch("/changePassword", auth, cryptPassword, changePassword);
// 修改密码接口(token放在cookie)
router.patch(
  "/changePassword_byCookie",
  cookie_auth,
  cryptPassword,
  changePassword
);
// 每次调用接口都返回token
// 对于放在body中，好像是有些麻烦了
// 但是我们可以通过cookie无感刷新

// 优化: 我们在每次返回home页的时候进行一次更新
// 接口就是传入token返回新token

// 双token的无感刷新
// token过期了
// 通过freshtoken续费
module.exports = router;
