# Hetzner Deployment Guide for WPlanner

This guide details the complete deployment process for the WPlanner application on a Hetzner server.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Google OAuth Configuration](#google-oauth-configuration)
- [Docker Configuration](#docker-configuration)
- [Deployment Steps](#deployment-steps)
- [Maintenance and Monitoring](#maintenance-and-monitoring)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [SSL Configuration](#ssl-configuration)
- [Backup Procedures](#backup-procedures)
- [Rollback Procedures](#rollback-procedures)
- [Performance Tuning](#performance-tuning)
- [Advanced Monitoring](#advanced-monitoring)

## Prerequisites

Before starting the deployment, ensure you have:
- A Hetzner server with Ubuntu installed
- Domain or IP address (using nip.io for this setup)
- Docker and Docker Compose installed
- Git installed
- Access to Google Cloud Console for OAuth setup

## Environment Configuration

### Frontend Configuration (.env.production)
```env
VITE_API_URL=https://wplanner.188.245.244.213.nip.io/api
```

### Backend Configuration (.env.production)
```env
# Environment
APP_ENV=prod
APP_DEBUG=0
APP_SECRET=generate-a-long-random-string-here

# Database
DATABASE_URL=mysql://wplanner:pa44word@database:3306/wplanner
MYSQL_ROOT_PASSWORD=pa44word
MYSQL_DATABASE=wplanner
MYSQL_USER=wplanner
MYSQL_PASSWORD=pa44word

# CORS
CORS_ALLOW_ORIGIN=https://wplanner.188.245.244.213.nip.io

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=choose-a-secure-passphrase

# Mailer
MAILER_DSN=smtp://razvananton21@gmail.com:your-app-password@smtp.gmail.com:587?encryption=tls

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://wplanner.188.245.244.213.nip.io/api/auth/google/callback

# App settings
DOMAIN=wplanner.188.245.244.213.nip.io
EMAIL=your-email@gmail.com
APP_URL=https://wplanner.188.245.244.213.nip.io
PROTOCOL=https
```

## Google OAuth Configuration

1. Access Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing one
   - Enable Google OAuth API

2. Configure OAuth Consent Screen:
   - Set application name
   - Add authorized domains
   - Configure scopes (email, profile)

3. Create OAuth 2.0 Credentials:
   - Create OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized JavaScript origins:
     ```
     https://wplanner.188.245.244.213.nip.io
     ```
   - Add authorized redirect URIs:
     ```
     https://wplanner.188.245.244.213.nip.io/api/auth/google/callback
     ```

## Docker Configuration

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Development stage
FROM base as development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build stage
FROM base as builder
COPY package*.json ./
RUN npm install
COPY . .
RUN mv .env.production .env && npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production Docker Compose
File: `docker-compose.prod.yml`
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: production
      args:
        - NODE_ENV=production
    ports:
      - "8080:80"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - wplanner-network

  backend:
    build:
      context: ./backend
      args:
        - APP_ENV=prod
        - APP_DEBUG=0
    environment:
      - APP_ENV=prod
      - APP_DEBUG=0
    volumes:
      - backend_uploads:/var/www/html/public/uploads
    depends_on:
      - database
    restart: unless-stopped
    networks:
      - wplanner-network

  database:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    networks:
      - wplanner-network

volumes:
  mysql_data:
  backend_uploads:

networks:
  wplanner-network:
    driver: bridge
```

## Deployment Steps

1. Initial Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Create project directory
mkdir -p ~/wplanner
cd ~/wplanner

# Clone your repository
git clone your-repository-url .
```

2. Configure Environment Files
```bash
# Copy environment files
cp .env.production.example .env.production
cp frontend/.env.production.example frontend/.env.production

# Edit the files with your configurations
nano .env.production
nano frontend/.env.production
```

3. Run the Deployment Script
```bash
# Make the script executable
chmod +x deploy-hetzner.sh

# Run the deployment
./deploy-hetzner.sh
```

## Maintenance and Monitoring

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View specific service logs
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs backend
```

### Restart Services
```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy
./deploy-hetzner.sh
```

## Troubleshooting

### Common Commands
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check environment variables
docker-compose -f docker-compose.prod.yml exec backend env

# Access container shell
docker-compose -f docker-compose.prod.yml exec backend bash
docker-compose -f docker-compose.prod.yml exec frontend sh

# View specific logs
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
docker-compose -f docker-compose.prod.yml logs --tail=100 frontend
```

### Common Issues
1. **404 Not Found**: Check nginx configuration and routing
2. **Database Connection Issues**: Verify database credentials and network
3. **OAuth Errors**: Verify callback URLs and credentials
4. **SSL/HTTPS Issues**: Check certificate configuration

## Security Considerations

1. **Environment Security**
   - Use strong passwords
   - Keep sensitive data in environment variables
   - Never commit sensitive data to git

2. **Server Security**
   - Keep system updated
   - Configure firewall rules
   - Use SSH key authentication
   - Disable root login (optional)

3. **Application Security**
   - Use HTTPS for all connections
   - Implement rate limiting
   - Set secure headers
   - Regular security updates

4. **Database Security**
   - Strong passwords
   - Regular backups
   - Limited network access

5. **Monitoring**
   - Regular log checking
   - Set up alerts for critical errors
   - Monitor system resources

6. **Backup Strategy**
   - Daily database backups
   - Regular file system backups
   - Test restore procedures

## SSL Configuration

### Let's Encrypt Setup
```bash
# Install certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot --nginx -d your-domain.com

# Auto-renewal setup
certbot renew --dry-run
```

### SSL Configuration in Nginx
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Strong SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

## Backup Procedures

### Database Backups
```bash
#!/bin/bash
# backup-db.sh

# Set variables
BACKUP_DIR="/root/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="wplanner"
MYSQL_PASSWORD="your-password"
MYSQL_DATABASE="wplanner"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker-compose -f docker-compose.prod.yml exec -T database \
    mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE \
    | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -name '*.gz' -delete
```

### File System Backups
```bash
#!/bin/bash
# backup-files.sh

# Set variables
BACKUP_DIR="/root/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup uploaded files
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz \
    -C /var/lib/docker/volumes/wplanner_backend_uploads/_data .

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -name '*.tar.gz' -delete
```

### Automated Backup Setup
```bash
# Add to crontab
0 3 * * * /root/backup-db.sh
0 4 * * * /root/backup-files.sh
```

## Rollback Procedures

### Version Rollback
```bash
#!/bin/bash
# rollback.sh

# Usage: ./rollback.sh <commit-hash>

if [ -z "$1" ]; then
    echo "Please provide a commit hash"
    exit 1
fi

# Stash any changes
git stash

# Checkout specific version
git checkout $1

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Database Rollback
```bash
#!/bin/bash
# db-rollback.sh

# Usage: ./db-rollback.sh backup_20240101_120000.sql.gz

if [ -z "$1" ]; then
    echo "Please provide a backup file name"
    exit 1
fi

BACKUP_FILE="/root/backups/database/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found"
    exit 1
fi

# Restore database
gunzip < $BACKUP_FILE | docker-compose -f docker-compose.prod.yml exec -T database \
    mysql -uwplanner -ppa44word wplanner
```

## Performance Tuning

### Nginx Optimization
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    multi_accept on;
    use epoll;
}

http {
    # Caching
    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
```

### MySQL Optimization
```ini
# /etc/mysql/conf.d/custom.cnf
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

max_connections = 150
thread_cache_size = 10
query_cache_size = 0
query_cache_type = 0

slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### PHP-FPM Optimization
```ini
# /usr/local/etc/php-fpm.d/www.conf
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

## Advanced Monitoring

### Prometheus & Grafana Setup
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - wplanner-network

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - wplanner-network

volumes:
  grafana_data:
```

### Node Exporter Setup
```yaml
# Add to docker-compose.prod.yml
  node-exporter:
    image: prom/node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - wplanner-network
```

### Alert Manager Configuration
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'your-email@gmail.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'

route:
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'email-notifications'

receivers:
- name: 'email-notifications'
  email_configs:
  - to: 'your-email@gmail.com'
```

### Monitoring Dashboard Setup
1. Access Grafana at http://your-domain:3000
2. Add Prometheus as data source
3. Import dashboard templates:
   - Node Exporter Full (ID: 1860)
   - MySQL Overview (ID: 7362)
   - PHP-FPM (ID: 4912)

### Performance Monitoring
```bash
# Install monitoring tools
apt-get install htop iotop sysstat

# Monitor system resources
htop
iotop
vmstat 1
iostat -x 1

# Monitor PHP-FPM status
curl localhost/status

# Monitor MySQL performance
docker-compose -f docker-compose.prod.yml exec database \
    mysqladmin extended-status -i1
``` 