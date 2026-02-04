const bcrypt = require('bcryptjs');

// 密码加密
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 密码验证
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  verifyPassword,
};
