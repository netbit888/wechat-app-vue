@echo off
chcp 65001 >nul
echo ========================================
echo   自动构建脚本 (Vue + Capacitor)
echo ========================================
echo.

:: 检查是否安装了Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo [信息] 当前目录：%cd%
echo [信息] 开始执行构建流程...
echo.

:: 执行npm run build
echo [步骤1] 执行 npm run build...
call npm run build

if errorlevel 1 (
    echo [错误] 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo [成功] 项目构建完成！
echo.

:: 执行npx cap sync
echo [步骤2] 执行 npx cap sync...
call npx cap sync

if errorlevel 1 (
    echo [错误] Capacitor同步失败
    pause
    exit /b 1
)

echo [成功] Capacitor同步完成！
echo.

:: 执行npx cap open android
echo [步骤3] 执行 npx cap open android...
call npx cap open android

if errorlevel 1 (
    echo [错误] 无法打开Android项目，请检查Android Studio是否安装
    pause
    exit /b 1
)

echo [成功] Android项目已打开！
echo.
echo ========================================
echo   所有操作已完成！
echo ========================================
echo.
pause