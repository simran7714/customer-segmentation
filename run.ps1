Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Customer Segmentation System Using K-Means Clustering Algorithm" -ForegroundColor Yellow
Write-Host " 'Understand Your Customers. Discover Business Opportunities.'" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Unified Server (FastAPI + React Production Frontend)..." -ForegroundColor White
Write-Host "Access Web Application at: " -NoNewline
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\backend"
& "..\.venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
