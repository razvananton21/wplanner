#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Hetzner deployment process..."

# Verify environment file exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create it using .env.production.example as a template."
    exit 1
fi

# Source the environment variables
source .env.production

# Check required variables
if [ -z "${DOMAIN}" ]; then
    echo "❌ Error: DOMAIN variable is not set in .env.production!"
    echo "Please add: DOMAIN=your-domain.com"
    exit 1
fi

if [ -z "${EMAIL}" ]; then
    echo "❌ Error: EMAIL variable is not set in .env.production!"
    echo "Please add: EMAIL=your-email@example.com"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install/Update required packages
echo "📦 Installing/Updating required packages..."
apt install -y docker.io docker-compose git

# Check if DOMAIN is an IP address
if [[ $DOMAIN =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "📝 Using IP address without SSL..."
    PROTOCOL="http"
else
    echo "🔒 Setting up SSL certificate..."
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m ${EMAIL}
    PROTOCOL="https"
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Setup environment variables for frontend
echo "🔧 Setting up frontend environment..."
cat > frontend/.env.production << EOL
VITE_API_URL=${PROTOCOL}://${DOMAIN}/api
EOL

# Copy production configurations
echo "📝 Setting up production configurations..."
cp frontend/nginx.prod.conf frontend/nginx.conf
cp .env.production .env

# Setup Docker network
echo "🌐 Setting up Docker network..."
docker network create wplanner-network || true

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start services in sequence
echo "🚀 Starting services in sequence..."

echo "   Starting database..."
docker-compose -f docker-compose.prod.yml up -d database
echo "   Waiting for database to be ready..."
sleep 15

echo "   Starting backend..."
docker-compose -f docker-compose.prod.yml up -d backend
echo "   Waiting for backend to be ready..."
sleep 5

echo "   Starting frontend..."
docker-compose -f docker-compose.prod.yml up -d frontend
echo "   Waiting for frontend to be ready..."
sleep 5

# Verify frontend is accessible
echo "🔍 Verifying frontend access..."
curl -s -o /dev/null -w "%{http_code}" ${PROTOCOL}://${DOMAIN} | grep -q "200" && \
    echo "✅ Frontend is accessible" || \
    echo "❌ Frontend check failed"

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend php bin/console doctrine:migrations:migrate --no-interaction

# Clear cache
echo "🧹 Clearing cache..."
docker-compose -f docker-compose.prod.yml exec -T backend php bin/console cache:clear
docker-compose -f docker-compose.prod.yml exec -T backend php bin/console cache:warmup

# Set proper permissions
echo "🔒 Setting proper permissions..."
docker-compose -f docker-compose.prod.yml exec -T backend chown -R www-data:www-data /var/www/html/var
docker-compose -f docker-compose.prod.yml exec -T backend chown -R www-data:www-data /var/www/html/public/uploads

# Setup automatic backups
echo "💾 Setting up backup script..."
cat > /root/backup.sh << 'EOL'
#!/bin/bash
BACKUP_DIR="/root/backups"
MYSQL_CONTAINER="wplanner_database_1"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec $MYSQL_CONTAINER mysqldump -u root -p${MYSQL_ROOT_PASSWORD} wplanner > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/html/public/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete
EOL

chmod +x /root/backup.sh

# Add backup cron job
(crontab -l 2>/dev/null; echo "0 3 * * * /root/backup.sh") | crontab -

# Setup monitoring (basic)
echo "📊 Setting up basic monitoring..."
apt install -y htop netdata

# Configure netdata
sed -i 's/NETDATA_BIND_SOCKET=.*/NETDATA_BIND_SOCKET=127.0.0.1:19999/' /etc/netdata/netdata.conf
systemctl restart netdata

# Verify deployment
echo "✅ Verifying deployment..."
docker-compose -f docker-compose.prod.yml ps

echo "✨ Deployment completed successfully!"
echo "🌍 Your application should now be accessible at:"
echo "   - Frontend: ${PROTOCOL}://${DOMAIN}"
echo "   - Backend API: ${PROTOCOL}://${DOMAIN}/api"
echo ""
echo "📊 Monitoring:"
echo "   - NetData: http://localhost:19999"
echo "   - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "💾 Backups:"
echo "   - Database and uploads are automatically backed up daily at 3 AM"
echo "   - Backups are stored in /root/backups"
echo "   - Last 7 days of backups are kept"
echo ""
echo "⚠️  Additional security recommendations:"
echo "   1. Setup UFW firewall rules"
echo "   2. Configure fail2ban"
echo "   3. Setup regular security updates"
echo "   4. Consider setting up Hetzner Cloud Backups"
echo ""
echo "🔍 To check container status:"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "📜 To view logs:"
echo "   Frontend: docker-compose -f docker-compose.prod.yml logs frontend"
echo "   Backend: docker-compose -f docker-compose.prod.yml logs backend" 