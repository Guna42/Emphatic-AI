@echo off
title Empathica AI — Starting Server
color 5F

echo.
echo  ========================================================
echo    EMPATHICA AI — GenAI Customer Response System
echo    Fine-tuned Flan-T5 + LoRA + DistilRoBERTa
echo  ========================================================
echo.

cd /d "%~dp0"

echo  [1/2] Checking Python environment...
python --version
echo.

echo  [2/2] Starting FastAPI server on http://localhost:8000
echo.
echo  Open your browser at:  http://localhost:8000
echo  Press Ctrl+C to stop the server.
echo.

python -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0

pause
