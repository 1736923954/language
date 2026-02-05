# Prisma 迁移指南

本项目已从 Sequelize 迁移到 Prisma。

## 安装依赖

```bash
npm install
# 或
pnpm install
```

## 配置数据库

1. 复制 `.env.example` 为 `.env`
2. 配置 `DATABASE_URL`：
   ```env
   DATABASE_URL="mysql://用户名:密码@主机:端口/数据库名?charset=utf8mb4&connection_limit=10"
   ```

## 初始化数据库

### 方式一：使用 Prisma Migrate（推荐）

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建迁移（开发环境）
npm run prisma:migrate

# 应用迁移（生产环境）
npm run prisma:migrate:deploy
```

### 方式二：使用现有 SQL 脚本

如果数据库已存在，可以直接使用 `migrations/init.sql` 创建表结构，然后运行：

```bash
npm run prisma:generate
```

### 方式三：使用 Prisma Push（快速原型）

```bash
npm run prisma:push
```

## 常用命令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建新的迁移
npm run prisma:migrate

# 应用迁移（生产环境）
npm run prisma:migrate:deploy

# 打开 Prisma Studio（数据库可视化工具）
npm run prisma:studio

# 推送 schema 到数据库（不创建迁移）
npm run prisma:push
```

## 数据填充

```bash
# 填充初始数据
npm run seed

# 修复管理员账户
npm run fix-admin
```

## 主要变化

### 1. 数据库配置

- **之前**: `src/config/database.js` 使用 Sequelize
- **现在**: `src/config/database.js` 使用 Prisma Client

### 2. 模型定义

- **之前**: `src/models/*.js` 使用 Sequelize 定义模型
- **现在**: `prisma/schema.prisma` 定义所有模型

### 3. 控制器

所有控制器已更新为使用 Prisma Client：

```javascript
// 之前 (Sequelize)
const { User } = require('../models');
const user = await User.findByPk(id);

// 现在 (Prisma)
const prisma = require('../config/database');
const user = await prisma.user.findUnique({ where: { id } });
```

### 4. 查询语法

- **之前**: Sequelize 的 `findAll`, `findByPk`, `create`, `update`, `destroy`
- **现在**: Prisma 的 `findMany`, `findUnique`, `create`, `update`, `delete`

### 5. 关系查询

- **之前**: `include: [{ model: Category }]`
- **现在**: `include: { category: true }`

### 6. 错误处理

- **之前**: Sequelize 错误（`SequelizeValidationError`, `SequelizeUniqueConstraintError`）
- **现在**: Prisma 错误代码（`P2002`, `P2025`, `P2003`）

## 优势

1. **类型安全**: Prisma 提供完整的 TypeScript 类型支持
2. **更好的开发体验**: 自动补全和类型检查
3. **迁移管理**: 更好的数据库迁移管理
4. **性能**: Prisma 查询优化更好
5. **现代化**: 更现代的 ORM 工具

## 注意事项

1. 确保数据库连接字符串格式正确
2. 首次运行前需要运行 `npm run prisma:generate`
3. 生产环境使用 `prisma migrate deploy` 而不是 `prisma migrate dev`
4. `src/models/` 目录下的旧文件可以删除，但已保留以防需要参考
