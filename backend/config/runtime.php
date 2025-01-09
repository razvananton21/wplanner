<?php

// Force production environment
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'prod';
$_SERVER['APP_DEBUG'] = $_ENV['APP_DEBUG'] = '0';
$_SERVER['APP_SECRET'] = $_ENV['APP_SECRET'] = '2ca64f8d83b9e89f5f19d672841d6bb8';
$_SERVER['DATABASE_URL'] = $_ENV['DATABASE_URL'] = 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8';

return function (array $context) {
    // Prevent Dotenv component from trying to load .env files
    $context['APP_RUNTIME_MODE'] = 'prod';
    $context['SYMFONY_DOTENV_VARS'] = '';
    
    return $context;
}; 