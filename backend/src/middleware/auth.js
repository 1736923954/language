const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

// 验证 Token 中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return error(res, 'Access token is missing', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return error(res, 'Invalid or expired token', 401);
  }

  req.user = decoded;
  next();
};

// 验证管理员权限
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return error(res, 'Admin access required', 403);
  }
};

// 可选的认证（不强制）
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
};
