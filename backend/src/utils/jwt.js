const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

// 生成 Token
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// 验证 Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 解码 Token（不验证签名）
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
