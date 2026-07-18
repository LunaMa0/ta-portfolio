@echo off
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update-site-data.ps1"
if errorlevel 1 (
  echo.
  echo Update failed. Close the workbook and try again.
)
echo.
pause
