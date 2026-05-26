#!/bin/bash
# Development quick start with hot reload

set -e

echo "🚀 Starting Enterprise BPM Platform (Development with Hot Reload)..."

# Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env not found. Using .env.example..."
    cp .env.example .env 2>/dev/null || {
        cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/enterprise_bpm?schema=public"
NEXTAUTH_SECRET="dev-secret-key-change-me"
NEXTAUTH_URL="http://localhost:3000"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="ChangeMe123!"
SUPER_ADMIN_TENANT_DOMAIN="admin"
POSTGRES_DB="enterprise_bpm"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
SEED_DB="true"
NODE_ENV="development"
EOF
        echo "✅ Created .env for development"
    }
fi

# Start with docker compose dev config
echo "🐳 Starting containers with hot reload..."
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "==========================================="
echo "✅ Development Environment Ready"
echo "==========================================="
echo "Frontend:    http://localhost:3000"
echo "Hot Reload:  Enabled (changes auto-reload)"
echo "Database:    postgres://localhost:5432"
echo "==========================================="
