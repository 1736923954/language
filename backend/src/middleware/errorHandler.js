const { error } = require('../utils/response');

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma 错误处理
  // P2002: 唯一性约束错误
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return error(res, `${field} already exists`, 400);
  }

  // P2025: 记录未找到
  if (err.code === 'P2025') {
    return error(res, 'Record not found', 404);
  }

  // P2003: 外键约束错误
  if (err.code === 'P2003') {
    return error(res, 'Foreign key constraint error', 400);
  }

  // P2014: 必需关系错误
  if (err.code === 'P2014') {
    return error(res, 'Required relation error', 400);
  }

  // Prisma 验证错误
  if (err.name === 'PrismaClientValidationError') {
    return error(res, 'Validation error: ' + err.message, 400);
  }

  // Prisma 已知请求错误
  if (err.name === 'PrismaClientKnownRequestError') {
    return error(res, err.message || 'Database error', 400);
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
