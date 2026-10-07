# Cosmic Ray Detection Project - Start Script
# This script starts both the Django backend and Vite frontend servers

Write-Host "Starting Cosmic Ray Detection Project..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Yellow

# Get the project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "Backend"
$frontendDir = Join-Path $projectRoot "Fontend"

Write-Host "Project Root: $projectRoot" -ForegroundColor Cyan
Write-Host "Backend Directory: $backendDir" -ForegroundColor Cyan
Write-Host "Frontend Directory: $frontendDir" -ForegroundColor Cyan
Write-Host ""

# Function to start backend server
function Start-Backend {
    Write-Host "Starting Django Backend Server..." -ForegroundColor Blue
    Set-Location $backendDir

    # Check if Python is available
    if (!(Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Python not found in PATH. Please ensure Python is installed." -ForegroundColor Red
        return
    }

    # Start Django server in background
    $backendJob = Start-Job -ScriptBlock {
        param($backendPath)
        Set-Location $backendPath
        python manage.py runserver
    } -ArgumentList $backendDir

    Write-Host "Backend server starting on http://127.0.0.1:8000/" -ForegroundColor Green
    return $backendJob
}

# Function to start frontend server
function Start-Frontend {
    Write-Host "Starting Vite Frontend Server..." -ForegroundColor Blue
    Set-Location $frontendDir

    # Check if npm is available
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: npm not found in PATH. Please ensure Node.js is installed." -ForegroundColor Red
        return
    }

    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }

    # Start Vite dev server in background
    $frontendJob = Start-Job -ScriptBlock {
        param($frontendPath)
        Set-Location $frontendPath
        npm run dev
    } -ArgumentList $frontendDir

    Write-Host "Frontend server starting on http://localhost:8081/" -ForegroundColor Green
    return $frontendJob
}

# Start both servers
$backendJob = Start-Backend
$frontendJob = Start-Frontend

Write-Host ""
Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check if jobs are running
Write-Host ""
Write-Host "Server Status:" -ForegroundColor Cyan

if ($backendJob.State -eq "Running") {
    Write-Host "Backend: Running" -ForegroundColor Green
} else {
    Write-Host "Backend: Failed to start" -ForegroundColor Red
    Write-Host "Backend Job State: $($backendJob.State)" -ForegroundColor Red
    if ($backendJob.HasMoreData) {
        Write-Host "Error Output:" -ForegroundColor Red
        Receive-Job $backendJob
    }
}

if ($frontendJob.State -eq "Running") {
    Write-Host "Frontend: Running" -ForegroundColor Green
} else {
    Write-Host "Frontend: Failed to start" -ForegroundColor Red
    Write-Host "Frontend Job State: $($frontendJob.State)" -ForegroundColor Red
    if ($frontendJob.HasMoreData) {
        Write-Host "Error Output:" -ForegroundColor Red
        Receive-Job $frontendJob
    }
}

Write-Host ""
Write-Host "Access your application:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:8081/" -ForegroundColor White
Write-Host "   Backend API: http://127.0.0.1:8000/api/detect/" -ForegroundColor White

Write-Host ""
Write-Host "To stop the servers, close this PowerShell window or press Ctrl+C" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow

# Keep the script running to maintain background jobs
Write-Host ""
Write-Host "Servers are running in background. Press Ctrl+C to stop..." -ForegroundColor Cyan

# Monitor jobs and restart if they fail
while ($true) {
    Start-Sleep -Seconds 5

    # Check backend job
    if ($backendJob.State -ne "Running") {
        Write-Host "Backend server stopped. Attempting to restart..." -ForegroundColor Yellow
        $backendJob = Start-Backend
    }

    # Check frontend job
    if ($frontendJob.State -ne "Running") {
        Write-Host "Frontend server stopped. Attempting to restart..." -ForegroundColor Yellow
        $frontendJob = Start-Frontend
    }
}