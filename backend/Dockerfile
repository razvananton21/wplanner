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

# Configure PHP
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN echo "\
date.timezone=UTC\n\
memory_limit=256M\n\
max_execution_time=30\n\
post_max_size=20M\n\
upload_max_filesize=20M\n\
display_errors=On\n\
display_startup_errors=On\n\
error_reporting=E_ALL\n\
log_errors=On\n\
error_log=/var/log/apache2/php_errors.log\n\
opcache.enable=1\n\
opcache.memory_consumption=256\n\
opcache.max_accelerated_files=20000\n\
opcache.validate_timestamps=0\n\
realpath_cache_size=4096K\n\
realpath_cache_ttl=600\n\
session.gc_maxlifetime=3600\n\
" > /usr/local/etc/php/conf.d/app.ini

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
ENV APP_DEBUG=0
ENV APP_SECRET=2ca64f8d83b9e89f5f19d672841d6bb8
ENV DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_RUNTIME=App\\Runtime\\CustomRuntime
ENV SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --prefer-dist --no-dev --no-scripts --no-progress --no-interaction

# Copy the rest of the application
COPY . .

# Generate JWT keys with proper permissions
RUN set -x \
    && openssl genrsa -passout pass:wedding2025 -out config/jwt/private.pem -aes256 4096 \
    && openssl rsa -passin pass:wedding2025 -in config/jwt/private.pem -pubout -out config/jwt/public.pem \
    && chmod 644 config/jwt/private.pem config/jwt/public.pem \
    && chown -R www-data:www-data config/jwt

# Copy and enable Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configure Apache for port
RUN echo "Listen \${PORT}" > /etc/apache2/ports.conf

# Configure PHP for production with error logging
RUN echo "display_errors=1\n\
log_errors=1\n\
error_reporting=E_ALL\n\
error_log=/var/log/apache2/php_errors.log" > /usr/local/etc/php/conf.d/error-logging.ini

# Ensure proper permissions for the entire application
RUN chown -R www-data:www-data . \
    && chmod -R 755 . \
    && chmod -R 777 var \
    && chmod -R 777 public

# Create empty .env file to satisfy Symfony
RUN touch .env && echo "APP_ENV=prod" > .env

# Dump autoload and clear cache with environment variables set
RUN APP_ENV=prod \
    APP_DEBUG=0 \
    SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL \
    composer dump-autoload --classmap-authoritative --no-dev \
    && APP_ENV=prod \
       APP_DEBUG=0 \
       SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL \
       php bin/console cache:clear --env=prod --no-debug \
    && APP_ENV=prod \
       APP_DEBUG=0 \
       SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL \
       php bin/console cache:warmup --env=prod --no-debug \
    && chown -R www-data:www-data var

# Create start script that handles port configuration
RUN echo '#!/bin/bash\n\
echo "Debug: Starting application..." >> /var/log/apache2/error.log\n\
echo "APP_ENV=$APP_ENV" >> /var/log/apache2/error.log\n\
echo "SYMFONY_DOTENV_VARS=$SYMFONY_DOTENV_VARS" >> /var/log/apache2/error.log\n\
echo "PORT=$PORT" >> /var/log/apache2/error.log\n\
echo "DocumentRoot: $(ls -la /var/www/html/public)" >> /var/log/apache2/error.log\n\
echo "Apache Config: $(cat /etc/apache2/sites-available/000-default.conf)" >> /var/log/apache2/error.log\n\
echo "PHP Modules: $(php -m)" >> /var/log/apache2/error.log\n\
echo "PHP Version: $(php -v)" >> /var/log/apache2/error.log\n\
echo "Apache Ports: $(cat /etc/apache2/ports.conf)" >> /var/log/apache2/error.log\n\
echo "Testing PHP file:" >> /var/log/apache2/error.log\n\
echo "<?php phpinfo(); ?>" > /var/www/html/public/test.php\n\
chown www-data:www-data /var/www/html/public/test.php\n\
chmod 755 /var/www/html/public/test.php\n\
sed -i "s/\${PORT}/$PORT/g" /etc/apache2/ports.conf\n\
sed -i "s/\${PORT}/$PORT/g" /etc/apache2/sites-available/000-default.conf\n\
apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

EXPOSE ${PORT}
ENV PORT=10000

CMD ["/usr/local/bin/start.sh"]