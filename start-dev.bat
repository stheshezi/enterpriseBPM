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

REM Start with docker compose dev config
echo 🐳 Starting containers with hot reload...
docker compose -f docker-compose.dev.yml up --build

echo.
echo ===========================================
echo ✅ Development Environment Ready
echo ===========================================
echo Frontend:    http://localhost:3000
echo Hot Reload:  Enabled (changes auto-reload^)
echo Database:    postgres://localhost:5432
echo ===========================================
