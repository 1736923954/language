const express = require('express');
const cors = require('cors');
const { CORS_ORIGIN, NODE_ENV } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS 配置
const corsOptions = {
  origin: CORS_ORIGIN.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 日志中间件
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vocabularies', require('./routes/vocabularies'));
app.use('/api/sentences', require('./routes/sentences'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/users', require('./routes/users'));

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
