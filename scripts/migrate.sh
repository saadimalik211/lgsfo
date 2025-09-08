#!/bin/bash

# Database migration script for Docker containers
# This script ensures the database is ready before running migrations

set -e

echo "🔄 Waiting for database to be ready..."

# Wait for database to be available
until pg_isready -h postgres -p 5432 -U lgsfo_user -d lgsfo; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🚀 Running database migrations..."
npx prisma migrate deploy

echo "✅ Database migrations completed successfully!"
