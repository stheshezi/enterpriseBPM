#!/bin/sh
set -e

# Run migrations
echo "Running database migrations..."
if npx prisma migrate deploy --skip-generate 2>/dev/null; then
  echo "Migrations completed"
else
  echo "Migrations skipped or failed (may already be up to date)"
fi

# Seed database if needed
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  npm run prisma:seed || true
fi

# Start application
echo "Starting Next.js application..."
exec node /app/node_modules/.bin/next start
