const User = require("../model/user.model");
class UserService {
  /**
   * @description: 注册用户
   * @param {*} user_name
   * @param {*} password
   * @return {*}
   */
  async createUser (user_name, password) {
    // 插入数据
    // await表达式:promise对象的值
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password,
    });
    return res.dataValues;
  }
  /**
   * @description: 查询用户信息
   * @param {*} id
   * @param {*} user_name
   * @param {*} password
   * @param {*} is_admin
   * @return {*}
   */
  async getUserInfo ({ id, user_name, password, is_admin }) {
    const whereOpt = {};
    id && Object.assign(whereOpt, { id });
    user_name && Object.assign(whereOpt, { user_name });
    password && Object.assign(whereOpt, { password });
    is_admin && Object.assign(whereOpt, { is_admin });

    const res = await User.findOne({
      attributes: ["id", "user_name", "password", "is_admin"],
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  async updateById ({ id, user_name, password, is_admin }) {
    const whereOpt = { id };
    const newUser = {};
    user_name && Object.assign(newUser, { user_name });
    password && Object.assign(newUser, { password });
    is_admin && Object.assign(newUser, { is_admin });

    const res = await User.update(newUser, { where: whereOpt });
    console.log("res", res[0]);
    return res[0] > 0 ? true : false;
  }
}

module.exports = new UserService();
