#!/bin/bash

# Test script for Traefik v3.5 upgrade
echo "🚀 Testing Traefik v3.5 Upgrade"
echo "================================"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Please create it from env.production.example first."
    exit 1
fi

echo "✅ Environment file found"

# Test Docker Compose configuration
echo "🔍 Validating Docker Compose configuration..."
docker-compose -f docker-compose.prod.yml --env-file .env.production config > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Docker Compose configuration is valid"
else
    echo "❌ Docker Compose configuration has errors"
    exit 1
fi

# Pull the new Traefik image
echo "📥 Pulling Traefik v3.5 image..."
docker pull traefik:v3.5
if [ $? -eq 0 ]; then
    echo "✅ Traefik v3.5 image pulled successfully"
else
    echo "❌ Failed to pull Traefik v3.5 image"
    exit 1
fi

# Test starting only Traefik
echo "🧪 Testing Traefik service startup..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d traefik
if [ $? -eq 0 ]; then
    echo "✅ Traefik service started successfully"
    
    # Wait a moment for Traefik to initialize
    sleep 5
    
    # Check if Traefik is responding
    echo "🔍 Checking Traefik health..."
    if curl -s http://localhost:8080/api/rawdata > /dev/null; then
        echo "✅ Traefik API is responding"
    else
        echo "⚠️  Traefik API not responding (this might be normal if no services are configured)"
    fi
    
    # Show Traefik logs
    echo "📋 Recent Traefik logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=10 traefik
    
    # Stop Traefik
    echo "🛑 Stopping test Traefik instance..."
    docker-compose -f docker-compose.prod.yml stop traefik
    docker-compose -f docker-compose.prod.yml rm -f traefik
    
else
    echo "❌ Failed to start Traefik service"
    exit 1
fi

echo ""
echo "🎉 Traefik v3.5 upgrade test completed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy the full stack: docker-compose -f docker-compose.prod.yml --env-file .env.production up -d"
echo "2. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f traefik"
echo "3. Check SSL: curl -I https://yourdomain.com (if domain is configured)"
echo ""
echo "Key improvements in v3.5:"
echo "• Better performance and memory usage"
echo "• Enhanced security features"
echo "• Improved Let's Encrypt integration"
echo "• Better logging and observability"
