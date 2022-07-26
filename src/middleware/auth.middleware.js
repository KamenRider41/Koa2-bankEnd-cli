const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const { tokenExpiredError, invalidToken } = require("../constant/err.type");

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header;
  console.log("authorization", authorization);
  const token = authorization.replace("Bearer ", "");
  console.log("token", token);
  try {
    // user中包含了payload的信息(id,user_name,is_admin)
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user;
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        return ctx.app.emit("error", tokenExpiredError, ctx);
      case "JsonWebTokenError":
        console.error("无效token", err);
        return ctx.app.emit("error", invalidToken, ctx);
    }
  }
  await next();
};

const cookie_auth = async (ctx, next) => {
  const cookie_token = ctx.cookies.get("token");
  console.log("******************");
  console.log("cookie_token", cookie_token);
  try {
    // user中包含了payload的信息(id,user_name,is_admin)
    const user = jwt.verify(cookie_token, JWT_SECRET);
    ctx.state.user = user;
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        return ctx.app.emit("error", tokenExpiredError, ctx);
      case "JsonWebTokenError":
        console.error("无效token", err);
        return ctx.app.emit("error", invalidToken, ctx);
    }
  }
  await next();
};

module.exports = {
  auth,
  cookie_auth,
};
