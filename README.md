# 1.项目使用说明
- 由于本项目会连接本地的mysql数据库,所以需要在`.env`文件中填写数据库的信息
  - `MYSQL_PWD`:你本地数据库的数据库密码
  - `MYSQL_DB`: 你连接的本地数据库名字
- 如果你不知道如何去新建一个数据库
  - 打开`cmd`输入命令`mysql -u root -p`
    - 输入密码后登录数据库
  - `show databases`就可以看到本地的mysql数据库的列表了
  - 如果没有，`create database test`就可以创建一个叫`test`的数据库
- 下载依赖并运行即可！
```bash
# 使用yarn
yarn
yarn dev
# 或者 npm
npm install
npm run dev
```

# 2.项目介绍

- 这是一个开箱即用的`node-koa2`的后端模板(脚手架)

## 项目目录介绍
|文件夹|作用|
|--|--|
|`src/app`       |声明app的文件夹|
|`src/config`    |使用dotnev解析.nev文件解析数据然后export|
|`src/constant`  |放错误类型的文件夹|
|`src/controller`|路由的控制函数|
|`src/db`        |数据库的连接文件|
|`src/middleware`|所有的中间件|
|`src/model`     |数据库建表文件夹|
|`src/public`    |放静态资源的文件夹|
|`src/routers`   |注册路由的文件夹|
|`src/service`   |封装对数据库的直接操作的函数|
|`src/views/index.html`|运行后home页面的html文件|
|`src/main.js`   |建立http接口的出口|
|`.nev`          |用来存放设置的常量,如数据库的信息|
|`.gitignore`    |提交仓库忽略的文件,如node_modules|
## 使用的模块介绍
|模块|作用|
|--|--|
|`koa`|本项目是基于koa的模板|
|`dotenv`|自动解析.env文件中的常量|
|`nodemon`|项目自动重启,可以热更新|
|`koa-router`|可以进行路由搭建|
|`koa-body`|可以解析http中的body，包括json，表单，文件等|
|`sequelize`|可以实现与mysql的连接|
|`bcryptjs`|模板本身实现了注册接口，其中使用bcryptjs对密码进行加密|
|`jsonwebtoken`|模板本身实现了简单的接口来完成token的生成和解析并调用数据库|
|`art-template`||
|`koa-art-template`|实现了运行后的home页面|
|`path`||
|`koa-static`|home页面能够使用静态资源|

# 3.搭建过程记录

- 理论上根据记录可以从 0 复现项目

## 一.项目初始化

### 1.npm 初始化

- `npm init -y`
  生成`package.json`文件(记录项目依赖)

### 2.git 初始化

- `git init`
  生成`.git`隐藏文件夹，git 的本地仓库
- 如果是克隆的空仓库,就自带了`.git`

### 3.创建 readme 文件

## 二.安装 Koa 框架

### 1.安装 Koa 框架

- `npm install koa`

### 2.编写最基础的 app

- 创建`src/main.js`

```js
// 导入包
const Koa = require("koa");
// 创建app实例
const app = new Koa();
// 创建中间件
app.use((ctx, next) => {
  ctx.body = "hello api";
});
// 监听端口
app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
```

### 3.测试

- 终端运行命令`node src/main.js`

### 注意：这里提交信息变很多，因为有 node_modules

- 我们新建一个`.gitignore`来忽略`node_modules`的提交
  - 文件里面写`node_modules/*`

## 三.项目的基本优化

### 1.自动重启服务

- 安装`nodemon`工具
  `npm i nodemon -D`
- 编写`package.json`脚本

```js
  "scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

- 执行`npm run dev`启动服务

### 2.读取配置文件

- 安装`dotenv`，读取根目录中的`.env`文件,将配置写`process.env`中

```js
npm i dotenv
```

- 创建`.env`文件

```js
APP_PROT = 8000;
```

- 创建`src/config/config,default.js`

```js
// 导入包
const dotenv = require("dotenv");
// 获取信息
dotenv.config();

// console.log(process.env.APP_PORT);

