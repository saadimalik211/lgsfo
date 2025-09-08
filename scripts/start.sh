#!/bin/bash

# Application startup script for Docker containers
# This script handles database connection and application startup

set -e

echo "🚀 Starting LGSFO application..."

# Wait for database to be available
echo "⏳ Waiting for database connection..."
DB_HOST=${DB_HOST:-postgres}
until pg_isready -h $DB_HOST -p 5432 -U lgsfo_user -d lgsfo; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database connection established!"

# Start the application
echo "🎯 Starting Next.js application..."
exec "$@"
