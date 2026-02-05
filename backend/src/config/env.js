require('dotenv').config();

module.exports = {
  // 服务器配置
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',

  // 数据库配置
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'english_learning',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  // Prisma DATABASE_URL（如果没有设置，自动构建）
  DATABASE_URL: process.env.DATABASE_URL || `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'english_learning'}?charset=utf8mb4&connection_limit=10`,

  // JWT 配置
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // 文件上传配置
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760, // 10MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',

  // 日志配置
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // CORS 配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:5173,http://localhost:5174',

  // 第三方服务
  GOOGLE_TTS_API_KEY: process.env.GOOGLE_TTS_API_KEY || '',

  // 邮件服务
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
};
