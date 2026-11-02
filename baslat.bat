@echo off
cd /d "%~dp0"
title Parfum Nota - Gelistirme Sunucusu
if not exist node_modules (
  echo Paketler yukleniyor...
  call npm install
)
start "" cmd /c "timeout /t 5 >nul && start http://localhost:3000"
call npm run dev
pause
