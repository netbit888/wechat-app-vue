@echo off
chcp 65001 > nul
echo 正在生成项目目录树并保存...
tree . /f /a > project_tree.txt
echo 目录树已保存到 project_tree.txt
pause