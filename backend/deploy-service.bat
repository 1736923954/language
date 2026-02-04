@echo off
chcp 65001 >nul
echo ========================================
echo English Learning Backend 部署脚本 (Windows Service)
echo ========================================
echo.

:: 检查 Node.js
echo [1/5] 检查 Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

:: 检查 node-windows
echo [2/5] 检查 node-windows...
npm list -g node-windows >nul 2>&1
if errorlevel 1 (
    echo ⚠ node-windows 未安装，正在安装...
    npm install -g node-windows
    if errorlevel 1 (
        echo ❌ node-windows 安装失败
        pause
        exit /b 1
    )
)
echo ✓ node-windows 已安装

:: 安装依赖
echo [3/5] 安装依赖...
call npm install --production
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

:: 检查 .env 文件
echo [4/5] 检查配置文件...
if not exist ".env" (
    echo ⚠ 警告: .env 文件不存在
    echo 请复制 .env.example 并修改配置
    copy .env.example .env
    echo ✓ 已创建 .env 文件，请修改配置后重新运行
    pause
    exit /b 0
)
echo ✓ 配置文件存在

:: 安装服务
echo [5/5] 安装 Windows Service...
node install-service.js
if errorlevel 1 (
    echo ❌ 服务安装失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 服务已安装并启动
echo.
echo 管理命令:
echo   启动: net start "English Learning API"
echo   停止: net stop "English Learning API"
echo   卸载: node uninstall-service.js
echo.
pause
