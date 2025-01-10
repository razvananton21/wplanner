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
    libzip-dev \
    ssl-cert

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache modules
RUN a2enmod rewrite headers ssl
RUN a2ensite default-ssl

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Copy Apache configurations
COPY apache.conf /etc/apache2/sites-available/000-default.conf
COPY ssl.conf /etc/apache2/conf-available/ssl.conf
RUN a2enconf ssl

# Install dependencies based on environment
ARG APP_ENV=prod
RUN if [ "$APP_ENV" = "prod" ]; then \
        composer install --no-interaction --optimize-autoloader --no-dev; \
    else \
        composer install --no-interaction --optimize-autoloader; \
    fi

# Set permissions
RUN chown -R www-data:www-data /var/www/html/var
RUN chmod -R 775 /var/www/html/var

# Generate JWT keys directory with proper permissions
RUN mkdir -p config/jwt
RUN chmod -R 775 config/jwt

# Create directory for SSL session cache
RUN mkdir -p /var/run/apache2

EXPOSE 80
EXPOSE 443

CMD ["apache2-foreground"] 