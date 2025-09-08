# 🚀 Quick Production Deployment

## TL;DR - Deploy in 3 Steps

### 1. Setup Environment
```bash
# Clone repository
git clone <your-repo-url> lgsfo
cd lgsfo

# Create production environment file
cp env.production.example .env.production
# Edit .env.production with your real API keys and passwords
```

### 2. Run Deployment Script
```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### 3. Verify Deployment
```bash
# Check health
curl http://localhost:3000/api/health

# Access application
open http://localhost:3000
```

## What the Script Does

The `deploy.sh` script automatically:

1. ✅ **Validates** your environment configuration
2. ✅ **Starts** PostgreSQL database
3. ✅ **Runs** database migrations manually (fixes the migration script issue)
4. ✅ **Builds** and starts the Next.js application
5. ✅ **Starts** Traefik reverse proxy
6. ✅ **Verifies** all services are healthy

## Required Environment Variables

**⚠️ You MUST configure these in `.env.production`:**

```bash
# Database
POSTGRES_PASSWORD=your_secure_password

# Google Maps (REQUIRED)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe (REQUIRED)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Admin (REQUIRED)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# NextAuth (REQUIRED)
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_min
NEXTAUTH_URL=https://yourdomain.com
```

## Manual Deployment (If Script Fails)

If the automated script doesn't work, follow the manual process:

```bash
# 1. Start database
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# 2. Wait for database
sleep 10

# 3. Run migrations manually
docker run --rm \
  --network lgsfo_lgsfo-network \
  -e DATABASE_URL=postgresql://lgsfo_user:your_password@lgsfo-postgres-prod:5432/lgsfo \
  -v $(pwd):/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npx prisma migrate deploy"

# 4. Start application
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build app

# 5. Start Traefik
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d traefik
```

## Troubleshooting

### Migration Issues
- **Problem**: `db-migrate` service fails
- **Solution**: Use manual migration (script handles this automatically)

### Environment Variables
- **Problem**: "variable not set" warnings
- **Solution**: Ensure `.env.production` exists and has all required variables

### Port Conflicts
- **Problem**: Ports already in use
- **Solution**: Stop conflicting services or change ports in `docker-compose.prod.yml`

### App Won't Start
- **Problem**: App container keeps restarting
- **Solution**: Check logs with `docker-compose -f docker-compose.prod.yml logs app`

## Access Points

- **Main App**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Admin Dashboard**: http://localhost:3000/admin
- **Traefik Dashboard**: http://localhost:8080

## Security Checklist

- [ ] Strong passwords for database and admin
- [ ] Valid API keys for Google Maps and Stripe
- [ ] Firewall configured (ports 80, 443, 3000)
- [ ] SSL certificates (if using domain)
- [ ] Regular backups scheduled

## Support

- **Logs**: `docker-compose -f docker-compose.prod.yml logs -f`
- **Status**: `docker-compose -f docker-compose.prod.yml ps`
- **Stop**: `docker-compose -f docker-compose.prod.yml down`

---

**🎉 That's it! Your production deployment should be running smoothly.**
