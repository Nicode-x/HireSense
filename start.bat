@echo off
echo Starting HireSense AI...

:: Start NLP Service (Python)
start "HireSense NLP" cmd /k "cd nlp-service && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: Start Backend (Node.js)
start "HireSense Backend" cmd /k "cd backend && node server.js"

:: Start Frontend (Vite)
start "HireSense Frontend" cmd /k "cd frontend && npm run dev"

echo All services are starting!
echo Frontend: http://localhost:5173
echo.
pause
