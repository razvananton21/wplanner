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
    netcat-traditional \
    libicu-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl
RUN echo "display_errors = On" >> /usr/local/etc/php/conf.d/error-logging.ini
RUN echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/error-logging.ini

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Apache configuration
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies without scripts
RUN composer install --no-scripts --no-autoloader

# Create var directory and set permissions
RUN mkdir -p var && \
    chmod 777 var

# Copy existing application directory
COPY . .

# Generate JWT keys
RUN set -e; \
    mkdir -p config/jwt; \
    openssl genrsa -aes256 -passout pass:wedding2025 -out config/jwt/private.pem 4096; \
    openssl rsa -pubout -in config/jwt/private.pem -passin pass:wedding2025 -out config/jwt/public.pem; \
    chmod 644 config/jwt/private.pem config/jwt/public.pem

# Dump autoload and run scripts at runtime
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

# Create startup script
COPY docker/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

CMD ["/usr/local/bin/startup.sh"] 