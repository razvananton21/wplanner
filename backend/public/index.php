<?php

use App\Kernel;

// Force production environment
$_SERVER['APP_ENV'] = 'prod';
$_SERVER['APP_DEBUG'] = '0';

// Set other environment variables
$_SERVER['APP_SECRET'] = '2ca64f8d83b9e89f5f19d672841d6bb8';
$_SERVER['DATABASE_URL'] = 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8';

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
