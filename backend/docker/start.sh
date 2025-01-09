#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-80}

# Update Apache ports configuration
echo "Listen ${PORT}" > /etc/apache2/ports.conf

# Update VirtualHost port in Apache config
sed -i "s/*:80/*:${PORT}/" /etc/apache2/sites-available/000-default.conf

# Update ServerName if provided
if [ ! -z "$SERVER_NAME" ]; then
    sed -i "s/ServerName localhost/ServerName $SERVER_NAME/" /etc/apache2/sites-available/000-default.conf
fi

# Start Apache
exec apache2-foreground 