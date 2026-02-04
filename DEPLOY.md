# 宝塔 Windows 面板部署指南

## 📋 部署前准备

### 1. 服务器要求
- Windows Server（推荐 Windows Server 2019/2022）
- 至少 2GB RAM
- 至少 20GB 硬盘空间
- 已安装宝塔 Windows 面板

### 2. 需要安装的软件
- Node.js（推荐 v18.x 或 v20.x）
- MySQL（推荐 8.0+）
- PM2（Node.js 进程管理器）
- Nginx（用于反向代理和静态文件服务）

---

## 🔧 第一步：环境准备

### 1.1 安装 Node.js

1. **通过宝塔面板安装**：
   - 打开宝塔面板 → 软件商店
   - 搜索 "Node.js" 并安装（推荐 v18.x）

2. **或手动安装**：
   - 访问 https://nodejs.org/ 下载 Windows 安装包
   - 安装后验证：
   ```cmd
   node -v
   npm -v
   ```

### 1.2 安装 MySQL

1. **通过宝塔面板安装**：
   - 软件商店 → 搜索 "MySQL" → 安装 MySQL 8.0

2. **创建数据库**：
   - 打开 MySQL 管理 → 添加数据库
   - 数据库名：`english_learning`
   - 用户名：`english_user`（或使用 root）
   - 密码：设置强密码
   - 记录这些信息，后续配置需要

### 1.3 选择进程管理方式

**方式一：PM2（推荐，简单易用）**
```cmd
npm install -g pm2
pm2 -v
```

**方式二：Windows Service（系统级服务）**
```cmd
npm install -g node-windows
```

**方式三：forever（轻量级）**
```cmd
npm install -g forever
```

**方式四：IIS + iisnode（如果使用 IIS）**
- 下载安装：https://github.com/Azure/iisnode/releases

### 1.4 安装 Nginx（可选，用于反向代理）

- 软件商店 → 搜索 "Nginx" → 安装

---

## 📦 第二步：上传项目文件

### 2.1 准备项目文件

在本地执行以下操作：

1. **打包项目**（排除 node_modules）：
   ```bash
   # 在项目根目录
   # 压缩 backend 和 admin 文件夹（排除 node_modules）
   ```

2. **上传到服务器**：
   - 通过宝塔文件管理器上传
   - 或使用 FTP/SFTP 工具
   - 推荐路径：`D:\wwwroot\english-learning\`

### 2.2 目录结构

上传后的目录结构应该是：
```
D:\wwwroot\english-learning\
├── backend\
│   ├── src\
│   ├── migrations\
│   ├── seeds\
│   ├── package.json
│   ├── server.js
│   └── .env
├── admin\
│   ├── dist\          # 构建后的前端文件
│   ├── src\
│   └── package.json
└── app\               # 移动端（可选）
```

---

## 🗄️ 第三步：配置数据库

### 3.1 创建数据库

1. 打开宝塔面板 → 数据库 → 添加数据库
   - 数据库名：`english_learning`
   - 用户名：`english_user`
   - 密码：`你的密码`
   - 访问权限：本地服务器

### 3.2 导入数据库结构

1. 打开数据库管理工具（phpMyAdmin 或 Navicat）
2. 选择 `english_learning` 数据库
3. 导入 SQL 文件：
   - 执行 `backend/migrations/init.sql`

或通过命令行：
```cmd
cd D:\wwwroot\english-learning\backend
mysql -u english_user -p english_learning < migrations\init.sql
```

---

## ⚙️ 第四步：配置后端服务

### 4.0 快速部署（推荐）

根据选择的进程管理方式，使用对应的部署脚本：

**使用 PM2：**
```cmd
cd D:\wwwroot\english-learning\backend
deploy-windows.bat
```

**使用 Windows Service：**
```cmd
cd D:\wwwroot\english-learning\backend
deploy-service.bat
```

脚本会自动完成：依赖安装、日志目录创建、服务启动等步骤。

### 4.1 配置环境变量

1. 在 `backend` 目录创建 `.env` 文件：
   ```env
   # 服务器配置
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0

   # 数据库配置（使用你创建的数据库信息）
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=english_learning
   DB_USER=english_user
   DB_PASSWORD=你的数据库密码

   # JWT 配置（生成一个随机密钥）
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d

   # CORS 配置（改为你的域名）
   CORS_ORIGIN=http://your-domain.com,https://your-domain.com

   # 文件上传配置
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./uploads

   # 日志配置
   LOG_LEVEL=info
   ```

2. **生成 JWT_SECRET**（在 Node.js 中）：
   ```cmd
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   将输出复制到 `JWT_SECRET`

