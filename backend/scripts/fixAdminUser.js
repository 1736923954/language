/**
 * 修复管理员账户脚本
 * 确保 admin 用户存在，密码为 admin123，角色为 admin
 * 用法: node scripts/fixAdminUser.js
 */
const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/database');
const { User } = require('../src/models');

async function fixAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const [user, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@example.com',
        password_hash: adminPassword,
        nickname: 'Administrator',
        role: 'admin',
        is_active: true,
      },
    });

    if (created) {
      console.log('✓ 已创建管理员账户: admin / admin123');
    } else {
      await user.update({
        password_hash: adminPassword,
        role: 'admin',
        is_active: true,
      });
      console.log('✓ 已更新管理员账户: admin / admin123');
    }

    process.exit(0);
  } catch (err) {
    console.error('✗ 修复失败:', err.message);
    process.exit(1);
  }
}

fixAdminUser();
