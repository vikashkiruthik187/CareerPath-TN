@echo off
echo ========================================================
echo  Starting CareerPath TN Platform (Full-Stack)
echo ========================================================

echo Starting Backend Server on http://localhost:5000...
start "CareerPath TN Backend" cmd /k "cd server && node src/index.js"

timeout /t 2 /nobreak >nul

echo Starting Frontend Server on http://localhost:3000...
start "CareerPath TN Frontend" cmd /k "cd client && npm run dev"

echo ========================================================
echo  Both servers are launching!
echo  Open your browser at: http://localhost:3000
echo ========================================================
pause
