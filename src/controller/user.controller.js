const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserInfo,
  updateById,
} = require("../service/user.service");
const { userRegisterError } = require("../constant/err.type");
const { JWT_SECRET } = require("../config/config.default");
class UserController {
  async register (ctx, next) {
    // 1.获取数据
    const { user_name, password } = ctx.request.body;
    try {
      // 2.操作数据库
      const res = await createUser(user_name, password);
      // 3.返回结果
      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          id: res.id,
          user_name: res.user_name,
        },
      };
    } catch (err) {
      console.log(err);
      ctx.app.emit("error", userRegisterError, ctx);
    }
  }
  async login (ctx, next) {
    const { user_name } = ctx.request.body;
    // 1.获取用户信息(在token的payload中，记录id,user_name,is_admin)
    try {
      // 从返回结果对象中剔除password属性，将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name });
      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "10s" }),
        },
      };
    } catch (err) {
      console.error("用户登录失败", err);
    }
  }

  async login_byCookie (ctx, next) {
    const { user_name } = ctx.request.body;
    // 1.获取用户信息(在token的payload中，记录id,user_name,is_admin)
    try {
      // 从返回结果对象中剔除password属性，将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name });
      const token = jwt.sign(res, JWT_SECRET, { expiresIn: "10s" });
      ctx.cookies.set("token", token, {
        domain: "localhost", // 写cookie所在的域名
        maxAge: 10 * 60 * 1000, // cookie有效时长
        // expires: new Date("2023-08-15"), // cookie失效时间
        httpOnly: true, // 是否只用于http请求中获取
        overwrite: false, // 是否允许重写
      });
      console.log("成功设置cookie!");
      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: "",
      };
    } catch (err) {
      console.error("用户登录失败", err);
    }
  }

  async changePassword (ctx, next) {
    // 1.获取数据
    const id = ctx.state.user.id;
    const password = ctx.request.body.password;
    console.log("id:", id, "password:", password);
    // 2.操作数据库
    if (await updateById({ id, password })) {
      ctx.body = {
        code: 0,
        message: "修改密码成功",
        result: "",
      };
    } else {
      ctx.body = {
        code: "10007",
        message: "修改密码失败",
        result: "",
      };
    }
    // 3.返回结果
  }
}

module.exports = new UserController();
