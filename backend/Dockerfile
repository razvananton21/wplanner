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

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create necessary directories
RUN mkdir -p var/cache var/log config/jwt

# Set up Symfony for production
ENV APP_ENV=prod
ENV APP_DEBUG=0
ENV APP_SECRET=2ca64f8d83b9e89f5f19d672841d6bb8
ENV DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy the entire application
COPY . .

# Create .env file with production values
RUN echo "APP_ENV=prod" > .env && \
    echo "APP_DEBUG=0" >> .env && \
    echo "APP_SECRET=2ca64f8d83b9e89f5f19d672841d6bb8" >> .env && \
    echo "DATABASE_URL=postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8" >> .env

# Create a minimal .env.local.php for production
RUN echo "<?php return array(" > .env.local.php && \
    echo "'APP_ENV' => 'prod'," >> .env.local.php && \
    echo "'APP_DEBUG' => '0'," >> .env.local.php && \
    echo "'APP_SECRET' => '2ca64f8d83b9e89f5f19d672841d6bb8'," >> .env.local.php && \
    echo "'DATABASE_URL' => 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8'" >> .env.local.php && \
    echo ");" >> .env.local.php

# Set initial permissions
RUN chown -R www-data:www-data . \
    && chmod -R 777 var config/jwt \
    && chmod 644 .env .env.local.php \
    && chmod +x bin/console

# Install dependencies for production
RUN set -x \
    && composer install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction \
    && composer dump-autoload --classmap-authoritative --no-dev \
    && composer clear-cache

# Generate JWT keys with proper permissions
RUN set -x \
    && mkdir -p config/jwt \
    && chmod 777 config/jwt \
    && openssl genrsa -passout pass:wedding2025 -out config/jwt/private.pem -aes256 4096 \
    && openssl rsa -passin pass:wedding2025 -in config/jwt/private.pem -pubout -out config/jwt/public.pem \
    && chmod 644 config/jwt/private.pem config/jwt/public.pem \
    && chown -R www-data:www-data config/jwt

# Copy Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Configure Apache for port
RUN echo "Listen 80" > /etc/apache2/ports.conf

# Configure PHP for production
RUN echo "display_errors=1\n" \
    "log_errors=1\n" \
    "error_reporting=E_ALL\n" \
    "error_log=/var/log/apache2/php_errors.log" > /usr/local/etc/php/conf.d/error-logging.ini

# Final setup and cache warmup
RUN set -x \
    && php bin/console cache:clear --env=prod --no-debug --no-warmup \
    && php bin/console cache:warmup --env=prod --no-debug \
    && chown -R www-data:www-data var

EXPOSE 80

# Use a shell script to update ports.conf and start Apache
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]