# Docker Deployment Guide

This guide covers how to deploy the LGSFO application using Docker containers.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available for containers

## Quick Start

### Development Environment

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd lgsfo
   cp env.example settings.env
   # Edit settings.env with your actual values
   ```

2. **Start development environment:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Application: http://localhost:3000
   - Traefik Dashboard: http://localhost:8080

### Production Environment

1. **Setup production environment:**
   ```bash
   cp env.production.example .env.production
   # Edit .env.production with your production values
   ```

2. **Deploy to production:**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   ```

## Environment Configuration

### Development (`settings.env`)
- Uses local development settings
- Hot reload enabled
- Debug logging enabled

### Production (`.env.production`)
- Optimized for production
- SSL/TLS enabled via Traefik
- Health checks enabled
- Automatic restarts

## Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** lgsfo
- **User:** lgsfo_user
- **Password:** Set via environment variables
- **Persistence:** Data stored in Docker volumes

### Next.js Application
- **Port:** 3000
- **Health Check:** `/api/health`
- **Auto-restart:** On failure
- **Dependencies:** Waits for database to be ready

### Traefik Reverse Proxy
- **HTTP Port:** 80
- **HTTPS Port:** 443
- **Dashboard:** 8080
- **Features:** SSL termination, load balancing, automatic HTTPS

## Database Migrations

Migrations are handled automatically:

1. **Development:** Run `npx prisma migrate dev` in the app container
2. **Production:** Migrations run automatically via the `db-migrate` service

## Health Checks

All services include health checks:

- **PostgreSQL:** `pg_isready` command
- **Application:** HTTP GET to `/api/health`
- **Traefik:** Built-in health monitoring

## Monitoring

### Container Status
```bash
docker-compose ps
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Health Status
```bash
# Check health status
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check if PostgreSQL container is running
   - Verify DATABASE_URL in environment file
   - Check network connectivity between containers

2. **Application Won't Start:**
   - Check application logs: `docker-compose logs app`
   - Verify all environment variables are set
   - Ensure database is ready before app starts

3. **Migration Issues:**
   - Check migration logs: `docker-compose logs db-migrate`
   - Verify database permissions
   - Check Prisma schema syntax

### Useful Commands

```bash
# Rebuild and restart all services
docker-compose down
docker-compose up --build

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up --build

# Access application container shell
docker-compose exec app sh

# Access database
docker-compose exec postgres psql -U lgsfo_user -d lgsfo

# View container resource usage
docker stats
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong passwords for production
   - Rotate API keys regularly

2. **Network Security:**
   - Use Docker networks for service isolation
   - Configure firewall rules for exposed ports
   - Enable SSL/TLS in production

3. **Container Security:**
   - Run containers as non-root users
   - Keep base images updated
   - Scan images for vulnerabilities

## Scaling

### Horizontal Scaling
```bash
# Scale application instances
docker-compose up --scale app=3
```

### Load Balancing
Traefik automatically handles load balancing across multiple app instances.

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U lgsfo_user lgsfo > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U lgsfo_user lgsfo < backup.sql
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v lgsfo_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## Performance Optimization

1. **Resource Limits:**
   - Set memory limits for containers
   - Configure CPU limits
   - Monitor resource usage

2. **Database Optimization:**
   - Configure PostgreSQL settings
   - Add database indexes
   - Monitor query performance

3. **Application Optimization:**
   - Enable Next.js optimizations
   - Configure caching
   - Monitor application metrics
