const { User } = require('../models');
const { Op } = require('sequelize');
const { success, error, paginated } = require('../utils/response');

// 获取用户列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, username, email, role } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (username) where.username = { [Op.like]: `%${username}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (role) where.role = role;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

// 获取单个用户
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

// 获取用户个人信息
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

// 更新用户信息
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    // 不允许更新密码和角色（通过此端点）
    const { password_hash, role, ...updateData } = req.body;

    await user.update(updateData);
    return success(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

// 更新个人信息
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    const { password_hash, role, ...updateData } = req.body;
    await user.update(updateData);

    return success(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// 删除用户
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    // 软删除：标记为非激活
    await user.update({ is_active: false });
    return success(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};