### 4.2 安装后端依赖

在宝塔终端中：
```cmd
cd D:\wwwroot\english-learning\backend
npm install --production
```

### 4.3 初始化数据

```cmd
cd D:\wwwroot\english-learning\backend
npm run seed
```

这会创建初始数据和管理员账户。

---

## 🚀 第五步：启动后端服务

### 方式一：使用 PM2（推荐，简单易用）

#### 5.1.1 创建 PM2 配置文件

在 `backend` 目录创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'english-learning-api',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

#### 5.1.2 启动服务

```cmd
cd D:\wwwroot\english-learning\backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5.1.3 验证服务

```cmd
pm2 list
pm2 logs english-learning-api
```

---

### 方式二：使用 Windows Service（推荐，系统级服务）

使用 `node-windows` 将 Node.js 应用注册为 Windows 服务，开机自动启动。

#### 5.2.1 安装 node-windows

```cmd
cd D:\wwwroot\english-learning\backend
npm install -g node-windows
```

#### 5.2.2 创建服务安装脚本

创建 `install-service.js`：
```javascript
const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'English Learning API',
  description: 'English Learning Backend API Service',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--max_old_space_size=512'
  ],
  env: [
    {
      name: 'NODE_ENV',
      value: 'production'
    }
  ]
});

svc.on('install', () => {
  console.log('服务安装成功！');
  svc.start();
});

svc.on('start', () => {
  console.log('服务启动成功！');
});

svc.install();
```

#### 5.2.3 安装服务

```cmd
cd D:\wwwroot\english-learning\backend
node install-service.js
```

#### 5.2.4 管理服务

```cmd
# 启动服务
net start "English Learning API"

# 停止服务
net stop "English Learning API"

# 卸载服务（创建 uninstall-service.js，见下方）
node uninstall-service.js
```

#### 5.2.5 创建卸载脚本

创建 `uninstall-service.js`：
```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'English Learning API'
});

svc.on('uninstall', () => {
  console.log('服务卸载成功！');
});

svc.uninstall();
```

---

### 方式三：使用 IIS + iisnode（适合 IIS 环境）

#### 5.3.1 安装 iisnode

1. 下载 iisnode：https://github.com/Azure/iisnode/releases
2. 安装 iisnode-x64-v0.2.26.msi

#### 5.3.2 创建 web.config

在 `backend` 目录创建 `web.config`：
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <iisnode
      node_env="production"
      nodeProcessCountPerApplication="1"
      maxConcurrentRequestsPerProcess="1024"
      maxNamedPipeConnectionRetry="100"
      namedPipeConnectionRetryDelay="250"
      maxNamedPipeConnectionPoolSize="512"
      maxNamedPipePooledConnectionAge="30000"
      asyncCompletionThreadCount="0"
      initialRequestBufferSize="4096"
      maxRequestBufferSize="65536"
      watchedFiles="*.js;iisnode.yml"
      uncFileChangesPollingInterval="5000"
      gracefulShutdownTimeout="60000"
      loggingEnabled="true"
      logDirectory="iisnode"
      debuggingEnabled="false"
      debugHeaderEnabled="false"
      debuggerPortRange="5058-6058"
      debuggerPathSegment="debug"
      maxLogFileSizeInKB="128"
      maxTotalLogFileSizeInKB="1024"
      maxLogFiles="20"
      devErrorsEnabled="false"
      flushResponse="false"
      enableXFF="false"
      promoteServerVars=""
      configOverrides="iisnode.yml"
    />
  </system.webServer>
</configuration>
```

