const { error } = require('../utils/response');

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message).join(', ');
    return error(res, messages, 400);
  }

  // Sequelize 唯一性约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return error(res, `${field} already exists`, 400);
  }

  // Sequelize 外键约束错误
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 'Foreign key constraint error', 400);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expired', 401);
  }

  // 默认错误
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return error(res, message, statusCode);
};

// 404 处理
const notFoundHandler = (req, res) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
