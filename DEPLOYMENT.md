# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the LETSGOSFO application to a production server, including handling the migration script issues we encountered.

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 2GB, 4GB+ recommended
- **Storage**: 20GB+ free space
- **Docker**: 20.10+ and Docker Compose 2.0+
- **Domain**: For SSL certificates (optional but recommended)

### Required Software
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Step-by-Step Deployment

### 1. Clone and Setup Repository
```bash
# Clone the repository
git clone <your-repo-url> lgsfo
cd lgsfo

# Make scripts executable
chmod +x scripts/*.sh
```

### 2. Environment Configuration

#### Create Production Environment File
```bash
# Copy the example file
cp env.production.example .env.production

# Edit with your production values
nano .env.production
```

#### Required Environment Variables
```bash
# Database
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://lgsfo_user:your_secure_password_here@postgres:5432/lgsfo

# Google Maps API (REQUIRED)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe Payments (REQUIRED)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Admin Credentials (REQUIRED)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# NextAuth (REQUIRED)
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_min
NEXTAUTH_URL=https://yourdomain.com

# Email (Optional)
RESEND_API_KEY=re_your_resend_api_key

# SMS (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SSL/TLS (For production with domain)
DOMAIN=yourdomain.com
ACME_EMAIL=admin@yourdomain.com
```

### 3. Database Migration (Manual Process)

**⚠️ Important**: The automated migration service has issues, so we'll run migrations manually.

#### Option A: Pre-deployment Migration
```bash
# Start only the database first
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# Wait for database to be ready
sleep 10

# Run migrations manually
docker run --rm \
  --network lgsfo_lgsfo-network \
  -e DATABASE_URL=postgresql://lgsfo_user:your_secure_password_here@lgsfo-postgres-prod:5432/lgsfo \
  -v $(pwd):/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npx prisma migrate deploy"
```

#### Option B: Post-deployment Migration
```bash
# Deploy the full stack first
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Run migrations after deployment
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### 4. Deploy the Application

#### Start All Services
```bash
# Deploy the full production stack
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

#### Verify Deployment
```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Check main page
curl -I http://localhost:3000/

# Check logs
docker-compose -f docker-compose.prod.yml logs app
```

### 5. SSL/HTTPS Setup (Optional but Recommended)

#### With Domain and Let's Encrypt
```bash
# Ensure your domain points to this server
# Update DNS A record to point to your server's IP

# The Traefik configuration will automatically:
# - Request SSL certificates from Let's Encrypt
# - Redirect HTTP to HTTPS
# - Serve the application over HTTPS
```

#### Without Domain (HTTP only)
```bash
# Access via HTTP
http://your-server-ip:3000
```

## Troubleshooting

### Common Issues

#### 1. Migration Script Fails
**Problem**: `db-migrate` service fails to start
**Solution**: Use manual migration process (see Step 3)

#### 2. Environment Variables Not Loading
**Problem**: Services show "variable not set" warnings
**Solution**: 
```bash
# Ensure .env.production exists and has correct values
ls -la .env.production
cat .env.production | grep -v "^#"
```

#### 3. Database Connection Issues
**Problem**: App can't connect to database
**Solution**:
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U lgsfo_user -d lgsfo -c "SELECT 1;"
```

#### 4. App Won't Start
**Problem**: App container keeps restarting
**Solution**:
```bash
# Check app logs
docker-compose -f docker-compose.prod.yml logs app

# Common fixes:
# - Ensure all required environment variables are set
# - Check database is accessible
# - Verify Stripe keys are valid
```

#### 5. Port Conflicts
**Problem**: Ports already in use
**Solution**:
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5432

# Stop conflicting services or change ports in docker-compose.prod.yml
```

### Health Checks

#### Application Health
```bash
# Health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"...","service":"LETSGOSFO API","version":"1.0.0"}
```

#### Database Health
```bash
# Check database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U lgsfo_user -d lgsfo
```

#### Service Status
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Expected: All services should be "Up" and "healthy"
```

## Maintenance

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Run any new migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Backups
```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U lgsfo_user lgsfo > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup volumes
docker run --rm -v lgsfo_postgres_data_prod:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### Monitoring
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Monitor resources
docker stats

# Check disk usage
docker system df
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env.production` to version control
- Use strong, unique passwords
- Rotate API keys regularly

### 2. Firewall
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. SSL/TLS
- Always use HTTPS in production
- Let's Encrypt certificates auto-renew
- Monitor certificate expiration

### 4. Database Security
- Use strong database passwords
- Limit database access to application only
- Regular backups

## Performance Optimization

### 1. Resource Limits
Add to `docker-compose.prod.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### 2. Database Optimization
```bash
# Monitor database performance
docker-compose -f docker-compose.prod.yml exec postgres psql -U lgsfo_user -d lgsfo -c "SELECT * FROM pg_stat_activity;"
```

### 3. Caching
- Next.js automatically optimizes static assets
- Consider Redis for session storage in high-traffic scenarios

## Support

### Logs Location
- Application logs: `docker-compose -f docker-compose.prod.yml logs app`
- Database logs: `docker-compose -f docker-compose.prod.yml logs postgres`
- Traefik logs: `docker-compose -f docker-compose.prod.yml logs traefik`

### Common Commands
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop all services
docker-compose -f docker-compose.prod.yml down

# View service status
docker-compose -f docker-compose.prod.yml ps

# Access application shell
docker-compose -f docker-compose.prod.yml exec app sh
```

---

## Quick Start Checklist

- [ ] Server with Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] `.env.production` configured with real API keys
- [ ] Database migrations run manually
- [ ] All services deployed and healthy
- [ ] Health endpoint responding
- [ ] SSL configured (if using domain)
- [ ] Firewall configured
- [ ] Monitoring setup

**🎉 Your production deployment is ready!**
