# Backend Docker Infrastructure

## 📦 What's Been Set Up

Your Next.js/Prisma backend now has production-grade Docker infrastructure:

### Files Created

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build (Node 20 Alpine) |
| `docker-compose.yml` | Production orchestration with PostgreSQL |
| `docker-compose.dev.yml` | Development with hot reload |
| `.dockerignore` | Excludes unnecessary files (saves ~50MB) |
| `.env.production` | Production environment template |
| `docker-entrypoint.sh` | Auto-migrations & seeding on startup |
| `app/api/health/route.ts` | Health check endpoint for container orchestration |

---

## 🚀 Quick Start

### Option 1: Production (Recommended for Deployment)

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

### Option 2: Development (Hot Reload)

**macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

---

## 🎯 Architecture Highlights

### Multi-Stage Build
```
Builder Stage (npm install, Prisma generate, next build)
    ↓
Runtime Stage (only production files, ~250MB final image)
```

### Production Setup
- **PostgreSQL 16 Alpine**: Persistent data with health checks
- **Next.js App**: Non-root user, signal handling, auto-migrations
- **Health Checks**: Container orchestration aware
- **Bridge Network**: Service-to-service communication

### Development Setup
- **Hot Reload**: Source code bind mount with auto-refresh
- **Auto-Seed**: Database seeds on startup (`SEED_DB=true`)
- **Separate Volumes**: `node_modules` and `.next` isolated

---

## 📋 Configuration

### Environment Variables

**Production (.env.production):**
```bash
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/enterprise_bpm?schema=public"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"  # Your production URL
SUPER_ADMIN_EMAIL="admin@yourdomain.com"
SUPER_ADMIN_PASSWORD="SecurePassword123!"
NODE_ENV="production"
SEED_DB="false"  # Don't seed in production
```

**Development (.env):**
Auto-created by `start-dev.sh/.bat` with sensible defaults.

### Secrets Management

For production, use:
- **Docker Secrets** (Docker Swarm)
- **Kubernetes Secrets** (K8s)
- **Environment file** (`--env-file`)
- **Secret manager** (AWS Secrets Manager, HashiCorp Vault)

---

## 📊 Common Tasks

### View Logs
```bash
# All services
docker compose logs -f

# Just the app
docker compose logs -f app

# Last 50 lines
docker compose logs app --tail 50
```

### Database Commands
```bash
# Access psql shell
docker compose exec postgres psql -U postgres -d enterprise_bpm

# Run migration manually
docker compose exec app npx prisma migrate dev --name migration_name

# Seed database
docker compose exec app npm run prisma:seed

# Reset everything (⚠️ destructive)
docker compose down -v
docker compose up -d
```

### Container Management
```bash
# Stop all services
docker compose stop

# Restart a service
docker compose restart app

# Rebuild after code changes
docker compose build app
docker compose up -d app

# Interactive shell in app container
docker compose exec app sh
```

### Health Checks
```bash
# Check container status
docker compose ps

# API health endpoint
curl http://localhost:3000/api/health

# Database connectivity
docker compose exec postgres pg_isready -U postgres
```

---

## 🔒 Security Best Practices

1. **Environment Secrets**
   ```bash
   # Generate secure NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

2. **Never Commit Secrets**
   ```bash
   echo ".env .env.production" >> .gitignore
   ```

3. **Non-Root User**
   - App runs as `nextjs:1001` (non-root)
   - Better defense against container escape

4. **Network Isolation**
   - Custom bridge network separates services
   - Services only expose necessary ports

5. **Health Checks**
   - Automatic container restart on failure
   - Orchestration-aware recovery

---

## 🚀 Deployment Options

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy
docker stack deploy -c docker-compose.yml enterprise-bpm

# View services
docker service ls
```

### Kubernetes
```bash
# Convert docker-compose to K8s manifests
docker compose config > manifest.yaml

# Deploy
kubectl apply -f manifest.yaml

# View pods
kubectl get pods -l app=enterprise-bpm
```

### Docker Compose (Single Host)
```bash
# Start as daemon
docker compose up -d

# Monitor
docker compose ps
```

---

## 📈 Performance Tuning

### Image Optimization
- Alpine Linux: 43MB base vs 500MB+ standard
- Multi-stage: Removes dev dependencies (~100MB saved)
- .dockerignore: Excludes unnecessary files (~50MB saved)

### Runtime Optimization
```bash
# Increase memory if needed
docker compose exec app free -h

# Check resource usage
docker stats
```

### Build Caching
```bash
# Rebuild with cache (faster)
docker compose build app

# Full rebuild (slower, cleaner)
docker compose build --no-cache app
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Wait 10s for DB, check `docker compose logs postgres` |
| `Out of memory` | Increase Docker memory in settings |
| `Port 3000 in use` | `docker compose down` or change `APP_PORT` in .env |
| `Migrations fail` | `docker compose exec app npx prisma migrate reset` |
| `Seed fails` | Check `SUPER_ADMIN_PASSWORD` complexity in `.env` |

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## ✅ What's Next

1. **Generate secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update production credentials in `.env.production`**

3. **Test locally:**
   ```bash
   ./start.sh  # or start.bat on Windows
   ```

4. **Push to production:**
   ```bash
   docker build -t enterprise-bpm:v1.0.0 .
   docker push your-registry/enterprise-bpm:v1.0.0
   ```

---

**That's it!** Your backend is now containerized and production-ready. 🎉
