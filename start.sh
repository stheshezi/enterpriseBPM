#!/bin/bash
# Quick start script for Enterprise BPM Platform

set -e

echo "🚀 Starting Enterprise BPM Platform (Production)..."

# Check if .env exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found. Creating from template..."
    cp .env.production .env.production 2>/dev/null || {
        echo "❌ Please create .env.production file"
        exit 1
    }
fi

# Build image
echo "🏗️  Building Docker image..."
docker build -t enterprise-bpm:latest . --progress=plain

# Start services
echo "🐳 Starting containers..."
docker compose up -d

# Wait for database
echo "⏳ Waiting for database..."
sleep 5

# Check health
echo "✅ Checking service health..."
docker compose exec -T postgres pg_isready -U postgres || {
    echo "❌ Database connection failed"
    exit 1
}

# Display endpoints
echo ""
echo "=========================================="
echo "✅ Enterprise BPM Platform Started"
echo "=========================================="
echo "Frontend:    http://localhost:3000"
echo "API Health:  http://localhost:3000/api/health"
echo "Database:    postgres://localhost:5432"
echo "=========================================="
echo ""
echo "View logs: docker compose logs -f app"
echo "Stop:      docker compose down"
