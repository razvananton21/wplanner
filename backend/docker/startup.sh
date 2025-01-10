#!/bin/bash

# Wait for database to be ready
until nc -z -v -w30 database 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

# Run composer scripts now that database is available
composer run-script post-install-cmd

# Start Apache
apache2-foreground 