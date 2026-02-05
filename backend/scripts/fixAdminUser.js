/**
 * 修复管理员账户脚本
 * 确保 admin 用户存在，密码为 admin123，角色为 admin
 * 用法: node scripts/fixAdminUser.js
 */
const prisma = require('../src/models');
const { hashPassword } = require('../src/utils/password');

async function fixAdminUser() {
  try {
    await prisma.$connect();
    console.log('✓ 数据库连接成功');

    const adminPassword = await hashPassword('admin123');

    const existingUser = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password_hash: adminPassword,
          nickname: 'Administrator',
          role: 'admin',
          is_active: true,
        },
      });
      console.log('✓ 已创建管理员账户: admin / admin123');
    } else {
      await prisma.user.update({
        where: { username: 'admin' },
        data: {
          password_hash: adminPassword,
          role: 'admin',
          is_active: true,
        },
      });
      console.log('✓ 已更新管理员账户: admin / admin123');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('✗ 修复失败:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixAdminUser();
