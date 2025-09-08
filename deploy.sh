#!/bin/bash

# LETSGOSFO Production Deployment Script
# This script automates the deployment process, handling the migration issues

set -e

echo "🚀 Starting LETSGOSFO Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    print_status "Please create .env.production from env.production.example and configure it with your production values."
    exit 1
fi

# Check if required environment variables are set
print_status "Checking environment configuration..."

# Source the environment file to check variables
source .env.production

required_vars=(
    "POSTGRES_PASSWORD"
    "GOOGLE_MAPS_API_KEY"
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
    "ADMIN_PASSWORD"
    "NEXTAUTH_SECRET"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_success "Environment configuration looks good!"

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml --env-file .env.production down 2>/dev/null || true

# Start database first
print_status "Starting PostgreSQL database..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check if database is healthy
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U lgsfo_user -d lgsfo >/dev/null 2>&1; then
        print_success "Database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Database failed to start after $max_attempts attempts"
        exit 1
    fi
    
    print_status "Waiting for database... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Run database migrations manually
print_status "Running database migrations..."
docker run --rm \
    --network lgsfo_lgsfo-network \
    -e DATABASE_URL="postgresql://lgsfo_user:${POSTGRES_PASSWORD}@lgsfo-postgres-prod:5432/lgsfo" \
    -v "$(pwd):/app" \
    -w /app \
    node:20-alpine \
    sh -c "npm install && npx prisma migrate deploy"

if [ $? -eq 0 ]; then
    print_success "Database migrations completed successfully!"
else
    print_error "Database migrations failed!"
    exit 1
fi

# Build and start the application
print_status "Building and starting the application..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build app

# Wait for application to start
print_status "Waiting for application to start..."
sleep 15

# Check if application is healthy
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "Application is healthy!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Application failed to start after $max_attempts attempts"
        print_status "Checking application logs..."
        docker-compose -f docker-compose.prod.yml logs app --tail=20
        exit 1
    fi
    
    print_status "Waiting for application... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Start Traefik
print_status "Starting Traefik reverse proxy..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d traefik

# Final health check
print_status "Performing final health checks..."

# Check all services
print_status "Service status:"
docker-compose -f docker-compose.prod.yml --env-file .env.production ps

# Test health endpoint
if curl -s http://localhost:3000/api/health | grep -q "ok"; then
    print_success "Health endpoint is responding correctly!"
else
    print_warning "Health endpoint check failed, but services appear to be running"
fi

# Test main page
if curl -s -I http://localhost:3000/ | grep -q "200 OK"; then
    print_success "Main page is accessible!"
else
    print_warning "Main page check failed, but services appear to be running"
fi

print_success "🎉 Deployment completed successfully!"
print_status ""
print_status "Your application is now running at:"
print_status "  - Main App: http://localhost:3000"
print_status "  - Health Check: http://localhost:3000/api/health"
print_status "  - Traefik Dashboard: http://localhost:8080"
print_status ""
print_status "To view logs:"
print_status "  docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f"
print_status ""
print_status "To stop the application:"
print_status "  docker-compose -f docker-compose.prod.yml --env-file .env.production down"
print_status ""
print_warning "Remember to:"
print_warning "  - Configure your firewall (ports 80, 443, 3000)"
print_warning "  - Set up SSL certificates if using a domain"
print_warning "  - Monitor the application logs"
print_warning "  - Set up regular database backups"
