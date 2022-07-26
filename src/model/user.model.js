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
// User.sync({ force: true });
module.exports = User;