// 导出对象
module.exports = process.env;
```

- 改写`main.js`导入配置和使用模版字符串

```js
// 导入设置的端口号
const { APP_PORT } = require("./config/config.default");
// 监听端口
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`);
});
```

## 四.添加路由

路由:根据不同的 URL，调用对应处理函数

### 1.安装 koa-router

```js
npm i koa-router
```

- 1.导入包
- 2.实例化对象
- 3.编写路由
- 4.注册中间件

### 2.编写路由

- 创建`src/routers`目录,编写`user.route.js`

```js
const Router = require("koa-router");

const router = new Router({ prefix: "/users" });

// GET /users/
router.get("/", (ctx, next) => {
  ctx.body = "hello users";
});

module.exports = router;
```

### 3.改写 main.js

```js
// 引入路由
const userRouter = require("./routers/user.route");
// 创建中间件
app.use(userRouter.routes()); // 挂载上面的所有路由
// 导入设置的端口号
const { APP_PORT } = require("./config/config.default");
// 监听端口
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`);
});
```

## 目录结构的优化

### 1.将 http 服务和 app 业务拆分

- 创建`src/app/index.js`

```js
// 导入包
const Koa = require("koa");
// 创建app实例
const app = new Koa();
// 导入封装好的路由
const userRouter = require("../routers/user.route");
// 创建中间件
app.use(userRouter.routes());

module.exports = app;
```

- 改写`main.js`

```js
// 导入设置的端口号
const { APP_PORT } = require("./config/config.default");
// 导入封装的app
const app = require("./app/index");
// 监听端口
app.listen(APP_PORT, () => {
  //使用模板字符串输出端口
  console.log(`server is running on http://localhost:${APP_PORT}`);
});
```

### 2.将路由和控制器拆分

- 路由:解析 URL,分发给控制器对应的方法

```js
// 导入controller
const { register, login } = require("../controller/user.controller");
// 注册接口
router.post("/register", register);
// 登陆接口
router.post("/login", login);
```

- 控制器:处理不同的业务,改写`user.route.js`,创建`controller/user.controller.js`

```js
class UserController {
  async register(ctx, next) {
    ctx.body = "用户注册成功";
  }
  async login(ctx, next) {
    ctx.body = "登录成功";
  }
}
module.exports = new UserController();
```

- 注意:POST 接口用浏览器无法直接获取结果哦！

## 六.解析 body

- koa-body 是一个可以帮助解析 http 中 body 的部分的中间件，包括 json，表单，文本，文件等

### 1.安装 koa-body

```js
npm i koa-body
```

### 2.注册中间件

- 改写`app/index.js` require+use
  - 大多数中间件都可以直接 require+use 就可以使用了

### 3.拆分 service 层

- service 层主要是做数据库的处理 创建`src/service/user.service.js`

```js
class UserService {
  async createUser(user_name, password) {
    // todo:写入数据库
    return "写入数据库成功";
  }
}

module.exports = new UserService();
```

### 4.解析请求数据

- 改写`user.controller.js`

```js
const { createUser } = require("../service/user.service");
class UserController {
  async register(ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body;
    // 2.操作数据库
    const res = await createUser(user_name, password);
    console.log(res);
    // 3.返回结果
    ctx.body = ctx.request.body;
  }

  async login(ctx, next) {
    ctx.body = "登录成功";
  }
}

module.exports = new UserController();
```

## 七.数据库操作

sequelize ORM 数据库工具 ORM:对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

### 1.安装 sequelize

```js
npm i mysql2 sequelize --save
```

### 2.编写配置文件

- 在`.env`中编写

### 3.连接数据库

```js
const { Sequelize } = require("sequelize");
const {
  MYSQL_HOST,
  MYSQL_PROT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require("../config/config.default");

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: "mysql",
});

seq
  .authenticate()
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((err) => {
    console.log("数据库连接失败", err);
  });
```

## 八.创建模型

- 创建`src/model/user.model.js`

```js
const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

