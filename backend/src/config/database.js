const { PrismaClient } = require('@prisma/client');
const { DATABASE_URL } = require('./env');

// 创建 Prisma Client 实例
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// 测试数据库连接
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✓ Database connection successful');
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    throw err;
  }
}

// 优雅关闭
async function disconnectDatabase() {
  await prisma.$disconnect();
}

// 初始化时连接数据库
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
}

module.exports = prisma;
