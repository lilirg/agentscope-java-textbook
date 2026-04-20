@echo off
chcp 65001 >nul
echo ========================================
echo    Docsify 本地预览服务器启动
echo ========================================
echo.
echo 正在启动服务器...
echo 访问地址：http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

python -m http.server 3000

pause