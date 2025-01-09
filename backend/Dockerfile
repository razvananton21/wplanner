FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    openssl \
    libpq-dev \
    default-mysql-client

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create necessary directories with proper permissions
RUN mkdir -p var/cache var/log config/jwt public \
    && chown -R www-data:www-data var config/jwt public \
    && chmod -R 777 var config/jwt

# Set up Symfony for production
ENV APP_ENV=prod
ENV APP_DEBUG=1
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_RUNTIME=App\\Runtime\\CustomRuntime

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --prefer-dist --no-dev --no-scripts --no-progress --no-interaction

# Copy the rest of the application
COPY . .

# Generate JWT keys with proper permissions
RUN mkdir -p config/jwt \
    && openssl genrsa -passout pass:${JWT_PASSPHRASE:-wedding2025} -out config/jwt/private.pem -aes256 4096 \
    && openssl rsa -passin pass:${JWT_PASSPHRASE:-wedding2025} -in config/jwt/private.pem -pubout -out config/jwt/public.pem \
    && chmod 644 config/jwt/private.pem config/jwt/public.pem \
    && chown -R www-data:www-data config/jwt

# Copy and enable Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configure Apache for port
RUN echo "Listen \${PORT:-80}" > /etc/apache2/ports.conf

# Configure PHP for production with error logging
RUN echo "display_errors=1\n\
log_errors=1\n\
error_reporting=E_ALL\n\
error_log=/var/log/apache2/php_errors.log\n\
memory_limit=256M\n\
upload_max_filesize=64M\n\
post_max_size=64M" > /usr/local/etc/php/conf.d/error-logging.ini

# Ensure proper permissions for the entire application
RUN chown -R www-data:www-data . \
    && chmod -R 755 . \
    && chmod -R 777 var \
    && chmod -R 777 public

# Create start script that handles environment setup and Apache start
RUN echo '#!/bin/bash\n\
\n\
# Update ports.conf with actual PORT\n\
sed -i "s/\${PORT:-80}/$PORT/g" /etc/apache2/ports.conf\n\
\n\
# Ensure proper permissions\n\
chown -R www-data:www-data /var/www/html\n\
chmod -R 755 /var/www/html\n\
chmod -R 777 /var/www/html/var\n\
chmod -R 777 /var/www/html/public\n\
\n\
# Clear and warmup cache\n\
php bin/console cache:clear --env=prod --no-debug\n\
php bin/console cache:warmup --env=prod --no-debug\n\
\n\
# Start Apache\n\
apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

EXPOSE 80
ENV PORT=80

CMD ["/usr/local/bin/start.sh"]