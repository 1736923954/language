@echo off
chcp 65001 >nul
echo ========================================
echo English Learning Admin 前端部署脚本
echo ========================================
echo.

:: 检查 Node.js
echo [1/4] 检查 Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

:: 检查 .env.production
echo [2/4] 检查生产环境配置...
if not exist ".env.production" (
    echo ⚠ .env.production 不存在，正在创建...
    copy .env.production.example .env.production
    echo ✓ 已创建 .env.production，请检查 API 地址配置
)
echo ✓ 配置文件检查完成

:: 安装依赖
echo [3/4] 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

:: 构建项目
echo [4/4] 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✓ 构建完成

echo.
echo ========================================
echo 构建完成！
echo ========================================
echo.
echo dist 目录已生成，请配置 Web 服务器指向此目录
echo.
pause
