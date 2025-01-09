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
    libpq-dev  # Add PostgreSQL support

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --no-interaction --no-scripts --no-plugins \
    && composer require symfony/runtime --no-interaction --no-scripts --no-plugins \
    && composer dump-autoload --optimize --no-scripts --no-plugins

# Copy the rest of the application
COPY . .

# Copy Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Set up Symfony
ENV APP_ENV=prod
ENV APP_DEBUG=0

# Create necessary directories with correct permissions
RUN mkdir -p var/cache var/log config/jwt \
    && chown -R www-data:www-data var config/jwt \
    && chmod -R 777 var config/jwt

# Generate JWT keys
RUN set -e; \
    openssl genrsa -aes256 -passout pass:wedding2025 -out config/jwt/private.pem 4096; \
    openssl rsa -pubout -in config/jwt/private.pem -passin pass:wedding2025 -out config/jwt/public.pem; \
    chmod 644 config/jwt/private.pem config/jwt/public.pem

EXPOSE 80

CMD ["apache2-foreground"] 