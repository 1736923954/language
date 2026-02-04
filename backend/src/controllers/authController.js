const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { hashPassword, verifyPassword } = require('../utils/password');
const { success, error } = require('../utils/response');

// 用户注册
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return error(res, 'Username already exists', 400);
    }

    // 加密密码
    const password_hash = await hashPassword(password);

    // 创建用户
    const user = await User.create({
      username,
      email,
      password_hash,
      nickname: username,
    });

    // 生成 Token
    const token = generateToken(user.id, user.role);

    return success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return error(res, 'Invalid username or password', 401);
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return error(res, 'Invalid username or password', 401);
    }

    // 检查用户是否激活
    if (!user.is_active) {
      return error(res, 'User account is inactive', 403);
    }

    // 管理后台登录：仅允许 admin 角色
    if (req.headers['x-client'] === 'admin' && user.role !== 'admin') {
      return error(res, '无权限：仅管理员可登录管理后台', 403);
    }

    // 更新最后登录时间
    await user.update({ last_login: new Date() });

    // 生成 Token
    const token = generateToken(user.id, user.role);

    return success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// 刷新 Token
exports.refreshToken = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user || !user.is_active) {
      return error(res, 'User not found or inactive', 401);
    }

    const token = generateToken(user.id, user.role);
    return success(res, { token }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

// 用户登出
exports.logout = async (req, res, next) => {
  try {
    // 前端删除 Token 即可
    return success(res, null, 'Logout successful');
  } catch (err) {
    next(err);
  }
};
