# 英语学习系统 - 完整项目

这是一个完整的英语学习平台，包含后端 API、Admin 管理后台和 Uni-app 前端应用。

## 📁 项目结构

```
language/
├── backend/          # Node.js + Express 后端 API
├── admin/            # Vue3 + Element Plus 管理后台
├── app/              # Vue3 + Uni-app 前端应用
└── README.md         # 项目说明
```

## 🚀 快速开始

### 后端服务
```bash
cd backend
npm install
npm run seed   # 初始化数据库
npm run dev    # 启动开发服务器 (端口 3000)
```

### Admin 管理后台
```bash
cd admin
npm install
npm run dev    # 启动开发服务器 (端口 5173)
# 访问：http://localhost:5173
# 默认账户：admin / admin123
```

### Uni-app 前端
```bash
cd app
npm install
npm run dev    # 启动开发服务器 (端口 5174)
# 访问：http://localhost:5174
```

## 📱 小程序支持

### 微信小程序
```bash
cd app
npm run build:mp-weixin
# 使用微信开发者工具打开 dist/build/mp-weixin
```

### 支付宝小程序
```bash
cd app
npm run build:mp-alipay
# 使用支付宝开发者工具打开 dist/build/mp-alipay
```

## 🎯 功能特性

### 后端
- ✅ JWT 认证与授权
- ✅ 词汇管理 (CRUD)
- ✅ 句子管理 (CRUD)
- ✅ 分类管理
- ✅ 学习进度追踪
- ✅ 用户统计

### Admin 后台
- ✅ 仪表板统计
- ✅ 词汇管理界面
- ✅ 句子管理界面
- ✅ 分类管理
- ✅ 用户管理
- ✅ 学习统计

### 前端应用
- ✅ 用户认证
- ✅ 词汇浏览与搜索
- ✅ 词汇详情与例句
- ✅ 发音练习
- ✅ 学习进度追踪
- ✅ 统计数据展示

## 📊 初始数据

系统包含以下初始数据：
- 8 个分类
- 30+ 个 B1 水平词汇
- 90+ 个实用例句
- 1 个管理员账户 (admin/admin123)

## 🔑 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Node.js, Express, Sequelize, MySQL |
| Admin | Vue3, Element Plus, Pinia, Vite |
| 前端 | Vue3, Uni-app, Pinia, SCSS |
| 认证 | JWT, bcryptjs |

## 📚 详细文档

- 详见各项目目录下的 README 文件
- 部署指南：见根目录 DEPLOYMENT_GUIDE.md
- 系统架构：见根目录 ENGLISH_LEARNING_SYSTEM_README.md

## 🔗 相关链接

- [Uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue3 官方文档](https://vuejs.org/)
- [Express 官方文档](https://expressjs.com/)
- [Element Plus 官方文档](https://element-plus.org/)

## 📄 许可证

MIT License

---

**项目创建时间**：2026 年 2 月 4 日
