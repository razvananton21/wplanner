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

# Set up Symfony for production
ENV APP_ENV=prod
ENV APP_DEBUG=0
ENV APP_SECRET=2ca64f8d83b9e89f5f19d672841d6bb8
ENV DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
ENV COMPOSER_ALLOW_SUPERUSER=1

# Create necessary directories
RUN mkdir -p var/cache var/log config/jwt

# Copy the entire application
COPY . .

# Set initial permissions
RUN chown -R www-data:www-data . \
    && chmod -R 777 var config/jwt \
    && chmod +x bin/console

# Install dependencies for production
RUN composer install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction \
    && composer dump-autoload --classmap-authoritative --no-dev \
    && composer clear-cache

# Generate JWT keys
RUN set -e; \
    openssl genrsa -aes256 -passout pass:wedding2025 -out config/jwt/private.pem 4096; \
    openssl rsa -pubout -in config/jwt/private.pem -passin pass:wedding2025 -out config/jwt/public.pem; \
    chmod 644 config/jwt/private.pem config/jwt/public.pem

# Copy Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Set default environment variables
ENV PORT=80
ENV SERVER_NAME=localhost

# Configure Apache for port
RUN echo "Listen 80" > /etc/apache2/ports.conf

# Configure PHP for production
RUN echo "display_errors=0\n" \
    "log_errors=1\n" \
    "error_log=/var/log/apache2/php_errors.log" > /usr/local/etc/php/conf.d/error-logging.ini

# Final permissions and cache warmup
RUN chown -R www-data:www-data . \
    && su www-data -s /bin/sh -c 'php bin/console cache:clear --env=prod --no-debug --no-warmup' \
    && su www-data -s /bin/sh -c 'php bin/console cache:warmup --env=prod --no-debug'

EXPOSE 80

# Use a shell script to update ports.conf and start Apache
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"] 