// 创建模型(表会自己加s)
const User = seq.define("user", {
  // id会被sequelize自动创建，管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "用户名,唯一",
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: "密码",
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: "是否位管理员,0:不是管理员(默认) 1:管理员",
  },
});
// 轻质同步数据库(创建数据表)
User.sync({ force: true });
module.exports = User;
```

- 通过`sync`同步模型创建 `model` 中设计的数据表

## 九.添加用户

- 所有数据库的操作都在`service`层完成。`service`调用`model`完成数据库操作

```js
const User = require("../model/user.model");
class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // await表达式:promise对象的值
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password,
    });
    console.log(res);
    return res.dataValues;
  }
}

module.exports = new UserService();
```

- 同时改写`user.controller.js`

```js
const { createUser } = require("../service/user.service");
class UserController {
  async register(ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body;
    // console.log(user_name, password);
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
  }

  async login(ctx, next) {
    ctx.body = "登录成功";
  }
}

module.exports = new UserController();
```

## 十.对创建用户的控制器进行错误处理

```js
// 合法性
if (!user_name || !password) {
  console.error("用户名或密码为空", ctx.request.body);
  ctx.status = 400;
  ctx.body = {
    code: "10001",
    message: "用户名或者密码为空",
    result: "",
  };
  return;
}
// 合理性 先在数据库中进行查询
if (getUserInfo({ user_name })) {
  ctx.status = 409;
  ctx.body = {
    code: "10002",
    message: "用户已经存在",
    result: "",
  };
  return;
}
```

## 十一.将错误处理拆分为中间件

### 1.统一错误处理

- 创建`src/constant/err.type.js`错误类型

```js
module.exports = {
  userFormateError: {
    code: "10001",
    message: "用户名或密码为空",
    result: "",
  },
  userAlreadtExited: {
    code: "10002",
    message: "用户已经存在",
    result: "",
  },
  userRegisterError: {
    code: "10003",
    message: "用户注册错误",
    result: "",
  },
};
```

- 创建`src/app/errHandler.js`---错误统一处理函数

```js
module.exports = (err, ctx) => {
  let status = 500;
  switch (err.code) {
    case "10001":
      status = 400;
      break;
    case "10002":
      status = 409;
      break;
    default:
      status = 500;
  }
  ctx.status = status;
  ctx.body = err;
};
```

- 在 app 中通过`app.on`监听,编写统一的错误定义文件

```js
const errHandler = require("./errHandler");
app.on("error", errHandler);
```

- 在出错的地方使用`ctx.app.emit`提交错误

```js
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
```

### 3.拆分中间件

- 创建`src/middleware/user.middleware.js`

```js
const { getUserInfo } = require("../service/user.service");
const {
  userFormateError,
  userAlreadtExited,
  userRegisterError,
} = require("../constant/err.type");
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  // 合法性
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormateError, ctx);
    return;
  }
  await next();
};

const verifyUser = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  console.log(user_name);
  try {
    // 合理性 先在数据库中进行查询
    if (await getUserInfo({ user_name })) {
      console.error("用户名已经存在", { user_name });
      ctx.app.emit("error", userAlreadtExited, ctx);
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误", err);
    ctx.app.emit("error", userRegisterError, ctx);
    return;
  }

  await next();
};
module.exports = {
  userValidator,
  verifyUser,
};
```

### 4.在路由注册中间件

```js
router.post("/register", userValidator, verifyUser, register);
```

## 十二.加密

在将密码保存到数据库之前，要对密码进行加密处理

### 1.安装 bcryptjs

```bash
npm i bcryptjs
```

### 2.编写加密中间件

- `src/middleware/user.middleware.js`

```js
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  // hash保存的是密文
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
};
```

### 3.在 router 中使用

- 直接添加这个中间件就可以了
  - 框架搭好了，后面加功能就比较方便

```js
router.post("/register", userValidator, verifyUser, cryptPassword, register);
```

## 十三.登陆验证

- 验证格式
- 验证用户是否存在
- 验证密码是否匹配

---

- 1.在`src/middleware/user.middleware.js`中添加中间件，其中判断是否为空的中间件和注册的中间件是可以复用的
  - 这就是为什么，我们要写成一个中间件
- 2.定义错误类型

```js
  userDosNotExist: {
    code: "10004",
    message: "用户不存在",
    result: "",
  },
  userLoginError: {
    code: "10005",
    message: "用户登录失败",
    result: "",
  },
  invalidPassword: {
    code: "10006",
    message: "密码不匹配",
    result: "",
  },
