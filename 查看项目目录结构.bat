@echo off
chcp 65001 > nul
echo 正在生成项目目录树...
tree . /f /a
echo.
echo 目录树显示完成。
pause