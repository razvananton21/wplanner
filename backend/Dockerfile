FROM php:8.2-apache

# Install essentials
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_pgsql \
    && a2enmod rewrite \
    && apt-get clean

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-progress

# Copy application
COPY . .

# Apache configuration
RUN echo '\
<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    DirectoryIndex index.php\n\
    <Directory /var/www/html/public>\n\
        AllowOverride None\n\
        Require all granted\n\
        FallbackResource /index.php\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN chown -R www-data:www-data var

# Configure PHP
RUN echo '\
memory_limit=256M\n\
upload_max_filesize=64M\n\
post_max_size=64M' > /usr/local/etc/php/conf.d/custom.ini

# Use port from environment
CMD sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf && apache2-foreground