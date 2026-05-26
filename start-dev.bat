@echo off
REM Development quick start with hot reload (Windows)

setlocal enabledelayedexpansion

echo 🚀 Starting Enterprise BPM Platform (Development with Hot Reload)...

REM Ensure .env exists
if not exist .env (
    echo ⚠️  .env not found. Creating for development...
    (
        echo DATABASE_URL=postgresql://postgres:postgres@postgres:5432/enterprise_bpm?schema=public
        echo NEXTAUTH_SECRET=dev-secret-key-change-me
        echo NEXTAUTH_URL=http://localhost:3000
        echo SUPER_ADMIN_EMAIL=admin@example.com
        echo SUPER_ADMIN_PASSWORD=ChangeMe123!
        echo SUPER_ADMIN_TENANT_DOMAIN=admin
        echo POSTGRES_DB=enterprise_bpm
        echo POSTGRES_USER=postgres
        echo POSTGRES_PASSWORD=postgres
        echo SEED_DB=true
        echo NODE_ENV=development
    ) > .env
    echo ✅ Created .env for development
)

rem === Install Node.js dependencies (host side) ===
echo 📦 Installing Node.js dependencies...
npm ci
if errorlevel 1 (
    echo ❌ npm install failed
    exit /b 1
)

rem === Start Docker containers (dev) ===
echo 🐳 Starting containers with hot‑reload...
docker compose -f docker-compose.dev.yml up --build -d
if errorlevel 1 (
    echo ❌ Docker compose failed
    exit /b 1
)

rem === Wait for Postgres to be ready ===
echo ⏳ Waiting for PostgreSQL to become healthy...
timeout /t 10 /nobreak >nul

rem === Run Prisma migrations inside the app container ===
echo 🗄️ Applying Prisma migrations inside container...
docker compose exec app npm run prisma:migrate
if errorlevel 1 (
    echo ❌ Prisma migrate failed
    exit /b 1
)

rem === Seed the database inside the app container ===
echo 🌱 Seeding database inside container...
docker compose exec app npm run prisma:seed
if errorlevel 1 (
    echo ❌ Prisma seed failed
    exit /b 1
)

rem === Start Next.js dev server (inside container) ===
echo 🚀 Starting Next.js dev server (http://localhost:3000)...
docker compose exec app npm run dev
