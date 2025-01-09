<?php

error_log('Debug: Request received - URI: ' . $_SERVER['REQUEST_URI']);
error_log('Debug: Environment: ' . ($_SERVER['APP_ENV'] ?? 'undefined'));

use App\Kernel;

// Force environment variables
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'prod';
$_SERVER['APP_DEBUG'] = $_ENV['APP_DEBUG'] = '0';
$_SERVER['APP_SECRET'] = $_ENV['APP_SECRET'] = '2ca64f8d83b9e89f5f19d672841d6bb8';
$_SERVER['DATABASE_URL'] = $_ENV['DATABASE_URL'] = 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8';

// Prevent Dotenv from loading .env file
putenv('SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL');

error_log('Debug: Environment variables set');

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

error_log('Debug: Runtime loaded');

return function (array $context) {
    error_log('Debug: Creating kernel with context: ' . json_encode($context));
    return new Kernel($context['APP_ENV'] ?? 'prod', (bool) ($context['APP_DEBUG'] ?? false));
};
