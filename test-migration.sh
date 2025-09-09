#!/bin/bash

# Test script to debug migration issues on Mac Mini M4
# Run this to test the migration approach before running the full deploy script

set -e

echo "🔍 Testing migration approach on Mac Mini M4..."

# Get absolute path to current directory
CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "📁 Current directory: ${CURRENT_DIR}"

# Check if package.json exists
if [ ! -f "${CURRENT_DIR}/package.json" ]; then
    echo "❌ package.json not found in ${CURRENT_DIR}"
    exit 1
fi

echo "✅ package.json found"

# Test volume mount
echo "🧪 Testing volume mount..."
docker run --rm \
    -v "${CURRENT_DIR}:/app" \
    -w /app \
    node:20-alpine \
    sh -c "ls -la /app && echo 'Volume mount successful!'"

echo "✅ Volume mount test completed"

# Test if we can access the database network
echo "🧪 Testing database network access..."
if docker network ls | grep -q "lgsfo_lgsfo-network"; then
    echo "✅ Network exists"
else
    echo "⚠️  Network doesn't exist yet (this is normal if database isn't running)"
fi

echo "🎯 Test completed successfully!"
echo "You can now run ./deploy.sh"
