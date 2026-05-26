@echo off
REM Quick start script for Enterprise BPM Platform (Windows)

setlocal enabledelayedexpansion

echo 🚀 Starting Enterprise BPM Platform (Production)...

REM Check if .env.production exists
if not exist .env.production (
    echo ⚠️  .env.production not found. Checking .env.example...
    if exist .env.example (
        copy .env.example .env.production
        echo ✅ Created .env.production from template
    ) else (
        echo ❌ Please create .env.production file
        exit /b 1
    )
)

REM Build image
echo 🏗️  Building Docker image...
docker build -t enterprise-bpm:latest .
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

REM Start services
echo 🐳 Starting containers...
docker compose up -d
if errorlevel 1 (
    echo ❌ Failed to start containers
    exit /b 1
)

REM Wait for services
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

REM Check database health
echo ✅ Checking service health...
docker compose exec -T postgres pg_isready -U postgres
if errorlevel 1 (
    echo ❌ Database is not ready yet. Check logs with: docker compose logs postgres
)

echo.
echo ==========================================
echo ✅ Enterprise BPM Platform Started
echo ==========================================
echo Frontend:    http://localhost:3000
echo API Health:  http://localhost:3000/api/health
echo Database:    postgres://localhost:5432
echo ==========================================
echo.
echo View logs: docker compose logs -f app
echo Stop:      docker compose down
echo.
