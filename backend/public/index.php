<?php

use App\Kernel;

// Debug line to verify changes
error_log('Debug: Starting application with custom configuration');

// Force environment variables
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'prod';
$_SERVER['APP_DEBUG'] = $_ENV['APP_DEBUG'] = '0';
$_SERVER['APP_SECRET'] = $_ENV['APP_SECRET'] = '2ca64f8d83b9e89f5f19d672841d6bb8';
$_SERVER['DATABASE_URL'] = $_ENV['DATABASE_URL'] = 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8';

// Prevent Dotenv from loading .env file
putenv('SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL');

error_log('Debug: Environment variables set: ' . getenv('APP_ENV'));

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    // Debug line to verify context
    error_log('Debug: Runtime context initialized with APP_ENV=' . ($context['APP_ENV'] ?? 'undefined'));
    
    return new Kernel($context['APP_ENV'] ?? 'prod', (bool) ($context['APP_DEBUG'] ?? false));
};