#### 5.3.3 在 IIS 中创建网站

1. 打开 IIS 管理器
2. 添加网站：
   - 网站名称：`English Learning API`
   - 物理路径：`D:\wwwroot\english-learning\backend`
   - 绑定：`http://localhost:3000` 或使用端口 3000
3. 确保应用程序池使用 Node.js 版本

---

### 方式四：使用任务计划程序（简单但功能有限）

#### 5.4.1 创建启动脚本

创建 `start.bat`：
```batch
@echo off
cd /d D:\wwwroot\english-learning\backend
node server.js
```

#### 5.4.2 配置任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务：
   - 名称：`English Learning API`
   - 触发器：系统启动时
   - 操作：启动程序
   - 程序：`D:\wwwroot\english-learning\backend\start.bat`
   - 起始于：`D:\wwwroot\english-learning\backend`
3. 勾选"以最高权限运行"
4. 在"条件"中取消"只有在计算机使用交流电源时才启动此任务"

**注意**：这种方式如果程序崩溃不会自动重启，需要配合监控脚本。

---

### 方式五：使用 forever（轻量级替代）

#### 5.5.1 安装 forever

```cmd
npm install -g forever
```

#### 5.5.2 启动服务

```cmd
cd D:\wwwroot\english-learning\backend
forever start server.js
```

#### 5.5.3 管理服务

```cmd
# 查看所有进程
forever list

# 停止服务
forever stop server.js

# 重启服务
forever restart server.js

# 查看日志
forever logs server.js
```

---

### 方式六：直接运行（仅用于测试，不推荐生产环境）

```cmd
cd D:\wwwroot\english-learning\backend
node server.js
```

**缺点**：
- 关闭命令行窗口服务就停止
- 程序崩溃不会自动重启
- 系统重启后不会自动启动

---

## 📊 各方式对比

| 方式 | 自动重启 | 开机启动 | 日志管理 | 资源占用 | 推荐度 |
|------|---------|---------|---------|---------|--------|
| PM2 | ✅ | ✅ | ✅✅ | 低 | ⭐⭐⭐⭐⭐ |
| Windows Service | ✅ | ✅ | ✅ | 低 | ⭐⭐⭐⭐ |
| IIS + iisnode | ✅ | ✅ | ✅ | 中 | ⭐⭐⭐ |
| 任务计划程序 | ❌ | ✅ | ❌ | 低 | ⭐⭐ |
| forever | ✅ | ❌ | ✅ | 低 | ⭐⭐⭐ |
| 直接运行 | ❌ | ❌ | ❌ | 低 | ⭐ |

**推荐顺序**：
1. **PM2** - 最简单，功能强大
2. **Windows Service** - 系统级服务，稳定可靠
3. **IIS + iisnode** - 如果已有 IIS 环境

---

## 🔍 验证服务

无论使用哪种方式，都可以通过以下方式验证：

```cmd
# 检查端口是否监听
netstat -ano | findstr :3000

# 测试 API
curl http://localhost:3000/api/health
# 或在浏览器访问
http://服务器IP:3000/api/health
```

---

## 🎨 第六步：构建和部署前端

### 6.0 快速部署（推荐）

如果使用提供的部署脚本：

1. **配置 `.env.production` 文件**（见下方 6.2）
2. **运行部署脚本**：
   ```cmd
   cd D:\wwwroot\english-learning\admin
   deploy-windows.bat
   ```

脚本会自动完成：依赖安装、构建等步骤。

### 6.1 安装前端依赖

```cmd
cd D:\wwwroot\english-learning\admin
npm install
```