```

- 3.改写路由

```js
// 登录接口
router.post("/login", userValidator, verifyLogin, login);
```

## 十四.用户的认证与授权

登陆成功后，给用户颁发一个令牌 token,用户在以后的每一次请求中携带这个令牌 jwt:jsonwebtoken

- header:头部
- payload:载荷
- signature:签名

### 1.颁发 token

#### a.安装 jsonwebtoken

```bash
npm i jsonwebtoken
```

#### b.在`.env`中定义私钥

#### c.在控制器中改写 login 方法

```js
const { JWT_SECRET } = require('../config/config.default')
  async login (ctx, next) {
    const { user_name } = ctx.request.body
    // 1.获取用户信息(在token的payload中，记录id,user_name,is_admin)
    try {
      // 从返回结果对象中剔除password属性，将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name })
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登录失败', err);

    }
  }
```

### 2.用户认证

#### a.添加新的错误类型

```js
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10102',
    message: 'token无效',
    result: ''
  }
```

#### b.创建 auth 中间件

- 创建`src/middleware/auth.middleware.js`

```js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const { tokenExpiredError, invalidToken } = require("../constant/err.type");
const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");
  // console.log(token);
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
```

#### c.改写路由

- 复用中间件

```js
// 修改密码接口
router.patch("/", auth, cryptPassword, changePassword);
```

## 十五.token 可以放在 cookie 中吗？

- token 是可以放在 cookie 中的
  - 和前面一样的套路,我们可以写出`/login_byCookie`和`/changePassword_byCookie`两个路由
  - 由于中间件的复用，我们的区别就在于
    - 1.login 的控制函数不返回 token 而是直接 SetCookie
    - 2.password 的鉴权中间件不从 header 中解析,而是从 cookie 中解析
- 这里就只放核心代码了

```js
const token = jwt.sign(res, JWT_SECRET, { expiresIn: "10s" });
ctx.cookies.set("token", token, {
  domain: "localhost", // 写cookie所在的域名
  maxAge: 10 * 60 * 1000, // cookie有效时长
  // expires: new Date("2023-08-15"), // cookie失效时间
  httpOnly: true, // 是否只用于http请求中获取
  overwrite: false, // 是否允许重写
});
const cookie_token = ctx.cookies.get("token");
```

## 十六.在正式写自更新路由前,我们起一个 home 页面吧！

### 1.安装`art-template`,`koa-art-template`,`path`,`koa-static`

```js
npm i art-template koa-art-template -s  // 渲染html
npm i path                              // 方便寻找路径
npm i koa-static                        // 方便引入css和图片
```

### 2.创建 homeRouter

- 创建`src/routers/home.route.js`

```js
const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  await ctx.render("index", {}); // 后面配置render后，index会直接去找views里面的index.html
});
// 这里是根路径，所以就是启动时候的呈现的页面
module.exports = router;
```

### 3.完成页面编写

- 后面用 static 指定了静态资源在 public 文件下
  - 所以创建`src/public`
  - css 和图片都放在这个文件夹才可以访问
  - 特别地，可以创建`src/public/css/style.css`和`src/public/assets/logo.png`
- html 在`src/views`里面完成

- 有关页面的编写这里就不贴代码了，因为每个人都有不一样的审美

### 4.改写`app/index`

```js
const render = require("koa-art-template");
const path = require("path");
const serve = require("koa-static");
// 配置koa-art-template模板引擎
render(app, {
  root: path.join(path.resolve(__dirname, ".."), "views"), //视图的位置
  extname: ".html", // 模板文件的后缀
});
const homeRouter = require("../routers/home.route");
app.use(serve(path.resolve(__dirname, "..") + "/public")); // 指定静态资源在public文件夹里面
app.use(homeRouter.routes());
```
