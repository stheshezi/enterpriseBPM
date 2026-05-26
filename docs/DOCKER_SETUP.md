# Docker Setup for Enterprise BPM Platform Backend

## Multi-Stage Production Build

The `Dockerfile` uses a 2-stage build to minimize final image size:
- **Builder stage**: Installs all dependencies, generates Prisma client, builds Next.js
- **Runtime stage**: Copies only necessary production files, runs with non-root user

**Key features:**
- Multi-stage architecture reduces final image to ~250MB
- Non-root user (nextjs:1001) for security
- dumb-init for proper signal handling and zombie process reaping
- Health check with `/api/health` endpoint
- Automatic database migrations on startup
- Optional database seeding with `SEED_DB=true`

---

## Docker Compose Configurations

### Production (`docker-compose.yml`)
Full production setup with:
- PostgreSQL 16 Alpine with health checks
- Next.js app with health monitoring
- Named volumes for persistent data
- Custom bridge network isolation
- Service dependencies with health conditions
- Environment variables from `.env`

**Usage:**
```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f app

# Stop services
docker compose down
```

### Development (`docker-compose.dev.yml`)
Development setup with:
- Hot reload via volume mounts
- Auto-seed on startup (`SEED_DB=true`)
- Source code mounted at `/app`
- Separated `node_modules` and `.next` to prevent conflicts

**Usage:**
```bash
docker compose -f docker-compose.dev.yml up -d

# Real-time logs
docker compose -f docker-compose.dev.yml logs -f app
```

---

## Environment Variables

Create `.env` (development) or `.env.production` (production):

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/enterprise_bpm?schema=public"
POSTGRES_DB="enterprise_bpm"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
DB_PORT="5432"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"  # or production URL

# Super Admin
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="SecurePassword123!"
SUPER_ADMIN_TENANT_DOMAIN="admin"

# App
APP_PORT="3000"
NODE_ENV="production"
SEED_DB="false"  # Set to "true" to seed on startup
```

---

## Building the Image

```bash
# Build for production
docker build -t enterprise-bpm:latest .

# Build with custom tag
docker build -t enterprise-bpm:v1.0.0 .

# Build without cache
docker build --no-cache -t enterprise-bpm:latest .
```

---

## Running Containers

### Single Service
```bash
# Start PostgreSQL only
docker compose up postgres

# Start app only (requires external PostgreSQL)
docker compose up app
```

### Scale Services
```bash
# Scale to 3 app instances (requires load balancer)
docker compose up -d --scale app=3
```

### Troubleshooting

```bash
# View container status
docker compose ps

# Check logs
docker compose logs app
docker compose logs postgres

# Access container shell
docker exec -it enterprise-bpm-app-dev sh

# Check health
docker compose exec postgres pg_isready -U postgres
docker compose exec app wget -q -O- http://localhost:3000/api/health
```

---

## Database Management

### Migrations
The entrypoint automatically runs:
```bash
npx prisma migrate deploy --skip-generate
```

### Manual Migration
```bash
docker compose exec app npx prisma migrate dev --name <migration-name>
```

### Database Seeding
Enable with `SEED_DB=true` in `.env`, or manually:
```bash
docker compose exec app npm run prisma:seed
```

### Reset Database (⚠️ Destructive)
```bash
docker compose down -v  # Remove volumes
docker compose up -d    # Fresh start with seed
```

---

## Security Best Practices

1. **Never commit `.env` files** - use `.env.example` as template
2. **Generate `NEXTAUTH_SECRET`** - use `openssl rand -base64 32`
3. **Run with non-root user** - image uses `nextjs:1001`
4. **Use secrets management** in production (Docker Secrets, Kubernetes)
5. **Set `NODE_ENV=production`** to disable dev tools

---

## Performance Optimization

- `.dockerignore` excludes unnecessary files (saves ~50MB)
- Multi-stage build avoids dev dependencies in final image
- Alpine base image (43MB vs 500MB+ for Node.js)
- Separate `node_modules` volume in dev to avoid sync overhead

---

## Next Steps

1. Generate secure NEXTAUTH_SECRET: `openssl rand -base64 32`
2. Update `.env.production` with real credentials
3. Test locally: `docker compose up`
4. Deploy to Docker Swarm/Kubernetes using `docker compose config`
5. Add CI/CD with GitHub Actions to build on push