### 6.2 配置 API 地址

在 `admin` 目录创建 `.env.production` 文件：
```env
# 如果前后端同域名，使用相对路径（推荐）
VITE_API_URL=/api

# 如果前后端不同域名，使用完整地址
# VITE_API_URL=https://api.your-domain.com/api
```

**注意**：如果使用 Nginx 代理，推荐使用相对路径 `/api`，这样 Nginx 会自动转发到后端。

### 6.3 构建前端

```cmd
cd D:\wwwroot\english-learning\admin
npm run build
```

构建完成后，`admin/dist` 目录就是静态文件。

### 6.4 部署静态文件

**方式一：使用 Nginx（推荐）**

1. 在宝塔面板 → 网站 → 添加站点
   - 域名：`admin.your-domain.com`（或使用子目录）
   - 根目录：`D:\wwwroot\english-learning\admin\dist`

2. 配置 Nginx（在站点设置 → 配置文件）：
   
   参考 `nginx-admin.conf.example` 文件，或使用以下配置：
   ```nginx
   server {
       listen 80;
       server_name admin.your-domain.com;
       root D:/wwwroot/english-learning/admin/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # API 代理
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   **重要**：确保路径使用正斜杠 `/` 或双反斜杠 `\\`，Windows 路径示例：`D:/wwwroot/english-learning/admin/dist`

**方式二：使用 IIS（Windows 自带）**

1. 安装 IIS 和 URL Rewrite 模块
2. 创建网站，指向 `admin/dist`
3. 配置 web.config（见下方）

---

## 🔒 第七步：配置 HTTPS（可选但推荐）

### 7.1 申请 SSL 证书

1. 宝塔面板 → 网站 → 你的站点 → SSL
2. 使用 Let's Encrypt 免费证书
3. 或上传自己的证书

### 7.2 更新 CORS 配置

在 `backend/.env` 中更新：
```env
CORS_ORIGIN=https://admin.your-domain.com,https://your-domain.com
```

重启后端：
```cmd
pm2 restart english-learning-api
```

---

## 📝 第八步：配置 IIS（如果使用 IIS）

在 `admin/dist` 目录创建 `web.config`：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## 🔍 第九步：验证部署

### 9.1 检查后端

```cmd
# 检查 PM2 状态
pm2 list

# 查看日志
pm2 logs english-learning-api

# 测试 API
curl http://localhost:3000/api/health
```

### 9.2 检查前端

- 访问 `http://your-domain.com` 或 `https://your-domain.com`
- 测试登录功能
- 检查 API 请求是否正常

---

## 🛠️ 常用维护命令

### PM2 管理（如果使用 PM2）
```cmd
# 查看所有进程
pm2 list

# 重启服务
pm2 restart english-learning-api

# 停止服务
pm2 stop english-learning-api

# 查看日志
pm2 logs english-learning-api

# 查看监控
pm2 monit
```

### Windows Service 管理（如果使用 Windows Service）
```cmd
# 启动服务
net start "English Learning API"

# 停止服务
net stop "English Learning API"

# 查看服务状态
sc query "English Learning API"

# 卸载服务
cd D:\wwwroot\english-learning\backend
node uninstall-service.js
```

### forever 管理（如果使用 forever）
```cmd
# 查看所有进程
forever list

# 重启服务
forever restart server.js

# 停止服务
forever stop server.js

# 查看日志
forever logs server.js
```

### 更新代码

**如果使用 PM2：**
```cmd
# 1. 停止服务
pm2 stop english-learning-api

# 2. 更新代码（上传新文件）

# 3. 安装依赖（如果有新依赖）
cd D:\wwwroot\english-learning\backend
npm install --production

# 4. 重启服务
pm2 restart english-learning-api
```

