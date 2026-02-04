const app = require('./src/app');
const sequelize = require('./src/config/database');
const { PORT, HOST, NODE_ENV } = require('./src/config/env');

// 启动服务器
const startServer = async () => {
  try {
    // 同步数据库
    await sequelize.sync({ alter: NODE_ENV === 'development' });
    console.log('✓ Database synchronized');

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
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});
