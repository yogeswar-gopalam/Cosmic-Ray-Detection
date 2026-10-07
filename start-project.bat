@echo off
echo 🚀 Starting Cosmic Ray Detection Project...
echo ==================================================
echo.

cd /d "%~dp0"

echo Starting Backend Server...
start "Django Backend" cmd /k "cd Backend && python manage.py runserver"

timeout /t 2 /nobreak > nul

echo Starting Frontend Server...
start "Vite Frontend" cmd /k "cd Fontend && npm run dev"

echo.
echo ✅ Both servers starting...
echo    Backend: http://127.0.0.1:8000/
echo    Frontend: http://localhost:8081/
echo.
echo 🛑 Close the command windows to stop servers
echo ==================================================
pause