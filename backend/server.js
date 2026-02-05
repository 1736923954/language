const app = require('./src/app');
const prisma = require('./src/models');
const { PORT, HOST, NODE_ENV } = require('./src/config/env');

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('✓ Database connected');

    // 启动服务器
    app.listen(PORT, HOST, () => {
      console.log(`✓ Server running on http://${HOST}:${PORT}`);
      console.log(`✓ Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});
