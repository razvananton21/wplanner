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
    openssl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory
COPY . .

# Install dependencies
RUN composer install --no-interaction

# Generate JWT keys
RUN set -e; \
    mkdir -p config/jwt; \
    openssl genrsa -aes256 -passout pass:wedding2025 -out config/jwt/private.pem 4096; \
    openssl rsa -pubout -in config/jwt/private.pem -passin pass:wedding2025 -out config/jwt/public.pem; \
    chmod 644 config/jwt/private.pem config/jwt/public.pem

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/var

EXPOSE 80

CMD ["apache2-foreground"] 