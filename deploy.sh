#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Verify environment file exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create it using .env.production.example as a template."
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Copy production configurations
echo "📝 Setting up production configurations..."
cp frontend/nginx.prod.conf frontend/nginx.conf
cp .env.production .env

# Build and start production containers
echo "🏗️ Building production containers..."
docker-compose -f docker-compose.prod.yml build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start new containers
echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend php bin/console doctrine:migrations:migrate --no-interaction

# Clear cache
echo "🧹 Clearing cache..."
docker-compose -f docker-compose.prod.yml exec backend php bin/console cache:clear
docker-compose -f docker-compose.prod.yml exec backend php bin/console cache:warmup

# Set proper permissions
echo "🔒 Setting proper permissions..."
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data /var/www/html/var
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data /var/www/html/public/uploads

# Verify deployment
echo "✅ Verifying deployment..."
docker-compose -f docker-compose.prod.yml ps

echo "✨ Deployment completed successfully!"
echo "🌍 Your application should now be accessible at your configured domain."
echo "⚠️  Don't forget to:"
echo "   1. Configure your domain's DNS settings"
echo "   2. Set up SSL/TLS certificates"
echo "   3. Configure your production mail server"
echo "   4. Update Google OAuth production credentials" 