@echo off
title Customer Segmentation System
echo =====================================================================
echo  Customer Segmentation System Using K-Means Clustering Algorithm
echo  "Understand Your Customers. Discover Business Opportunities."
echo =====================================================================
echo.
echo Starting FastAPI Backend + React Web Interface...
echo Open your browser at: http://localhost:8000
echo.

cd /d "%~dp0backend"
"..\.venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
