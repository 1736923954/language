const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'english_learning',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: '+08:00',
  }
);

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

module.exports = sequelize;