**如果使用 Windows Service：**
```cmd
# 1. 停止服务
net stop "English Learning API"

# 2. 更新代码（上传新文件）

# 3. 安装依赖（如果有新依赖）
cd D:\wwwroot\english-learning\backend
npm install --production

# 4. 启动服务
net start "English Learning API"
```

**如果使用 forever：**
```cmd
# 1. 停止服务
forever stop server.js

# 2. 更新代码（上传新文件）

# 3. 安装依赖（如果有新依赖）
cd D:\wwwroot\english-learning\backend
npm install --production

# 4. 启动服务
forever start server.js
```

### 更新前端
```cmd
# 1. 构建新版本
cd D:\wwwroot\english-learning\admin
npm run build

# 2. 清空旧文件并上传新 dist 目录
# 或直接覆盖 dist 目录
```

---

## ⚠️ 常见问题

### 1. 端口被占用
```cmd
# 查看端口占用
netstat -ano | findstr :3000

# 修改 backend/.env 中的 PORT
```

### 2. 数据库连接失败
- 检查 MySQL 服务是否启动
- 检查数据库用户名密码是否正确
- 检查防火墙是否开放 3306 端口

### 3. 服务无法启动
- 检查 Node.js 版本：`node -v`
- 检查依赖是否安装：`npm install`
- 查看错误日志：
  - PM2: `pm2 logs`
  - Windows Service: 查看 Windows 事件查看器
  - forever: `forever logs`
- 检查端口是否被占用：`netstat -ano | findstr :3000`

### 4. 前端无法访问 API
- 检查 Nginx 代理配置
- 检查 CORS 配置
- 检查后端服务是否运行

### 5. 静态资源 404
- 检查 Nginx/IIS 配置
- 检查文件路径是否正确
- 检查权限设置

---

## 📞 技术支持

如遇到问题，请检查：
1. 宝塔面板日志
2. PM2 日志：`pm2 logs`
3. Nginx 错误日志
4. 浏览器控制台错误

---

## 📌 部署检查清单

- [ ] Node.js 已安装
- [ ] MySQL 已安装并创建数据库
- [ ] 进程管理器已安装（PM2/Windows Service/forever）
- [ ] 后端 `.env` 已配置
- [ ] 后端依赖已安装
- [ ] 数据库已初始化
- [ ] 后端服务已启动（PM2/Windows Service/forever）
- [ ] 前端 `.env.production` 已配置
- [ ] 前端已构建
- [ ] Nginx/IIS 已配置
- [ ] SSL 证书已配置（可选）
- [ ] 防火墙端口已开放（3000, 80, 443）
- [ ] 域名 DNS 已解析

---

## 🚀 快速部署流程总结

### 后端部署（3 步）
```cmd
1. 配置 backend/.env
2. 运行 backend/deploy-windows.bat
3. 验证: pm2 list
```

### 前端部署（3 步）
```cmd
1. 配置 admin/.env.production
2. 运行 admin/deploy-windows.bat
3. 配置 Nginx/IIS 指向 admin/dist
```

---

## 📚 相关文件说明

- `DEPLOY.md` - 本部署文档
- `backend/ecosystem.config.js` - PM2 配置文件
- `backend/deploy-windows.bat` - 后端快速部署脚本（PM2）
- `backend/deploy-service.bat` - 后端快速部署脚本（Windows Service）
- `backend/install-service.js` - Windows Service 安装脚本
- `backend/uninstall-service.js` - Windows Service 卸载脚本
- `backend/web.config` - IIS + iisnode 配置文件
- `backend/start.bat` - 简单启动脚本
- `admin/deploy-windows.bat` - 前端快速部署脚本
- `admin/web.config` - IIS 配置文件
- `nginx-admin.conf.example` - Nginx 配置示例
- `admin/.env.production.example` - 前端环境变量示例

---

**⚠️ 重要提醒：**
1. 部署完成后，记得修改默认密码和 JWT_SECRET！
2. 生产环境务必使用 HTTPS
3. 定期备份数据库
4. 监控 PM2 服务状态
