const prisma = require('../models');
const { success, error, paginated } = require('../utils/response');

// 获取用户列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, username, email, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (username) {
      where.username = { contains: username };
    }
    if (email) {
      where.email = { contains: email };
    }
    if (role) {
      where.role = role;
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          avatar_url: true,
          nickname: true,
          level: true,
          role: true,
          last_login: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return paginated(res, data, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};

// 获取单个用户
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar_url: true,
        nickname: true,
        level: true,
        role: true,
        last_login: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar_url: true,
        nickname: true,
        level: true,
        role: true,
        last_login: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
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
    // 不允许更新密码和角色（通过此端点）
    const { password_hash, role, ...updateData } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar_url: true,
        nickname: true,
        level: true,
        role: true,
        last_login: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return success(res, user, 'User updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'User not found', 404);
    }
    next(err);
  }
};

// 更新个人信息
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { password_hash, role, ...updateData } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatar_url: true,
        nickname: true,
        level: true,
        role: true,
        last_login: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return success(res, user, 'Profile updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'User not found', 404);
    }
    next(err);
  }
};

// 删除用户
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 软删除：标记为非激活
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { is_active: false },
    });

    return success(res, null, 'User deleted');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'User not found', 404);
    }
    next(err);
  }
};
