@echo off
chcp 65001 >nul
echo ========================================
echo English Learning Backend 部署脚本
echo ========================================
echo.

:: 检查 Node.js
echo [1/6] 检查 Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

:: 检查 PM2
echo [2/6] 检查 PM2...
pm2 -v >nul 2>&1
if errorlevel 1 (
    echo ⚠ PM2 未安装，正在安装...
    npm install -g pm2
    if errorlevel 1 (
        echo ❌ PM2 安装失败
        pause
        exit /b 1
    )
)
echo ✓ PM2 已安装

:: 安装依赖
echo [3/6] 安装依赖...
call npm install --production
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

:: 创建日志目录
echo [4/6] 创建日志目录...
if not exist "logs" mkdir logs
echo ✓ 日志目录已创建

:: 检查 .env 文件
echo [5/6] 检查配置文件...
if not exist ".env" (
    echo ⚠ 警告: .env 文件不存在
    echo 请复制 .env.example 并修改配置
    copy .env.example .env
    echo ✓ 已创建 .env 文件，请修改配置后重新运行
    pause
    exit /b 0
)
echo ✓ 配置文件存在

:: 启动服务
echo [6/6] 启动服务...
pm2 delete english-learning-api 2>nul
pm2 start ecosystem.config.js
if errorlevel 1 (
    echo ❌ 服务启动失败
    pause
    exit /b 1
)
pm2 save
echo ✓ 服务已启动

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 查看服务状态: pm2 list
echo 查看日志: pm2 logs english-learning-api
echo 重启服务: pm2 restart english-learning-api
echo.
pause
